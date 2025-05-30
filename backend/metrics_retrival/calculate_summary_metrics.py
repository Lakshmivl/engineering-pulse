from datetime import datetime
from collections import defaultdict

def format_cycle_time_readable(hours):
    if hours < 24:
        return f"{int(hours)} h {int((hours % 1) * 60)} m"
    else:
        days = int(hours // 24)
        remaining_hours = int(hours % 24)
        return f"{days} d {remaining_hours} h"

def calculate_summary_metrics(pr_items):
    merged_to_develop = [pr for pr in pr_items if pr.get("State", "").lower() == "merged" and pr.get("TargetBranch") == "develop"]
    merged_to_main = [pr for pr in pr_items if pr.get("State", "").lower() == "merged" and pr.get("TargetBranch") == "main"]

    total_prs = len([pr for pr in pr_items if pr.get("TargetBranch") == "develop"])
    merged_prs = len(merged_to_develop)
    avg_pr_size = calculate_average([pr.get("PR_Size", 0) for pr in merged_to_develop])
    avg_review_time = calculate_average([
        time_diff_in_hours(pr.get("ReviewRequestedTime"), pr.get("FirstReviewTime"))
        for pr in merged_to_develop if pr.get("ReviewRequestedTime") and pr.get("FirstReviewTime")
    ])
    avg_cycle_time_hours = calculate_average([
        time_diff_in_hours(pr.get("CreatedDate"), pr.get("MergedDate"))
        for pr in merged_to_develop if pr.get("CreatedDate") and pr.get("MergedDate")
    ])
    pr_to_production = len(merged_to_develop)
    loc_to_production = sum(pr.get("PR_Size", 0) for pr in merged_to_main)

    # Aggregated PR size and cycle time per repository
    repo_pr_counts = defaultdict(int)
    repo_pr_sizes = defaultdict(list)
    repo_cycle_times = defaultdict(list)

    for pr in merged_to_develop:
        repo = (pr.get("repository") or "unknown").lower().strip()
        repo_pr_counts[repo] += 1
        repo_pr_sizes[repo].append(pr.get("PR_Size", 0))

        start = pr.get("CreatedDate")
        end = pr.get("MergedDate")
        if start and end:
            cycle_hours = time_diff_in_hours(start, end)
            if cycle_hours > 0:
                repo_cycle_times[repo].append(cycle_hours)

    avg_pr_size_per_repo = {
        repo: round(sum(sizes) / len(sizes)) if sizes else 0
        for repo, sizes in repo_pr_sizes.items()
    }

    avg_cycle_time_per_repo = {
        repo: round(sum(cycles) / len(cycles), 2) if cycles else 0
        for repo, cycles in repo_cycle_times.items()
    }

    repo_summary = {}
    for repo in sorted(repo_pr_counts):
        repo_summary[repo] = {
            "avg_pr_size": avg_pr_size_per_repo.get(repo, 0),
            "pr_count": repo_pr_counts.get(repo, 0),
            "avg_cycle_time": avg_cycle_time_per_repo.get(repo, 0)
        }

    return {
        "total_prs": total_prs,
        "merged_prs": merged_prs,
        "avg_pr_size": round(avg_pr_size),
        "avg_review_time": format_cycle_time_readable(avg_review_time),
        "avg_cycle_time": format_cycle_time_readable(avg_cycle_time_hours),
        "pr_to_prod": pr_to_production,
        "loc_to_prod": loc_to_production,
        "repo_summary": repo_summary
    }

def calculate_average(numbers):
    valid = []
    for n in numbers:
        try:
            val = float(n)
            if val > 0:
                valid.append(val)
        except (TypeError, ValueError):
            continue
    return sum(valid) / len(valid) if valid else 0

def time_diff_in_hours(start_iso, end_iso):
    try:
        start = datetime.fromisoformat(start_iso.replace("Z", ""))
        end = datetime.fromisoformat(end_iso.replace("Z", ""))
        return (end - start).total_seconds() / 3600.0
    except:
        return 0
