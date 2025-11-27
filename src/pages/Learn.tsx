import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, TrendingUp, CreditCard, PiggyBank, GraduationCap, Lightbulb } from "lucide-react";

const Learn = () => {
  const topics = [
    {
      icon: PiggyBank,
      title: "Saving Fundamentals",
      description: "Learn the basics of building an emergency fund and saving habits",
      lessons: 6,
      difficulty: "Beginner",
      color: "text-success",
    },
    {
      icon: Lightbulb,
      title: "Budgeting 101",
      description: "Master the art of creating and sticking to a budget",
      lessons: 8,
      difficulty: "Beginner",
      color: "text-primary",
    },
    {
      icon: CreditCard,
      title: "Understanding Credit",
      description: "Everything you need to know about credit cards and credit scores",
      lessons: 10,
      difficulty: "Intermediate",
      color: "text-secondary",
    },
    {
      icon: TrendingUp,
      title: "Investing Basics",
      description: "Start your investment journey with stocks, bonds, and ETFs",
      lessons: 12,
      difficulty: "Intermediate",
      color: "text-accent",
    },
    {
      icon: GraduationCap,
      title: "Student Finances",
      description: "Navigate student loans, scholarships, and part-time income",
      lessons: 7,
      difficulty: "Beginner",
      color: "text-primary",
    },
    {
      icon: BookOpen,
      title: "Financial Planning",
      description: "Long-term strategies for achieving financial independence",
      lessons: 15,
      difficulty: "Advanced",
      color: "text-secondary",
    },
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-success/20 text-success";
      case "Intermediate":
        return "bg-primary/20 text-primary";
      case "Advanced":
        return "bg-accent/20 text-accent";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout>
      <div className="space-y-8 max-w-6xl mx-auto">
        <div>
          <h1 className="text-4xl font-display font-bold text-foreground mb-2">Learn</h1>
          <p className="text-muted-foreground">Build your financial knowledge step by step</p>
        </div>

        <Card className="border-border/50 bg-gradient-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="text-2xl font-display flex items-center gap-2">
              <GraduationCap className="w-6 h-6" />
              Your Learning Journey
            </CardTitle>
            <CardDescription className="text-primary-foreground/80">
              Complete lessons to earn points and unlock achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-3xl font-display font-bold mb-1">0</div>
                <div className="text-sm text-primary-foreground/80">Lessons Completed</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold mb-1">0</div>
                <div className="text-sm text-primary-foreground/80">Total Points</div>
              </div>
              <div>
                <div className="text-3xl font-display font-bold mb-1">0</div>
                <div className="text-sm text-primary-foreground/80">Achievements</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topics.map((topic, index) => {
            const Icon = topic.icon;
            return (
              <Card
                key={index}
                className="border-border/50 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center ${topic.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <Badge className={getDifficultyColor(topic.difficulty)}>
                      {topic.difficulty}
                    </Badge>
                  </div>
                  <CardTitle className="font-display text-xl">{topic.title}</CardTitle>
                  <CardDescription>{topic.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{topic.lessons} lessons</span>
                    <span className="text-primary font-medium">Start Learning →</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-display">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 p-4 rounded-lg bg-muted/50">
              <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">50/30/20 Rule</p>
                <p className="text-sm text-muted-foreground">
                  Allocate 50% of income to needs, 30% to wants, and 20% to savings and debt repayment.
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 rounded-lg bg-muted/50">
              <Lightbulb className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Emergency Fund First</p>
                <p className="text-sm text-muted-foreground">
                  Before investing, build an emergency fund covering 3-6 months of expenses.
                </p>
              </div>
            </div>
            <div className="flex gap-3 p-4 rounded-lg bg-muted/50">
              <Lightbulb className="w-5 h-5 text-success shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Start Early</p>
                <p className="text-sm text-muted-foreground">
                  The earlier you start saving and investing, the more compound interest works in your favor.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Learn;
