# ASTRACARE AI: Environment Configuration

## 1. Environment Variables (`.env.local` / `.env.example`)

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# AI Provider Configuration (Conversational Layer M4)
AI_PROVIDER_API_KEY=your_gemini_or_openai_api_key_here
AI_PROVIDER_MODEL=gemini-1.5-flash

# Kaggle Configuration (Automated Ingestion)
KAGGLE_USERNAME=your_kaggle_username
KAGGLE_KEY=your_kaggle_api_key

# Email / SMS Gateway (Optional custom providers)
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=re_your_api_key_here
```

> **Security Note**: Never commit real secret keys into source control. Place active credentials in `.env.local` which is safely ignored by `.gitignore`.
