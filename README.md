# Interview Ally

Welcome to **Interview Ally** — your AI-powered companion designed to help you prepare, practice, and perfect your interview skills. Whether you're grinding Data Structures and Algorithms (DSA), preparing for behavioral HR rounds, or refining your resume, Interview Ally is here to provide real-time, constructive, and Socratic feedback.

---

## 🚀 Features

- **DSA Copilot:** Socratic problem-solving. It pushes you to think through approaches, complexities, and code generation rather than just giving you the answer.
- **HR & Behavioral Copilot:** Practice the STAR method (Situation, Task, Action, Result) with simulated behavioral questions and get specific feedback to strengthen your answers.
- **Resume Reviewer:** Get actionable, bullet-by-bullet feedback on your resume to highlight your impact and polish your professional formatting.
- **Real-time AI:** Powered directly by Google Gemini's advanced models.
- **Seamless UI:** A beautiful, responsive, and modern interface built with React and Tailwind CSS.

---

## 🛠 Tech Stack

- **Frontend:** [React](https://react.dev/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) and [Radix UI](https://www.radix-ui.com/)
- **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL & Edge Functions)
- **AI Integration:** Google Gemini API
- **Testing:** [Playwright](https://playwright.dev/) for End-to-End browser testing

---

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- `npm` (comes with Node.js)
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started) (if you intend to run the backend functions locally or deploy them)
- A [Google AI Studio API Key](https://aistudio.google.com/app/apikey) for Gemini

---

## 💻 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/YOUR_USERNAME/interview-ally.git
cd interview-ally
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create or update your `.env` and `supabase/.env.local` files:

**.env** (Frontend Variables)
```env
VITE_SUPABASE_PROJECT_ID="your-supabase-project-id"
VITE_SUPABASE_URL="https://your-supabase-url.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-supabase-anon-key"

# (Optional here, but required in Supabase Edge Functions)
GEMINI_API_KEY="your-gemini-api-key"
```

**supabase/.env.local** (Backend Variables for local testing)
```env
GEMINI_API_KEY="your-gemini-api-key"
```

---

## 🚦 Running Locally

To run the application, you need to start the frontend server. 

```bash
npm run dev
```
The application will be available at `http://localhost:8080`.

*(Optional)* If you want to test the Supabase Edge Functions (like the AI chat) locally rather than connecting to your live cloud database, you can start the local Supabase environment:
```bash
supabase start
supabase functions serve --env-file ./supabase/.env.local
```

---

## 🌐 Deployment

### Frontend Deployment
The frontend is a standard Vite application and can be easily deployed to platforms like Vercel, Netlify, or GitHub Pages.

```bash
npm run build
```

### Supabase Edge Functions Deployment
To deploy the updated backend AI functions to your live Supabase project:

1. Push the secret to your live Supabase project:
   ```bash
   supabase secrets set GEMINI_API_KEY="your-gemini-api-key" --project-ref your-project-id
   ```
2. Deploy the edge function:
   ```bash
   supabase functions deploy chat --project-ref your-project-id
   ```

---

## 🧪 Testing

This project uses Playwright for end-to-end testing.

To run the tests:
```bash
npm run test
```
*(You may need to run `npx playwright install` the very first time to download the necessary test browsers).*
