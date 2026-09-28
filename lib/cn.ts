import { createCn } from "cn/config";

// The type scale from app/global.css. Without it, a size such as
// `text-lead` and a colour such as `text-fg-muted` on one element look like
// two colours, and the merge drops the size.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "display-sm",
            "display-zh",
            "display-zh-sm",
            "headline",
            "headline-sm",
            "title",
            "lead",
          ],
        },
      ],
    },
  },
});
