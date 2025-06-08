# Ai-Finance

Ai-Finance is a web application that harnesses artificial intelligence to deliver financial insights and management tools. Built with Next.js, this project integrates various services for authentication, database management, and AI-driven features to provide a robust platform for financial tracking and analysis.

[Live website link](https://ai-finance-pied.vercel.app/)

## 🚀 Features

- Secure user authentication and management via Clerk
- Interactive dashboard for financial overview
- AI-powered financial insights using Google Gemini
- Real-time database synchronization with Supabase
- Email notifications powered by Resend
- Enhanced security with Arcjet

## 🛠️ Technologies Used

- **Frontend:** Next.js, React, Tailwind CSS  
- **Authentication:** Clerk  
- **Database:** PostgreSQL (via Supabase)  
- **AI Integration:** Google Gemini API  
- **Email Services:** Resend API  
- **Security:** Arcjet  

## 📦 Installation Instructions

### 1. Clone the repository

```bash
git clone https://github.com/GODWIN-projects/Ai-finance.git
cd Ai-finance
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

- Create a `.env.local` file in the root directory.
- Add the following environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_FRONTEND_API=your_clerk_frontend_api
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL=/dashboard
DATABASE_URL=your_supabase_database_url
DIRECT_URL=your_supabase_direct_url
ARCJET_KEY=your_arcjet_key
RESEND_API_KEY=your_resend_api_key
GEMINI_API_KEY=your_gemini_api_key
```

- Replace each placeholder (`your_clerk_publishable_key`, etc.) with your actual keys and URLs.

> ⚠️ Ensure you have valid accounts and API credentials for:
> - [Clerk](https://clerk.dev/) (authentication)
> - [Supabase](https://supabase.com/) (database)
> - [Arcjet](https://arcjet.com/) (security)
> - [Resend](https://resend.com/) (email services)
> - [Google Gemini](https://deepmind.google/technologies/gemini/) (AI services)

## 💻 Usage

Start the development server:

```bash
npm run dev
```

Open your browser and go to [http://localhost:3000](http://localhost:3000)

Sign up or log in to access the dashboard and explore AI-enhanced financial management.

## 🌍 Environment Variables

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key for frontend authentication  
- `CLERK_SECRET_KEY`: Clerk secret key for backend authentication  
- `NEXT_PUBLIC_CLERK_FRONTEND_API`: Clerk frontend API URL  
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL`: Sign-in page URL (default: `/sign-in`)  
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL`: Sign-up page URL (default: `/sign-up`)  
- `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL`: Post-sign-in redirect URL (default: `/dashboard`)  
- `DATABASE_URL`: Supabase database connection URL (via connection pooling)  
- `DIRECT_URL`: Direct Supabase database URL (used for migrations)  
- `ARCJET_KEY`: API key for Arcjet security services  
- `RESEND_API_KEY`: API key for Resend email services  
- `GEMINI_API_KEY`: API key for Google Gemini AI services  

