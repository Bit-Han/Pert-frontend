# 🧮 PERT Simulation and Comparison Tool

This project is a full-stack application for performing **PERT (Program Evaluation and Review Technique)** analysis and **Monte Carlo simulations** for project management.  

It allows users to:
- Define tasks with optimistic, most likely, and pessimistic durations.
- Simulate total project duration using classical and Monte Carlo PERT.
- Compare estimation methods visually with charts and metrics.
- Update tasks dynamically with WebSocket-based recalculations.

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
Copy code
http://localhost:3000
```










































