import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { ShareLinkIcon } from "@/components/icons/HrIcons";
import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { generateDiscLink } from "@/modules/hr-module/services/personalityTestService";

const GenerateDiscLink = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const candidateInfo = useSelector((state) => state.dialog.props);

  const [copied, setCopied] = useState(false);
  const [link, setLink] = useState(candidateInfo?.disc_link || null);

  const handleGenerateLink = async () => {
    try {
      const res = await generateDiscLink(
        user.organisation_id,
        candidateInfo.id,
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

  const discLinkData = link || candidateInfo?.disc_link;
  const discLinkId = discLinkData?.disc_link_id;
  const expiresAt = discLinkData?.expires_at;

  return (
    <div className="-mt-4 text-center">
      <div className="flex flex-col items-center space-y-4">
        <h2 className="text-xl font-semibold">DISC Test Link</h2>

        <div className="flex flex-col items-start gap-2 border rounded-md p-4 w-full max-w-3xl">
          <div className="flex items-center gap-2 w-full">
            <div className="bg-primary/10 flex size-9 items-center justify-center rounded-md">
              <ShareLinkIcon />
            </div>

            <div className="flex-1 text-sm break-all">
              {discLinkId ? (
                <span className="text-blue-600 dark:text-blue-400">
                  {discLinkData?.url}
                </span>
              ) : (
                <span className="text-muted-foreground">No link available</span>
              )}
            </div>

            <div>
              {discLinkId ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(discLinkData?.url)}
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

export default GenerateDiscLink;
