import sqlite3
import os
from collections import Counter

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "db", "kpi.db")

def get_context_data():
    conn = sqlite3.connect(DB_PATH)
    rows = conn.execute(
        "SELECT plant, kpi_category, kpi_name, date, value, status, flag_reason FROM kpi_records"
    ).fetchall()
    conn.close()
    lines = [
        f"plant={r[0]} | category={r[1]} | kpi={r[2]} | date={r[3]} | value={r[4]} | status={r[5]} | reason={r[6] or 'none'}"
        for r in rows
    ]
    return "\n".join(lines), rows

def summarize_patterns(rows):
    """Aggregate flagged records into recurring patterns: which KPI/plant/reason
    combos show up repeatedly. This is the input the AI uses to spot trends,
    it's grounded in actual counts, not raw guessing."""
    reason_counter = Counter()
    for r in rows:
        plant, category, kpi, date, value, status, reason = r
        if status == "flagged" and reason:
            for single_reason in reason.split(","):
                reason_counter[(plant, kpi, single_reason)] += 1

    lines = []
    for (plant, kpi, reason), count in reason_counter.most_common(10):
        lines.append(f"{plant} | {kpi} | recurring issue: {reason} | occurred {count} time(s)")
    return "\n".join(lines) if lines else "No recurring patterns found yet, not enough flagged data."

def call_gemini(prompt):
    """Shared call to Gemini, returns None if no key is set so callers can fall back."""
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        return None
    import google.generativeai as genai
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt)
    return response.text

def ask(question):
    """Plain Q&A grounded in the validated dataset."""
    context, _ = get_context_data()
    prompt = (
        "You are a KPI data assistant for a cement plant reporting system. "
        "Answer ONLY using the data below. Never invent numbers that are not present. "
        "If the data doesn't contain the answer, say so plainly.\n\n"
        f"DATA:\n{context}\n\nQUESTION: {question}"
    )
    result = call_gemini(prompt)
    if result is None:
        flagged = [l for l in context.split("\n") if "status=flagged" in l]
        return "No GEMINI_API_KEY set, showing raw flagged records instead:\n" + "\n".join(flagged)
    return result

def get_insights():
    """Predictive layer: looks at recurring patterns in flagged data and asks
    the AI to name likely root causes and suggest concrete next steps.
    This is suggestions grounded in actual recurring counts, not a black-box
    prediction, so it's defensible if a judge asks 'how does it know that'."""
    _, rows = get_context_data()
    patterns = summarize_patterns(rows)

    prompt = (
        "You are a reliability and data-quality assistant for a cement plant KPI system. "
        "Below are recurring flagged-data patterns, each with the plant, KPI, issue type, "
        "and how many times it occurred. Based ONLY on these patterns, do two things:\n"
        "1. Suggest the most likely root cause for each recurring pattern (label it as a hypothesis, not a certainty)\n"
        "2. Suggest one concrete, practical next step for the plant team to investigate or fix it\n"
        "Do not invent data not shown below. Keep each suggestion short and actionable.\n\n"
        f"RECURRING PATTERNS:\n{patterns}"
    )
    result = call_gemini(prompt)
    if result is None:
        return f"No GEMINI_API_KEY set. Raw recurring patterns detected:\n{patterns}"
    return result

if __name__ == "__main__":
    print("--- Q&A ---")
    print(ask("Which records were flagged and why?"))
    print("\n--- Predictive Insights ---")
    print(get_insights())
