import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import DiscCartoonImg from "@/assets/images/disc-cartoon.png";
import {
  KoalaIcon,
  OwlIcon,
  ParrotIcon,
  TigerIcon,
} from "@/components/icons/HrIcons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sparkles,
  ListChecks,
  Target,
  Briefcase,
  Mic,
  Users,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { setDialogData } from "@/store/reducers/dialogSlice";
import { cn } from "@/utils/cn";
import { MoveLeftIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function CandidateDISCResult({ candidate }) {
  const dispatch = useDispatch();
  const [showingDiscResultIndex, setShowingDiscResultIndex] = useState(-1);

  return (
    <>
      <div
        className={cn(
          "flex justify-end items-center",
          showingDiscResultIndex !== -1 && "justify-between"
        )}
      >
        {showingDiscResultIndex !== -1 && (
          <Button
            variant="secondary"
            onClick={() => setShowingDiscResultIndex(-1)}
          >
            <MoveLeftIcon />
          </Button>
        )}
        <Button
          onClick={() => {
            dispatch(
              setDialogData({
                type: "generateDiscLink",
                styles: "md:min-w-[750px]",
                props: candidate,
              })
            );
          }}
        >
          Generate DISC Link
        </Button>
      </div>
      {showingDiscResultIndex === -1 && (
        <Table className="mt-4">
          <TableHeader className="border">
            <TableRow>
              <TableHead className="">No</TableHead>
              <TableHead>Result</TableHead>
              <TableHead>Date Submitted</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {candidate.disc_results?.map((result, index) => (
              <TableRow key={result.id}>
                <TableCell className="">{index + 1}</TableCell>

                <TableCell>
                  <Button
                    variant="link"
                    onClick={() => setShowingDiscResultIndex(index)}
                  >
                    Click to View
                  </Button>
                </TableCell>

                <TableCell className="">
                  <p className="max-w-8">{format(result.created, "PP p")}</p>
                </TableCell>
              </TableRow>
            ))}

            {candidate.disc_results.length === 0 && (
              <TableRow>
                <TableCell colSpan={7}>No DISC test result.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {showingDiscResultIndex !== -1 && (
        <>
          <div className="flex justify-between pt-4 gap-2">
            <CandidateDiscRadarChart
              result={candidate.disc_results[showingDiscResultIndex]}
            />

            <div className="w-1/2 aspect-[5/3] border rounded-lg overflow-hidden">
              <img
                src={DiscCartoonImg}
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          {candidate.disc_results[showingDiscResultIndex]?.summary.map(
            (summary, index) => (
              <div key={index} className="mt-6">
                <p className="flex items-center gap-2 font-semibold text-base">
                  {summary.description.animal === "Koala" ? (
                    <KoalaIcon className="size-6" />
                  ) : summary.description.animal === "Tiger" ? (
                    <TigerIcon className="size-6" />
                  ) : summary.description.animal === "Parrot" ? (
                    <ParrotIcon className="size-5" />
                  ) : (
                    <OwlIcon className="size-6" />
                  )}
                  {summary.description.animal}
                </p>

                <Card className="mt-3 border border-muted bg-background/25 text-muted-foreground dark:bg-muted/40">
                  <CardContent className="p-4 py-0 space-y-3 text-sm leading-relaxed">
                    <p className="flex items-start gap-2">
                      <Sparkles className="size-4 mt-1 text-foreground" />
                      <span>
                        <span className="font-medium text-foreground">
                          Personality:
                        </span>{" "}
                        {summary.personality}.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <ListChecks className="size-4 mt-1 text-foreground" />
                      <span>
                        <span className="font-medium text-foreground">
                          Key Traits:
                        </span>{" "}
                        {summary.description.key_traits}.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Target className="size-4 mt-1 text-foreground" />
                      <span>
                        <span className="font-medium text-foreground">
                          Focus:
                        </span>{" "}
                        {summary.description.focus}.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Briefcase className="size-4 mt-1 text-foreground" />
                      <span>
                        <span className="font-medium text-foreground">
                          Work Style:
                        </span>{" "}
                        {summary.description.work_style}.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Mic className="size-4 mt-1 text-foreground" />
                      <span>
                        <span className="font-medium text-foreground">
                          Communication Style:
                        </span>{" "}
                        {summary.description.communication_style}.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <Users className="size-4 mt-1 text-foreground" />
                      <span>
                        <span className="font-medium text-foreground">
                          Value to Team:
                        </span>{" "}
                        {summary.description.value_to_team}.
                      </span>
                    </p>
                    <p className="flex items-start gap-2">
                      <AlertTriangle className="size-4 mt-1 text-foreground" />
                      <span>
                        <span className="font-medium text-foreground">
                          Potential Challenges:
                        </span>{" "}
                        {summary.description.potential_challenges}.
                      </span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            )
          )}
        </>
      )}
    </>
  );
}

function CandidateDiscRadarChart({ result }) {
  const chartData = [
    { name: "Koala", data: result.s_count },
    { name: "Tiger", data: result.d_count },
    { name: "Parrot", data: result.i_count },
    { name: "Owl", data: result.c_count },
  ];

  const chartConfig = {
    data: {
      label: "data",
      color: "var(--chart-1)",
    },
  };

  return (
    <div className="p-4 border rounded-lg w-1/2">
      <p className="text-center">Four-Type Personality Radar Chart</p>

      <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[225px]"
      >
        <RadarChart data={chartData} outerRadius="70%">
          <PolarGrid gridType="circle" />
          <PolarAngleAxis dataKey="name" />

          <Radar
            dataKey="data"
            fill="var(--color-data)"
            fillOpacity={0.8}
            dot={{
              r: 3,
              fillOpacity: 0.5,
            }}
          />
        </RadarChart>
      </ChartContainer>
    </div>
  );
}
