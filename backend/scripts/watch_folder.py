import time
import os
import sys

sys.path.append(os.path.dirname(__file__))
from validate import validate_file

WATCH_DIR = os.path.join(os.path.dirname(__file__), "..", "data", "incoming")
CHECK_INTERVAL_SECONDS = 10  # tune lower for a live demo so judges see it react fast

def watch():
    seen = {}
    print(f"Watching {WATCH_DIR} for new or changed Excel files...")
    while True:
        for fname in os.listdir(WATCH_DIR):
            if not fname.endswith(".xlsx"):
                continue
            fpath = os.path.join(WATCH_DIR, fname)
            mtime = os.path.getmtime(fpath)
            if fname not in seen or seen[fname] != mtime:
                print(f"New/changed file detected: {fname}")
                validate_file(fpath)
                seen[fname] = mtime
        time.sleep(CHECK_INTERVAL_SECONDS)

if __name__ == "__main__":
    watch()
