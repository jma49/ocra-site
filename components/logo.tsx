import { SmallSpider } from "@/components/brand/spider-mark";

export function Logo({ dark }: { dark?: boolean }) {
  return (
    <span className="logo">
      <SmallSpider size={28} dark={dark} />
      <span>ocra</span>
    </span>
  );
}
