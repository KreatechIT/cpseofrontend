import { useSelector, useDispatch } from "react-redux";
import { generateJobLink } from "../../services/jobsService";
import { Button } from "@/components/ui/button";
import { ShareLinkIcon } from "@/components/icons/HrIcons";
import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

const GenerateLink = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const jobPosting = useSelector((state) => state.dialog.props);

  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState(jobPosting?.link || null);

  const handleGenerateLink = async () => {
    try {
      const res = await generateJobLink(
        user.organisation_id,
        jobPosting.id,
        dispatch
      );
      setLink(res);
    } catch (err) {
      console.error("Failed to generate link:", err);
    }
  };

  const handleCopy = (text) => {
    if (!navigator?.clipboard?.writeText) {
      console.warn("Clipboard API not supported");
      return;
    }
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  const jobLinkData = link || jobPosting?.link;
  const jobLinkId = jobLinkData?.job_link_id;
  const expiresAt = jobLinkData?.expires_at;

  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold">Share Your Job Post Publicly</h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Share the link to invite others to view this job post.
        </p>

        <div className="flex flex-col items-start gap-2 border rounded-md p-4 w-full max-w-3xl">
          <div className="flex items-center gap-2 w-full">
            <div className="bg-primary/10 flex size-9 items-center justify-center rounded-md">
              <ShareLinkIcon />
            </div>

            <div className="flex-1 text-sm break-all">
              {jobLinkId ? (
                <span className="text-blue-600 dark:text-blue-400">
                  {jobLinkData?.url}
                </span>
              ) : (
                <span className="text-muted-foreground">No link available</span>
              )}
            </div>

            <div>
              {jobLinkId ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(jobLinkData?.url)}
                >
                  <CopyIcon className="mr-1 h-4 w-4" />
                  {copied ? "Copied" : "Copy"}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleGenerateLink}
                >
                  Generate
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
      {expiresAt && (
        <p className="text-xs text-muted-foreground mt-1">
          Expires at: {format(new Date(expiresAt), "MMM dd, yyyy hh:mm a")}
        </p>
      )}
    </div>
  );
};

export default GenerateLink;
