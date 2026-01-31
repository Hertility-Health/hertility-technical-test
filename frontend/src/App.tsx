import { useEffect, useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Info } from "lucide-react"

interface HormoneResults {
  code: string;
  units: string;
  value: number;
}

interface Results {
  id: number;
  userId: number;
  hormoneResults: Array<HormoneResults>;
  status: 'IN RANGE' | 'NOT IN RANGE';
  explanations?: string[];
}

const fetchResults = async () => {
  try {
    const res = await fetch("http://localhost:52863/results")
    const json = await res.json()
    return json as Results[]
  } catch (error) {
    console.error(error)
  }
  return []
}

function App() {
  const [results, setResults] = useState<Results[]>([])
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  useEffect(() => {
    fetchResults().then(results => {
      setResults(results)
    })
  }, [])

  const filteredResults = useMemo(() => {
    if (statusFilter === "ALL") return results;
    return results.filter(result => result.status === statusFilter);
  }, [results, statusFilter]);

  return (
    <div className="container mx-auto py-10 space-y-8">
      <div className="flex flex-col space-y-2">
        <h2 className="text-muted-foreground font-medium tracking-tight">Hertility admin dashboard</h2>
        <h1 className="text-4xl font-bold tracking-tight">Hormone results</h1>
      </div>

      <Card className="w-full sm:w-[600px] mx-auto">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pb-7">
          <CardTitle className="text-xl font-semibold">Results Overview</CardTitle>
          <Tabs value={statusFilter} onValueChange={setStatusFilter} className="w-full sm:w-auto">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ALL">All Results</TabsTrigger>
              <TabsTrigger value="IN RANGE">In Range</TabsTrigger>
              <TabsTrigger value="NOT IN RANGE">Not In Range</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[100px] px-4 font-semibold whitespace-nowrap">Result ID</TableHead>
                <TableHead className="px-4 font-semibold whitespace-nowrap">User ID</TableHead>
                <TableHead className="w-[140px] px-4 font-semibold whitespace-nowrap">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredResults.map((result) => (
                <TableRow key={result.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="px-4 py-4 font-medium">
                    <span className="text-muted-foreground mr-0.5">#</span>{result.id}
                  </TableCell>
                  <TableCell className="px-4 py-4">{result.userId}</TableCell>
                  <TableCell className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={result.status === 'IN RANGE' ? 'secondary' : 'destructive'}
                        className={result.status === 'IN RANGE' ? 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200 whitespace-nowrap' : 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200 whitespace-nowrap'}
                      >
                        {result.status}
                      </Badge>
                      {result.status === 'NOT IN RANGE' && result.explanations && result.explanations.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <button className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shrink-0">
                              <Info className="h-4 w-4" />
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80" align="end">
                            <div className="space-y-3">
                              <h4 className="font-semibold leading-none">Status Details</h4>
                              <p className="text-sm text-muted-foreground">
                                The following issues were identified in this result:
                              </p>
                              <ul className="text-sm list-disc pl-4 space-y-1.5">
                                {result.explanations.map((exp, idx) => (
                                  <li key={idx} className="leading-tight">{exp}</li>
                                ))}
                              </ul>
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredResults.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground italic">
                    No results found for this filter.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
