import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";

const CpNews = ({ news }) => {
  return (
    <Card className="shadow-none  bg-[#FBFCFF1A] hover:bg-[#3872FA1A]">
      <CardHeader>
        <CardTitle className="text-3xl flex items-center gap-2 text-[#323232]"> 
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="21" viewBox="0 0 22 21" fill="none">
            <path d="M4.5 20.25H15.75C16.9435 20.25 18.0881 19.7759 18.932 18.932C19.7759 18.0881 20.25 16.9435 20.25 15.75V10.2937C20.25 9.99538 20.1315 9.70923 19.9205 9.49825C19.7095 9.28728 19.4234 9.16875 19.125 9.16875C18.8266 9.16875 18.5405 9.28728 18.3295 9.49825C18.1185 9.70923 18 9.99538 18 10.2937V15.75C18 16.3467 17.7629 16.919 17.341 17.341C16.919 17.7629 16.3467 18 15.75 18H4.5C3.90326 18 3.33097 17.7629 2.90901 17.341C2.48705 16.919 2.25 16.3467 2.25 15.75V4.5C2.25 3.90326 2.48705 3.33097 2.90901 2.90901C3.33097 2.48705 3.90326 2.25 4.5 2.25H10.125C10.4234 2.25 10.7095 2.13147 10.9205 1.92049C11.1315 1.70952 11.25 1.42337 11.25 1.125C11.25 0.826631 11.1315 0.540483 10.9205 0.329505C10.7095 0.118526 10.4234 0 10.125 0H4.5C3.30653 0 2.16193 0.474106 1.31802 1.31802C0.474106 2.16193 0 3.30653 0 4.5V15.75C0 16.9435 0.474106 18.0881 1.31802 18.932C2.16193 19.7759 3.30653 20.25 4.5 20.25Z" fill="#3872FA"/>
            <path d="M19.451 1.45146L10.1247 10.789L6.42347 7.07646C6.21163 6.86462 5.92431 6.74561 5.62472 6.74561C5.32513 6.74561 5.03781 6.86462 4.82597 7.07646C4.61413 7.2883 4.49512 7.57562 4.49512 7.87521C4.49512 8.02355 4.52434 8.17044 4.5811 8.30749C4.63787 8.44454 4.72108 8.56907 4.82597 8.67396L9.32597 13.174C9.43055 13.2794 9.55498 13.3631 9.69207 13.4202C9.82916 13.4773 9.97621 13.5067 10.1247 13.5067C10.2732 13.5067 10.4203 13.4773 10.5574 13.4202C10.6945 13.3631 10.8189 13.2794 10.9235 13.174L21.0485 3.04896C21.2603 2.83712 21.3793 2.5498 21.3793 2.25021C21.3793 1.95062 21.2603 1.6633 21.0485 1.45146C20.8366 1.23962 20.5493 1.12061 20.2497 1.12061C19.9501 1.12061 19.6628 1.23962 19.451 1.45146Z" fill="#3872FA"/>
          </svg>
          CP News
        </CardTitle>
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