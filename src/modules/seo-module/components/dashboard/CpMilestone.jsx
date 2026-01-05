import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CpMilestone = () => {
  // Placeholder - replace with real data/API when ready
  const milestones = [
    { title: "Milestone 1", description: "Achieved 100% SEO coverage", date: "2026-01-01" },
    { title: "Milestone 2", description: "Launched new project", date: "2026-01-03" },
  ];

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>CP Milestone</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {milestones.map((m, index) => (
          <div key={index} className="p-4 border rounded-lg">
            <h4 className="font-semibold">{m.title}</h4>
            <p className="text-sm text-muted-foreground">{m.description}</p>
            <p className="text-xs text-muted-foreground mt-2">{m.date}</p>
          </div>
        ))}
        <p className="text-center text-muted-foreground text-sm">More milestones coming soon...</p>
      </CardContent>
    </Card>
  );
};

export default CpMilestone;