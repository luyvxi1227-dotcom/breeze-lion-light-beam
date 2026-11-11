import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type ComponentType } from "react";
import { Hud } from "@/components/solar/Hud";

if (typeof window !== "undefined") {
  void import("@/components/solar/System");
}

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const [View, setView] = useState<ComponentType | null>(null);
  useEffect(() => {
    let alive = true;
    void import("@/components/solar/System").then((mod) => {
      if (alive) setView(() => mod.System);
    });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main className="stage">
      {View ? <View /> : <div className="void" />}
      <Hud />
    </main>
  );
}
