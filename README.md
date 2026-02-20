# 🚀 Smart AI Resume Analyzer

An AI-powered full-stack web application that analyzes resumes against job descriptions to calculate match percentage, detect missing skills, and generate intelligent improvement suggestions.

Built with Spring Boot (Java 17) and React (Vite + Tailwind CSS), the system simulates ATS-style resume screening using keyword extraction, cosine similarity, and rule-based scoring.

---

## 🌍 Live Demo

🔗 **Backend:** https://your-backend.onrender.com  
🔗 **Frontend:** https://your-frontend.onrender.com

*(Replace with your Render URLs after deployment.)*

---

## 📌 Project Overview

Smart AI Resume Analyzer allows users to:

- 🔐 **Register & Login** (JWT Authentication)
- 📄 **Upload Resume** (PDF / DOCX)
- 📝 **Paste Job Description**
- 📊 **Get Match Percentage**
- 🧠 **View Missing & Matched Skills**
- 💡 **Receive Improvement Suggestions**
- 📈 **Track Analysis History**

It mimics how Applicant Tracking Systems (ATS) evaluate resumes.

---

## 🏗️ Tech Stack

### Backend

- Java 17
- Spring Boot 3
- Spring Security (JWT)
- JPA / Hibernate
- PostgreSQL
- Apache Tika (Resume Parsing)
- Maven

### Frontend

- React (Vite)
- Tailwind CSS
- Axios
- Chart.js
- Framer Motion

### Deployment

- Render (Web Service + Static Site)
- PostgreSQL (Render Managed DB)

---

## 🧠 How the Analysis Works

### 1️⃣ Resume Parsing

- Extracts text from PDF/DOCX using **Apache Tika**
- Cleans text (lowercase, remove symbols, stopwords)

### 2️⃣ Skill Extraction

- Predefined skill dataset (Java, Spring, Docker, AWS, React, etc.)
- Extracts skills from:
  - Resume
  - Job Description

### 3️⃣ Match Calculation

**Skill Match** = (Matched Skills / Total JD Skills) × 100

### 4️⃣ Cosine Similarity

- Converts texts into word frequency vectors
- Calculates similarity score
- Blends with skill match score

**Final Match** = (0.6 × Skill Match) + (0.4 × Cosine Similarity)

### 5️⃣ Resume Score (Out of 10)

| Factor            | Weight |
|-------------------|--------|
| Skill Match       | 40%    |
| Experience Keywords | 20%  |
| Projects Section  | 15%    |
| Education Section | 15%    |
| Certifications    | 10%    |

---

## 📁 Project Structure

```
resume-analyzer/
│
├── backend/
│   ├── controller/
│   ├── service/
│   ├── repository/
│   ├── model/
│   ├── dto/
│   ├── security/
│   ├── config/
│   ├── util/
│   └── exception/
│
├── frontend/
│   ├── components/
│   ├── pages/
│   ├── api/
│   ├── context/
│   └── assets/
│
├── database/
│   └── schema-postgres.sql
│
└── README.md
```

---

## 🔐 Authentication

- JWT-based authentication
- BCrypt password hashing
- Stateless session management
- Role-based authorization

---

## 📡 API Endpoints

### 🔑 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login → returns JWT |

### 📊 Resume Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/analyze` | Analyze resume vs job description |
| GET | `/api/analyze/history` | List user's analyses |
| GET | `/api/analyze/{id}` | Get analysis by ID |
| DELETE | `/api/analyze/{id}` | Delete analysis |
| GET | `/api/analyze/{id}/report` | Download PDF report |

### 👤 Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Current user profile (Bearer token) |

#### POST /api/analyze

**Request:** `multipart/form-data`

- `resume` — PDF or DOCX file
- `jobDescription` — Job description text

**Response:**

```json
{
  "matchPercentage": 82,
  "resumeScore": 8.7,
  "matchedSkills": ["Java", "Spring Boot"],
  "missingSkills": ["Docker", "AWS"],
  "suggestions": ["Add measurable achievements", "Include cloud experience"]
}
```

**API Docs (when backend is running):** Swagger UI at `/swagger-ui.html`, OpenAPI at `/v3/api-docs`.

---

