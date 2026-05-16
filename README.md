# 📚 SpidyBooks

SpidyBooks is a sleek, modern, dark-themed digital bookstore application designed for book lovers and curious minds. Built with a robust React frontend and a secure Node.js/Express backend, it features a fluid user experience backed by dynamic role-based authentication (Admin & User layouts) and micro-interactions powered by Framer Motion.

---

## ✨ Features

### 👤 User Workspace
* **Dynamic Navigation:** Personalized navbar links that change dynamically based on login sessions.
* **Book Discovery:** Clean storefront grid showcasing available books with crisp styling.
* **Interactive Cart & Profiles:** Fully protected workflows enabling users to manage their selections seamlessly.
* **Animated Feedback:** Sleek custom warning dialogue boxes and spring-physics modal views instead of default browser alerts.
* **Personalization:** Customizable favourites functionality .

### 🛡️ Admin Dashboard
* **Metrics Overview Panel:** An analytics hub compiling data streams via dynamic **Stat Cards** (Total Users, Total Books, Total Delivered Revenue, Pending Orders).
* **Order Pipeline Management:** A dedicated pipeline tracking pending shipments with status indicator configurations.
* * **Book Management:** A Book inventory to perfrom CRUD operation(Adding Books,deleting Books, Reading all the details, Updating Quantity,Price , etc... )
* **Users Dashboard:** Fully view all users, activities, their info....
* **Content Controls:** Custom forms with built-in destructuring payloads to safeguard database schemas from configuration errors.

---

## 🛠️ Tech Stack

* **Frontend:** React, React Router DOM (v6), Tailwind CSS, Framer Motion, Lucide React
* **Backend:** Node.js, Express, MongoDB/Mongoose (via Axios connection pipelines)
* **Hosting Configuration:** Optimized for platforms like **Vercel** (with fallback server rewrites) and **Render** (using custom dependency resolution setups).

---

## ⚙️ Environment Variables

Create a `.env` file in the root of your project directory and add the following configuration:

```env``
VITE_API_URL=https://your-deployed-backend-url.com

---

## 📁 Project Structure

src/
├── components/     # Reusable UI elements (Navbar, Footer, ErrorModal)
├── pages/          # Layout views (Dashboard, Books, PendingOrders, SignUp)
├── context/        # Auth states and session tokens
├── assets/         # Static imagery, badges, and branding icons
└── App.jsx         # Client-side router & route protection mapping

---

## 🌐 Deployment Configuration

This repository includes custom runtime parameters optimized for direct deployment to **Vercel** and **Render**:

* **SPA Client Routing (`vercel.json`):** Ensures internal routes do not break with 404 errors during direct url requests or browser-forced logouts.
* **Alpha Package Safety (`.npmrc`):** Bypasses strict peer dependency version collision blocks during automated cloud server builds.

## 🚀 Installation & Setup

Follow these steps to spin up the codebase locally:

### 1. Clone the Repository

git clone [https://github.com/Tim3-19/SpidyBooks.git](https://github.com/Tim3-19/SpidyBooks.git)
cd SpidyBooks
