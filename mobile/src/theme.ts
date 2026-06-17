// Tema dell'app: colori ad alto contrasto e dimensioni font generose,
// pensati per accessibilita' (dislessia, ipovisione).
// Due varianti: chiaro e scuro.

export type Theme = {
  background: string;
  card: string;
  text: string;
  textMuted: string;
  primary: string;
  primaryText: string;
  border: string;
  danger: string;
};

export const lightTheme: Theme = {
  background: "#FFFFFF",
  card: "#F2F4F7",
  text: "#101828",
  textMuted: "#475467",
  primary: "#1D4ED8", // blu ad alto contrasto
  primaryText: "#FFFFFF",
  border: "#D0D5DD",
  danger: "#B42318",
};

export const darkTheme: Theme = {
  background: "#0B0F19",
  card: "#1A2030",
  text: "#F5F7FA",
  textMuted: "#A6B0C0",
  primary: "#60A5FA",
  primaryText: "#0B0F19",
  border: "#2A3242",
  danger: "#FF6B6B",
};

// Dimensioni font grandi e leggibili.
export const fontSize = {
  title: 30,
  subtitle: 18,
  body: 19,
  button: 20,
  small: 15,
};
