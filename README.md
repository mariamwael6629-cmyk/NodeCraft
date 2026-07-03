# 🛠️ NodeCraft — AI Workflow Automation Platform

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://www.python.org)

A high-performance, full-stack AI workflow automation platform engineered for seamless process orchestration[cite: 1]. NodeCraft combines a flexible FastAPI backend with a responsive, modern React UI built entirely with vanilla layout tokens[cite: 1].

---

## 🚀 Tech Stack

* **Backend:** Python · FastAPI · SQLAlchemy · SQLite *(Easily swappable to PostgreSQL)* · JWT Auth[cite: 1].
* **Frontend:** React 18 · Vite 5 · Vanilla CSS *(Custom, zero-dependency modern layout)*[cite: 1].

---

## 📂 Project Structure

```text
NodeCraft/
├── backend/
│   ├── app/
│   │   ├── api/routes/       # Endpoints for auth, workflows, templates, monitoring, etc.
│   │   ├── core/              # Env configuration & JWT/bcrypt security helpers
│   │   ├── db/                # SQLAlchemy database engine & session handlers
│   │   ├── models/            # SQLAlchemy database ORM structures
│   │   ├── schemas/           # Pydantic v2 validation data models
│   │   ├── services/          # Core business logic layer isolation
│   │   ├── seed.py            # Automatic seed system for templates, billing, and extensions
│   │   └── main.py            # FastAPI setup, global CORS configuration, and error exceptions
│   ├── requirements.txt
│   └── .env.example
└── frontend/
    ├── src/
    │   ├── App.jsx            # Core routing and central page state orchestrator
    │   ├── AuthContext.jsx    # Application context wrapper for active login state
    │   ├── api.js             # Built-in fetch client targeting core routing
    │   ├── theme.js           # Shared centralized design language rules
    │   ├── GlobalStyle.jsx    # Reset style injections and layout presets
    │   ├── components/        # Isolated global atomic UI components
    │   └── pages/             # Fully structured layout views
    ├── package.json
    └── vite.config.js         # Automated endpoint proxy setup (/api -> port 8000)
```[cite: 1]

---

## ✨ Features

* 🗺️ **Visual Workflow Builder** – Drag-and-drop interactive workspace interface equipped with node parameters, running sandbox simulation, and full log histories[cite: 1].
* 🤖 **AI Assistant Interface** – Conversational chat container that accurately translates plain-English descriptions into functional system nodes and connections[cite: 1].
* 🛒 **Template Marketplace** – Includes 9 ready-to-run system pipeline blue-prints with live categorization queries[cite: 1].
* 📊 **Monitoring Dashboard** – Live processing throughput, historical stability tracking charts, error indicators, and stream feeds[cite: 1].
* 👥 **Team Workspaces** – Access level assignment, simple invitation modals, and extensive modification log histories[cite: 1].
* ⚙️ **Unified Workspace Settings** – Manage programmatic key lifecycles (generation/revocation), service toggle configurations, and aesthetic settings[cite: 1].
* 💳 **Dynamic Pricing Matrices** – Billing tier views completely driven by backend calculations[cite: 1].

---

## 💻 Getting Started

### Backend Deployment
```bash
cd backend

# Create and execute virtual environment environment
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate

# Install third party platform dependencies
pip install -r requirements.txt

# Bind server configurations
cp .env.example .env

# Run local production-mimicked development server
uvicorn app.main:app --reload --port 8000
```[cite: 1]
> 💡 System API OpenAPI references are generated immediately at `http://localhost:8000/docs`[cite: 1].

### Frontend Deployment
```bash
cd frontend

# Install client packages
npm install

# Initialize development instance
npm run dev
```[cite: 1]
> 💡 Client views operate at `http://localhost:5173`. Proxied endpoints seamlessly pass backend traffic directly[cite: 1].

---

## 🔒 Environment Variables

### Backend (`backend/.env`)
| Variable | Default Value | Purpose |
| :--- | :--- | :--- |
| `SECRET_KEY` | `change-this-...` | Primary cryptographic key layer ensuring payload signature validation[cite: 1]. |
| `DATABASE_URL` | `sqlite:///./nodecraft.db` | Targets location parameters of chosen data container[cite: 1]. |
| `FRONTEND_ORIGINS` | `http://localhost:5173` | Configures safe access matrices across shared local requests[cite: 1]. |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `1440` | Extends lifespan windows of active login parameters (default 24h)[cite: 1]. |
| `ENVIRONMENT` | `development` | Toggles safe verbose warnings (`development` / `production`)[cite: 1]. |

---

## ⚡ API Endpoint Schema

| Method | Target Route | Scope Description |
| :--- | :--- | :--- |
| **POST** | `/api/auth/register` | Provisions custom credentials for new identity records[cite: 1]. |
| **POST** | `/api/auth/login` | Yields verification tokens against active profile records[cite: 1]. |
| **GET** | `/api/auth/me` | Validates session security parameters for requested records[cite: 1]. |
| **GET/POST**| `/api/workflows` | Manages customized pipeline creations across configurations[cite: 1]. |
| **POST** | `/api/workflows/{id}/run` | Triggers background simulation processing tasks[cite: 1]. |
| **POST** | `/api/assistant/chat` | Transforms human expressions into node architecture components[cite: 1]. |

---

## 🌐 Production Architecture Checklist

* **Encryption Layer:** Enforce an updated `SECRET_KEY` string using production values like `openssl rand -hex 32`[cite: 1].
* **Persistent Storage:** Switch out `DATABASE_URL` configurations to bind cleanly to target production PostgreSQL servers[cite: 1].
* **Runtime Verification:** Ensure `ENVIRONMENT=production` is initialized to restrict development error outputs[cite: 1].
* **LLM Integrations:** The modular helper engine found at `backend/app/services/assistant_service.py` is configured with placeholder code out of the box; swap it out with actual provider client calls (such as OpenAI or Anthropic SDK endpoints) when launching[cite: 1].

```