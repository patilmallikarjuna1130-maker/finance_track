import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Plus, Target, Trash2, IndianRupee } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";

const Savings = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [selectedGoal, setSelectedGoal] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  useEffect(() => {
    checkAuth();
    loadGoals();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const loadGoals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const goalsWithProgress = (data || []).map((goal) => ({
        ...goal,
        percentage: (parseFloat(goal.current_amount.toString()) / parseFloat(goal.target_amount.toString())) * 100,
      }));

      setGoals(goalsWithProgress);
    } catch (error: any) {
      toast.error("Failed to load savings goals");
    } finally {
      setLoading(false);
    }
  };

  const handleAddGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("savings_goals").insert({
        user_id: user.id,
        title,
        target_amount: parseFloat(targetAmount),
        target_date: targetDate || null,
        current_amount: 0,
      });

      if (error) throw error;

      toast.success("Savings goal created!");
      setShowForm(false);
      setTitle("");
      setTargetAmount("");
      setTargetDate("");
      loadGoals();
    } catch (error: any) {
      toast.error(error.message || "Failed to create goal");
    }
  };

  const handleDeposit = async (goalId: string) => {
    try {
      const goal = goals.find((g) => g.id === goalId);
      if (!goal) return;

      const newAmount = parseFloat(goal.current_amount.toString()) + parseFloat(depositAmount);

      const { error } = await supabase
        .from("savings_goals")
        .update({
          current_amount: newAmount,
          completed: newAmount >= parseFloat(goal.target_amount.toString()),
        })
        .eq("id", goalId);

      if (error) throw error;

      toast.success(`Added ₹${depositAmount} to ${goal.title}!`);
      setSelectedGoal(null);
      setDepositAmount("");
      loadGoals();
    } catch (error: any) {
      toast.error("Failed to add deposit");
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      const { error } = await supabase.from("savings_goals").delete().eq("id", id);

      if (error) throw error;

      toast.success("Goal deleted");
      loadGoals();
    } catch (error: any) {
      toast.error("Failed to delete goal");
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
            <h1 className="text-4xl font-display font-bold text-foreground mb-2">Savings Goals</h1>
            <p className="text-muted-foreground">Track your progress towards financial targets</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="shadow-glow">
            <Plus className="w-4 h-4 mr-2" />
            New Goal
          </Button>
        </div>

        {showForm && (
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-display">Create Savings Goal</CardTitle>
              <CardDescription>Set a target and start saving</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAddGoal} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Name</Label>
                  <Input
                    id="title"
                    placeholder="New laptop, Trip to Europe, Emergency fund..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Target Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="1000.00"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Target Date (optional)</Label>
                    <Input
                      id="date"
                      type="date"
                      value={targetDate}
                      onChange={(e) => setTargetDate(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit">Create Goal</Button>
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {goals.length === 0 ? (
          <Card className="border-border/50">
            <CardContent className="text-center py-12">
              <div className="text-muted-foreground">
                <Target className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No savings goals yet</p>
                <p className="text-sm">Create your first goal and start saving!</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {goals.map((goal) => (
              <Card key={goal.id} className={`border-border/50 hover:shadow-lg transition-shadow ${goal.completed ? 'bg-success/5 border-success/30' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="font-display flex items-center gap-2">
                        {goal.title}
                        {goal.completed && <span className="text-sm text-success">✓ Completed!</span>}
                      </CardTitle>
                      <CardDescription>
                        ₹{parseFloat(goal.current_amount).toFixed(2)} of ₹{parseFloat(goal.target_amount).toFixed(2)}
                        {goal.target_date && (
                          <span className="block mt-1">
                            Target: {format(new Date(goal.target_date), "MMM dd, yyyy")}
                          </span>
                        )}
                      </CardDescription>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteGoal(goal.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Progress value={Math.min(goal.percentage, 100)} className="h-3" />
                    <p className="text-sm text-muted-foreground mt-2">
                      {goal.percentage.toFixed(0)}% achieved
                    </p>
                  </div>
                  
                  {selectedGoal === goal.id ? (
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="Amount"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                      <Button
                        onClick={() => handleDeposit(goal.id)}
                        disabled={!depositAmount || parseFloat(depositAmount) <= 0}
                      >
                        Add
                      </Button>
                      <Button variant="outline" onClick={() => setSelectedGoal(null)}>
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <Button
                      className="w-full"
                      variant="outline"
                      onClick={() => setSelectedGoal(goal.id)}
                      disabled={goal.completed}
                    >
                      <IndianRupee className="w-4 h-4 mr-2" />
                      Add Money
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Savings;
