"""Punto di avvio dell'API FastAPI.

Avvio in sviluppo (dalla cartella backend/):
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

Documentazione interattiva automatica: http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import documents

app = FastAPI(title="Sistema vocale e testuale AI", version="0.1.0")

# CORS: permette all'app mobile di chiamare questa API dal browser/dispositivo.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.allowed_origins.split(",")],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registriamo le rotte dei documenti.
app.include_router(documents.router)


@app.get("/health")
def health():
    """Controllo veloce: serve a sapere se il backend e' vivo."""
    return {"status": "ok"}
