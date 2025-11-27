import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, TrendingDown, TrendingUp, Wallet, Target } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AddExpenseDialog from "@/components/AddExpenseDialog";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [monthlyBudget, setMonthlyBudget] = useState(0);
  const [savingsProgress, setSavingsProgress] = useState(0);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [recentExpenses, setRecentExpenses] = useState<any[]>([]);

  useEffect(() => {
    checkAuth();
    loadDashboardData();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadDashboardData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get current month expenses
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { data: expenses } = await supabase
        .from("expenses")
        .select("*")
        .eq("user_id", user.id)
        .gte("date", startOfMonth.toISOString())
        .order("date", { ascending: false });

      const total = expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0) || 0;
      setTotalExpenses(total);
      setRecentExpenses(expenses?.slice(0, 5) || []);

      // Get total budget
      const { data: budgets } = await supabase
        .from("budgets")
        .select("limit_amount")
        .eq("user_id", user.id)
        .eq("period", "monthly");

      const totalBudget = budgets?.reduce((sum, b) => sum + parseFloat(b.limit_amount.toString()), 0) || 0;
      setMonthlyBudget(totalBudget);

      // Get savings progress
      const { data: goals } = await supabase
        .from("savings_goals")
        .select("current_amount, target_amount")
        .eq("user_id", user.id)
        .eq("completed", false);

      const progress = goals?.reduce((sum, g) => {
        const percent = (parseFloat(g.current_amount.toString()) / parseFloat(g.target_amount.toString())) * 100;
        return sum + percent;
      }, 0) || 0;

      setSavingsProgress(goals && goals.length > 0 ? progress / goals.length : 0);
    } catch (error: any) {
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      title: "Monthly Spending",
      value: `₹${totalExpenses.toFixed(2)}`,
      change: monthlyBudget > 0 ? `${((totalExpenses / monthlyBudget) * 100).toFixed(0)}% of budget` : "No budget set",
      icon: TrendingDown,
      color: totalExpenses > monthlyBudget ? "text-destructive" : "text-primary",
    },
    {
      title: "Total Budget",
      value: `₹${monthlyBudget.toFixed(2)}`,
      change: monthlyBudget > totalExpenses ? `₹${(monthlyBudget - totalExpenses).toFixed(2)} remaining` : "Over budget",
      icon: Wallet,
      color: "text-secondary",
    },
    {
      title: "Savings Progress",
      value: `${savingsProgress.toFixed(0)}%`,
      change: "Average across goals",
      icon: Target,
      color: "text-success",
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8 max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Track your financial journey</p>
          </div>
          <Button className="shadow-glow" onClick={() => setShowAddExpense(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-border/50 hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-display font-bold text-foreground mb-1">
                    {stat.value}
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display">Recent Expenses</CardTitle>
              <CardDescription>Your latest transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {recentExpenses.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <TrendingDown className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No expenses yet. Start tracking!</p>
                  <Button variant="outline" className="mt-4" onClick={() => setShowAddExpense(true)}>
                    Add Your First Expense
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentExpenses.map((expense) => (
                    <div key={expense.id} className="flex justify-between items-center p-3 border border-border/50 rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">
                          {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(expense.date).toLocaleDateString()}
                          {expense.description && ` • ${expense.description}`}
                        </p>
                      </div>
                      <p className="font-bold text-lg text-foreground">₹{parseFloat(expense.amount).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display">Quick Actions</CardTitle>
              <CardDescription>Manage your finances</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/budget")}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Set Budget Goals
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/savings")}
              >
                <Target className="w-4 h-4 mr-2" />
                Create Savings Goal
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate("/learn")}
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Learn Financial Tips
              </Button>
            </CardContent>
          </Card>
        </div>

        <AddExpenseDialog
          open={showAddExpense}
          onOpenChange={setShowAddExpense}
          onSuccess={loadDashboardData}
        />
      </div>
    </Layout>
  );
};

export default Dashboard;
