from flask import Flask, request
import sqlite3

app = Flask(__name__)

# SQLite database setup
def init_db():
    conn = sqlite3.connect('rfid_data.db')
    cursor = conn.cursor()
    cursor.execute('''CREATE TABLE IF NOT EXISTS RFID_data (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        staff_name TEXT,
                        card_id TEXT,
                        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

# Route to handle incoming data
@app.route('/Vegetables_and_Fruits_Data_Logger/', methods=['GET'])
def log_data():
    # Extract data from URL parameters
    staff_name = request.args.get('r')
    card_id = request.args.get('g')
    # Insert data into SQLite database
    if staff_name and card_id:
        conn = sqlite3.connect('rfid_data.db')
        cursor = conn.cursor()
        cursor.execute("INSERT INTO RFID_data (staff_name, card_id) VALUES (?, ?)", (staff_name, card_id))
        conn.commit()
        conn.close()
        return 'Data inserted successfully', 200
    return 'Missing data', 400

# Start the server
if __name__ == '__main__':
    init_db()  # Ensure the database is created
    app.run(host='0.0.0.0', port=80)
