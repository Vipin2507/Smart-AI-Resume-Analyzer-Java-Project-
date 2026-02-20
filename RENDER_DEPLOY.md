# Render Deployment – Quick Reference

## 1. PostgreSQL Database

| Step | Action |
|------|--------|
| New | **PostgreSQL** |
| Name | `resume-analyzer-db` |
| Region | Same as backend |
| Copy | **Internal Database URL**, **Username**, **Password** |

## 2. Backend (Web Service)

| Field | Value |
|-------|--------|
| **Root Directory** | `backend` (if repo root is project root) |
| **Runtime** | Java |
| **Build Command** | `mvn clean package -DskipTests` |
| **Start Command** | `java -jar target/smart-resume-analyzer-1.0.0.jar` |

### Environment Variables (Backend)

| Key | Value |
|-----|--------|
| `DB_URL` | *(Internal Database URL from step 1)* |
| `DB_USERNAME` | *(from PostgreSQL)* |
| `DB_PASSWORD` | *(from PostgreSQL)* |
| `JWT_SECRET` | Generate: `openssl rand -base64 32` |
| `FRONTEND_URL` | `https://YOUR-FRONTEND-NAME.onrender.com` (set after creating frontend) |
| `SPRING_PROFILES_ACTIVE` | `prod` |

## 3. Frontend (Static Site)

| Field | Value |
|-------|--------|
| **Root Directory** | `frontend` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Environment Variable (Frontend)

| Key | Value |
|-----|--------|
| `VITE_API_BASE_URL` | `https://YOUR-BACKEND-NAME.onrender.com` (no trailing slash) |

## 4. After First Deploy

1. Copy the **frontend** URL from Render.
2. In **backend** service → Environment → set `FRONTEND_URL` to that URL.
3. Redeploy backend so CORS allows the frontend origin.

## 5. JAR Name

If your `pom.xml` version/artifact differs, the JAR name may be different. Check after build:

```bash
ls target/*.jar
```

Use that name in the Start Command, e.g. `java -jar target/your-actual-name.jar`.
