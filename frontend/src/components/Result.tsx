import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ResultData } from "@/types/ResultData";
import { twMerge } from "tailwind-merge";

export const Result = ({ result }: { result: ResultData }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <TableRow key={result.id}>
          <TableCell>{result.id}</TableCell>
          <TableCell>{result.userId}</TableCell>
          <TableCell className="font-medium">
            {typeof result.normal === "undefined" ? (
              <span className="text-red-700 dark:text-red-500">UNKNOWN</span>
            ) : result.normal ? (
              <span className="text-green-700 dark:text-green-500">
                IN RANGE
              </span>
            ) : (
              <span className="text-red-700 dark:text-red-500">
                NOT IN RANGE
              </span>
            )}
          </TableCell>
        </TableRow>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Result {result.id} (User {result.userId})
          </DialogTitle>
          <DialogDescription>
            <Table className="bg-background text-foreground text-center">
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Hormone</TableHead>
                  <TableHead className="text-center">Value</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {result.hormoneResults.map((hormoneResult) => {
                  return (
                    <TableRow key={hormoneResult.code}>
                      <TableCell>{hormoneResult.code}</TableCell>
                      <TableCell>
                        {hormoneResult.value}
                        {hormoneResult.units}
                      </TableCell>
                      <TableCell
                        className={twMerge(
                          "font-medium",
                          hormoneResult.range === "NORMAL"
                            ? "text-green-700 dark:text-green-500"
                            : "text-red-700 dark:text-red-500"
                        )}
                      >
                        {hormoneResult.range}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
