"""
Helper Module: contributor_metrics.py
Updated: Adds time-series PR volume and review speed tracking,
makes 'state' check case-insensitive, removes 'DeployedToProd',
and properly computes cross-repo and fastest reviewers using correct field names.
Adds logging of final return payload and prints list of reviewers.
"""

from datetime import datetime
import json
import logging
from collections import defaultdict

# Configure logger
logger = logging.getLogger()
logger.setLevel(logging.INFO)

def calculate_contributor_metrics(items):
    reviewer_stats = {}
    total_iterations = 0
    impactful_contributors = {}
    code_quality_champions = {}
    review_response_times = {}
    reviewer_first_seen = set()
    reviewer_repo_map = {}
    new_reviewers = set()
    total_reviewed_prs = 0
    total_reviewer_count = 0
    daily_volume = defaultdict(int)
    daily_review_speed = defaultdict(list)

    for pr in items:
        pr_id = pr.get("PR_ID", "Unknown")
        repo = pr.get("repository", "UnknownRepo")
        author = pr.get("Author")
        state = pr.get("State", "").lower()
        branch = pr.get("TargetBranch", "").lower()
        created = pr.get("CreatedDate")
        review_requested = pr.get("ReviewRequestedTime")
        first_reviewed = pr.get("FirstReviewTime")

        if created:
            try:
                created_day = datetime.fromisoformat(created.replace("Z", "")).date().isoformat()
                daily_volume[created_day] += 1
            except Exception as e:
                logger.warning(f"[WARN] PR_ID={pr_id} - failed to parse CreatedDate: {e}")

        if author and state == "merged" and branch == "develop":
            impactful_contributors[author] = impactful_contributors.get(author, 0) + 1

        try:
            iterations = int(pr.get("PR_Iterations", 0))
        except Exception:
            iterations = 0
        total_iterations += iterations

        reviewers = pr.get("Reviewers", [])
        if isinstance(reviewers, str):
            try:
                reviewers = json.loads(reviewers)
            except:
                reviewers = []

        total_reviewer_count += len(reviewers)
        if reviewers:
            total_reviewed_prs += 1

        if state != "open" and review_requested and first_reviewed and reviewers:
            try:
                r1 = datetime.fromisoformat(review_requested.replace("Z", ""))
                r2 = datetime.fromisoformat(first_reviewed.replace("Z", ""))
                if r2 >= r1:
                    delta = (r2 - r1).total_seconds() / 3600.0
                    first_reviewer = pr.get("FirstReviewer", reviewers[0])
                    if first_reviewer:
                        if first_reviewer not in review_response_times:
                            review_response_times[first_reviewer] = []
                        review_response_times[first_reviewer].append(delta)
                        review_day = r1.date().isoformat()
                        daily_review_speed[review_day].append(delta)
                else:
                    logger.warning(f"[WARN] PR_ID={pr_id} has FirstReviewTime earlier than ReviewRequestedTime")
            except Exception as e:
                logger.warning(f"[WARN] PR_ID={pr_id} - error parsing review time: {e}")

        changers = pr.get("ChangeRequestors", [])
        if isinstance(changers, str):
            try:
                changers = json.loads(changers)
            except:
                changers = []

        for c in changers:
            code_quality_champions[c] = code_quality_champions.get(c, 0) + 1

        for r in reviewers:
            if r not in reviewer_first_seen:
                new_reviewers.add(r)
            reviewer_first_seen.add(r)

            if r not in reviewer_repo_map:
                reviewer_repo_map[r] = set()
            reviewer_repo_map[r].add(repo)

            if r not in reviewer_stats:
                reviewer_stats[r] = {"reviews": 0, "iterations": 0}
            reviewer_stats[r]["reviews"] += 1
            reviewer_stats[r]["iterations"] += iterations

    top_reviewers = sorted(
        [
            {"name": r, "reviews": stats["reviews"]}
            for r, stats in reviewer_stats.items()
        ],
        key=lambda x: x["reviews"],
        reverse=True
    )[:5]

    fastest_reviewers = [
        {
            "name": r,
            "avg_response_time_hrs": round(sum(times) / len(times), 2)
        }
        for r, times in review_response_times.items() if times
    ]
    fastest_reviewers = sorted(fastest_reviewers, key=lambda x: x["avg_response_time_hrs"])[:5]

    code_quality_leaders = sorted(
        [ {"name": r, "prs_flagged": count} for r, count in code_quality_champions.items() ],
        key=lambda x: x["prs_flagged"], reverse=True
    )[:5]

    cross_repo_champions = sorted(
        [ {"name": r, "unique_repos_reviewed": len(repos)} for r, repos in reviewer_repo_map.items() if len(repos) > 1 ],
        key=lambda x: x["unique_repos_reviewed"], reverse=True
    )[:5]

    review_coverage_percent = round((total_reviewed_prs / len(items)) * 100, 1) if items else 0.0
    avg_reviewers_per_pr = int(round(total_reviewer_count / len(items))) if items else 0

    daily_chart = [
        {
            "date": day,
            "pr_volume": daily_volume[day],
            "avg_review_time_hrs": round(sum(daily_review_speed[day]) / len(daily_review_speed[day]), 2) if daily_review_speed[day] else 0.0
        }
        for day in sorted(set(daily_volume.keys()).union(daily_review_speed.keys()))
    ]

    result = {
        "impactful_contributors": sorted(
            [ {"name": r, "prs_delivered": count} for r, count in impactful_contributors.items() ],
            key=lambda x: x["prs_delivered"], reverse=True
        )[:5],
        "new_reviewers": sorted(list(new_reviewers))[:3],
        "code_quality_champions": code_quality_leaders,
        "fastest_reviewers": fastest_reviewers,
        "cross_repo_champions": cross_repo_champions,
        "top_reviewers": top_reviewers,
        "total_reviewers": len(reviewer_stats),
        "review_coverage": review_coverage_percent,
        "avg_reviewers_per_pr": avg_reviewers_per_pr,
        "review_speed_chart": daily_chart
    }

    logger.info("[Contributor Metrics Result] %s", json.dumps(result, indent=2))
    logger.info("[Unique Reviewer List] %s", sorted(list(reviewer_stats.keys())))

    return result
