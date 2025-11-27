import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Budget = () => {
  const navigate = useNavigate();
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  const categories = [
    { value: "tuition", label: "Tuition" },
    { value: "books", label: "Books" },
    { value: "food", label: "Food" },
    { value: "travel", label: "Travel" },
    { value: "leisure", label: "Leisure" },
    { value: "rent", label: "Rent" },
    { value: "utilities", label: "Utilities" },
    { value: "other", label: "Other" },
  ];

  useEffect(() => {
    checkAuth();
    loadBudgets();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadBudgets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("budgets")
        .select("*")
        .eq("user_id", user.id)
        .eq("period", "monthly")
        .order("category");

      if (error) throw error;

      // Get expenses for each budget
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const budgetsWithSpending = await Promise.all(
        (data || []).map(async (budget) => {
          const { data: expenses } = await supabase
            .from("expenses")
            .select("amount")
            .eq("user_id", user.id)
            .eq("category", budget.category)
            .gte("date", startOfMonth.toISOString());

          const spent = expenses?.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0) || 0;

          return {
            ...budget,
            spent,
            percentage: (spent / parseFloat(budget.limit_amount.toString())) * 100,
          };
        })
      );

      setBudgets(budgetsWithSpending);
    } catch (error: any) {
      toast.error("Failed to load budgets");
    } finally {
      setLoading(false);
    }
  };

  const handleAddBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("budgets").insert([{
        user_id: user.id,
        category: category as any,
        limit_amount: parseFloat(amount),
        period: "monthly",
      }]);

      if (error) throw error;

      toast.success("Budget added successfully!");
      setShowForm(false);
      setCategory("");
      setAmount("");
      loadBudgets();
    } catch (error: any) {
      toast.error(error.message || "Failed to add budget");
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      const { error } = await supabase.from("budgets").delete().eq("id", id);

      if (error) throw error;

      toast.success("Budget deleted");
      loadBudgets();
    } catch (error: any) {
      toast.error("Failed to delete budget");
    }
  };

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
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">Budget</h1>
            <p className="text-muted-foreground">Set and track your spending limits</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            Add Budget
          </Button>
        </div>

        {showForm && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display">New Budget</CardTitle>
              <CardDescription>Set a monthly spending limit for a category</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddBudget} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Monthly Limit (₹)</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="500.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Save Budget</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {budgets.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">
                <Plus className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No budgets yet</p>
                <p className="text-sm">Create your first budget to start tracking spending</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => (
              <Card key={budget.id} className="border-border/50 hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="font-display capitalize">{budget.category}</CardTitle>
                      <CardDescription>
                        ₹{budget.spent.toFixed(2)} of ₹{parseFloat(budget.limit_amount).toFixed(2)}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteBudget(budget.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Progress value={Math.min(budget.percentage, 100)} className="h-3" />
                  <p className="text-sm text-muted-foreground mt-2">
                    {budget.percentage.toFixed(0)}% used
                    {budget.percentage > 100 && (
                      <span className="text-destructive font-medium ml-2">Over budget!</span>
                    )}
                    {budget.percentage > 80 && budget.percentage <= 100 && (
                      <span className="text-secondary font-medium ml-2">Almost at limit</span>
                    )}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Budget;
