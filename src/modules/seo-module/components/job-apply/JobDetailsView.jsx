import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Briefcase,
  Building2,
  ClipboardList,
  DollarSign,
  FileTextIcon,
  MapPin,
} from "lucide-react";

export const decodeHtml = (str) => {
  const txt = document.createElement("textarea");
  txt.innerHTML = str;
  txt.innerHTML = txt.value; // second decode
  return txt.value;
};

const JobDetailsView = ({ jobDetail, setIsApplying }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-primary">
          {jobDetail.job_title}
        </h1>
        <p className=" text-sm mt-2">Position: {jobDetail.position}</p>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <p className="flex items-center gap-2">
          <Building2 className="size-4 text-muted-foreground" />
          <span>Company: {jobDetail.company}</span>
        </p>
        <p className="flex items-center gap-2">
          <MapPin className="size-4 text-muted-foreground" />
          <span>Location: {jobDetail.location}</span>
        </p>
        <p className="flex items-center gap-2">
          <DollarSign className="size-4 text-muted-foreground" />
          <span>Salary: {jobDetail.salary}</span>
        </p>
        <p className="flex items-center gap-2">
          <Briefcase className="size-4 text-muted-foreground" />
          <span>Job Type: {jobDetail.job_type}</span>
        </p>
      </div>

      {/* Description */}
      <div>
        <h2 className="font-medium flex items-end gap-2 text-muted-foreground mt-6">
          <FileTextIcon className="size-4.5" />
          Job Description
        </h2>
        <Separator className="my-2" />
        <div
          className="ProseMirror"
          dangerouslySetInnerHTML={{
            __html: decodeHtml(jobDetail.job_description),
          }}
        />
      </div>

      {/* Requirements */}
      <div>
        <h2 className="font-medium flex items-end gap-2 text-muted-foreground mt-6">
          <ClipboardList className="size-4.5" />
          Job Requirements
        </h2>
        <Separator className="my-2" />
        <div
          className="ProseMirror"
          dangerouslySetInnerHTML={{
            __html: decodeHtml(jobDetail.job_requirement),
          }}
        />
      </div>

      <Button onClick={() => setIsApplying(true)}>Apply</Button>
    </div>
  );
};

export default JobDetailsView;
