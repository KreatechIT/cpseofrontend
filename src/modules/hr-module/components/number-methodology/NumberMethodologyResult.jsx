import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import axiosInstance from "@/services/axiosInstance";
import { useEffect, useState } from "react";

export default function NumberMethodologyResult({ birthDate }) {
  const [result, setResult] = useState();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get(
          `/hr/number-methodology/?date_of_birth=${birthDate}`
        );
        setResult(res.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (birthDate) {
      fetchData();
    }
  }, [birthDate]);

  return (
    <div className="@container">
      <div className="p-4 mt-4 rounded-lg flex flex-col-reverse @7xl:grid @7xl:grid-cols-[58%_40%] gap-8 @7xl:border ">
        <div>
          <Card className="shadow-none w-4/5 mx-auto">
            <CardHeader>
              <CardTitle>Title</CardTitle>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <Card className="shadow-none min-h-40">
              <CardHeader>
                <CardTitle>Strength</CardTitle>
              </CardHeader>
            </Card>
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Weakness</CardTitle>
              </CardHeader>
            </Card>
            <Card className="shadow-none">
              <CardHeader>
                <CardTitle>Images</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <Card className="shadow-none min-h-80 mt-4">
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <div>
          <div className="flex items-center flex-col justify-center border py-8 bg-card rounded-lg relative">
            <div className="w-3/4 h-6 flex justify-center gap-4">
              <div className="w-10 h-full">
                <div className="h-6 text-center text-sm text-muted-foreground">
                  Day
                </div>
                {/* <div className="h-10 border flex justify-center items-center font-bold text-xl rounded-md">
                  {result?.inputted_date_of_birth.day}
                </div> */}
              </div>
              <div className="w-10 h-full">
                <div className="h-6 text-center text-sm text-muted-foreground">
                  Month
                </div>
                {/* <div className="h-10 border flex justify-center items-center font-bold text-xl  rounded-md">
                  {result?.inputted_date_of_birth.month}
                </div> */}
              </div>
              <div className="w-24 h-full ps-4">
                <div className="h-6 text-start text-sm text-muted-foreground">
                  Year
                </div>
                {/* <div className="h-10 border flex justify-center items-center font-bold text-xl  rounded-md">
                  {result?.inputted_date_of_birth.year}
                </div> */}
              </div>
            </div>

            {/* Outer shape acting as the border */}
            <div
              style={{
                clipPath: "polygon(25% 0%, 75% 0%, 100% 25%, 50% 100%, 0% 25%)",
              }}
              className="w-80 h-80 bg-border relative mt-4"
            >
              {/* Inner shape, inset to reveal border */}
              <div
                style={{
                  clipPath:
                    "polygon(25% 0%, 75% 0%, 100% 25%, 50% 100%, 0% 25%)",
                }}
                className="absolute inset-[2px] bg-background "
              >
                <div className="h-20 w-full grid grid-cols-[30%_20%_20%_30%]">
                  <div className="h-full border-y relative flex justify-end pr-3 items-center">
                    <p className="text-2xl font-bold -mb-4">
                      {result?.inputted_date_of_birth.day}
                    </p>
                    <div className="absolute right-0 bottom-0 h-3/4 w-[2px] bg-border" />
                  </div>

                  <div className="h-full border-y border-r flex justify-center items-center">
                    <p className="text-2xl font-bold -mb-4">
                      {result?.inputted_date_of_birth.month}
                    </p>
                  </div>

                  <div className="h-full border-y relative border-l flex justify-center items-center">
                    <p className="text-2xl font-bold -mb-4">
                      {result?.inputted_date_of_birth.year
                        ?.toString()
                        .slice(0, 2)}
                    </p>
                    <div className="absolute right-0 bottom-0 h-3/4 w-[2px] bg-border" />
                  </div>
                  <div className="h-full border-y flex justify-start pl-2 items-center">
                    <p className="text-2xl font-bold -mb-4">
                      {result?.inputted_date_of_birth.year?.toString().slice(2)}
                    </p>
                  </div>
                </div>

                <div className="h-20 w-full grid grid-cols-[33%_17%_17%_33%]">
                  <div className="h-full border-y relative flex items-center justify-end pe-5">
                    <p className="text-3xl font-bold -mb-4">
                      {result?.row_one[0]}
                    </p>
                    <div className="absolute right-0 bottom-0 h-3/4 w-[2px] bg-border" />
                  </div>
                  <div className="h-full border-y border-r grid place-items-center">
                    <p className="text-3xl font-bold -mb-4">
                      {result?.row_one[1]}
                    </p>
                  </div>
                  <div className="h-full border-y relative border-l grid place-items-center">
                    <p className="text-3xl font-bold -mb-4">
                      {result?.row_one[2]}
                    </p>
                    <div className="absolute right-0 bottom-0 h-3/4 w-[2px] bg-border" />
                  </div>
                  <div className="h-full border-y flex items-center ps-5">
                    <p className="text-3xl font-bold -mb-4">
                      {result?.row_one[3]}
                    </p>
                  </div>
                </div>

                <div className="h-20 w-full grid grid-cols-[50%_50%]">
                  <div className="h-full border flex items-center justify-end pe-5">
                    <p className="text-3xl font-bold">{result?.row_two[0]}</p>
                  </div>
                  <div className="h-full border flex items-center ps-5">
                    <p className="text-3xl font-bold">{result?.row_two[1]}</p>
                  </div>
                </div>
                <div className="h-20 w-full grid place-items-center ">
                  <p className="text-3xl font-bold -mt-4">
                    {result?.row_three[0]}
                  </p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="w-3/4 h-16 flex gap-20 justify-center">
              <div className="h-full w-14 border grid place-items-center text-lg">
                {result?.bottom_part[0]}
              </div>
              <div className="h-full w-14 border grid place-items-center text-lg">
                {result?.bottom_part[1]}
              </div>
            </div>
            <div className="w-3/4 h-16 flex gap-20 justify-center relative mt-4">
              <div className="h-full w-14 border grid place-items-center text-lg font-bold">
                {result?.bottom_most[0]}
              </div>
              {/* <div className="h-full w-16 border rounded-full absolute right-10"></div> */}
            </div>

            <div className="w-full h-16 grid grid-cols-2 gap-28 absolute mt-28">
              {/* Left */}
              <div className="h-full flex w-full justify-end gap-2 px-4">
                <div className="h-full w-14 border grid place-items-center text-lg">
                  {result?.left_part[0]}
                </div>
                <div className="h-full flex flex-col gap-1 w-8 justify-center">
                  <div className="h-2.5 border"></div>
                  <div className="h-2.5 border"></div>
                </div>
                <div className="h-full w-14 border grid place-items-center text-lg">
                  {result?.left_part[1]}
                </div>
                <div className="h-full w-14 border grid place-items-center text-lg">
                  {result?.left_part[2]}
                </div>
              </div>

              {/* Right */}
              <div className="h-full flex gap-2 px-4">
                <div className="h-full w-14 border grid place-items-center text-lg">
                  {result?.right_part[0]}
                </div>

                <div className="h-full w-14 border grid place-items-center text-lg">
                  {result?.right_part[1]}
                </div>
                <div className="h-full flex flex-col gap-1 w-8 justify-center">
                  <div className="h-2.5 border"></div>
                  <div className="h-2.5 border"></div>
                </div>
                <div className="h-full w-14 border grid place-items-center text-lg">
                  {result?.right_part[2]}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <div className="grid grid-cols-[30%_68%] gap-4 mt-4">
              <div className="border p-2 rounded-md">Main Number</div>
              <div className="border p-2 rounded-md">
                {result?.middle_singular_number_description}
              </div>
            </div>
            {result?.description_data?.map((res, idx) => {
              if (res) {
                return (
                  <div
                    key={idx}
                    className="grid grid-cols-[30%_68%] gap-4 mt-4"
                  >
                    <div className="border p-2 rounded-md">{res?.Number}</div>
                    <div className="border p-2 rounded-md">
                      <p>Characteristics: {res?.Characteristic}</p>
                      <p>Strength: {res?.Strength}</p>
                      <p>Weakness: {res?.Weakness}</p>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
