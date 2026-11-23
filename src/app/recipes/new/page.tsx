"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function NewRecipePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [servings, setServings] = useState("");
  const [url, setUrl] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);
  const [ingredients, setIngredients] = useState([
    { name: "", amountText: "" },
  ]);
  const [steps, setSteps] = useState([{ text: "" }]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          videoId: videoId || undefined,
          servings: servings ? Number(servings) : undefined,
          ingredients: ingredients.filter((item) => item.name !== ""),
          steps: steps.filter((item) => item.text !== ""),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        router.push(`/recipes/${data.id}`);
      } else {
        alert(data.error);
      }
    } catch {
      alert("登録に失敗しました。時間をおいてもう一度試してください");
    }
  }

  async function handleExtract() {
    setIsExtracting(true);
    try {
      const res = await fetch("/api/recipes/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (res.ok) {
        setTitle(data.title);
        setVideoId(data.videoId);
        setServings(data.servings === null ? "" : String(data.servings));
        setIngredients(data.ingredients);
        setSteps(data.steps);
      } else {
        alert(data.error);
      }
    } catch {
      alert(
        "レシピの取り出しに失敗しました。時間をおいてもう一度試してください",
      );
    } finally {
      setIsExtracting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="YouTube の URL"
      />
      <button type="button" onClick={handleExtract} disabled={isExtracting}>
        {isExtracting ? "取り出し中..." : "AIで取り出す"}
      </button>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <input value={videoId} onChange={(e) => setVideoId(e.target.value)} />
      <input
        type="number"
        value={servings}
        onChange={(e) => setServings(e.target.value)}
        placeholder="何人分"
      />
      {ingredients.map((item, index) => (
        <div key={index}>
          <input
            value={item.name}
            onChange={(e) =>
              setIngredients(
                ingredients.map((row, i) =>
                  i === index ? { ...row, name: e.target.value } : row,
                ),
              )
            }
            placeholder="材料名"
          />
          <input
            value={item.amountText}
            onChange={(e) =>
              setIngredients(
                ingredients.map((row, i) =>
                  i === index ? { ...row, amountText: e.target.value } : row,
                ),
              )
            }
            placeholder="分量"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() =>
          setIngredients([...ingredients, { name: "", amountText: "" }])
        }
      >
        材料を追加
      </button>
      {steps.map((item, index) => (
        <div key={index}>
          <textarea
            value={item.text}
            onChange={(e) =>
              setSteps(
                steps.map((row, i) =>
                  i === index ? { ...row, text: e.target.value } : row,
                ),
              )
            }
            placeholder="手順"
          />
        </div>
      ))}
      <button type="button" onClick={() => setSteps([...steps, { text: "" }])}>
        手順を追加
      </button>
      <button type="submit">登録</button>
    </form>
  );
}