## 🗄️ Database Schema

### Users Table

| Field       | Type      |
|------------|-----------|
| id         | Long (PK) |
| name       | String    |
| email      | String (unique) |
| password   | String (hashed) |
| role       | String    |
| created_at | Timestamp |

### Analysis Table

| Field             | Type    |
|-------------------|---------|
| id                | Long (PK) |
| user_id           | Long (FK) |
| job_description   | TEXT    |
| resume_text       | TEXT    |
| match_percentage  | Double  |
| resume_score      | Double  |
| created_at        | Timestamp |

---

## ⚙️ Local Setup Guide

### 1️⃣ Clone Repository

```bash
git clone https://github.com/your-username/resume-analyzer.git
cd resume-analyzer
```

### 2️⃣ Backend Setup

**Option A — with PostgreSQL**

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Create database and set environment variables:

```bash
# PostgreSQL
export DB_URL=jdbc:postgresql://localhost:5432/resume_analyzer_db
export DB_USERNAME=postgres
export DB_PASSWORD=your_password
export JWT_SECRET=your_base64_secret   # Generate: openssl rand -base64 32
```

**Option B — without PostgreSQL (H2 in-memory)**

```bash
cd backend
mvn spring-boot:run -Dspring.profiles.active=dev
```

Backend runs at **http://localhost:8080**.

### 3️⃣ Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

For local dev, the app proxies `/api` to the backend. To point directly to backend:

```bash
# .env.local or .env
VITE_API_BASE_URL=http://localhost:8080
```

Frontend runs at **http://localhost:5173**.

---

## 🚀 Deployment on Render

### Backend Deployment

1. Create **Web Service**
2. Connect GitHub repository (set **Root Directory** to `backend` if needed)
3. **Build Command:** `mvn clean package -DskipTests`
4. **Start Command:** `java -jar target/smart-resume-analyzer-1.0.0.jar`
5. Add **Environment Variables:**

| Key | Value |
|-----|--------|
| DB_URL | *(Render PostgreSQL Internal URL)* |
| DB_USERNAME | *(from PostgreSQL)* |
| DB_PASSWORD | *(from PostgreSQL)* |
| JWT_SECRET | *(generate: `openssl rand -base64 32`)* |
| FRONTEND_URL | `https://your-frontend.onrender.com` |
| SPRING_PROFILES_ACTIVE | `prod` |

### Frontend Deployment

1. Create **Static Site**
2. **Root Directory:** `frontend`
3. **Build Command:** `npm install && npm run build`
4. **Publish Directory:** `dist`
5. **Environment Variable:** `VITE_API_BASE_URL` = `https://your-backend.onrender.com` (no trailing slash)

### Database

Create a **PostgreSQL** instance on Render and use its **Internal Database URL** as `DB_URL` for the backend.

---

## 🛡️ Security Features

- Password hashing with BCrypt
- JWT token validation filter
- Input validation (Bean Validation)
- Global exception handling (no stack traces in production)
- Secure file upload limits (10MB)
- No hardcoded credentials — all config via environment variables
- CORS configured via `FRONTEND_URL`

---

## 🧪 Testing

- **Unit tests** for `ResumeAnalyzerService`
- **Authentication flow** testing (`AuthFlowIntegrationTest`)
- **API endpoint** validation (`AnalysisControllerIntegrationTest`)

```bash
cd backend
mvn test
```

---

## 📈 Future Enhancements

- OpenAI integration for AI suggestions
- Resume grammar analysis
- ATS compatibility score
- Multi-language resume support
- Microservice architecture
- Docker & CI/CD pipeline

---

## 💼 Why This Project Matters

This project demonstrates:

- Backend development with Spring Boot
- Secure authentication (JWT)
- Database integration (JPA + PostgreSQL)
- File parsing (PDF/DOCX with Apache Tika)
- NLP-based similarity algorithms (cosine similarity)
- Full-stack integration (React + REST API)
- Production deployment experience (Render)

---

## 👨‍💻 Author

**Vipin Tomar**  
B.Tech CSE (AI & Data Science)  
Backend & AI Enthusiast

---

## ⭐ If You Like This Project

Star the repository and connect on LinkedIn 🚀

---

## License

MIT.
