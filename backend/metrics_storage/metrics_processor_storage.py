import json
import re
from datetime import datetime
from decimal import Decimal
from botocore.exceptions import ClientError

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def calculate_cycle_time_hours(start_time, end_time):
    """Calculate cycle time in hours between start and end time"""
    if not start_time or not end_time:
        return 0
    
    # Implementation depends on your date format - simplified version:
    try:
        start = datetime.fromisoformat(start_time.replace('Z', '+00:00'))
        end = datetime.fromisoformat(end_time.replace('Z', '+00:00'))
        delta = end - start
        return delta.total_seconds() / 3600
    except Exception as e:
        print(f"Error calculating cycle time: {e}")
        return 0

def format_cycle_time_readable(hours):
    """Format cycle time hours into readable format"""
    if hours <= 0:
        return "0h"
    
    days = int(hours // 24)
    remaining_hours = int(hours % 24)
    
    if days > 0:
        return f"{days}d {remaining_hours}h"
    else:
        return f"{remaining_hours}h"

def extract_pr_base_info(payload, detail_type):
    """Extract common PR information from payload"""
    pr = payload.get('pull_request', {})
    repo = payload.get('repository', {})
    pr_number = payload.get("number") or pr.get("number")
    pr_id = f"{repo.get('name')}_{pr_number}"
    
    return {
        "pr": pr,
        "repo": repo,
        "pr_number": pr_number,
        "pr_id": pr_id,
        "action": payload.get("action"),
        "sender": payload.get("sender", {}).get("login")
    }

def get_existing_pr_data(table, pr_id):
    """Retrieve existing PR data from DynamoDB"""
    try:
        response = table.get_item(Key={"PR_ID": pr_id})
        if "Item" in response:
            print(f"Found existing item for PR {pr_id}")
            return response["Item"]
        print(f"No existing item found for PR {pr_id}")
        return {}
    except Exception as e:
        print(f"Error retrieving PR data for {pr_id}: {e}")
        return {}

def handle_pr_draft_conversion(table, pr_id):
    """Handle PR conversion to draft state"""
    print(f"PR moved back to draft. Deleting from DynamoDB: {pr_id}")
    table.delete_item(Key={"PR_ID": pr_id})

def handle_pr_synchronize(table, pr_id):
    """Handle PR synchronize event (new commits pushed)"""
    print(f"New commit pushed to PR {pr_id}. Checking if we should reset state to 'Review in Progress'...")
    try:
        table.update_item(
            Key={"PR_ID": pr_id},
            UpdateExpression="set #S = :val",
            ExpressionAttributeNames={"#S": "State"},
            ExpressionAttributeValues={
                ":val": "Review in Progress",
                ":expected": "Changes Requested"
            },
            ConditionExpression="attribute_exists(PR_ID) AND #S = :expected"
        )
        print(f"State reset to 'Review in Progress' for PR {pr_id}")
    except Exception as e:
        print(f"Skipped state reset for PR {pr_id}: {e}")

def create_pr_base_item(pr_info, action, timestamp):
    """Create base PR item for DynamoDB - only essential fields for initial creation"""
    pr = pr_info["pr"]
    repo = pr_info["repo"]
    pr_id = pr_info["pr_id"]
    pr_number = pr_info["pr_number"]
    
    author = pr.get('user', {}).get('login')
    branch_name = pr.get("head", {}).get("ref", "")
    jira_match = re.search(r'([A-Z]+-\d+)', branch_name, re.IGNORECASE)
    jira_id = jira_match.group(1).upper() if jira_match else ""
    
    created_at = pr.get("created_at")
    review_requested_time = pr.get("updated_at") if action == "ready_for_review" else created_at

    # Define basic PR State - only considering open/closed initially
    if pr.get("state") == "closed":
        state = "Closed"
    else:
        state = "Open"

    # Core fields needed for initial PR creation
    return {
        "PR_ID": pr_id,
        "PRNumber": pr_number,
        "Jira_ID": jira_id,
        "Jira_URL": get_jira_url(jira_id),
        "PR_URL": pr.get("html_url"),
        "State": state,
        "CreatedDate": created_at,
        "TargetBranch": pr.get("base", {}).get("ref"),
        "Author": author,
        "PR_Size": pr.get("additions", 0) + pr.get("deletions", 0),
        "TechStack": repo.get("language", "Unknown"),
        "ReviewRequestedTime": review_requested_time,
        "event_timestamp": timestamp,
        "repository": repo.get('name'),
        "event_type": "pull_request",
        "action": action,
        "sender": pr_info["sender"]
    }

def handle_pr_creation_or_update(table, pr_info, timestamp):
    """Handle PR creation or update events"""
    pr_id = pr_info["pr_id"]
    action = pr_info["action"]
    
    # Check if PR already exists to avoid recreating it
    existing_item = get_existing_pr_data(table, pr_id)
    
    # Only create a new item if the PR doesn't already exist
    if not existing_item:
        # Create new PR item with only essential fields
        item = create_pr_base_item(pr_info, action, timestamp)
        print(f"Creating new PR item for {pr_id}")
        print(json.dumps(item, indent=2, cls=DecimalEncoder))
        table.put_item(Item=item)
        print(f"Created new PR {pr_id} in DynamoDB")
        return
    
    # For existing PRs, update only the necessary fields based on the event type
    print(f"PR {pr_id} already exists. Updating relevant fields.")
    
    # Handle merged PR updates
    pr = pr_info["pr"]
    if action == "closed" and pr.get("merged"):
        merged_at = pr.get("merged_at")
        # Use ReviewRequestedTime instead of CreatedDate for cycle time calculation
        review_requested_time = existing_item.get("ReviewRequestedTime")
        cycle_time_hours = calculate_cycle_time_hours(review_requested_time, merged_at)
        cycle_time_display = format_cycle_time_readable(cycle_time_hours)
        merged_by_user = pr.get("merged_by", {})
        merged_by = merged_by_user.get("login") if merged_by_user else ""
        
        try:
            table.update_item(
                Key={"PR_ID": pr_id},
                UpdateExpression="SET MergedDate = :md, CycleTimeHours = :cth, CycleTimeDisplay = :ctd, #S = :st, merged_by = :mb, event_timestamp = :ts, #A = :act",
                ExpressionAttributeNames={
                    "#S": "State",
                    "#A": "action"
                },
                ExpressionAttributeValues={
                    ":md": merged_at,
                    ":cth": Decimal(str(cycle_time_hours)),
                    ":ctd": cycle_time_display,
                    ":st": "Merged",
                    ":mb": merged_by,
                    ":ts": timestamp,
                    ":act": action
                }
            )
            print(f"Updated merge data for PR {pr_id}")
        except Exception as e:
            print(f"Error updating merge data: {e}")
    
    # Handle simple state updates for closed PRs (not merged)
    elif action == "closed":
        try:
            table.update_item(
                Key={"PR_ID": pr_id},
                UpdateExpression="SET #S = :st, event_timestamp = :ts, #A = :act",
                ExpressionAttributeNames={
                    "#S": "State",
                    "#A": "action"
                },
                ExpressionAttributeValues={
                    ":st": "Closed",
                    ":ts": timestamp,
                    ":act": action
                }
            )
            print(f"Updated PR {pr_id} to Closed state")
        except Exception as e:
            print(f"Error updating closed state: {e}")
    
    # Handle other action updates (general case)
    else:
        try:
            table.update_item(
                Key={"PR_ID": pr_id},
                UpdateExpression="SET event_timestamp = :ts, action = :act",
                ExpressionAttributeValues={
                    ":ts": timestamp,
                    ":act": action
                }
            )
            print(f"Updated timestamp for PR {pr_id}")
        except Exception as e:
            print(f"Error updating timestamp: {e}")

def record_first_review(table, pr_id, reviewer_login):
    """Record first review information"""
    try:
        first_review_time = datetime.utcnow().isoformat()
        print(f"🎯 First review activity detected for PR {pr_id} by {reviewer_login}")

        table.update_item(
            Key={"PR_ID": pr_id},
            UpdateExpression="SET FirstReviewReceived = :flag, FirstReviewTime = :ts, FirstReviewer = :login",
            ExpressionAttributeValues={
                ":flag": True,
                ":ts": first_review_time,
                ":login": reviewer_login
            },
            ConditionExpression="attribute_exists(PR_ID)"
        )
        return True
    except Exception as e:
        print(f"⚠️ Failed to record FirstReviewReceived for PR {pr_id}: {e}")
        return False

def add_reviewer_to_list(table, pr_id, reviewer_login):
    """Add reviewer to the reviewers list if not already present"""
    try:
        # First, get the current list of reviewers
        pr_data = get_existing_pr_data(table, pr_id)
        current_reviewers = pr_data.get("Reviewers", [])
        
        # Check if reviewer is already in the list
        if reviewer_login in current_reviewers:
            print(f"Reviewer {reviewer_login} already exists for PR {pr_id}, skipping addition")
            return True
        
        print(f"Recording new reviewer {reviewer_login} for PR {pr_id}")
        table.update_item(
            Key={"PR_ID": pr_id},
            UpdateExpression="SET Reviewers = list_append(if_not_exists(Reviewers, :empty_list), :new_reviewer)",
            ExpressionAttributeValues={
                ":new_reviewer": [reviewer_login],
                ":empty_list": []
            },
            ConditionExpression="attribute_exists(PR_ID)"
        )
        return True
    except Exception as e:
        print(f"Failed to add reviewer {reviewer_login} to PR {pr_id}: {e}")
        return False

def update_pr_state(table, pr_id, new_state, condition_state=None):
    """Update PR state with optional condition"""
    try:
        if condition_state:
            print(f"Setting State = '{new_state}' for PR {pr_id} if current state is '{condition_state}'")
            table.update_item(
                Key={"PR_ID": pr_id},
                UpdateExpression="SET #S = :val",
                ExpressionAttributeNames={"#S": "State"},
                ExpressionAttributeValues={
                    ":val": new_state,
                    ":expected": condition_state
                },
                ConditionExpression="attribute_exists(PR_ID) AND #S = :expected"
            )
        else:
            print(f"Setting State = '{new_state}' for PR {pr_id}")
            table.update_item(
                Key={"PR_ID": pr_id},
                UpdateExpression="SET #S = :val",
                ExpressionAttributeNames={"#S": "State"},
                ExpressionAttributeValues={
                    ":val": new_state
                },
                ConditionExpression="attribute_exists(PR_ID)"
            )
        return True
    except Exception as e:
        print(f"Failed to update state for PR {pr_id}: {e}")
        return False

def handle_changes_requested(table, pr_id):
    """Handle changes requested review state"""
    try:
        print(f"Setting State = 'Changes Requested' and PR_Iterations = 1 for: {pr_id}")
        table.update_item(
            Key={"PR_ID": pr_id},
            UpdateExpression="SET PR_Iterations = :val1, #S = :val2",
            ExpressionAttributeNames={"#S": "State"},
            ExpressionAttributeValues={
                ":val1": 1,
                ":val2": "Changes Requested"
            },
            ConditionExpression="attribute_exists(PR_ID)"
        )
        return True
    except Exception as e:
        print(f"Failed to handle changes requested for PR {pr_id}: {e}")
        return False

def handle_review_event(table, pr_info, review):
    """Handle PR review events"""
    pr_id = pr_info["pr_id"]
    review_state = review.get('state')
    reviewer_login = review.get('user', {}).get('login')
    
    print(f"Review received for PR {pr_id} with state: {review_state} by {reviewer_login}")
    
    # Check if PR exists, if not create it
    pr_data = get_existing_pr_data(table, pr_id)
    
    if not pr_data:
        # PR doesn't exist in DynamoDB yet, create it
        timestamp = datetime.utcnow().isoformat()
        item = create_pr_base_item(pr_info, pr_info["action"], timestamp)
        
        # Add review-specific fields
        item["FirstReviewReceived"] = True
        item["FirstReviewTime"] = timestamp
        item["FirstReviewer"] = reviewer_login
        item["Reviewers"] = [reviewer_login]
        
        if review_state == 'changes_requested':
            item["PR_Iterations"] = 1
            item["State"] = "Changes Requested"
        
        print(f"Creating new PR item with review data for {pr_id}")
        table.put_item(Item=item)
        return
    
    # PR exists, update review data
    # Record first review if this is the first one
    if not pr_data.get("FirstReviewReceived"):
        record_first_review(table, pr_id, reviewer_login)
    
    # Always record the reviewer
    if reviewer_login:
        add_reviewer_to_list(table, pr_id, reviewer_login)
    
    # Handle different review states
    if review_state == 'changes_requested':
        handle_changes_requested(table, pr_id)
    elif review_state in ['approved', 'commented']:
        update_pr_state(table, pr_id, "Review in Progress", "Open")
    else:
        print("Skipping review event: state not actionable.")

def store_event_in_dynamodb(payload_str, detail_type, table):
    """Main function to process GitHub webhook events and update DynamoDB"""
    # Skip non-relevant events
    if 'pull_request' not in detail_type and 'pull_request_review' not in detail_type:
        print(f"Skipping non-PR event: {detail_type}")
        return
    
    # Skip inline review comments
    if detail_type == 'pull_request_review_comment':
        print("Skipping inline review comment event.")
        return
    
    # Parse the payload
    try:
        payload = json.loads(payload_str)
        print("[payload]", json.dumps(payload, indent=2))
    except Exception as e:
        print(f"Error parsing payload: {e}")
        return
    
    # Extract common PR info
    pr_info = extract_pr_base_info(payload, detail_type)
    pr_id = pr_info["pr_id"]
    action = pr_info["action"]
    timestamp = datetime.utcnow().isoformat()
    
    # Handle pull_request events
    if detail_type == 'pull_request':
        # Handle PR moved to draft
        if action == 'converted_to_draft':
            handle_pr_draft_conversion(table, pr_id)
            return
        
        # Handle new commit push
        if action == 'synchronize':
            handle_pr_synchronize(table, pr_id)
            return
        
        # Skip irrelevant actions
        if action not in ['opened', 'reopened', 'ready_for_review', 'closed']:
            print(f"Skipping pull_request action: {action}")
            return
        
        # Skip draft PRs
        if pr_info["pr"].get("draft", False):
            print(f"Skipping draft PR: {pr_id}")
            return
        
        # Handle PR creation or updating existing PRs
        handle_pr_creation_or_update(table, pr_info, timestamp)
    
    # Handle pull_request_review events
    elif detail_type == 'pull_request_review':
        review = payload.get('review', {})
        handle_review_event(table, pr_info, review)

def get_jira_url(jira_id):
    base_url = "https://base_url"
    if jira_id:
        return f"{base_url}{jira_id}"
    return None