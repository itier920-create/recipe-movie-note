import { z } from "zod";

export const RecipeExtractionSchema = z.object({
  servings: z.number().nullable(),
  ingredients: z.array(
    z.object({
      name: z.string(),
      amountText: z.string(),
      quantity: z.number().nullable(),
      unit: z.string().nullable(),
      isSeasoning: z.boolean(),
    }),
  ),
  steps: z.array(
    z.object({
      text: z.string(),
    }),
  ),
});
