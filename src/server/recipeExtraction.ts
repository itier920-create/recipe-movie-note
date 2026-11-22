import { Anthropic } from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
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

export type RecipeExtraction = z.infer<typeof RecipeExtractionSchema>;

const client = new Anthropic();

const SYSTEM_PROMPT = `あなたは料理動画の概要欄から、レシピを取り出す担当です。渡された概要欄の文から、人数・材料・手順を取り出してください。

ルール:
- 概要欄に書いてあることだけを使い、書いていないことは作らないでください。
- 人数が書いていなければ、servings は null にしてください。
- 材料の amountText は、概要欄の書き方をそのまま入れてください
(例: 大さじ1と1/2、少々)。
- quantity は数字にできるときだけ入れてください(例: 大さじ1と1/2なら1.5)。少々・適量など数字にできないときは null にしてください。
- unit は大さじ・g ・個などの単位です。単位がなければ null にしてください。
- 塩・砂糖・醤油・みりん・酒・味噌・油・こしょう・だしの素など、味付けに使うものは isSeasoning を true にしてください。
- 手順は概要欄に書いてある順番どおりに、1つずつ分けて入れてください。
- 概要欄にレシピが書いていなければ、 ingredients と steps は空の配列にしてください。`;

export async function extractRecipe(
  description: string,
): Promise<RecipeExtraction> {
  const response = await client.beta.messages.parse({
    model: "claude-opus-5-5",
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: description }],
    output_config: { format: betaZodOutputFormat(RecipeExtractionSchema) },
  });

  if (response.stop_reason === "refusal") {
    throw new Error("AI がレシピの取り出しを断りました");
  }
  if (!response.parsed_output) {
    throw new Error("AI の返事をレシピの形に変換できませんでした");
  }
  return response.parsed_output;
}
