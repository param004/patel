import KagePersonalizedScene from "@/components/KagePersonalizedScene";
import "@/shaders/threeui.css";

export const metadata = {
  title: "Param Pambhar - Full-stack developer",
  description:
    "The Kage landing page running personalised copy: the same authored document, CSS, shaders and assets, with portfolio text swapped in.",
};

export default function KagePersonalized() {
  return (
    <div className="kage-shell">
      <KagePersonalizedScene />
    </div>
  );
}
