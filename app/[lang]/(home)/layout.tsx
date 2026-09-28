import type { ReactNode } from "react";
import { Shell } from "@/components/landing/shell";

export default async function Layout({
  params,
  children,
}: {
  params: Promise<{ lang: string }>;
  children: ReactNode;
}) {
  const { lang } = await params;
  return <Shell locale={lang}>{children}</Shell>;
}
