# Vercel Deployment Configuration

This project is configured to deploy on Vercel with the following setup:

## 🏗️ Project Structure
- **Frontend**: React + Vite app in `/frontend`
- **Backend**: Node.js API (runs locally, for production use Vercel serverless functions or external backend)

## 🚀 Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. Visit [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your GitHub repository: `https://github.com/Emilio700/tienda-modelos-3d`
4. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Add environment variables (if needed)
6. Click **"Deploy"**

### Option 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Navigate to your project directory
cd "c:\Users\aksel\OneDrive\Documentos\PYANSA TI\Indicadores\WEB"

# Deploy
vercel
```

## ⚙️ Configuration

The `vercel.json` file configures:
- API routes redirection
- Build settings

## 🔧 Environment Variables

If you need environment variables, add them in Vercel Dashboard:
- Go to Project Settings → Environment Variables
- Add any required variables

## 📝 Notes

- The current backend (`/backend`) is designed for local development
- For production, consider:
  - Using Vercel Serverless Functions
  - Hosting backend separately (e.g., Railway, Render, Heroku)
  - Using a Backend-as-a-Service (e.g., Firebase, Supabase)

## 🔗 After Deployment

Your app will be available at: `https://your-project-name.vercel.app`
