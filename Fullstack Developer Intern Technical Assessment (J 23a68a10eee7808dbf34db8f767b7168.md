# Fullstack Developer Intern Technical Assessment (July ‘25)

# Introduction

This is a comprehensive technical assessment for a fictional company called **SecureSight**. SecureSight is a CCTV monitoring software where you can connect upto 3 CCTV feeds — computer vision models help detect certain activity on the feeds (e.g. unauthorised access, gun threats, etc).

For this technical assessment, you will be creating the frontend and basic backend for the dashboard only:

1. Mandatory scope:
    1. Navbar
    2. Incident Player (left-side)
    3. Incident List (right-side)
2. Optional scope:
    1. Incident timeline (bottom)
    2. Additional 3D-front-end assessment (see Optional/Extra Credit section below for more details)
    

![image.png](image.png)

Here is the Figma file: https://www.figma.com/design/v3gdcLjbIWn4kXybewFZgw/Full-Stack-Developer-Internship-TA?node-id=0-1&t=fB7ghxLnjk1LUJ93-1

# Deliverables

## Mandatory Deliverable

| **Layer** | **Requirement** |
| --- | --- |
| **Data model** | `Camera` — id, name, location 
`Incident` — id, cameraId ⇢ Camera, type, tsStart, tsEnd, thumbnailUrl, **resolved** (boolean) |
| **Seed script** | Provide prisma/seed.ts (or SQL) that inserts:
• 3+ cameras (e.g., Shop Floor A, Vault, Entrance)
• 12+ incidents across at least 3 threat types (Unauthorised Access, Gun Threat, Face Recognised, etc.). 

Include believable timestamps covering a 24‑hour span and placeholder thumbnails (local /public images will do). |
| **Database** | Use any Postgres, MySQL, or SQLite target:
– Local file (mode=memory fine)
– Docker Compose service
– or a free cloud DB (Neon, Supabase, PlanetScale). |
| **API routes** | 1. GET /api/incidents?resolved=false — return newest‑first JSON
2. PATCH /api/incidents/:id/resolve — flip resolved and echo updated row |
| **Frontend (Next.js 15 App Router)** | 1. Incident Player (left)
• Large video frame (static MP4/GIF stub is fine). It’s completely fine to have a static image here.
• Mini strip of two additional camera thumbnails

2. Incident List (right)
• Thumbnail, coloured type icon, camera location, start–end time
• Resolve button with optimistic UI (row fades out on click, then API) |

## Optional/Extra Credit Deliverable

| **Optional/Extra Credit Tasks** | Details |
| --- | --- |
| **Interactive Timeline** | Under the player, draw an SVG/Canvas ruler for 24 h. Place incident markers, draggable scrubber, and snap video on drag. |
| 3D website in React Three Fibre. | On a separate route or project, recreate this design using React Three Fibre: https://www.figma.com/design/v3gdcLjbIWn4kXybewFZgw/Full-Stack-Developer-Internship-TA?node-id=1-3828

There are two 3D sections with simple animations (animation instructions are on the Figma file).

Product model: ‣ |

# Submissions

1. Submit your technical assessment at this link: [https://instinctive-studio.notion.site/2369efe857498197a1a4f447f6635ea1?pvs=105](https://www.notion.so/2369efe857498197a1a4f447f6635ea1?pvs=21)
2. Make sure the following is done:
    1. Public Github repo
    2. Live URL (Vercel, Netlify or Render) — include .env vars if needed
    3. README covering:
        1. Deployment instrucments
        2. Tech decisions
        3. If I had more time… (quick bullets for future improvements)

Absolutely! Here’s a **detailed guide for Step 3: Build the API Endpoints** for your SecureSight dashboard using Next.js API routes and the `sqlite3` package.

---

## **API Endpoints Required**

1. **GET `/api/incidents?resolved=false`**
   - Returns a list of incidents (newest first, filtered by resolved status).
2. **PATCH `/api/incidents/:id/resolve`**
   - Flips the `resolved` status for the given incident and returns the updated row.

---

## **Folder Structure**

Your API files should be in:
```
/app/api/incidents/route.js      (for GET and PATCH)
```
Or, for RESTful PATCH by ID:
```
<code_block_to_apply_changes_from>
```
But for simplicity, you can handle both in `/app/api/incidents/route.js` with method checks.

---

## **How to Implement**

### **1. Install sqlite3 (already done)**

### **2. Create the API Route File**

#### **a. GET /api/incidents?resolved=false**

- Fetch incidents from the database, filter by `resolved`, order by `tsStart` DESC.
- Join with the Camera table to get camera name/location.

#### **b. PATCH /api/incidents/:id/resolve**

- Update the `resolved` field for the given incident (flip true/false).
- Return the updated incident row.

---

### **3. Example Code**

#### **File: `app/api/incidents/route.js`**

```js
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

// PATCH /api/incidents/:id/resolve
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
```

---

## **How to Use**

- **GET**:  
  `http://localhost:3000/api/incidents?resolved=false`  
  Returns all unresolved incidents, newest first.

- **PATCH**:  
  `http://localhost:3000/api/incidents?id=1` (with PATCH method)  
  Flips the resolved status for incident with id=1.

---

## **Next Steps**

1. **Create the file:**  
   `app/api/incidents/route.js`  
   (Copy the code above into it.)

2. **Test the endpoints** using Postman, curl, or your browser.

3. **Let me know if you want the code for the frontend (Incident List, Player, etc.) next!**

---

If you want to use RESTful URLs like `/api/incidents/1/resolve`, let me know and I’ll show you how to do that with Next.js App Router.

Absolutely! Here’s a clear explanation of the errors you encountered during the database seeding process:

---

## **What Happened?**

You tried to run:
```sh
sqlite3 db/data.db < db/seed.sql
```
or
```sh
<code_block_to_apply_changes_from>
```
and got errors like:
```
Parse error near line 2: no such table: Camera
...
Parse error near line 7: no such table: Incident
```

---

## **Why Are These Errors Happening?**

**The error “no such table: Camera” means that the `Camera` table does not exist in your SQLite database at the time you try to insert data into it.**

This usually happens for one of these reasons:
1. **The schema (tables) were not created before running the seed script.**
2. **You are seeding a different database file than the one where you created the tables.**
3. **The schema creation command failed or was not run at all.**

---

## **Why did this happen in your case?**

- In PowerShell, the `<` redirection operator does **not** work the same way as in bash or cmd. So, when you ran:
  ```sh
  sqlite3 db/data.db < db/schema.sql
  ```
  it did **not** actually execute the schema file, so the tables were never created.

- When you tried to seed, the tables didn’t exist, so you got the “no such table” errors.

- The correct way in PowerShell is to use:
  ```sh
  sqlite3 db/data.db ".read db/schema.sql"
  ```
  and then
  ```sh
  sqlite3 db/data.db ".read db/seed.sql"
  ```

---

## **How to Fix**

1. **First, create the tables:**
   ```sh
   sqlite3 db/data.db ".read db/schema.sql"
   ```
2. **Then, seed the data:**
   ```sh
   sqlite3 db/data.db ".read db/seed.sql"
   ```

**Order matters!**  
If you try to insert data before the tables exist, you’ll get “no such table” errors.

---

## **Summary Table**

| Command                                 | What it does                | When to run?         |
|------------------------------------------|-----------------------------|----------------------|
| `sqlite3 db/data.db ".read db/schema.sql"` | Creates tables              | First (only once)    |
| `sqlite3 db/data.db ".read db/seed.sql"`   | Inserts sample data         | After schema created |

---

## **What to Do Now**

- Run the schema command first (if you haven’t already).
- Then run the seed command.
- If you get errors, make sure you’re using the correct database file and that the schema file is correct.

---

If you want, I can walk you through the next steps or help you verify your database is set up correctly!

---

## **Your Main Problem**

You are getting errors like:
```
Parse error near line 2: no such table: Camera
...
Parse error near line 7: no such table: Incident
```
when trying to seed your SQLite database.

---

## **Why This Happens**

- The tables (`Camera`, `Incident`) do **not exist** in your database when you try to insert data.
- This is because, in PowerShell, the `<` operator does **not** work for file redirection as it does in bash/cmd.
- So, your schema (table creation) script was **not actually run** before you tried to seed.

---

## **How to Fix (Step-by-Step)**

### **1. Make Sure Your Schema File is Correct**
Your `db/schema.sql` should look like this:
```sql
CREATE TABLE IF NOT EXISTS Camera (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS Incident (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  cameraId INTEGER NOT NULL,
  type TEXT NOT NULL,
  tsStart TEXT NOT NULL,
  tsEnd TEXT NOT NULL,
  thumbnailUrl TEXT NOT NULL,
  resolved INTEGER NOT NULL DEFAULT 0,
  FOREIGN KEY (cameraId) REFERENCES Camera(id)
);
```

### **2. Run the Schema Script (Creates Tables)**
In PowerShell, run:
```sh
sqlite3 db/data.db ".read db/schema.sql"
```
This will create the tables in your `db/data.db` file.

### **3. Run the Seed Script (Inserts Data)**
Now, run:
```sh
sqlite3 db/data.db ".read db/seed.sql"
```
This will insert your sample cameras and incidents.

### **4. Verify the Data**
You can check if the data is there by running:
```sh
sqlite3 db/data.db "SELECT * FROM Camera;"
sqlite3 db/data.db "SELECT * FROM Incident;"
```
You should see rows printed for each table.

---

## **If You Still Get Errors**

- Double-check that you are in the correct directory (`C:\Users\musav\Downloads\assessment`).
- Make sure your `db/schema.sql` and `db/seed.sql` files are correct and in the `db` folder.
- Make sure you are using the correct database file (`db/data.db`).

---

## **Next Steps**

1. **Run the schema command:**  
   `sqlite3 db/data.db ".read db/schema.sql"`
2. **Run the seed command:**  
   `sqlite3 db/data.db ".read db/seed.sql"`
3. **Check the data:**  
   `sqlite3 db/data.db "SELECT * FROM Camera;"`

If you see data, your backend is ready!  
Then you can run your Next.js app with:
```sh
npm run dev
```
and visit [http://localhost:3000](http://localhost:3000).

---

**If you get any error at any step, copy the error here and I’ll help you fix it immediately!**  
Would you like to try these steps now, or do you want me to walk you through each command one by one?