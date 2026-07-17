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
| User | Dexter, Ben, Jason, Cooper, Everyone, Mike, Ben/Dexter, Mike & Cooper, Dexter/Cooper, Kyler, Dexter/Kyler, Ben/Dexter/Kyler |
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

- Anyone can view, add, and edit projects
- **Delete requires a password** (default: `parallax`)
- Search and filter by status
- Sortable columns
- CSV export
- Stats summary

### Change the delete password

1. Create a SHA-256 hex hash of your new password (PowerShell):

```powershell
$bytes = [Text.Encoding]::UTF8.GetBytes("your-new-password")
$sha = [Security.Cryptography.SHA256]::Create()
($sha.ComputeHash($bytes) | ForEach-Object { $_.ToString("x2") }) -join ""
```

2. Replace `DELETE_PASSWORD_HASH` in `app.js` with that hash.
3. Commit and push.
