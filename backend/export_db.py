import sqlite3

# Connect to SQLite database
conn = sqlite3.connect("db.sqlite3")
cursor = conn.cursor()

# Open a file to save the SQL dump
with open("hostel_management.sql", "w") as f:
    for line in conn.iterdump():  # Dumps all tables and data
        f.write(f"{line}\n")

conn.close()
print("✅ Database export complete! File saved as hostel_management.sql")
