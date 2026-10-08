import { EyesMark } from "@/components/brand/eyes-mark";

// The eye row beside the wordmark; `dark` sets it on a night ground, where
// the eyes take the signal colour.
export function Logo({ dark }: { dark?: boolean }) {
  return (
    <span className={dark ? "logo logo-dark" : "logo"}>
      <EyesMark size={30} className="logo-eyes" />
      <span>ocra</span>
    </span>
  );
}
