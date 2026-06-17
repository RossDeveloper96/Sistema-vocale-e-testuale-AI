"""Estrazione del testo da un documento.

Questo e' un "service": contiene la LOGICA vera. La rotta (routers/documents.py)
si limita a ricevere il file e a chiamare la funzione 'estrai_testo' qui sotto.

Formati supportati al Passo 1:
  - PDF   (.pdf)   -> pypdf
  - Word  (.docx)  -> python-docx
  - Testo (.txt)   -> lettura diretta
  - Immagini (.png/.jpg/...) -> OCR con Tesseract (se installato)
"""

from __future__ import annotations

import io


class FormatoNonSupportato(Exception):
    """Sollevata quando non sappiamo gestire quel tipo di file."""


def _estrai_da_pdf(dati: bytes) -> str:
    from pypdf import PdfReader

    reader = PdfReader(io.BytesIO(dati))
    pagine = [pagina.extract_text() or "" for pagina in reader.pages]
    return "\n\n".join(pagine).strip()


def _estrai_da_docx(dati: bytes) -> str:
    from docx import Document

    documento = Document(io.BytesIO(dati))
    paragrafi = [p.text for p in documento.paragraphs]
    return "\n".join(paragrafi).strip()


def _estrai_da_txt(dati: bytes) -> str:
    # Proviamo prima UTF-8, poi un fallback tollerante.
    try:
        return dati.decode("utf-8").strip()
    except UnicodeDecodeError:
        return dati.decode("latin-1", errors="replace").strip()


def _estrai_da_immagine(dati: bytes) -> str:
    """OCR. Richiede Tesseract installato sul sistema.
    Se manca, diamo un messaggio chiaro invece di un errore criptico.
    """
    try:
        import pytesseract
        from PIL import Image
    except ImportError as e:  # libreria python mancante
        raise FormatoNonSupportato(
            "Librerie OCR non installate (pytesseract/Pillow)."
        ) from e

    try:
        immagine = Image.open(io.BytesIO(dati))
        # 'ita+eng': prova prima italiano, poi inglese.
        return pytesseract.image_to_string(immagine, lang="ita+eng").strip()
    except pytesseract.TesseractNotFoundError as e:
        raise FormatoNonSupportato(
            "Tesseract (OCR) non e' installato sul sistema. "
            "Installa 'tesseract-ocr' per leggere le immagini."
        ) from e


# Mappa: estensione del file -> funzione che lo gestisce.
_ESTRATTORI = {
    ".pdf": _estrai_da_pdf,
    ".docx": _estrai_da_docx,
    ".txt": _estrai_da_txt,
    ".md": _estrai_da_txt,
    ".png": _estrai_da_immagine,
    ".jpg": _estrai_da_immagine,
    ".jpeg": _estrai_da_immagine,
    ".webp": _estrai_da_immagine,
}


def estensione(nome_file: str) -> str:
    """Restituisce l'estensione in minuscolo, es. '.pdf'."""
    punto = nome_file.rfind(".")
    return nome_file[punto:].lower() if punto != -1 else ""


def estrai_testo(nome_file: str, dati: bytes) -> str:
    """Punto d'ingresso unico: dato il nome file e i suoi byte,
    restituisce il testo estratto.
    """
    ext = estensione(nome_file)
    estrattore = _ESTRATTORI.get(ext)
    if estrattore is None:
        raise FormatoNonSupportato(f"Formato '{ext or 'sconosciuto'}' non supportato.")
    return estrattore(dati)
