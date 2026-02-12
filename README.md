# CafeToo - Cyber Lounge Experience 🚀

> **High-end Canteen Ordering System for the Modern Campus**

CafeToo is a next-generation web application designed to revolutionize the campus dining experience. Merging "Cyber-Canteen" aesthetics with powerful real-time features, it offers students a seamless way to order food and owners a robust kitchen management system.

---

## ⚡ Tech Stack

-   **Frontend**: Next.js 14, React, Tailwind CSS
-   **Backend**: Supabase (PostgreSQL, Realtime, Auth)
-   **Styling**: Custom CSS Variables, Animated Gradients, Glassmorphism
-   **Motion**: Framer Motion (3D Tilt, Parallax, Page Transitions)
-   **State Management**: React Context API

---

## 🔥 Key Features

### For Students
-   **Cyber-Lounge UI**: Immersive dark mode with neon accents and 3D interactions.
-   **Real-time Ordering**: Instant order placement and tracking.
-   **Gamified Rewards**: "Spin-to-Sip" wheel unlocks on orders over ₹100.
-   **Flash Deals**: Receive instant toast notifications for live kitchen offers.
-   **Feedback Loop**: Rate meals with emoji reactions and star ratings.

### For Owners
-   **Kanban Dashboard**: Real-time kitchen display (Incoming -> Preparing -> Ready).
-   **Flash Offer Engine**: Broadcast deals to all active users instantly.
-   **Secure Access**: PIN-protected portal with "Remember Me" functionality.

---

## 🛠️ Setup Instructions

### Prerequisites
1.  Node.js 18+ installed.
2.  A Supabase account.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cafetoo.git
    cd cafetoo
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # Ensure Tailwind dependencies are set
    npm install -D tailwindcss postcss autoprefixer
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory:
    ```bash
    NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

4.  **Database Setup:**
    Run the SQL scripts provided in `supabase_schema.sql` and `supabase_schema_phase3.sql` in your Supabase SQL Editor to create the necessary tables (`orders`, `offers`, `feedback`) and Row Level Security policies.

5.  **Run the application:**
    ```bash
    npm run dev
    ```
    Visit `http://localhost:3000`.

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

**Developed with ❤️ by [Your Name]**
