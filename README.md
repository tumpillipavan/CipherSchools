# CipherSQLStudio

**The Ultimate Browser-Based SQL Learning Platform**

CipherSQLStudio is a modern, interactive web application designed to help users master SQL through hands-on practice. It features a real-time sandbox environment, intelligent AI-driven hints, and a progressive curriculum ranging from basic SELECT queries to advanced Joins and Subqueries.

---

## Key Features

- **Interactive SQL Workspace**: A full-featured Monaco Editor (VS Code style) for writing and executing queries.
- **Real-Time Sandbox Execution**: Queries are executed safely against a real PostgreSQL database using read-only transactions.
- **Hybrid Database Architecture**:
  - **MongoDB**: Stores assignment metadata, questions, and curriculum structure.
  - **PostgreSQL**: Acts as the ephemeral execution engine for user queries.
- **Fail-Safe Offline Mode**: If the PostgreSQL sandbox is unavailable, the system gracefully falls back to cached preview data, allowing uninterrupted learning.
- **AI-Powered Hints**: Integrated LLM support provides context-aware hints without revealing the full solution.
- **Visual Schema Explorer**: View table structures, column types, and live sample data alongside your editor.
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.
---

## Architecture & Data Flow

The following **hand-drawn Data-Flow Diagram** illustrates how a SQL query is processed end-to-end.
![Data Flow Diagram](./docs/data-flow-diagram.jpg)
### Flow Explanation
1. **User Interaction**
   - The user writes an SQL query in the browser-based editor and clicks **Execute Query**.

2. **Frontend (React Client)**
   - The frontend sends the SQL query and assignment context to the backend via a REST API call.
   - UI state changes to loading.

3. **Backend API (Node.js / Express)**
   - The API receives the query request.

4. **Query Validation Layer**
   - The query is sanitized and checked for forbidden operations (DROP, DELETE, UPDATE).
   - If invalid, an error response is sent back to the client.

5. **PostgreSQL Sandbox Execution**
   - A database transaction is started.
   - The validated query is executed on sandbox tables.
   - Results are captured and the transaction is rolled back to ensure safety.

6. **Response Handling**
   - Query results or errors are sent back to the frontend.

7. **UI Rendering**
   - The frontend updates state and displays results in a tabular format.

   This flow demonstrates clear separation between **User Interface**, **Backend Logic**, **Validation**, **Database Execution**, and **State Updates**.
  
   ---

### Project Structure

```text
cipher/
├── client/                # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/    # UI Components (SqlEditor, Layout, etc.)
│   │   ├── pages/         # Page Views (AssignmentList, Workspace)
│   │   ├── styles/        # SCSS Stylesheets
│   │   ├── App.jsx        # Main App Component
│   │   └── main.jsx       # Entry Point
│   ├── index.html         # HTML Template
│   └── package.json       # Frontend Dependencies
├── server/                # Backend (Node.js + Express)
│   ├── config/            # DB Connectivity (db.js)
│   ├── models/            # Mongoose Models (Assignment.js)
│   ├── routes/            # API Routes (assignments.js, query.js)
│   ├── index.js           # Server Entry Point
│   └── package.json       # Backend Dependencies
├── .gitignore             # Files to ignore (node_modules, .env)
└── README.md              # Project Documentation

---

## Assignment Scope

The platform includes a progressive learning path covering the following SQL concepts:

1.  **Basic SELECT**: Retrieving data from a single table (`Select All Users`).
2.  **Filtering**: Using `WHERE` clauses to refine results (`Finding Admin Users`).
3.  **Sorting & Limiting**: Using `ORDER BY` and `LIMIT` (`Recent Signups`).
4.  **Aggegation**: Using `GROUP BY` and `COUNT` (`Count Users by Role`).
5.  **JOINS**: Combining data from multiple tables (`User Orders`).
6.  **Subqueries**: Complex nested queries (`Orders > 100`).

Each assignment includes a specific **Target Goal**, a **Database Schema** reference, and **Visual Feedback**.

---

## Environment Variables Explained

Create a `.env` file in the `server` directory with the following variables.

| Variable | Description | Example Value |
| :--- | :--- | :--- |
| `PORT` | The port the backend server runs on. | `5000` |
| `MONGO_URI` | Connection string for the Content Database. | `mongodb+srv://...` |
| `PG_HOST` | Hostname for the PostgreSQL Sandbox. | `localhost` |
| `PG_PORT` | Port for the PostgreSQL Sandbox. | `5432` |
| `PG_DATABASE` | Name of the Sandbox Database. | `cipher_sandbox` |
| `PG_USER` | PostgreSQL Username. | `postgres` |
| `PG_PASSWORD` | PostgreSQL Password. | `password` |
| `LLM_API_KEY` | API Key for the AI Hint Service (OpenAI/Gemini). | `sk-...` |
| `USE_MOCK_HINTS`| Set to `true` to simulate AI hints (save costs). | `true` |

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- PostgreSQL (Local or Cloud)
- MongoDB (Global or Local)

### 1. Clone & Install
```bash
git clone https://github.com/tumpillipavan/CipherSchools.git
cd CipherSchools

# Install Backend
cd server
npm install

# Install Frontend
cd ../client
npm install
```

### 2. Configure & Seed
1.  Setup your `.env` file in `server/`.
2.  Run the seed scripts to populate your databases:
    ```bash
    # In /server directory
    npm run seed     
    npm run seed:pg   
    ```

### 3. Run the Application
```bash
# Terminal 1: Start Server
cd server
npm run dev

# Terminal 2: Start Client
cd client
npm run dev
```

Visit `http://localhost:5173` to start coding!

---

## License

This project is licensed under the ISC License.
