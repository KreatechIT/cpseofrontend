import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CpMilestone = ({ overview }) => {
  if (!overview || !overview.projects) {
    return <Card className="shadow-none"><CardContent>No data</CardContent></Card>;
  }

  let totalImpressions = 0;
  let totalClicks = 0;
  let totalFormInquiries = 0;
  let totalJoins = 0;

  overview.projects.forEach((project) => {
    project.data.forEach((row) => {
      totalImpressions += row.impressions || 0;
      totalClicks += row.clicks || 0;
      totalFormInquiries += (row.inquiry_download || 0) + (row.inquiry_whatsapp || 0);
      totalJoins += row.join || 0;
    });
  });

  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle className="text-3xl">CP Milestone</CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="text-start mb-4 flex justify-between">
          <p className="text-2xl ">Impressions</p>
          <p className="font-bold text-green-600">{totalImpressions.toLocaleString()}</p>
        </div>
        <div className="text-start mb-4 flex justify-between">
          <p className="text-2xl ">Clicks</p>
          <p className="font-bold text-green-600">{totalClicks.toLocaleString()}</p>
        </div>
        <div className="text-start mb-4 flex justify-between">
          <p className=" text-2xl ">Form Inquiries</p>
          <p className="font-bold text-green-600">{totalFormInquiries.toLocaleString()}</p>
        </div>
        <div className="text-start mb-4 flex justify-between">
          <p className=" text-2xl ">Join / Signups</p>
          <p className="font-bold text-green-600">{totalJoins.toLocaleString()}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CpMilestone;