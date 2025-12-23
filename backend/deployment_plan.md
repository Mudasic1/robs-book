# Backend Deployment Plan: Vercel & Infrastructure

This guide outlines the steps to deploy the Physical AI Textbook backend to production.

## 1. Infrastructure Requirements

### Database (PostgreSQL)

- **Provider**: Supabase, Neon, or AWS RDS.
- **Requirement**: Must have a public connection string and support SSL.
- **Migration**: Tables are created automatically on startup by `Base.metadata.create_all`.

### Vector Database (Qdrant)

- **Provider**: Qdrant Cloud (Free Tier available).
- **Requirement**: A valid cluster URL and API Key.

### AI models (Google Gemini)

- **Provider**: Google AI Studio.
- **Requirement**: API Key with access to `gemini-1.5-flash` and `text-embedding-004`.

## 2. Environment Variables Checklist

Ensure these are set in your Vercel Project Settings (Environment Variables):

| Key              | Description                  | Example                               |
| :--------------- | :--------------------------- | :------------------------------------ |
| `DATABASE_URL`   | PostgreSQL connection string | `postgresql://user:pass@host:port/db` |
| `QDRANT_URL`     | Qdrant Cloud URL             | `https://xxxx.cloud.qdrant.io`        |
| `QDRANT_API_KEY` | Qdrant API Key               | `your_qdrant_api_key`                 |
| `GEMINI_API_KEY` | Google Gemini API Key        | `your_gemini_api_key`                 |
| `SECRET_KEY`     | JWT signing secret           | `generate_a_random_string`            |
| `CORS_ORIGINS`   | Allowed frontend URL(s)      | `https://your-frontend.vercel.app`    |

## 3. Deployment Steps

1. **Vercel Project Setup**:

   - Link your GitHub repository to Vercel.
   - Set the `backend` directory as the project root (or use the monorepo setup).
   - Add the environment variables from the checklist above.

2. **Database Initialization**:

   - On the first deployment, the backend will automatically create the necessary tables (`users`, `conversations`, etc.) if they don't exist.

3. **Verify API health**:
   - Visit `https://your-backend.vercel.app/health`.
   - You should receive `{"status": "healthy"}`.

## 4. Production Security Tips

- **CORS**: Ensure `CORS_ORIGINS` is restricted to your production frontend domain only.
- **HTTPS**: Vercel handles SSL automatically.
- **Secrets**: NEVER commit your `.env` file to version control.
