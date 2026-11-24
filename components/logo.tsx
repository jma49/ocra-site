import { EyesMark } from "@/components/brand/eyes-mark";

// The eye row beside the wordmark, in the text colour.
export function Logo() {
  return (
    <span className="logo">
      <EyesMark size={30} className="logo-eyes" />
      <span>ocra</span>
    </span>
  );
}
