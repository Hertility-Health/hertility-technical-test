import { z } from "zod";

const HormoneResultSchema = z.object({
  code: z.string(),
  units: z.string(),
  value: z.number(),
});

const ResultSchema = z.object({
  id: z.number(),
  userId: z.number(),
  hormoneResults: z.array(HormoneResultSchema),
});

const HormoneRangeSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const ProcessedHormoneResultSchema = HormoneResultSchema.extend({
  isInRange: z.boolean().nullable(),
  range: HormoneRangeSchema.nullable(),
});

const ProcessedResultSchema = z.object({
  id: z.number(),
  userId: z.number(),
  hormoneResults: z.array(ProcessedHormoneResultSchema),
  status: z.enum(["IN RANGE", "NOT IN RANGE"]),
});

export const ResultsArraySchema = z.array(ResultSchema);
export const HormoneRangesRecordSchema = z.record(z.string(), HormoneRangeSchema);
export const ProcessedResultsArraySchema = z.array(ProcessedResultSchema);

export type Result = z.infer<typeof ResultSchema>;
export type ResultStatus = z.infer<typeof ProcessedResultSchema>["status"];
export type HormoneRange = z.infer<typeof HormoneRangeSchema>;
export type HormoneRanges = z.infer<typeof HormoneRangesRecordSchema>;
export type ProcessedHormoneResult = z.infer<typeof ProcessedHormoneResultSchema>;
export type ProcessedResult = z.infer<typeof ProcessedResultSchema>;
