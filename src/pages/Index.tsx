import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BarChart, CheckCircle, Zap } from "lucide-react";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { motion } from "framer-motion";

const Index = () => {
  const featureCards = [
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Streamlined Operations",
      description: "Automate workflows and reduce manual data entry with our intelligent platform.",
    },
    {
      icon: <BarChart className="h-8 w-8 text-primary" />,
      title: "Data-Driven Insights",
      description: "Gain actionable insights from your data with our advanced analytics and reporting tools.",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      title: "Compliance & Security",
      description: "Ensure compliance with industry standards and protect your data with enterprise-grade security.",
    },
  ];

  return (
    <div className="w-full bg-background text-foreground flex flex-col items-center overflow-x-hidden">
      {/* Hero Section */}
      <main className="w-full min-h-screen flex flex-col items-center justify-center text-center p-4 relative">
        {/* Grid Overlay */}
        <div className="absolute inset-0 h-full w-full bg-transparent bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Floating Elements */}
        <motion.div
          className="absolute top-[10%] left-[10%] h-16 w-16 bg-primary/10 rounded-2xl animate-float"
          style={{ animationDelay: '0s' }}
        />
        <motion.div
          className="absolute bottom-[15%] right-[15%] h-24 w-24 bg-secondary rounded-full animate-float"
          style={{ animationDelay: '1s' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto z-10"
        >
          <h1 className="text-5xl md:text-7xl font-heading font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-foreground to-foreground/70 py-2">
            Modern Governance,
            <br />
            <span className="text-primary">Simplified.</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            The all-in-one platform for public sector efficiency. Streamline services, analyze data, and drive impactful results for your community.
          </p>
          <div className="mt-10 flex justify-center gap-4">
            <Button size="lg" className="rounded-full text-lg px-8 py-6">
              Request a Demo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="rounded-full text-lg px-8 py-6">
              Contact Sales
            </Button>
          </div>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="w-full py-20 md:py-32 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-heading font-bold text-center mb-16">
            A Platform Built for Progress
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featureCards.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full text-center shadow-lg hover:shadow-xl transition-shadow duration-300 border-transparent hover:border-primary rounded-2xl">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-xl w-fit mb-4">
                      {feature.icon}
                    </div>
                    <CardTitle className="text-2xl font-heading">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-20 md:py-32">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-4">
              <p className="text-6xl font-bold text-primary">45%</p>
              <p className="mt-2 text-lg text-muted-foreground">Increase in Efficiency</p>
            </div>
            <div className="p-4">
              <p className="text-6xl font-bold text-primary">30M+</p>
              <p className="mt-2 text-lg text-muted-foreground">Citizens Served</p>
            </div>
            <div className="p-4">
              <p className="text-6xl font-bold text-primary">$12M</p>
              <p className="mt-2 text-lg text-muted-foreground">Saved in Operational Costs</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-8 bg-secondary">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Modern Governance Inc. All rights reserved.</p>
          <MadeWithDyad />
        </div>
      </footer>
    </div>
  );
};

export default Index;