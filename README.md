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
| Contact name | Customer / site contact name |
| Contact phone | Contact phone number |
| Quote sheet | Google Sheet URL for the quote (also editable when a job is expanded) |
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
- **Click a job row to expand full details**
- **Delete requires a password** (default: `parallax`)
- Search and filter by status / user
- Sortable columns
- CSV export
- Stats summary
- **Fiber Agreements** — build a telecommunications service agreement or a service order from a job, or type it in by hand

## Fiber Agreements

Open the **Fiber Agreements** tab, or expand a job and choose **Create agreement**. The form can also start from the job picker. Anything you type is manual and is not written back onto the job.

Saved agreements stay in this browser (`localStorage` key `parallax-fiber-agreements-v1`). **Download PDF** saves the file locally. There is no server and no Adobe Acrobat Sign yet. `sendForSignature()` in `fiber-agreements.js` and `signTag()` in `pdf-doc.js` are the hooks for Sign later. Signature lines on the PDF are blank.

| Job field | Agreement field |
|-----------|-----------------|
| Project | Business / customer name. A trailing copy of the job address is removed. |
| Contact name | Contact person. A phone or email written in that field is split out when Contact phone / Email are empty. |
| Contact phone | Phone |
| Address | Street, city, state, ZIP when it looks like `street, city, ST ZIP`. Otherwise the whole value stays in the street. State defaults to IN. City and ZIP are not guessed. |
| NRC | Installation charge. A value with `?` is filled and flagged to confirm. |
| MRC | Fiber level when it matches a preset price. Any other positive amount selects Custom. |
| Scheduled | Requested installation date |
| WO | Agreement # |
| Notes | Service order notes. Review them; job notes are often internal. |
| Quote sheet | Link on the form, and a reference line on the service order |

Fiber levels: 1 = 120 Mbps at $120/mo, 2 = 200 Mbps at $200/mo, 3 = 500 Mbps at $500/mo, 4 = 750 Mbps at $1,000/mo, 5 = 1 Gig at $2,500/mo, plus Custom speed and price. A job with no MRC does not assume Level 1.

The service order line items start as a monthly row and an installation row from that level and the NRC. Edit them, add rows, or remove rows. After an edit they stay put until **Reset from fiber level**. The PDF totals NRC and MRC from those rows.

The PDF is the current Parallax fiber agreement, then a last page titled **Service Order** (quote-style header, logo, customer block, qty / unit / amount table). Choose **Service order only** to skip the contract pages. `jspdf.umd.min.js` is included so the PDF works offline.

### Change the delete password

1. Create a SHA-256 hex hash of your new password (PowerShell):

```powershell
$bytes = [Text.Encoding]::UTF8.GetBytes("your-new-password")
$sha = [Security.Cryptography.SHA256]::Create()
($sha.ComputeHash($bytes) | ForEach-Object { $_.ToString("x2") }) -join ""
```

2. Replace `DELETE_PASSWORD_HASH` in `app.js` with that hash.
3. Commit and push.
