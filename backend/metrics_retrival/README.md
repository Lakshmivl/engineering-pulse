
## Engineering Metrics Retriever
This AWS Lambda-based service exposes REST API endpoints to retrieve GitHub Pull Request (PR) metrics from DynamoDB. It powers engineering dashboards with high-level summaries, contributor insights, and raw PR data, helping teams improve code review speed, quality, and visibility.


## Features
- Returns high-level engineering KPIs (PR size, cycle time, review time)
- Provides contributor insights like top reviewers and fastest responders
- Outputs raw PR records for frontend dashboards or audits
- Filters data by squad, tech stack, and date range
- Designed for use in GitHub Webhook-based engineering analytics platforms


## Sample API Requests
GET /summary?startDate=20250501&endDate=20250528
GET /contributors?startDate=20250501&endDate=20250528&squad=growth-team
GET /table?startDate=20250501&endDate=20250528&squad=platform&stack=python

## Postman Collection Included
A Postman collection is included in this repo to help you quickly test and explore metrics-retriever endpoints:
- Import it into your Postman workspace
- Set `startDate`, `endDate`, and optional query parameters (`squad`, `stack`)
- Run predefined requests for `/summary`, `/contributors`, and `/table`
