# Smart AI Resume Analyzer – API Reference

Base URL: `http://localhost:8080` (or your deployed backend).

All authenticated endpoints require header: `Authorization: Bearer <token>`.

---

## Authentication

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

**Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:** `201 Created`

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "type": "Bearer",
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER"
}
```

**Validation:** name 2–100 chars, valid email, password 6–100 chars.

---

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

**Body:**

```json
{
  "email": "john@example.com",
  "password": "secret123"
}
```

**Response:** `200 OK` (same shape as register response).

**Errors:** `401 Unauthorized` – invalid email or password.

---

## Profile

### Get current user profile

```http
GET /api/profile
Authorization: Bearer <token>
```

**Response:** `200 OK`

```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "role": "USER",
  "createdAt": "2024-01-15T10:00:00"
}
```

---

## Analysis

### Analyze resume

```http
POST /api/analyze
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form fields:**

| Field            | Type | Required | Description                |
|------------------|------|----------|----------------------------|
| jobDescription   | text | Yes      | Full job description text  |
| resume           | file | Yes      | PDF or DOCX (max 10MB)    |

**Response:** `200 OK`

```json
{
  "analysisId": 1,
  "matchPercentage": 72.5,
  "resumeScore": 7.8,
  "matchedSkills": ["java", "spring", "mysql"],
  "missingSkills": ["docker", "aws", "react"],
  "suggestions": [
    "Add key technical skills: docker, aws, react",
    "Add quantified achievements (metrics, percentages, impact)."
  ],
  "readabilityScore": 85.0,
  "atsCompatible": true
}
```

**Errors:**

- `400 Bad Request` – missing job description, invalid or empty file, unsupported type.
- `413 Payload Too Large` – file &gt; 10MB.

---

### Get analysis history

```http
GET /api/analyze/history?page=0&size=20
Authorization: Bearer <token>
```

**Query:**

| Name | Type | Default | Description   |
|------|------|---------|---------------|
| page | int  | 0       | Page index    |
| size | int  | 20      | Page size     |

**Response:** `200 OK`

```json
[
  {
    "id": 1,
    "matchPercentage": 72.5,
    "resumeScore": 7.8,
    "createdAt": "2024-01-15T10:30:00"
  }
]
```

---

### Get analysis by ID

```http
GET /api/analyze/{id}
Authorization: Bearer <token>
```

**Response:** `200 OK` – same structure as analyze response.

**Errors:** `404 Not Found` – analysis not found or not owned by user.

---

### Delete analysis

```http
DELETE /api/analyze/{id}
Authorization: Bearer <token>
```

**Response:** `204 No Content`.

**Errors:** `404 Not Found`.

---

### Download PDF report

```http
GET /api/analyze/{id}/report
Authorization: Bearer <token>
```

**Response:** `200 OK`

- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="resume-analysis-report-{id}.pdf"`

**Errors:** `404 Not Found`.

---

## Error response format

All errors return JSON:

```json
{
  "timestamp": "2024-01-15T10:00:00",
  "status": 400,
  "error": "Bad Request",
  "message": "Human-readable message",
  "details": { "field": "validation message" }
}
```

`details` is optional (e.g. validation errors).

---

## OpenAPI / Swagger

- **Swagger UI:** `http://localhost:8080/swagger-ui.html`
- **OpenAPI 3 JSON:** `http://localhost:8080/v3/api-docs`
