// The OCRA wordmark at the foot of the landing page: heavy geometric letters
// drawn for ocra, the O as the frog's eye glancing ahead. Each path winds its
// counters the other way, so the default nonzero fill rule cuts them out.
export const WORDMARK = {
  width: 1376,
  height: 320,
  paths: [
    "M0 160A160 160 0 1 1 320 160A160 160 0 1 1 0 160ZM62 160A98 98 0 1 0 258 160A98 98 0 1 0 62 160ZM148 154A36 36 0 1 1 220 154A36 36 0 1 1 148 154Z",
    "M594 13.4A160 160 0 1 0 594 306.6V234.2A98 98 0 1 1 594 85.8Z",
    "M632 0H862A96 96 0 0 1 862 192H632ZM694 62V130H862A34 34 0 0 0 862 62ZM632 0H694V320H632ZM760 130H830L958 320H888Z",
    "M1011 320L1155.5 0H1231.5L1376 320ZM1193.5 66.5L1135 196H1252ZM1110.6 250L1079 320H1308L1276.4 250Z",
  ],
} as const;
