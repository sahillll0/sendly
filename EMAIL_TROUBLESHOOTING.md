# Email Service Troubleshooting Guide

## Issues Found

### 1. Wrong API Endpoints in Documentation ✅ FIXED
- Documentation was pointing to `sendly-three.vercel.app` and `api.sendly.com`
- Updated all references to `sendly-bay.vercel.app`

### 2. Environment Variables Not Set on Vercel (CRITICAL)

Your `.env` file is NOT deployed to Vercel. You need to add these environment variables in your Vercel dashboard:

**Steps to fix:**
1. Go to https://vercel.com/your-project/settings/environment-variables
2. Add these variables:

```
DB_URL=mongodb+srv://sahiltippe111_db_user:sahiltippe@cluster0.fzxcep7.mongodb.net/?appName=Cluster0
JWT_SECRET=supersecretjwtkey_change_in_production_nwdewnFDSNSBLDSJVLASDBVDCSFSCSSACDDD
SMTP_USER=sahiltippe111@gmail.com
SMTP_PASS=hafpqezuzerbxicw
SMTP_PORT=587
SMTP_HOST=smtp.gmail.com
CLOUDINARY_API_KEY=361726544927911
CLOUDINARY_API_SECRET=GvUxhcEnwAdS8TdNACsaG6a7stg
CLOUDINARY_CLOUD_NAME=dclpslzvb
```

3. Redeploy your application

### 3. Gmail SMTP Issues

Your Gmail app password looks correct (16 characters), but verify:

1. **2-Factor Authentication is enabled** on your Google account
2. **App Password is still valid** - Generate a new one if needed:
   - Go to https://myaccount.google.com/apppasswords
   - Generate new app password for "Mail"
   - Update `SMTP_PASS` in Vercel

### 4. Security Warning ⚠️

Your `.env` file contains real credentials and should NEVER be committed to Git!

**Fix this immediately:**
```bash
# Remove .env from git history
git rm --cached .env
git commit -m "Remove .env from repository"
git push

# Verify .gitignore contains .env
echo ".env" >> .gitignore
```

## Testing the API

Once environment variables are set on Vercel, test with:

```bash
curl -X POST https://sendly-bay.vercel.app/api/send \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_API_KEY_HERE" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

## Common Error Messages

| Error | Cause | Solution |
|-------|-------|----------|
| "Email sending failure" | SMTP credentials missing/invalid | Check Vercel env vars |
| "Invalid API key" | API key not found in database | Create project in dashboard |
| "Invalid email format" | Email validation failed | Check email format |
| 500 Internal Server Error | Database connection failed | Check DB_URL in Vercel |

## Next Steps

1. ✅ Documentation URLs fixed
2. ⚠️ Add environment variables to Vercel
3. ⚠️ Remove .env from Git
4. ⚠️ Test the API endpoint
5. ⚠️ Check Vercel deployment logs for errors
