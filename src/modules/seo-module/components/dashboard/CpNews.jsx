import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const CpNews = ({ news }) => {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-3xl">CP News</CardTitle>
      </CardHeader>
      <ScrollArea className="h-[300px]">
        <CardContent className="space-y-4">
          {/* {news.map((item, index) => (
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
          ))} */}
        <div className="text-start mb-4">
          <a className="text-1xl  hover:underline cursor-pointer">ChatGPT Outage Affects APIs And File Uploads</a>
        </div>
        <div className="text-start mb-4">
          <a className="text-1xl  hover:underline cursor-pointer">SEO Pulse: AI Shopping, GPT-5.1 & EU Pressure On Google</a>
        </div>
        <div className="text-start mb-4">
          <a className="text-1xl  hover:underline cursor-pointer">Is Google About To Go Full AI Mode?</a>
        </div>
        </CardContent>
      </ScrollArea>
    </Card>
  );
};

export default CpNews;