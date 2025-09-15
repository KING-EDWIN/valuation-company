# 🚀 STANFIELD PARTNERS - Backend Setup Guide

## 📋 **Prerequisites**
- Vercel account
- Your project deployed on Vercel

## 🔧 **Step 1: Enable Vercel Postgres**

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project** (stanfield3)
3. **Go to "Storage" tab**
4. **Click "Create Database"**
5. **Select "Postgres"**
6. **Choose Free Tier** (500MB storage, 10GB bandwidth)
7. **Click "Create"**

## 🔑 **Step 2: Get Database Credentials**

After creating the database, you'll get these environment variables:

```bash
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."
```

## ⚙️ **Step 3: Update Environment Variables**

1. **Copy the credentials** from Vercel dashboard
2. **Update your `.env.local` file** with the actual values
3. **Add JWT secrets**:

```bash
JWT_SECRET="your-super-secret-jwt-key-here"
NEXTAUTH_SECRET="your-nextauth-secret-here"
```

## 🗄️ **Step 4: Initialize Database**

1. **Deploy your project** to Vercel
2. **Visit**: `https://your-app.vercel.app/api/init-db`
3. **Method**: POST
4. **This will create all necessary tables**

## 🔐 **Step 5: Test Authentication**

### Register a user:
```bash
curl -X POST https://your-app.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@stanfieldpartners.com",
    "password": "password123",
    "name": "Administrator",
    "role": "admin"
  }'
```

### Login:
```bash
curl -X POST https://your-app.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@stanfieldpartners.com",
    "password": "password123"
  }'
```

## 📊 **Available API Endpoints**

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Jobs
- `GET /api/jobs` - Get all jobs
- `POST /api/jobs` - Create new job
- `GET /api/jobs/[id]` - Get specific job
- `PUT /api/jobs/[id]` - Update job
- `DELETE /api/jobs/[id]` - Delete job

### Notifications
- `GET /api/notifications?userId=123` - Get user notifications
- `POST /api/notifications` - Create notification

### Database
- `POST /api/init-db` - Initialize database tables

## 🛡️ **Security Features**

- ✅ JWT token authentication
- ✅ Password hashing with bcrypt
- ✅ Protected API routes
- ✅ Role-based access control
- ✅ Input validation

## 🚀 **Next Steps**

1. **Update your frontend** to use the new API endpoints
2. **Replace mock data** with real database calls
3. **Add file upload** functionality
4. **Implement real-time notifications**

## 📞 **Support**

If you encounter any issues:
1. Check Vercel logs
2. Verify environment variables
3. Ensure database is initialized
4. Check API endpoint responses

---

**🎉 Congratulations! Your backend is now ready!**


