import { NextResponse } from 'next/server';
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(process.cwd(), 'db', 'data.db');

// GET /api/incidents?resolved=false
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const resolved = searchParams.get('resolved');
  const resolvedValue = resolved === 'true' ? 1 : 0;

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    db.all(
      `SELECT Incident.*, Camera.name as cameraName, Camera.location as cameraLocation
       FROM Incident
       JOIN Camera ON Incident.cameraId = Camera.id
       WHERE Incident.resolved = ?
       ORDER BY Incident.tsStart DESC`,
      [resolvedValue],
      (err, rows) => {
        db.close();
        if (err) {
          resolve(NextResponse.json({ error: err.message }, { status: 500 }));
        } else {
          resolve(NextResponse.json(rows));
        }
      }
    );
  });
}

// PATCH /api/incidents?id=1
export async function PATCH(request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  }

  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(dbPath);
    // Get current resolved value
    db.get('SELECT resolved FROM Incident WHERE id = ?', [id], (err, row) => {
      if (err || !row) {
        db.close();
        resolve(NextResponse.json({ error: 'Incident not found' }, { status: 404 }));
        return;
      }
      const newResolved = row.resolved ? 0 : 1;
      db.run(
        'UPDATE Incident SET resolved = ? WHERE id = ?',
        [newResolved, id],
        function (err) {
          if (err) {
            db.close();
            resolve(NextResponse.json({ error: err.message }, { status: 500 }));
            return;
          }
          // Return updated row
          db.get(
            `SELECT Incident.*, Camera.name as cameraName, Camera.location as cameraLocation
             FROM Incident
             JOIN Camera ON Incident.cameraId = Camera.id
             WHERE Incident.id = ?`,
            [id],
            (err, updatedRow) => {
              db.close();
              if (err) {
                resolve(NextResponse.json({ error: err.message }, { status: 500 }));
              } else {
                resolve(NextResponse.json(updatedRow));
              }
            }
          );
        }
      );
    });
  });
} 