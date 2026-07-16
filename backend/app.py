import os
import sqlite3
from typing import Optional
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

# Load environmental variables
load_dotenv()

# Configure Gemini
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("WARNING: GEMINI_API_KEY is not set in environmental variables.")
genai.configure(api_key=api_key)

app = FastAPI(title="Veritas Pulse Gateway Backend")

# Enable CORS for React Frontend (localhost:5173)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "kpi.db"

# ----------------------------------------------------------------
# 1. Database Initialization & Seeding
# ----------------------------------------------------------------
def init_db():
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    # Create the records table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS kpi_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            plant TEXT NOT NULL,
            kpi_name TEXT NOT NULL,
            date TEXT NOT NULL,
            value REAL,
            status TEXT NOT NULL,
            flag_reason TEXT
        )
    """)
    conn.commit()

    # Seed initial data if the table is empty
    cursor.execute("SELECT COUNT(*) FROM kpi_records")
    if cursor.fetchone()[0] == 0:
        seed_data = [
            ("Ibadan Plant Alpha", "Turbine Temperature", "2026-07-14", 185.4, "flagged", "Exceeds maximum threshold limit of 180°C"),
            ("Ibadan Plant Alpha", "Throughput Yield", "2026-07-14", 94.2, "clean", None),
            ("Lagos Assembly Beta", "Power Factor", "2026-07-14", 0.72, "flagged", "Power factor below critical tolerance grid requirement (0.85 minimum)"),
            ("Lagos Assembly Beta", "Daily Output Metric", "2026-07-13", 1240.0, "clean", None),
            ("Port Harcourt Refining", "Carbon Monoxide Level", "2026-07-14", 55.0, "flagged", "Sensors report critical CO concentration safety limit breach (max 50ppm)"),
            ("Port Harcourt Refining", "Fuel Feed Rate", "2026-07-14", 8.9, "clean", None),
            ("Ibadan Plant Alpha", "Vibration Amplitude", "2026-07-13", 0.12, "clean", None),
        ]
        cursor.executemany("""
            INSERT INTO kpi_records (plant, kpi_name, date, value, status, flag_reason)
            VALUES (?, ?, ?, ?, ?, ?)
        """, seed_data)
        conn.commit()
    conn.close()

init_db()

# ----------------------------------------------------------------
# 2. Pydantic Models for Validation
# ----------------------------------------------------------------
class QueryRequest(BaseModel):
    question: str

# ----------------------------------------------------------------
# 3. API Endpoints
# ----------------------------------------------------------------

@app.get("/api/summary")
def get_summary():
    """Returns aggregated metadata counters from SQLite."""
    try:
        conn = sqlite3.connect(DB_FILE)
        cursor = conn.cursor()
        
        cursor.execute("SELECT COUNT(*) FROM kpi_records")
        total = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM kpi_records WHERE status = 'flagged'")
        flagged = cursor.fetchone()[0]
        
        cursor.execute("SELECT COUNT(*) FROM kpi_records WHERE status = 'clean'")
        clean = cursor.fetchone()[0]
        
        conn.close()
        return {
            "total_records": total,
            "flagged_records": flagged,
            "clean_records": clean
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/records")
def get_records(status: Optional[str] = Query(None, pattern="^(all|flagged|clean)$")):
    """Retrieves records with optional status filtering."""
    try:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        
        if status and status != "all":
            cursor.execute("SELECT * FROM kpi_records WHERE status = ? ORDER BY date DESC", (status,))
        else:
            cursor.execute("SELECT * FROM kpi_records ORDER BY date DESC")
            
        rows = cursor.fetchall()
        conn.close()
        
        return [dict(row) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/insights")
def get_insights():
    """Gathers all active anomalies and generates an engineering mitigation brief using Gemini."""
    if not api_key:
        return {"insights": "Gemini API Key is missing. Please populate your .env file."}
        
    try:
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT plant, kpi_name, value, flag_reason FROM kpi_records WHERE status = 'flagged'")
        anomalies = [dict(row) for row in cursor.fetchall()]
        conn.close()

        if not anomalies:
            return {"insights": "No pending flagged exceptions are present. Database state is currently nominal."}

        # Format DB data directly into LLM Prompt
        context_string = "\n".join([
            f"- Plant: {a['plant']} | Parameter: {a['kpi_name']} | Recorded Value: {a['value']} | System Alert: {a['flag_reason']}"
            for a in anomalies
        ])

        prompt = f"""
You are an expert industrial systems engineering consultant. Analyze these flagged plant anomalies immediately:
{context_string}

Provide a concise technical assessment for the operations room:
1. Executive Root-Cause Hypotheses (What is causing each warning?).
2. Prioritized Mitigation Workflows (Actionable operational steps).
3. Preventive maintenance recommendations.

Respond with professional, authoritative formatting. Keep your answer technical, direct, and under 250 words.
"""
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        return {"insights": response.text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini Inference Error: {str(e)}")


@app.post("/api/ask")
def ask_assistant(payload: QueryRequest):
    """Answers arbitrary natural language queries grounded entirely to the database records."""
    if not api_key:
        return {"answer": "Gemini API Key is missing. Please populate your .env file."}

    try:
        # Pull down the complete table state to use as grounding context
        conn = sqlite3.connect(DB_FILE)
        conn.row_factory = sqlite3.Row
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM kpi_records")
        all_data = [dict(row) for row in cursor.fetchall()]
        conn.close()

        context_string = "\n".join([
            f"Record ID {d['id']}: Plant={d['plant']}, Metric={d['kpi_name']}, Date={d['date']}, Value={d['value']}, Status={d['status']}, Error={d['flag_reason']}"
            for d in all_data
        ])

        prompt = f"""
You are an integrated AI SQL Analyst on the 'Veritas Pulse' platform.
Ground your response strictly within this current database dump:

{context_string}

User's Query: "{payload.question}"

Instructions:
- Base your response strictly on the factual database dump above.
- If the question involves computing averages, totals, counts, or finding max/min values, execute the arithmetic step-by-step mentally.
- Keep the response short, clear, and targeted.
"""
        model = genai.GenerativeModel("gemini-2.5-flash")
        response = model.generate_content(prompt)
        return {"answer": response.text.strip()}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assistant Grounding Error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    # Start app on port 8000
    uvicorn.run("app:app", host="127.0.0.1", port=8000, reload=True)