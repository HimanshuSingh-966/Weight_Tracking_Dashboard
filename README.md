# 🏋️‍♂️ WeightTrack – Smart Weight Tracking Dashboard

**WeightTrack** is a minimalist, privacy-focused web application that allows users to effortlessly log and visualize their weight over time. Designed with simplicity and user experience in mind, it provides an intuitive interface for tracking weight trends without unnecessary complexities.

🔗 **Live Demo**: [weight-tracking-dashboard.netlify.app](https://weight-tracking-dashboard.netlify.app)

---

## ✨ Features

- 📅 Add and view daily weight logs
- 📊 Visualize progress through dynamic charts
- 🎯 Set and track weight goals
- 📉 Calculate BMI and analyze health trends
- ⚙️ Customizable settings for weight units and more
- 📤 Share progress reports
- ⚡ Blazing fast with Vite, fully responsive design


---

## 🛠️ Technologies Used

- **HTML5 & CSS3**: Structuring and styling the application.
- **JavaScript (ES6+)**: Implementing core functionalities and interactivity.
- **Chart.js**: Rendering responsive and interactive charts for data visualization.
- **Netlify**: Hosting and continuous deployment of the application.

---

## 📂 Project Structure

'''plaintext
Weight_Tracking_Dashboard/
├── .bolt/
│ └── config.json
│ └── promt
├── public/
│ └── index.html
├── src/
│ ├── components/
│ │ ├── calculators/
│ │ │ └── BMICalculator.tsx
│ │ ├── charts/
│ │ │ └── WeightChart.tsx
│ │ ├── forms/
│ │ │ └── WeightForm.tsx
│ │ ├── goals/
│ │ │ └── GoalProgress.tsx
│ │ ├── layout/
│ │ │ └── Header.tsx
│ │ ├── stats/
│ │ │ └── WeightStats.tsx
│ │ ├── ui/
│ │ │ ├── Button.tsx
│ │ │ ├── DashboardCard.tsx
│ │ │ └── LoadingState.tsx
│ │ ├── weight/
│ │ │ └── WeightHistory.tsx
│ │ └── Dashboard.tsx
│ ├── context/
│ │ └── WeightContext.tsx
│ ├── pages/
│ │ ├── Reports.tsx
│ │ ├── Settings.tsx
│ │ └── ShareProgress.tsx
│ ├── App.tsx
│ ├── index.css
│ ├── main.tsx
│ └── vite-env.d.ts
├── .gitignore
├── README.md
├── eslint.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts


---

## 🧑‍💻 Getting Started

### Prerequisites

Ensure you have **Node.js** and **npm** installed.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/HimanshuSingh-966/weight-tracking-dashboard.git
2. **Install dependencies:**:
   ```bash
   npm install
3. **Start the development server:**
   ```bash
   npm run dev
4. **Open http://localhost to view the app.**

