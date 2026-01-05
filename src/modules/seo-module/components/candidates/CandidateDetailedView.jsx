import { DocsIcon } from "@/components/icons/HrIcons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import usePermission from "@/hooks/usePermission";
import { cn } from "@/utils/cn";
import { getCandidateStatusColor } from "@/utils/getStatusColor";
import { format } from "date-fns";
import { CircleAlertIcon, CircleCheckIcon, UserIcon } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  changeCandidateStatus,
  getCandidateAuditLog,
  removeCandidateFromTalentPool,
} from "../../services/candidatesService";
import AddReferrer from "./AddCandidateReferrer";
import { useEffect, useState } from "react";

import { Separator } from "@/components/ui/separator";
import { setDialogData } from "@/store/reducers/dialogSlice";
import CandidateDISCResult from "./CandidateDiscResult";
import { addBaseURL } from "@/utils/addBaseUrl";
import CandidateRemarkForm from "./CandidateRemarkForm";

const CandidateDetailedView = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { hasPermission } = usePermission();
  const candidate = useSelector((state) => state.sheet.props);
  const [auditLog, setAuditLog] = useState([]);

  const [isAddingReferrer, setIsAddingReferrer] = useState(false);
  const [remarkType, setRemarkType] = useState("");

  useEffect(() => {
    getCandidateAuditLog(user.organisation_id, candidate.id).then((data) =>
      setAuditLog(data)
    );
  }, [candidate, user.organisation_id]);

  const handleChangeStatus = () => {
    let newStatus;
    if (candidate.status === "New") {
      newStatus = 2;
    } else if (candidate.status === "Scheduled") {
      newStatus = 3;
    } else if (candidate.status === "Interviewed") {
      newStatus = 4;
    } else if (candidate.status === "Offered") {
      newStatus = 5;
    }

    changeCandidateStatus(
      user.organisation_id,
      candidate.id,
      { status: newStatus },
      dispatch
    );
  };

  const handleChangeStatusToPrevious = () => {
    let newStatus;
    if (candidate.status === "Scheduled") {
      newStatus = 1;
    } else if (candidate.status === "Interviewed") {
      newStatus = 2;
    } else if (candidate.status === "Offered") {
      newStatus = 3;
    } else if (
      candidate.status === "Hired" ||
      candidate.status === "Rejected"
    ) {
      newStatus = 4;
    }

    changeCandidateStatus(
      user.organisation_id,
      candidate.id,
      { status: newStatus },
      dispatch
    );
  };

  const handleMoveBackToStageNew = () => {
    changeCandidateStatus(
      user.organisation_id,
      candidate.id,
      { status: "1" },
      dispatch
    );
  };

  const handleRemoveFromTalentPool = () => {
    removeCandidateFromTalentPool(user.organisation_id, candidate.id, dispatch);
  };

  let candidateStatus = candidate.status;

  if (candidate.is_blacklisted) {
    candidateStatus = "Blacklisted";
  } else if (candidate.is_whitelisted) {
    candidateStatus = "Whitelisted";
  }

  return (
    <div className="px-4 -mt-4">
      <div className="flex items-start gap-4">
        <Avatar className="h-36 w-36 rounded-lg border">
          <AvatarImage
            src={addBaseURL(candidate.image || "")}
            alt={candidate.full_name}
            className="h-full w-full rounded-lg object-cover border"
          />
          <AvatarFallback className="dark:bg-white/10 rounded-lg">
            <UserIcon size={40} className="opacity-60" aria-hidden="true" />
          </AvatarFallback>
        </Avatar>

        <Card className="w-full bg-white/75 shadow-none dark:bg-card">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Full Name</p>
                <h2 className="font-medium text-sm mt-0.5">
                  {candidate.full_name}
                </h2>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Applied Role</p>
                <p className="font-medium text-sm mt-0.5">
                  {candidate.job_title}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Applied Date</p>
                <p className="font-medium text-sm mt-0.5">
                  {format(candidate.applied_date, "PP")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <h2 className="font-medium text-sm mt-0.5">
                  {candidate.email}
                </h2>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Preferred Start Date
                </p>
                <p className="font-medium text-sm mt-0.5">
                  {format(candidate.preferred_start_date, "PP")}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <p className="font-medium text-sm mt-0.5">
                  <Badge
                    className={`text-xs font-medium px-3 rounded-full ${getCandidateStatusColor(
                      candidateStatus
                    )}`}
                    variant="outline"
                  >
                    {candidateStatus}
                  </Badge>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="mt-4">
        <TabsList className="border-b w-full flex justify-between">
          <div className="flex gap-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="pipeline">Hiring Pipeline</TabsTrigger>
            <TabsTrigger value="p-test">Personality Test</TabsTrigger>
          </div>
          <div className="ms-auto">
            <TabsTrigger value="audit-log">Audit Log</TabsTrigger>
          </div>
        </TabsList>

        <TabsContent value="profile">
          <Card className="w-full bg-white/75 shadow-none dark:bg-card mt-4">
            <CardHeader>Personal Information</CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 -mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <h2 className="font-medium text-sm mt-0.5">
                    {candidate.full_name}
                  </h2>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Chinese Name</p>
                  <p className="font-medium text-sm mt-0.5">
                    {candidate.chinese_name || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Gender</p>
                  <p className="font-medium text-sm mt-0.5">
                    {candidate.gender || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Date of Birth</p>
                  <p className="font-medium text-sm mt-0.5">
                    {format(candidate.birth_date, "PP")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Marital Status
                  </p>
                  <p className="font-medium text-sm mt-0.5">
                    {candidate.marital_status}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">ID Number</p>
                  <p className="font-medium text-sm mt-0.5">
                    {candidate.id_number}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Religion</p>
                  <p className="font-medium text-sm mt-0.5">
                    {candidate.religion}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    Contact Number
                  </p>
                  <p className="font-medium text-sm mt-0.5">
                    {candidate.contact_number}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-full bg-white/75 shadow-none dark:bg-card mt-4">
            <CardHeader>Address Information</CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-[50%_25%_25%] gap-4 -mt-4">
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <h2 className="font-medium text-sm mt-0.5">
                    {candidate.address}
                  </h2>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Nationality</p>
                  <p className="font-medium text-sm mt-0.5">
                    {candidate.nationality}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Race</p>
                  <p className="font-medium text-sm mt-0.5">{candidate.race}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education Experience */}
          {candidate.education_experiences?.length > 0 && (
            <Card className="w-full bg-white/75 shadow-none dark:bg-card mt-4">
              <CardHeader>Education Background</CardHeader>
              <CardContent className="-mt-4 space-y-4">
                {candidate.education_experiences.map((edu) => (
                  <div
                    key={edu.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Institution
                      </p>
                      <p className="font-medium text-sm mt-0.5">
                        {edu.institution}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Qualification
                      </p>
                      <p className="font-medium text-sm mt-0.5">
                        {edu.qualification}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Field of Study
                      </p>
                      <p className="font-medium text-sm mt-0.5">
                        {edu.field_of_study}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Result</p>
                      <p className="font-medium text-sm mt-0.5">{edu.result}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Start Date
                      </p>
                      <p className="font-medium text-sm mt-0.5">
                        {format(edu.start_date, "PP")}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">End Date</p>
                      <p className="font-medium text-sm mt-0.5">
                        {edu.end_date ? format(edu.end_date, "PP") : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium text-sm mt-0.5">
                        {edu.location || "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Work Experience */}
          {candidate.work_experiences?.length > 0 && (
            <Card className="w-full bg-white/75 shadow-none dark:bg-card mt-4">
              <CardHeader>Work Experience</CardHeader>
              <CardContent className="-mt-4 space-y-4">
                {candidate.work_experiences.map((work) => (
                  <div
                    key={work.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground">Company</p>
                      <p className="font-medium text-sm mt-0.5">
                        {work.company_name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Position</p>
                      <p className="font-medium text-sm mt-0.5">
                        {work.position}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Department
                      </p>
                      <p className="font-medium text-sm mt-0.5">
                        {work.department}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Duration</p>
                      <p className="font-medium text-sm mt-0.5">
                        {format(work.start_date, "PP")} –{" "}
                        {work.end_date
                          ? format(work.end_date, "PP")
                          : "Present"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Responsibilities
                      </p>
                      <p className="font-medium text-sm mt-0.5">
                        {work.job_responsibilities || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Reason for Leaving
                      </p>
                      <p className="font-medium text-sm mt-0.5">
                        {work.reason_of_leaving || "-"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="font-medium text-sm mt-0.5">
                        {work.location || "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Family Information */}
          {candidate.family_members?.length > 0 && (
            <Card className="w-full bg-white/75 shadow-none dark:bg-card mt-4">
              <CardHeader>Family Information</CardHeader>
              <CardContent className="-mt-4 space-y-4">
                {candidate.family_members.map((family) => (
                  <div
                    key={family.id}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 border-b pb-4 last:border-b-0 last:pb-0"
                  >
                    <div>
                      <p className="text-xs text-muted-foreground">Name</p>
                      <p className="font-medium text-sm mt-0.5">
                        {family.name}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Relationship
                      </p>
                      <p className="font-medium text-sm mt-0.5">
                        {family.relationship}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Gender</p>
                      <p className="font-medium text-sm mt-0.5">
                        {family.gender}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Age</p>
                      <p className="font-medium text-sm mt-0.5">{family.age}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Occupation
                      </p>
                      <p className="font-medium text-sm mt-0.5">
                        {family.occupation || "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          <Card className="w-full bg-white/75 shadow-none dark:bg-card mt-4">
            <CardHeader>Referral</CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 -mt-4">
                {candidate?.refferer_id ? (
                  <>
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Referrer Id
                      </p>
                      <h2 className="font-medium text-sm mt-0.5">
                        {candidate.refferer_id}
                      </h2>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground">
                        Referrer Name
                      </p>
                      <p className="font-medium text-sm mt-0.5">
                        {candidate.referrer_name}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    {isAddingReferrer ? (
                      <>
                        <AddReferrer
                          candidate_id={candidate.id}
                          setIsAddingReferrer={setIsAddingReferrer}
                        />
                      </>
                    ) : (
                      <div>
                        <Button
                          size="sm"
                          onClick={() => setIsAddingReferrer(true)}
                        >
                          Add Referrer
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full bg-white/75 shadow-none dark:bg-card mt-4">
            <CardHeader>Numbers Methodology</CardHeader>
            <CardContent>
              <Button
                size="sm"
                onClick={() => {
                  dispatch(
                    setDialogData({
                      type: "candidateNumberMethodologyResult",
                      styles: "md:min-w-[950px] xl:min-w-[1050px]",
                      props: candidate.birth_date,
                    })
                  );
                }}
              >
                View
              </Button>
            </CardContent>
          </Card>

          <Card className="w-full bg-white/75 shadow-none dark:bg-card mt-4">
            <CardHeader>Resume</CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-[70%_30%] gap-4 -mt-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <DocsIcon className="size-6" />
                    <p className="text-sm mt-0.5">
                      {candidate.resume
                        ? candidate.resume.split("/").pop()
                        : "Not available"}
                    </p>
                  </div>
                </div>

                <div>
                  {candidate.resume && (
                    <a
                      href={addBaseURL(candidate.resume)}
                      download
                      className="text-sm w-fit"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button size="sm">View</Button>
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pipeline">
          <Card className="w-full bg-white/75 shadow-none dark:bg-card mt-4">
            <CardHeader>
              <h3 className="text-lg font-medium">Candidate Pipeline Stage</h3>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 items-center text-sm">
                <div
                  className={cn(
                    "flex items-center justify-center bg-secondary py-2 rounded-lg",
                    candidate.status === "New" &&
                      !candidate.is_blacklisted &&
                      "bg-primary text-primary-foreground"
                  )}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%)",
                  }}
                >
                  New
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center bg-secondary py-2",
                    candidate.status === "Scheduled" &&
                      !candidate.is_blacklisted &&
                      "bg-primary text-primary-foreground"
                  )}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)",
                  }}
                >
                  Scheduled
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center bg-secondary py-2",
                    candidate.status === "Interviewed" &&
                      !candidate.is_blacklisted &&
                      "bg-primary text-primary-foreground"
                  )}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)",
                  }}
                >
                  Interviewed
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center bg-secondary py-2",
                    candidate.status === "Offered" &&
                      !candidate.is_blacklisted &&
                      "bg-primary text-primary-foreground"
                  )}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)",
                  }}
                >
                  Offered
                </div>
                <div
                  className={cn(
                    "flex items-center justify-center bg-secondary py-2",
                    candidate.status === "Hired" &&
                      "bg-primary text-primary-foreground",
                    (candidate.status === "Rejected" ||
                      candidate.is_blacklisted) &&
                      "bg-destructive text-white"
                  )}
                  style={{
                    clipPath:
                      "polygon(0 0, calc(100% - 20px) 0, 100% 50%, calc(100% - 20px) 100%, 0 100%, 20px 50%)",
                  }}
                >
                  {candidate.status === "Hired"
                    ? candidate.status
                    : candidate.status === "Rejected" ||
                      candidate.is_blacklisted
                    ? "Rejected"
                    : "Hired / Rejected"}
                </div>
              </div>
            </CardContent>
          </Card>

          {candidate.remark != "" && (
            <Card className="w-full bg-white/75 shadow-none dark:bg-card mt-4 text-sm">
              <CardContent className="">
                <p className="text-xs text-muted-foreground">Remark</p>
                <p>{candidate.remark}</p>
              </CardContent>
            </Card>
          )}

          {candidate.is_whitelisted && (
            <div className="rounded-md border border-emerald-500/50 px-4 py-3 text-emerald-600 mt-4">
              <p className="text-sm">
                <CircleCheckIcon
                  className="me-3 -mt-0.5 inline-flex opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                This candidate is in talent pool.
              </p>
            </div>
          )}

          {candidate.is_blacklisted && (
            <div className="rounded-md border border-red-500/50 px-4 py-3 text-red-600 mt-4">
              <p className="text-sm">
                <CircleAlertIcon
                  className="me-3 -mt-0.5 inline-flex opacity-60"
                  size={16}
                  aria-hidden="true"
                />
                This candidate is blacklisted.
              </p>
            </div>
          )}

          {/* Buttons */}
          {hasPermission("hr_job_candidate.edit") && (
            <div className="mt-4 gap-2 flex justify-between flex-wrap">
              <div className="gap-2 flex flex-wrap">
                {candidate.status !== "Rejected" &&
                  candidate.status !== "Hired" &&
                  !candidate.is_blacklisted && (
                    <Button
                      size="sm"
                      variant="destructive"
                      className=""
                      onClick={() => setRemarkType("reject")}
                    >
                      Reject
                    </Button>
                  )}

                {candidate.status !== "Rejected" &&
                  candidate.status !== "Hired" &&
                  !candidate.is_blacklisted && (
                    <Button
                      size="sm"
                      className="border border-emerald-500 dark:border-emerald-500  hover:text-border-emerald-500 bg-emerald-600 hover:bg-emerald-500"
                      onClick={handleChangeStatus}
                    >
                      Move to Next Stage
                    </Button>
                  )}

                {candidate.status !== "New" && !candidate.is_blacklisted && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleChangeStatusToPrevious}
                  >
                    Move to Previous Stage
                  </Button>
                )}

                {candidate.is_whitelisted && candidate.status !== "New" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border border-primary dark:border-primary text-primary hover:text-primary bg-transparent"
                    onClick={handleMoveBackToStageNew}
                  >
                    Move back to stage New
                  </Button>
                )}
              </div>

              <div className="gap-2 flex justify-end">
                {!candidate.is_blacklisted && !candidate.is_whitelisted && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border dark:border-destructive border-destructive text-destructive hover:text-destructive bg-transparent"
                    onClick={() => setRemarkType("blacklist")}
                  >
                    Blacklist Pool
                  </Button>
                )}

                {!candidate.is_blacklisted &&
                  !candidate.is_whitelisted &&
                  candidate.status !== "Rejected" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="border border-primary dark:border-primary text-primary hover:text-primary bg-transparent"
                      onClick={() => setRemarkType("talent")}
                    >
                      Talent Pool
                    </Button>
                  )}

                {candidate.is_whitelisted && (
                  <Button
                    variant="destructive"
                    // className="border border-primary dark:border-primary text-primary hover:text-primary bg-transparent"
                    onClick={handleRemoveFromTalentPool}
                  >
                    Remove from whitelist
                  </Button>
                )}
              </div>
            </div>
          )}

          {remarkType != "" && (
            <Card className="w-full bg-white/75 shadow-none dark:bg-card mt-4">
              <CardHeader className="text-center">Add Remark</CardHeader>

              <CardContent className="-mt-8">
                <CandidateRemarkForm
                  remarkType={remarkType}
                  setRemarkType={setRemarkType}
                  candidate_id={candidate.id}
                />
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="audit-log">
          <Card className="shadow-md border">
            <CardContent className="space-y-6 pt-2">
              {auditLog.length > 0 ? (
                auditLog.map((log, index) => (
                  <div key={log.id} className="relative pl-6">
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-1.5 w-3 h-3 bg-primary rounded-full" />

                    {/* Log Content */}
                    <div className="flex flex-col gap-1">
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(log.created), "PPPpp")}
                      </div>
                      <div className="text-sm font-medium">
                        {log.action}{" "}
                        <span className="text-sm text-gray-500">
                          By {log.created_by}
                        </span>
                      </div>
                    </div>

                    {/* Separator after each item except last */}
                    {index !== auditLog.length - 1 && (
                      <Separator className="my-1 ml-1.5 h-2 w-0.5 bg-secondary" />
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground py-10">
                  No audit logs available.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="p-test">
          <div className="m-2 p-2 rounded-md border">
            <Tabs defaultValue="disc">
              <TabsList>
                <TabsTrigger
                  value="disc"
                  className="border px-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground mr-2"
                >
                  DISC
                </TabsTrigger>
                <TabsTrigger
                  value="mbti"
                  className="border px-3 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground dark:data-[state=active]:text-primary-foreground mr-2"
                >
                  MBTI
                </TabsTrigger>
              </TabsList>

              <TabsContent value="disc">
                <CandidateDISCResult candidate={candidate} />
              </TabsContent>
              <TabsContent value="mbti"></TabsContent>
            </Tabs>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CandidateDetailedView;
