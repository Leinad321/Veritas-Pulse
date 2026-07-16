import pandas as pd
import sqlite3
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "db", "kpi.db")

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS kpi_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            plant TEXT, kpi_category TEXT, kpi_name TEXT,
            date TEXT, value REAL, target REAL,
            status TEXT, flag_reason TEXT, submitted_by TEXT,
            source_file TEXT
        )
    """)
    conn.commit()
    return conn

def validate_row(value, recent_avg):
    reasons = []
    if pd.isna(value):
        reasons.append("missing_value")
    else:
        if value > 300 or value < 0:
            reasons.append("implausible_range")
        if recent_avg and abs(value - recent_avg) / recent_avg > 0.4:
            reasons.append("large_deviation_from_trend")
    return reasons

def validate_file(filepath):
    df = pd.read_excel(filepath)
    conn = init_db()

    # avoid re-processing the same file twice
    already = conn.execute(
        "SELECT COUNT(*) FROM kpi_records WHERE source_file = ?", (filepath,)
    ).fetchone()[0]
    if already > 0:
        conn.execute("DELETE FROM kpi_records WHERE source_file = ?", (filepath,))

    seen_dates = set()
    running_values = []

    for _, row in df.iterrows():
        recent_avg = sum(running_values[-5:]) / len(running_values[-5:]) if running_values else None
        reasons = validate_row(row["value"], recent_avg)

        if row["date"] in seen_dates:
            reasons.append("duplicate_period")
        seen_dates.add(row["date"])

        if not pd.isna(row["value"]):
            running_values.append(row["value"])

        status = "flagged" if reasons else "clean"
        conn.execute(
            """INSERT INTO kpi_records
               (plant, kpi_category, kpi_name, date, value, target, status, flag_reason, submitted_by, source_file)
               VALUES (?,?,?,?,?,?,?,?,?,?)""",
            (row["plant"], row["kpi_category"], row["kpi_name"], str(row["date"]),
             row["value"] if not pd.isna(row["value"]) else None, row["target"],
             status, ",".join(reasons) if reasons else None, row["submitted_by"], filepath)
        )

    conn.commit()
    flagged_count = conn.execute("SELECT COUNT(*) FROM kpi_records WHERE status='flagged'").fetchone()[0]
    total_count = conn.execute("SELECT COUNT(*) FROM kpi_records").fetchone()[0]
    print(f"Validated {filepath}: {total_count} rows, {flagged_count} flagged")
    conn.close()

if __name__ == "__main__":
    validate_file("data/incoming/obajana_energy.xlsx")
