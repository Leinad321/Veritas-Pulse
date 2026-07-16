import pandas as pd
import random
from datetime import datetime, timedelta

def generate_sample(plant="Obajana", days=30, out_path="data/incoming/obajana_energy.xlsx"):
    rows = []
    base_date = datetime(2026, 6, 1)
    for i in range(days):
        date = base_date + timedelta(days=i)
        rows.append({
            "plant": plant,
            "kpi_category": "energy",
            "kpi_name": "specific_power_consumption_kwh_per_ton",
            "date": date.strftime("%Y-%m-%d"),
            "value": round(random.uniform(85, 105), 2),
            "target": 90,
            "submitted_by": "plant_engineer_1"
        })

    # deliberately inject bad rows so validation has something real to catch
    rows[5]["value"] = 999
    rows[12]["value"] = None
    rows[20]["date"] = rows[19]["date"]

    df = pd.DataFrame(rows)
    df.to_excel(out_path, index=False)
    print(f"Sample data written to {out_path}")

if __name__ == "__main__":
    generate_sample()
