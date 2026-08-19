"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import { MadeWithDyad } from "@/components/made-with-dyad";

const Index = () => {
  return (
    <div className="flex flex-col min-h-dvh bg-white">
      <Header />
      <main className="flex-1">
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <h1 className="text-4xl font-bold tracking-tighter text-gray-900 sm:text-5xl md:text-6xl">
                Build Your Next Idea Faster
              </h1>
              <p className="text-lg text-gray-600 md:text-xl">
                This is a beautiful and responsive landing page template to get
                you started. Just edit this text and you're ready to go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg">Get Started Now</Button>
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex items-center justify-center p-4">
        <MadeWithDyad />
      </footer>
    </div>
  );
};

export default Index;