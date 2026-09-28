import { createCn } from "cn/config";

// The type scale from app/global.css. Without it, a size such as
// `text-title` and a colour such as `text-fg` on one element look like two
// colours, and the merge drops the size.
export const cn = createCn({
  extend: {
    classGroups: {
      "font-size": [
        {
          text: [
            "display",
            "display-md",
            "display-sm",
            "display-zh",
            "display-zh-sm",
            "headline",
            "headline-sm",
            "headline-zh",
            "headline-zh-sm",
            "title",
            "lead",
          ],
        },
      ],
    },
  },
});
