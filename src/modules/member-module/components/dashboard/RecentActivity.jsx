import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Clock3, User } from "lucide-react";

const activities = [
  {
    date: "Today",
    logs: [
      { name: "Jamie Smith", action: "is active now", time: "16:05" },
      {
        name: "Alex Johnson",
        action: "logged in 2 minutes ago",
        time: "13:05",
      },
      {
        name: "Emily Chen",
        action: "uploaded a document",
        time: "12:45",
      },
      {
        name: "Marcus Lee",
        action: "updated his profile",
        time: "11:20",
      },
      {
        name: "Natalie Brown",
        action: "joined the project board",
        time: "09:55",
      },
    ],
  },
  {
    date: "Yesterday",
    logs: [
      {
        name: "Taylor Green",
        action: "reviewed recent transactions",
        time: "21:05",
      },
      {
        name: "Wilson Baptista",
        action: "transferred funds",
        time: "09:05",
      },
    ],
  },
];

const RecentActivity = () => {
  return (
    <Card className="bg-card w-full rounded-xl border shadow-none">
      <CardHeader className="m-0 pb-0">
        <h2 className="text-lg font-semibold">Recent Activities</h2>
      </CardHeader>

      <CardContent className="-mt-6 space-y-6 pt-4 text-sm">
        {activities.map((activity, index) => (
          <div key={index}>
            <h3 className="text-muted-foreground mb-2 text-sm font-medium">
              {activity.date}
            </h3>

            <div className="text-muted-foreground space-y-4">
              {activity.logs.map((log, i) => (
                <div key={i} className="relative flex items-start gap-4">
                  <div className="relative flex flex-col items-center">
                    <div className="bg-primary/25 relative z-10 flex h-10 w-10 items-center justify-center rounded-full">
                      <User size={20} />
                    </div>
                  </div>

                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="text-foreground font-semibold">
                        {log.name}
                      </span>{" "}
                      {log.action}
                    </p>
                    <div className="mt-1 flex items-center text-xs">
                      <Clock3 size={14} className="mr-1.5" />
                      {log.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
