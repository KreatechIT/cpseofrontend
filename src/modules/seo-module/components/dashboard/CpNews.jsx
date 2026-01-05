import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const CpNews = ({ news }) => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>CP News</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[300px]">
        <CardContent className="space-y-4">
          {news.map((item, index) => (
            <div key={index} className="p-4 border rounded-lg">
              <h4 className="font-semibold">{item.title}</h4>
              <p className="text-sm text-muted-foreground mt-1">{item.summary}</p>
              <a href={item.source_url} className="text-sm text-blue-600 hover:underline mt-2 block">
                Read more
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Published: {format(new Date(item.published_at), "dd MMM yyyy")}
              </p>
            </div>
          ))}
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default CpNews;