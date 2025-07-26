# SecureSight Dashboard

A fullstack technical assessment for a CCTV monitoring dashboard.

## Deployment Instructions

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Create the database and tables:**
   ```sh
   sqlite3 db/data.db ".read db/schema.sql"
   ```
3. **Seed the database:**
   ```sh
   sqlite3 db/data.db ".read db/seed.sql"
   ```
4. **Start the development server:**
   ```sh
   npm run dev
   ```
5. **Open your browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## Tech Decisions
- **Next.js 15 App Router** for modern React and API routes
- **SQLite** for a simple, file-based database
- **Raw SQL** for schema and seeding (no ORM)
- **Tailwind CSS** for fast, modern UI
- **API routes** for backend logic

## If I had more time…
- Add authentication and user roles
- Implement the interactive timeline (SVG/Canvas)
- Add 3D dashboard with React Three Fiber
- Improve accessibility and mobile responsiveness
- Add tests (unit, integration, e2e)
- Use a production database (Postgres/MySQL)
- Add error handling and loading states everywhere 