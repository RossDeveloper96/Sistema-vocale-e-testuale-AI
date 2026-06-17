# Leggimelo — Sistema vocale e testuale AI

App mobile (iOS + Android) che prende qualsiasi documento (PDF, Word, TXT,
immagini) e: lo legge ad alta voce con voce umana, dice i punti chiave, ne fa
un riassunto.

## Stack
- **Backend:** Python + FastAPI (estrazione testo, OCR, AI, voce).
- **AI riassunto:** Kimi K2.5 (Moonshot) via API compatibile-OpenAI — isolata in `services/ai.py`.
- **Voce:** ElevenLabs (TTS) con caching dell'audio gia' generato.
- **Mobile:** React Native + Expo (TypeScript).

## Struttura
```
backend/   API FastAPI (app/main.py, routers/, services/, config.py)
mobile/    App Expo (App.tsx, src/services/, src/theme.ts, src/config.ts)
```

## Avvio in sviluppo

### Backend
```bash
cd backend
python3 -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # poi riempi le chiavi
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
# Doc interattiva: http://localhost:8000/docs
```

### Mobile
```bash
cd mobile
npm install
npm run web        # preview nel browser
# oppure: npx expo start  -> apri con l'app "Expo Go" sul telefono
```

## Stato
- [x] Passo 1 — Ossatura: import file + estrazione testo a schermo
- [ ] Passo 2 — Voce (ElevenLabs)
- [ ] Passo 3 — AI: "cosa ho capito" + riassunto (Kimi)
- [ ] Passo 4 — Player, evidenziazione, libreria
- [ ] Passo 5 — Account + freemium
- [ ] Passo 6 — Build e pubblicazione store
