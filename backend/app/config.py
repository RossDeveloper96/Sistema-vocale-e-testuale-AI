"""Configurazione centrale dell'app.

Legge le impostazioni dal file .env (le chiavi API non stanno MAI nel codice).
Il resto del backend importa 'settings' da qui e non legge mai os.environ a mano.
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # LLM (Kimi/Moonshot) — usati piu' avanti, al Passo 3
    moonshot_api_key: str = ""
    moonshot_base_url: str = "https://api.moonshot.ai/v1"
    ai_model: str = "kimi-k2.5"

    # Voce (ElevenLabs) — usata al Passo 2
    elevenlabs_api_key: str = ""

    # Generale
    allowed_origins: str = "*"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


# Istanza unica, importata in tutto il progetto.
settings = Settings()
