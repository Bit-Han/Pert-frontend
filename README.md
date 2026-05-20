# PERT Simulation & Project Management Tool
 
**Stop guessing project deadlines. Start predicting them with statistical confidence.**
 
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-blue?style=for-the-badge)](https://pert-frontend.vercel.app/)


### Dashboard — Task Input & PERT Analysis
![Dashboard Screenshot](https://github.com/user-attachments/assets/1a029f58-50b4-4979-930f-b850056dac42)
> *Users define tasks with optimistic, most likely, and pessimistic duration estimates. The system instantly calculates expected durations and identifies the critical path.*
 
---
 
### Monte Carlo Simulation Results
<!-- Replace the line below with your actual screenshot -->
![Monte Carlo Chart](https://github.com/user-attachments/assets/99105b1e-184d-4214-bbd8-963d360af449)
> *The simulation runs thousands of scenarios and returns a probability distribution — showing not just when a project might finish, but how confident you can be in that estimate.*
 
---
 
### Method Comparison View
<!-- Replace the line below with your actual screenshot -->
![Comparison View](https://github.com/user-attachments/assets/4492556e-9c9a-4644-9b21-863ed679233f)
> *Side-by-side comparison of Classical PERT vs Monte Carlo results with key metrics displayed visually using Recharts.*
 
---


## The Problem This Solves
 
Project managers around the world face the same challenge every day: **how long will this actually take?**
 
Traditional single-point estimates ("this will take 3 weeks") are almost always wrong because they ignore uncertainty. Teams consistently underestimate complexity, and missed deadlines cost businesses real money — an estimated **$50 billion per year** in the US alone according to PMI research.
 
**PERT (Program Evaluation and Review Technique)** was developed by the US Navy in the 1950s to solve exactly this problem. Instead of one estimate, it uses three:
 
- **Optimistic (O)** — best case scenario
- **Most Likely (M)** — realistic estimate
- **Pessimistic (P)** — worst case scenario
Combined with **Monte Carlo simulation** — a technique used by financial analysts, engineers, and data scientists — this tool runs thousands of simulated project scenarios to give you a **probability distribution of outcomes**, not just a single number.
 
**The result:** Instead of "this project will take 10 weeks," you get "there is an 85% probability this project completes within 12 weeks." That's actionable intelligence.
 
---
 
## Features
 
- **Task Definition Interface** — Add, edit, and delete project tasks with three-point duration estimates (O, M, P)
- **Classical PERT Analysis** — Calculates expected duration and variance using the standard PERT formula
- **Critical Path Detection** — Automatically identifies which tasks directly impact the project deadline
- **Monte Carlo Simulation** — Runs thousands of simulated scenarios using NumPy to generate completion probability distributions
- **Method Comparison** — Side-by-side visual comparison of Classical PERT vs Monte Carlo results
- **Interactive Charts** — Probability distribution histograms and comparison charts built with Recharts
- **Real-Time Recalculations** — Task updates trigger instant recalculations via WebSocket connections without page refresh
- **Responsive Design** — Works across desktop and tablet screen sizes
---

## ⚙️ Tech Stack

**Frontend**
- [Next.js 14](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/) for modern components
- [Recharts](https://recharts.org/) for visual charts

**Backend**
- [FastAPI](https://fastapi.tiangolo.com/)
- [NumPy](https://numpy.org/) for Monte Carlo simulations
- [Uvicorn](https://www.uvicorn.org/) ASGI server

---

## Architecture
 
```
┌─────────────────────────────────────────────────────────┐
│                     User Browser                        │
│                                                         │
│   ┌─────────────────────────────────────────────────┐   │
│   │         Next.js Frontend (Vercel)               │   │
│   │                                                 │   │
│   │  Task Input → PERT Form → Chart Display         │   │
│   │        │                        ▲               │   │
│   │        │ REST API calls         │ JSON results  │   │
│   │        │ WebSocket updates      │               │   │
│   └────────┼────────────────────────┼───────────────┘   │
│            │                        │                   │
└────────────┼────────────────────────┼───────────────────┘
             │                        │
             ▼                        │
┌─────────────────────────────────────────────────────────┐
│              FastAPI Backend (Render)                   │
│                                                         │
│   POST /tasks     → Validate & store tasks              │
│   GET  /simulate  → Run Monte Carlo (NumPy)             │
│   GET  /critical-path → NetworkX graph traversal        │
│   WS   /ws        → Push recalculations to client       │
└─────────────────────────────────────────────────────────┘
```
 
---
## 🚀 Local Setup Instructions

### 🐍 Backend (FastAPI)

#### 1️⃣ Navigate to the backend directory
```bash
cd pert-backend
```

## 2️⃣ Create a virtual environmenton Windows (PowerShell)
```bash
 python -m venv .venv
 
 ```
 to activate venv in backend

```bash
.venv\Scripts\Activate.ps1
```
or

```bash
venv\Scripts\activate
```


## 4️⃣ Install dependencies on the backend 
```bash

pip install -r fastapi uvicorn[standard] numpy networkx pydantic
```
## 5️⃣ Run the FastAPI server
```bash
uvicorn main:app --reload
```
Backend should now be running on:

```cpp
Copy code
http://127.0.0.1:8000
```
You can open the API docs here:

```arduino
Copy code
http://127.0.0.1:8000/docs
```
## ⚛️ Frontend (Next.js)

1️⃣ Navigate to the frontend directory

```bash
Copy code
cd pert-frontend
```
## 2️⃣ Install dependencies
```bash
npm install
```

## 4️⃣ Run the development server
```bash
npm run dev
```
Frontend should now be running on:

```arduino
http://localhost:3000
```

## How The Monte Carlo Simulation Works
 
The simulation works by treating each task duration as a random variable drawn from a **Beta PERT distribution** — a probability distribution specifically designed for three-point estimates.
 
For each simulation iteration (default: 10,000):
 
1. A random duration is sampled for each task based on its O, M, P values
2. The critical path is calculated for that specific scenario
3. The total project duration is recorded
After all iterations, the recorded durations form a **probability distribution** that shows:
- The most likely completion time
- The range of possible outcomes
- The probability of finishing by any given date
This is the same technique used by financial analysts for risk modeling, engineers for reliability testing, and NASA for mission planning.
 
---


## 📄 License
 
MIT License — feel free to use this project as a reference or build on top of it.
 
---
 
## 👤 Author
 
**Emmanuel Ovuoba**
- Portfolio: [portfolio](https://ovuobaemmanuel.vercel.app/)
- GitHub: [@Bit-Han](https://github.com/Bit-Han)
- Email: ovuobaemmanuel@gmail.com
- LinkedIn: [LINKEDIN](https://www.linkedin.com/in/emmanuel-ovuoba-929155103/)
---
 
> *Built with the conviction that better estimates lead to better outcomes — for teams, for clients, and for the people depending on both.*





































