# Parallax Project Tracking

Web app for tracking Parallax projects and work orders.

## Fields

| Field | Description |
|-------|-------------|
| Open Date | When the project was opened |
| Completed Date | When the project was completed |
| Project | Project name |
| Address | Job site address |
| Update | Latest status update |
| Scheduled | Scheduled date |
| Status | Not Yet Started, Complete, On Hold, In Progress, Waiting on other, Scheduled, Port Submitted, Parts Ordered, Ready for Billing, Billing Complete, Disregard, Needs Quoted |
| User | Assigned user |
| WO | Work order number |
| NRC | Non-recurring charge |
| MRC | Monthly recurring charge |
| Contact | Customer / site contact |
| Notes | Free-form notes |

## Local

```powershell
start C:\Users\dexte\parallax-project-tracking\index.html
```

Data is stored in the browser (`localStorage`) on each device.

## Deploy (Netlify)

1. Import GitHub repo `parallax-project-tracking`
2. Build command: empty · Publish directory: `.`
3. Deploy

## Features

- Add / edit / delete projects
- Search and filter by status
- Sortable columns
- CSV export
- Stats summary
