import VaccineCalculator from "./components/VaccineCalculator";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-neutral-200 selection:bg-brand-500/30 selection:text-brand-100" id="app-root">
      <main className="max-w-7xl mx-auto py-6 md:py-12" id="app-main">
        <VaccineCalculator />
      </main>
    </div>
  );
}
