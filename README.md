# Smart AI Resume Analyzer

A full-stack web application that analyzes resumes against job descriptions, providing match percentage, skill gaps, resume score, and improvement suggestions.

## Features

- **User authentication**: Register / Login with JWT
- **Resume upload**: PDF or DOCX (Apache Tika)
- **Job description**: Paste any job description
- **Analysis results**:
  - Match percentage (skill match + cosine similarity)
  - Resume score (0–10): skills, experience, projects, education, certifications
  - Matched skills / Missing skills
  - AI-style suggestions
  - Readability score & ATS compatibility hint
- **Dashboard**: Upload & Analyze, History, Profile
- **History**: View past analyses, download PDF report, delete
- **Dark/Light mode**, responsive UI, glassmorphism

## Tech Stack

| Layer    | Stack |
|----------|--------|
| Backend  | Java 17, Spring Boot 3, Spring Security (JWT), JPA/Hibernate, MySQL, Maven, Apache Tika, Lombok, iText (PDF) |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, Chart.js, Axios, React Router |
| DB       | MySQL (dev/prod), H2 (tests) |

## Prerequisites

- **Java 17+**
- **Node.js 18+** and npm
- **MySQL 8** (or use Docker)

## Quick Start

### 1. Database

Create database (optional; app can create it if `createDatabaseIfNotExist=true`):

```bash
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS resume_analyzer_db;"
```

Or run the schema script:

```bash
mysql -u root -p < database/schema.sql
```

### 2. Backend

```bash
cd backend
# Set DB credentials in src/main/resources/application.yml if needed (default: root/root)
./mvnw spring-boot:run
```

Backend runs at **http://localhost:8080**.

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173** and proxies `/api` to the backend.

### 4. Use the app

1. Open http://localhost:5173
2. Register → Login
3. Go to **Analyze** → paste job description, upload PDF/DOCX resume → **Analyze Resume**
4. View match %, score, skills, suggestions; download PDF from **History**

## Configuration

### Backend (`backend/src/main/resources/application.yml`)

| Property | Description | Default |
|----------|-------------|---------|
| `spring.datasource.url` | MySQL JDBC URL | `jdbc:mysql://localhost:3306/resume_analyzer_db?...` |
| `spring.datasource.username` | DB user | `root` |
| `spring.datasource.password` | DB password | `root` |
| `app.jwt.secret` | JWT signing key (Base64) | (dev default) |
| `app.jwt.expiration-ms` | Token validity | `86400000` (24h) |
| `spring.servlet.multipart.max-file-size` | Max upload size | `10MB` |

For production, set `JWT_SECRET` and DB credentials via environment variables.

### Frontend

API base URL is `/api` (Vite proxy to `http://localhost:8080`). For a different backend, set `VITE_API_URL` or change the proxy in `vite.config.ts`.

## API Documentation

When the backend is running:

- **Swagger UI**: http://localhost:8080/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/v3/api-docs

### Main endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register (name, email, password) |
| POST | `/api/auth/login` | Login (email, password) → JWT |
| GET | `/api/profile` | Current user profile (Bearer token) |
| POST | `/api/analyze` | Analyze resume (multipart: `resume`, `jobDescription`) |
| GET | `/api/analyze/history?page=0&size=20` | Analysis history |
| GET | `/api/analyze/{id}` | Get analysis by ID |
| DELETE | `/api/analyze/{id}` | Delete analysis |
| GET | `/api/analyze/{id}/report` | Download PDF report |

### Analysis response (example)

```json
{
  "analysisId": 1,
  "matchPercentage": 72.5,
  "resumeScore": 7.8,
  "matchedSkills": ["java", "spring", "mysql"],
  "missingSkills": ["docker", "aws"],
  "suggestions": ["Add key technical skills: docker, aws", "Add quantified achievements..."],
  "readabilityScore": 85.0,
  "atsCompatible": true
}
```

## Project structure

```
Resume Checker/
├── backend/                    # Spring Boot
│   ├── src/main/java/com/resumeanalyzer/
│   │   ├── controller/         # REST controllers
│   │   ├── service/            # Auth, ResumeAnalyzer, Report, User
│   │   ├── repository/         # JPA repositories
│   │   ├── model/              # User, Analysis entities
│   │   ├── dto/                # Request/Response DTOs
│   │   ├── security/           # JWT filter, JwtService, UserDetails
│   │   ├── config/             # Security, OpenAPI
│   │   ├── exception/          # Global handler, custom exceptions
│   │   └── util/               # TextExtractor, TextCleaner, SkillDataset, CosineSimilarity
│   └── src/test/               # Unit + integration tests
├── frontend/                   # React + Vite
│   └── src/
│       ├── api/                # Axios client, types
│       ├── components/         # Layout, MatchCircle, SkillChart
│       ├── context/             # Auth, Theme
│       └── pages/               # Login, Register, Dashboard, Analyze, History, Profile
├── database/
│   └── schema.sql              # MySQL schema (optional)
└── README.md
```

## Testing

### Backend

```bash
cd backend
./mvnw test
```

- Unit tests: `ResumeAnalyzerServiceTest`, `CosineSimilarityTest`
- Integration test: `AnalysisControllerIntegrationTest` (register, login, analyze with multipart)

*Note: Integration test sends plain text as PDF; for real PDF parsing use a sample PDF file.*

### Frontend

```bash
cd frontend
npm run build
```

## Analysis logic (summary)

1. **Text extraction**: Apache Tika from PDF/DOCX.
2. **Text cleaning**: Lowercase, remove special chars, stopwords.
3. **Skill extraction**: Predefined skill set (e.g. java, spring, mysql, docker, aws, react, …) matched against resume and job description.
4. **Match %**: `finalMatch = 0.6 * skillMatchPercent + 0.4 * cosineSimilarityPercent`.
5. **Resume score (0–10)**: Weighted — skill match 40%, experience 20%, projects 15%, education 15%, certifications 10%.
6. **Suggestions**: e.g. add missing skills, projects, metrics, expand experience.

## Future extensions

- OpenAI (or other LLM) for richer suggestions and grammar
- Multi-language support
- Microservice split (auth, analysis, reports)
- Keyword density heatmap

## License

MIT.
