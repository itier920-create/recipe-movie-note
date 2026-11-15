"use client";

import React, { useState } from "react";

export default function NewRecipePage() {
  const [title, setTitle] = useState("");
  const [videoId, setVideoId] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const res = await fetch("/api/recipes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        videoId,
        ingredients: [],
        steps: [],
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
      <button type="submit">登録</button>
    </form>
  );
}
