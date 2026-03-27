export interface Theme {
  BACKGROUND: string;
  TITLE: string;
  TEXT: string;
  NEXT_RANK_BAR: string;
  CARD_BORDER: string;
  CARD_HIGHLIGHT: string;
}

export const COLORS: { [name: string]: Theme } = {
  default: {
    BACKGROUND: "#0f1318",
    TITLE: "#e9eef7",
    TEXT: "#a5b1c3",
    NEXT_RANK_BAR: "#6fb2ff",
    CARD_BORDER: "#2b3443",
    CARD_HIGHLIGHT: "#3f4c61",
  },
};
