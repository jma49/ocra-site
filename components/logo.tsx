import { EyesMark, LookingEyes } from "@/components/brand/eyes-mark";

// The eye row beside the wordmark. On a night ground (`dark`) the eyes take
// the signal colour and, on the landing page, follow the pointer.
export function Logo({ dark }: { dark?: boolean }) {
  return (
    <span className={dark ? "logo logo-dark" : "logo"}>
      {dark ? (
        <LookingEyes size={30} className="logo-eyes" />
      ) : (
        <EyesMark size={30} className="logo-eyes" />
      )}
      <span>ocra</span>
    </span>
  );
}
