import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0A0A0A] text-white">
      <main className="flex-1 flex items-center justify-center text-center p-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-500 py-2">
            Craft Your Digital Presence
          </h1>
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-xl mx-auto">
            Build stunning, high-performance websites with an intuitive, AI-powered editor. Go from idea to launch faster than ever before.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" className="bg-white text-black hover:bg-gray-200 rounded-full transition-all duration-300">
              Get Started
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full border-gray-700 hover:bg-gray-900 hover:text-white transition-all duration-300">
              Learn More
            </Button>
          </div>
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Index;