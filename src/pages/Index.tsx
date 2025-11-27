import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, TrendingUp, Target, Wallet, BookOpen, Award, ArrowRight } from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Wallet,
      title: "Smart Budgeting",
      description: "Set budgets per category and track spending in real-time",
    },
    {
      icon: Target,
      title: "Savings Goals",
      description: "Create goals and watch your progress grow",
    },
    {
      icon: TrendingUp,
      title: "Expense Tracking",
      description: "Automatically categorize and visualize your expenses",
    },
    {
      icon: BookOpen,
      title: "Financial Education",
      description: "Learn through interactive lessons and quizzes",
    },
    {
      icon: Award,
      title: "Gamification",
      description: "Earn points and badges for building good habits",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-accent/5">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-primary rounded-3xl mb-8 shadow-glow animate-pulse">
            <Sparkles className="w-10 h-10 text-primary-foreground" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-display font-bold text-foreground mb-6 leading-tight">
            Master Your Money,{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Master Your Future
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            The smart financial literacy platform designed for students. Track expenses, create budgets, 
            achieve savings goals, and learn through gamified lessons.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth">
              <Button size="lg" className="text-lg px-8 shadow-glow hover:shadow-accent transition-all">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to="/learn">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Learning
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-foreground mb-4">
              Everything You Need to Build Financial Confidence
            </h2>
            <p className="text-xl text-muted-foreground">
              Powerful tools designed specifically for student life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="border-border/50 hover:shadow-lg transition-all hover:-translate-y-1"
                >
                  <CardContent className="pt-6">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 shadow-glow">
                      <Icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                    <h3 className="text-xl font-display font-bold text-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="max-w-4xl mx-auto border-border/50 bg-gradient-primary text-primary-foreground shadow-xl">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-display font-bold mb-4">
              Ready to Take Control of Your Finances?
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already building better financial habits with FinWise
            </p>
            <Link to="/auth">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 shadow-accent"
              >
                Start Your Journey Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50">
        <div className="text-center text-muted-foreground">
          <p>© 2024 FinWise. Empowering students with financial literacy.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
