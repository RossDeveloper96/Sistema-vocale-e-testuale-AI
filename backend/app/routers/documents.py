"""Rotte relative ai documenti.

Regola d'oro del progetto: la rotta riceve la richiesta e risponde,
ma il LAVORO vero lo fa il service (services/extraction.py).
"""

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.services.extraction import FormatoNonSupportato, estensione, estrai_testo

router = APIRouter(prefix="/documents", tags=["documents"])

# Limite prudente in sviluppo: 20 MB.
MAX_BYTES = 20 * 1024 * 1024


@router.post("/extract")
async def extract(file: UploadFile = File(...)):
    """Riceve un file caricato e restituisce il testo estratto.

    Risposta JSON:
      { "filename": ..., "characters": N, "text": "..." }
    """
    dati = await file.read()

    if not dati:
        raise HTTPException(status_code=400, detail="File vuoto.")
    if len(dati) > MAX_BYTES:
        raise HTTPException(status_code=413, detail="File troppo grande (max 20 MB).")

    try:
        testo = estrai_testo(file.filename or "", dati)
    except FormatoNonSupportato as e:
        raise HTTPException(status_code=415, detail=str(e))
    except Exception as e:  # qualunque imprevisto durante l'estrazione
        raise HTTPException(status_code=500, detail=f"Errore di estrazione: {e}")

    if not testo:
        # Es. PDF solo-immagini senza OCR, o documento vuoto.
        raise HTTPException(
            status_code=422,
            detail="Nessun testo estratto. Se e' una scansione, servira' l'OCR.",
        )

    return {
        "filename": file.filename,
        "extension": estensione(file.filename or ""),
        "characters": len(testo),
        "text": testo,
    }
