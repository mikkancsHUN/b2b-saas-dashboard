# 🚀 Premium B2B SaaS Analytics Dashboard

A high-performance, fully optimized fintech dashboard that displays real-time SaaS metrics (MRR, Churn Rate, and comprehensive transaction statistics). This project focuses heavily on premium UI/UX design, atomic component architecture, and lightning-fast rendering.

## ✨ Key Features

- **Real-Time SaaS Metrics:** Dynamic calculation of MRR (Monthly Recurring Revenue), Churn Rate, and successful/pending/failed transactions, including percentage-based month-over-month changes.
- **Evergreen Chart Engine:** A dynamic, rolling 6-month chart window that seamlessly handles year-end transitions and future-dated test data without breaking.
- **Instant Filtering & Search:** Lightning-fast client and status-based filtering implemented directly within the transaction table interface.
- **Premium UI/UX:** Tailored Indigo/Blue dark and light modes with lag-free switching, smooth gradient shimmer effects, and high-fidelity loading skeleton screens.
- **Data Persistence:** Full Supabase integration utilizing Next.js server-side data revalidation (`router.refresh`) for real-time updates.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, React Server Components)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Database / Backend:** [Supabase](https://supabase.com/)
- **State & UI Components:** Custom atomic components (including a bulletproof `Button` wrapper, optimized modals, and data tables)
- **Deployment:** [Vercel](https://vercel.com/)

## 🚀 Getting Started & Local Setup

1. **Clone the repository:**

   ```bash
   git clone <your-repository-link>
   cd b2b-saas-dashboard
   ```

2. **Install dependencies:**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Environment Variables (.env.local):**
   Create a .env.local file in the root directory and add your Supabase credentials:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## Code Quality & Refactoring

A core focus of this project was maintaining Clean Code principles. The initial monolithic logic was successfully refactored into isolated, reusable client and server-side components, as well as dedicated helper utilities (app/dashboard/utils.ts). This architectural change reduced the main page's line count by over 90%, vastly improving maintainability, scalability, and overall performance.
