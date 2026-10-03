import { redirect } from "next/navigation";

/**
 * The Kage experience is the site homepage now, so this path only exists to
 * keep the earlier bookmark working.
 */
export default function KagePage() {
  redirect("/");
}
