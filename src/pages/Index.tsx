import { Button } from "@/components/ui/button";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex items-center justify-center text-center p-4">
        <div className="relative max-w-4xl mx-auto">
          {/* Grid Overlay */}
          <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-navy font-heading tracking-tight">
            Modern Governance, Simplified
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            A modern government SaaS dashboard featuring a soft light-gray canvas, white cards, and a dark navy sidebar for a clean, professional user experience.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" className="bg-primary-blue text-white hover:bg-blue-700 rounded-xl px-8 py-3 text-base font-semibold">
              Get Started
            </Button>
            <Button size="lg" variant="outline" className="rounded-xl border-gray-300 hover:bg-gray-100 px-8 py-3 text-base font-semibold text-navy">
              View Demo
            </Button>
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;