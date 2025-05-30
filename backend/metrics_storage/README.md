# Update README with notes on Jira URL configuration and GitHub Webhook Lambda integration

updated_readme_content = """
# PR Metrics Processor

This module processes GitHub webhook events related to pull requests and pull request reviews. It stores relevant PR metadata in an AWS DynamoDB table for later visualization, analysis, or metrics generation.

## Features

- Extracts and stores PR metadata (author, state, timestamps, reviewers)
- Tracks PR lifecycle events (opened, merged, closed, etc.)
- Tracks PR review activity, including first review and reviewer list
- Calculates cycle time and PR iteration count
- Supports conditional state updates
- Supports deletion when PR is converted to draft
- Optimized for integration with engineering dashboards

## Technologies Used

- Python 3
- AWS DynamoDB
- GitHub Webhooks
- `boto3` / `botocore`
- `datetime`, `decimal`, and standard libraries

## Functions

### Event Processing

- `store_event_in_dynamodb(payload_str, detail_type, table)`
  - Main entry point to process webhook payloads.

### PR Event Handlers

- `handle_pr_creation_or_update(...)`
- `handle_pr_draft_conversion(...)`
- `handle_pr_synchronize(...)`
- `handle_review_event(...)`

### Review Data Helpers

- `record_first_review(...)`
- `add_reviewer_to_list(...)`
- `handle_changes_requested(...)`

### Utility Functions

- `calculate_cycle_time_hours(...)`
- `format_cycle_time_readable(...)`
- `extract_pr_base_info(...)`
- `get_existing_pr_data(...)`
- `update_pr_state(...)`
- `get_jira_url(...)`

## Setup

1. Install dependencies:
    ```bash
    pip install boto3
    ```

2. Add AWS credentials and DynamoDB table name in your environment or use an IAM role.

3. **Configure the Jira Base URL**
    - Update the `get_jira_url(jira_id)` function to return the correct link to your Jira system.
    - Example:
      ```python
      def get_jira_url(jira_id):
          base_url = "https://yourcompany.atlassian.net/browse/"
          if jira_id:
              return f"{base_url}{jira_id}"
          return None
      ```

4. **Integrate with GitHub Webhook Lambda**
    - Deploy this module in an AWS Lambda function.
    - Connect the Lambda to your GitHub webhook endpoint.
    - Pass the webhook `payload`, event type, and DynamoDB table reference to the function:
      ```python
      def lambda_handler(event, context):
          detail_type = event['headers'].get('X-GitHub-Event')
          payload_str = event['body']
          store_event_in_dynamodb(payload_str, detail_type, dynamodb_table)
      ```

## Notes

- This code assumes all timestamps are in ISO 8601 format.
- Designed to run in an event-driven environment like AWS Lambda.
- The `get_jira_url()` function must be customized with your actual Jira base URL.

## License
This project is open source and available under the Apache License.
