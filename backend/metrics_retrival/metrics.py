import os
import json
import boto3
from boto3.dynamodb.conditions import Key, Attr
from datetime import datetime
from decimal import Decimal
from contributor_metrics import calculate_contributor_metrics
from calculate_summary_metrics import calculate_summary_metrics

DYNAMODB_TABLE_NAME = os.environ.get("DYNAMO_TABLE_NAME")
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table(DYNAMODB_TABLE_NAME)

def lambda_handler(event, context):
    print("Event received:", json.dumps(event))
    path = event.get("rawPath", "")
    query = event.get("queryStringParameters", {}) or {}
    start_date_raw = query.get("startDate")
    end_date_raw = query.get("endDate")
    squad = query.get("squad")
    stack = query.get("stack")

    try:
        start_date = datetime.strptime(start_date_raw, "%Y%m%d").replace(hour=0, minute=0, second=0).isoformat() + "Z"
        end_date = datetime.strptime(end_date_raw, "%Y%m%d").replace(hour=23, minute=59, second=59).isoformat() + "Z"
    except ValueError:
        return response(400, "Invalid date format. Use YYYYMMdd (e.g., 20250514)")

    try:
        if not start_date or not end_date:
            return response(400, "Missing required parameters: startDate, endDate")

        if path.endswith("/summary"):
            return get_summary(start_date, end_date)
        elif path.endswith("/contributors"):
            return get_contributors(start_date, end_date, squad)
        elif path.endswith("/table"):
            return get_table(start_date, end_date, squad, stack)
        else:
            return response(404, "Endpoint not found")

    except Exception as e:
        print("Error:", str(e))
        return response(500, f"Internal Server Error: {str(e)}")

def get_summary(start_date, end_date):
    items = scan_by_date(start_date, end_date)
    metrics = calculate_summary_metrics(items)
    return response(200, metrics)

def get_contributors(start_date, end_date, squad=None):
    items = scan_by_date(start_date, end_date, squad)
    metrics = calculate_contributor_metrics(items)
    return response(200, metrics)


def get_table(start_date, end_date, squad=None, stack=None):
    items = scan_by_date(start_date, end_date, squad, stack)
    return response(200, items)

def scan_by_date(start, end, squad=None, stack=None):
    filter_exp = (
            Attr("CreatedDate").gte(start) & Attr("CreatedDate").lte(end)
    )
    if squad:
        filter_exp &= Attr("Squad").eq(squad)
    if stack:
        filter_exp &= Attr("TechStack").eq(stack)

    response = table.scan(FilterExpression=filter_exp)
    return response.get("Items", [])

def calculate_avg_cycle_time(prs):
    total_hours = 0.0
    count = 0
    for pr in prs:
        start = pr.get("CreatedDate")
        end = pr.get("MergedDate")
        if start and end:
            try:
                start_ts = datetime.fromisoformat(start.replace("Z", ""))
                end_ts = datetime.fromisoformat(end.replace("Z", ""))
                total_hours += (end_ts - start_ts).total_seconds() / 3600.0
                count += 1
            except Exception:
                continue
    return round(total_hours / count, 2) if count > 0 else 0.0

def decimal_default(obj):
    if isinstance(obj, Decimal):
        return int(obj) if obj % 1 == 0 else float(obj)
    raise TypeError(f"Object of type {type(obj).__name__} is not JSON serializable")

def response(status_code, body):
    return {
        "statusCode": status_code,
        "body": json.dumps(body, default=decimal_default),
        "headers": {"Content-Type": "application/json"}
    }