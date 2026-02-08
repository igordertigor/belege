import * as z from "zod";

export const TransactionSplit = z.object({
  account: z.string(),
  amount: z.number(),
  description: z.optional(z.string()),
})

export const Transaction = z.object({
  username: z.string(),
  date: z.coerce.date(),
  description: z.optional(z.string()),
  splits: z.array(TransactionSplit),
  receipt: z.optional(z.string())
})

export const Accounts = z.object({
  names: z.array(z.string())
})



export type Transaction_t = z.infer<typeof Transaction>;
