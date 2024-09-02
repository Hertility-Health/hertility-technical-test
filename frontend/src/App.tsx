import { useQuery } from "@tanstack/react-query";
import { getResults } from "./hooks/getResults";
import { FilterOptions, Results } from "./types";
import { FilterDropdown } from "./components/FilterDropDown";
import { useEffect, useState } from "react";
import Result from "./components/Result";

function App() {
  const { data, error } = useQuery<Results[]>({
    queryKey: ["results"],
    queryFn: getResults,
  });
  const [resultList, setResultList] = useState<Results[] | undefined>(data);

  useEffect(() => {
    if (data) {
      setResultList(data);
    }
  }, [data]);

  const handleFilterClick = (option: string | null) => {
    option === FilterOptions.notInRange &&
      setResultList(data?.filter((result) => result.status === "not in range"));
    option === FilterOptions.inRange &&
      setResultList(data?.filter((result) => result.status === "in range"));
    option === FilterOptions.all && setResultList(data);
  };

  if (error) return <h1>Woops!!</h1>;

  return (
    <div className="bg-background">
      <h2 className="font-serif px-4 py-4">Hertility admin dashboard</h2>
      <h1 className="font-serif px-4 pb-8">Hormone results</h1>
      <div className="w-fit mx-auto pb-10">
        <FilterDropdown onSelect={handleFilterClick} />
        <div className="flex uppercase py-4 px-2 justify-between font-semibold">
          <p className={"w-1/4"}>result id</p>
          <p className={"w-1/4"}>user id</p>
          <p className={"w-2/4 text-right"}>status</p>
          <></>
        </div>
        <div className="flex flex-col gap-[10px] w-[500px]">
          {resultList &&
            resultList.map((result) => {
              return <Result result={result} key={result.id} />;
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
