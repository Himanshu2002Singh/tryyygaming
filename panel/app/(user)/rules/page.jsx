"use client";
import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

const Rules = () => {
  const [text, setText] = useState("");

  React.useEffect(() => {
    fetch("/rules.md")
      .then((response) => response.text())
      .then((data) => setText(data))
      .catch((error) =>
        console.error("Error fetching the markdown file:", error)
      );
  }, []);

  return (
    <div className="h-full overflow-auto text-sm p-4">
      <ReactMarkdown remarkPlugins={[remarkBreaks]}>{text}</ReactMarkdown>
    </div>
  );
};

export default Rules;
