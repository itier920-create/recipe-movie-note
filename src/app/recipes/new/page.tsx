"use client";

import React, { useState } from "react";

export default function NewRecipePage() {
  const [title, setTitle] = useState("");
  const [videoId, setVideoId] = useState("");
  const [ingredients, setIngredients] = useState([
    { name: "", amountText: "" },
  ]);
  const [steps, setSteps] = useState([{ text: "" }]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        videoId: videoId || undefined,
        ingredients: ingredients.filter((item) => item.name !== ""),
        steps: steps.filter((item) => item.text !== ""),
      }),
    });

    const data = await res.json();
    if (res.ok) {
      alert("登録しました");
    } else {
      alert(data.error);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />
      <input value={videoId} onChange={(e) => setVideoId(e.target.value)} />
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
