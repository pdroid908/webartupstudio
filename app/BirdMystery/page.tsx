// app/page.tsx
import GameContainer from "@/app/src/components/Game/GameContainer";
export default function Home() {
  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#333",
      }}
    >
      <GameContainer />
    </main>
  );
}
