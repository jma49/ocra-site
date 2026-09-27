import { notFound } from "next/navigation";

// Unknown paths under a language render that language's 404 page instead of
// Next's bare default.
export default function Unknown() {
  notFound();
}
