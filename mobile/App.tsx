// Schermata principale dell'app (Passo 1: Ossatura).
//
// Cosa fa:
//  1. Mostra un titolo e un pulsante "Importa documento".
//  2. Apre il selettore di file del sistema (PDF, Word, TXT, immagini).
//  3. Invia il file al backend e mostra a schermo il testo estratto.
//  4. Permette di passare da tema chiaro a scuro (accessibilita').

import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";

import { importaEdEstrai, RisultatoEstrazione } from "./src/services/api";
import { darkTheme, fontSize, lightTheme } from "./src/theme";

export default function App() {
  // Il sistema operativo ci dice se l'utente preferisce chiaro o scuro.
  const schemaSistema = useColorScheme();
  const [scuro, setScuro] = useState(schemaSistema === "dark");
  const theme = scuro ? darkTheme : lightTheme;

  const [caricamento, setCaricamento] = useState(false);
  const [errore, setErrore] = useState<string | null>(null);
  const [risultato, setRisultato] = useState<RisultatoEstrazione | null>(null);

  async function onImporta() {
    setErrore(null);
    setCaricamento(true);
    try {
      const esito = await importaEdEstrai();
      if (esito) setRisultato(esito);
    } catch (e: any) {
      setErrore(e?.message ?? "Errore sconosciuto.");
    } finally {
      setCaricamento(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={scuro ? "light" : "dark"} />

      {/* Intestazione */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Leggimelo</Text>
        <Pressable
          onPress={() => setScuro((v) => !v)}
          accessibilityLabel="Cambia tema chiaro o scuro"
          style={[styles.themeBtn, { borderColor: theme.border }]}
        >
          <Text style={{ color: theme.text, fontSize: fontSize.small }}>
            {scuro ? "☀️ Chiaro" : "🌙 Scuro"}
          </Text>
        </Pressable>
      </View>

      <Text style={[styles.subtitle, { color: theme.textMuted }]}>
        Importa un documento e te ne mostro il testo. Poi imparero' a leggerlo
        ad alta voce e a riassumerlo.
      </Text>

      {/* Pulsante principale */}
      <Pressable
        onPress={onImporta}
        disabled={caricamento}
        accessibilityLabel="Importa un documento"
        style={[
          styles.primaryBtn,
          { backgroundColor: theme.primary, opacity: caricamento ? 0.6 : 1 },
        ]}
      >
        {caricamento ? (
          <ActivityIndicator color={theme.primaryText} />
        ) : (
          <Text style={[styles.primaryBtnText, { color: theme.primaryText }]}>
            📄 Importa documento
          </Text>
        )}
      </Pressable>

      {/* Messaggio di errore */}
      {errore && (
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <Text style={{ color: theme.danger, fontSize: fontSize.body }}>
            ⚠️ {errore}
          </Text>
        </View>
      )}

      {/* Risultato: testo estratto */}
      {risultato && (
        <View style={[styles.resultBox, { borderColor: theme.border }]}>
          <Text style={[styles.resultMeta, { color: theme.textMuted }]}>
            {risultato.filename} — {risultato.characters} caratteri
          </Text>
          <ScrollView
            style={[styles.textScroll, { backgroundColor: theme.card }]}
            contentContainerStyle={{ padding: 16 }}
          >
            <Text
              style={{
                color: theme.text,
                fontSize: fontSize.body,
                lineHeight: fontSize.body * 1.5,
              }}
            >
              {risultato.text}
            </Text>
          </ScrollView>
        </View>
      )}

      {!risultato && !errore && !caricamento && (
        <Text style={[styles.hint, { color: theme.textMuted }]}>
          Formati supportati: PDF, Word (.docx), TXT, immagini.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 64,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    fontSize: fontSize.title,
    fontWeight: "800",
  },
  themeBtn: {
    borderWidth: 1,
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  subtitle: {
    fontSize: fontSize.subtitle,
    marginTop: 12,
    marginBottom: 24,
    lineHeight: fontSize.subtitle * 1.4,
  },
  primaryBtn: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryBtnText: {
    fontSize: fontSize.button,
    fontWeight: "700",
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
  },
  resultBox: {
    flex: 1,
    marginTop: 24,
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  resultMeta: {
    fontSize: fontSize.small,
    padding: 12,
  },
  textScroll: {
    flex: 1,
  },
  hint: {
    fontSize: fontSize.small,
    textAlign: "center",
    marginTop: 24,
  },
});
