// Tutte le chiamate al backend passano da qui.
// Cosi' la schermata non sa nulla di URL e dettagli di rete.

import * as DocumentPicker from "expo-document-picker";
import { Platform } from "react-native";

import { API_BASE_URL } from "../config";

export type RisultatoEstrazione = {
  filename: string;
  extension: string;
  characters: number;
  text: string;
};

// Costruisce il FormData con il file scelto, gestendo sia web che telefono.
async function buildFormData(
  asset: DocumentPicker.DocumentPickerAsset
): Promise<FormData> {
  const form = new FormData();

  if (Platform.OS === "web") {
    // Su web il picker ci da un oggetto File del browser.
    if (asset.file) {
      form.append("file", asset.file, asset.name);
    } else {
      const blob = await (await fetch(asset.uri)).blob();
      form.append("file", blob, asset.name);
    }
  } else {
    // Su iOS/Android passiamo uri + nome + tipo.
    form.append("file", {
      uri: asset.uri,
      name: asset.name,
      type: asset.mimeType ?? "application/octet-stream",
    } as any);
  }

  return form;
}

// Apre il selettore di file e, se l'utente sceglie un documento,
// lo invia al backend e restituisce il testo estratto.
export async function importaEdEstrai(): Promise<RisultatoEstrazione | null> {
  const scelta = await DocumentPicker.getDocumentAsync({
    type: [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/*",
    ],
    copyToCacheDirectory: true,
  });

  if (scelta.canceled || !scelta.assets?.length) {
    return null; // l'utente ha annullato
  }

  const form = await buildFormData(scelta.assets[0]);

  const risposta = await fetch(`${API_BASE_URL}/documents/extract`, {
    method: "POST",
    body: form,
  });

  if (!risposta.ok) {
    let dettaglio = `Errore ${risposta.status}`;
    try {
      const corpo = await risposta.json();
      if (corpo?.detail) dettaglio = corpo.detail;
    } catch {
      // ignora: teniamo il messaggio generico
    }
    throw new Error(dettaglio);
  }

  return (await risposta.json()) as RisultatoEstrazione;
}
