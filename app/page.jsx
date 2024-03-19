import Image from "next/image";
import InteractiveGrid from "../components/InteractiveGrid";

export default function Home() {
  return (
    <div>
      <div className="container">
        <InteractiveGrid />
      </div>
    </div>
  );
}