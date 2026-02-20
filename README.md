# Smart AI Resume Analyzer

Production-ready full-stack application for analyzing resumes against job descriptions. Built with Spring Boot (Java 17) and React (Vite), designed for deployment on [Render](https://render.com).

---

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Backend  | Java 17, Spring Boot 3, Spring Security (JWT), JPA/Hibernate, PostgreSQL, Maven, Apache Tika, Lombok |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Framer Motion, Chart.js, Axios |
| Database | PostgreSQL (production), H2 (tests) |
| Deploy   | Render (Web Service + Static Site + PostgreSQL) |

---

## Architecture (ASCII)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           RENDER (Production)                             │
├─────────────────────────────────────────────────────────────────────────┤
│  Static Site (Frontend)          Web Service (Backend)     PostgreSQL    │
│  ┌──────────────────┐           ┌──────────────────┐     ┌──────────┐  │
│  │  React (Vite)     │  HTTPS    │  Spring Boot     │     │  DB      │  │
│  │  dist/            │ ────────► │  JAR :8080       │────►│  users   │  │
│  │  VITE_API_BASE_URL│           │  JWT + CORS       │     │  analysis│  │
│  └──────────────────┘           └──────────────────┘     └──────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

Local:
  Frontend (npm run dev) ─ proxy /api ─► Backend (mvn spring-boot:run) ─► PostgreSQL or H2
```

---

## Local Setup

### Prerequisites

- **Java 17+**
- **Node.js 18+** and npm
- **PostgreSQL 14+** (or use default H2 for quick run)

### 1. Database (optional for local)

If using PostgreSQL locally:

```bash
createdb resume_analyzer_db
# Or run: psql -f database/schema-postgres.sql
```

Set environment variables (or use defaults in `application.properties`):

```bash
export DB_URL=jdbc:postgresql://localhost:5432/resume_analyzer_db
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
```

### 2. Backend

**Option A – with PostgreSQL:**

```bash
cd backend
mvn clean package
mvn spring-boot:run
```

**Option B – without PostgreSQL (H2 in-memory):**

```bash
cd backend
mvn spring-boot:run -Dspring.profiles.active=dev
```

Backend runs at **http://localhost:8080**.  
For production profile:

```bash
export SPRING_PROFILES_ACTIVE=prod
export JWT_SECRET=your-base64-secret-at-least-32-bytes
mvn spring-boot:run
```

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** and proxies `/api` to the backend.

### 4. Optional: JWT secret for local

Generate a Base64 secret (min 32 bytes):

```bash
echo -n "your-secret-key-min-32-characters-long" | base64
export JWT_SECRET=<output>
```

---

## Environment Variables

### Backend (Spring Boot)

| Variable            | Required (Prod) | Description |
|---------------------|-----------------|-------------|
| `DB_URL`            | Yes             | PostgreSQL JDBC URL (e.g. `jdbc:postgresql://host:5432/dbname`) |
| `DB_USERNAME`       | Yes             | Database user |
| `DB_PASSWORD`       | Yes             | Database password |
| `JWT_SECRET`        | Yes             | Base64-encoded secret (min 256 bits). Generate: `openssl rand -base64 32` |
| `JWT_EXPIRATION_MS` | No              | Token validity in ms (default: 86400000 = 24h) |
| `FRONTEND_URL`      | Yes (prod)      | Frontend origin for CORS (e.g. `https://your-app.onrender.com`) |
| `PORT`              | No              | Server port (default: 8080; Render sets this) |
| `SPRING_PROFILES_ACTIVE` | No         | Set to `prod` on Render for production logging |

### Frontend (Vite)

| Variable              | Required (Prod) | Description |
|-----------------------|----------------|-------------|
| `VITE_API_BASE_URL`   | Yes (prod)     | Backend base URL (e.g. `https://your-backend.onrender.com`) |

---

## Deployment on Render

### 1. Create PostgreSQL Database

1. In Render Dashboard: **New** → **PostgreSQL**.
2. Name: `resume-analyzer-db` (or similar).
3. Region: same as your backend.
4. After creation, note:
   - **Internal Database URL** (use this for `DB_URL` in the backend)
   - **Username** → `DB_USERNAME`
   - **Password** → `DB_PASSWORD`

Schema is created automatically by Spring Boot (`ddl-auto=update`). Optionally run `database/schema-postgres.sql` manually.

### 2. Backend (Web Service)

1. **New** → **Web Service**.
2. Connect your repo (e.g. GitHub).
3. **Root Directory**: `backend` (or leave blank if repo root is backend).
4. **Runtime**: Java.
5. **Build Command**: `mvn clean package -DskipTests`
6. **Start Command**: `java -jar target/smart-resume-analyzer-1.0.0.jar`
7. **Instance Type**: Free or paid.

**Environment Variables** (add in Render dashboard):

| Key                 | Value |
|---------------------|--------|
| `DB_URL`            | *(Internal Database URL from step 1)* |
| `DB_USERNAME`       | *(from PostgreSQL)* |
| `DB_PASSWORD`       | *(from PostgreSQL)* |
| `JWT_SECRET`        | *(generate: `openssl rand -base64 32`)* |
| `FRONTEND_URL`      | `https://your-frontend.onrender.com` (set after creating frontend) |
| `SPRING_PROFILES_ACTIVE` | `prod` |

8. Deploy. Note the backend URL (e.g. `https://smart-resume-analyzer-api.onrender.com`).

### 3. Frontend (Static Site)

1. **New** → **Static Site**.
2. Connect same repo.
3. **Root Directory**: `frontend`.
4. **Build Command**: `npm install && npm run build`
5. **Publish Directory**: `dist`
6. **Environment Variable**:
   - `VITE_API_BASE_URL` = `https://your-backend.onrender.com` (no trailing slash)

7. Deploy. Note the frontend URL.

### 4. Update CORS

In the **Backend** service on Render, set:

- `FRONTEND_URL` = `https://your-actual-frontend.onrender.com`

Redeploy backend if you had used a placeholder.

---

## API Documentation

When the backend is running:

- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **OpenAPI JSON**: `http://localhost:8080/v3/api-docs`

### Main Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST   | `/api/auth/register` | Register (name, email, password) |
| POST   | `/api/auth/login`    | Login (email, password) → JWT |
| GET    | `/api/profile`      | Current user (Bearer token) |
| POST   | `/api/analyze`       | Analyze resume (multipart: `jobDescription`, `resume`) |
| GET    | `/api/analyze/history` | List analyses (Bearer token) |
| GET    | `/api/analyze/{id}`  | Get analysis by ID |
| DELETE | `/api/analyze/{id}`  | Delete analysis |
| GET    | `/api/analyze/{id}/report` | Download PDF report |

### Error Response Format

```json
{
  "timestamp": "2024-01-15T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Human-readable message",
  "details": { "field": "validation message" }
}
```

---

## Testing

### Backend

```bash
cd backend
mvn test
```

- Unit tests: `ResumeAnalyzerServiceTest`, `CosineSimilarityTest`
- Integration test: `AnalysisControllerIntegrationTest` (register, login, analyze with JWT)

### Frontend

```bash
cd frontend
npm run build
```

---

## Project Structure

```
Resume Checker/
├── backend/                    # Spring Boot
│   ├── src/main/java/com/resumeanalyzer/
│   │   ├── controller/
│   │   ├── service/
│   │   ├── repository/
│   │   ├── model/
│   │   ├── dto/
│   │   ├── security/
│   │   ├── config/             # Security, CORS, OpenAPI
│   │   ├── exception/          # GlobalExceptionHandler
│   │   └── util/
│   ├── src/main/resources/
│   │   ├── application.properties
│   │   └── application-prod.properties
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── api/                # Axios client (VITE_API_BASE_URL)
│   │   ├── components/
│   │   ├── pages/
│   │   └── context/
│   ├── .env.production
│   └── package.json
├── database/
│   ├── schema-postgres.sql     # Optional PostgreSQL schema
│   └── schema.sql              # Legacy MySQL (reference)
└── README.md
```

---

## Production Checklist

- [ ] `JWT_SECRET` set to a strong Base64 value (min 32 bytes)
- [ ] `SPRING_PROFILES_ACTIVE=prod` on backend
- [ ] `FRONTEND_URL` matches your Render static site URL
- [ ] `VITE_API_BASE_URL` points to your Render backend URL
- [ ] No secrets in repo; all config via environment variables
- [ ] File upload limit 10MB (configurable in `application.properties`)

---

## Screenshots

<!-- Add screenshots of Login, Dashboard, Analyze result, History -->

| Login | Dashboard | Analysis Result |
|-------|-----------|-----------------|
| *(screenshot)* | *(screenshot)* | *(screenshot)* |

---

## Live Demo

- **Frontend**: [https://your-app.onrender.com](https://your-app.onrender.com)
- **API**: [https://your-backend.onrender.com](https://your-backend.onrender.com)

---

## License

MIT.
