import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock3, User } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const CpUpdates = ({ updates }) => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-3xl">CP Updates</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[300px]">
        <CardContent className="space-y-4">
          {/* {updates.map((update, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="bg-primary/25 flex h-10 w-10 items-center justify-center rounded-full">
                  <User size={20} />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm">
                  <span className="font-semibold">{update.user_name}</span> {update.action}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  <Clock3 size={14} className="mr-1 inline" />
                  {format(new Date(update.created), "dd MMM yyyy HH:mm")}
                </p>
                <p className="text-sm mt-1">{update.detail}</p>
              </div>
            </div>
          ))} */}
        <div className="text-start mb-4 flex justify-between">
          <p className="text-1xl ">Technical SEO Fix <br /> <i>By PIC 1</i></p>
          <p className="text-green-600"> Completed</p>
        </div>
        <div className="text-start mb-4 flex justify-between">
          <p className="text-1xl ">20 Quality Backlinks  <br /> <i>By PIC 1</i></p>
          <p className="text-red-600">  Pending</p>
        </div>
        <div className="text-start mb-4 flex justify-between">
          <p className="text-1xl ">20 Quality Backlinks <br /> <i>By PIC 1</i></p>
          <p className="text-green-600"> Completed</p>
        </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default CpUpdates;