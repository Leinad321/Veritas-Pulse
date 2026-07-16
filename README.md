# DCP KPI Validation + AI Query Prototype

Tested and confirmed working end to end: 30 sample rows generated, 8 correctly
flagged (implausible spike, missing value, duplicate date, trend deviations).

## Architecture

Excel file (plant data) -> watch_folder.py (auto-detects new/changed files)
-> validate.py (pandas validation rules) -> SQLite (db/kpi.db)
-> app.py (FastAPI, exposes /api/summary, /api/records, /api/ask)
-> Dashboard.jsx (React, displays results + AI query box)

## Backend setup (Windows)

```
cd backend
pip install pandas openpyxl fastapi uvicorn google-generativeai

# 1. generate sample data (skip once you have real plant data)
python data/generate_sample_data.py

# 2. run validation once
python scripts/validate.py

# 3. OR run the auto-watcher instead of step 2, for the live "automatic sync" demo
python scripts/watch_folder.py

# 4. start the API (in a separate terminal, leave watch_folder.py running)
uvicorn app:app --reload --port 8000
```

For the AI query layer and predictive insights to give real answers instead of
the fallback text, get a free Gemini API key at https://aistudio.google.com/apikey
and set it (Windows PowerShell):
```
$env:GEMINI_API_KEY="your_key_here"
```
Or on Command Prompt:
```
set GEMINI_API_KEY=your_key_here
```
Set it in the same terminal window you run `uvicorn` from.

## Predictive Insights (new)

`/api/insights` looks at all flagged records, groups them by plant + KPI +
issue type, counts how often each recurring pattern shows up, and asks Gemini
to suggest a likely root cause and one concrete next step for each pattern.
This is grounded in real counts from your data, not a black-box guess, so if
a judge asks "how does it know that," the honest answer is: it's counting
actual recurring flags and asking the AI to reason about them, not predicting
from nothing.

## Frontend setup

Drop `Dashboard.jsx` into a React app (Vite or Create React App both work).
It needs `lucide-react` installed:
```
npm install lucide-react
```
Render `<Dashboard />` as your main app component. It talks to
`http://localhost:8000` by default, change `API_BASE` in Dashboard.jsx if your
API runs elsewhere.

## Live demo flow (for the pitch)

1. Have watch_folder.py already running
2. Drop a new/edited Excel file into `backend/data/incoming/` live, in front of judges
3. Within ~10 seconds the dashboard auto-refreshes and shows the new flagged/clean records
4. Ask the AI assistant a question about what just came in

This demonstrates the full automatic pipeline, no manual upload step, in real time.
