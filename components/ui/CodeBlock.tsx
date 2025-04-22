import * as React from "react";
import { highlightCode, Annotation, HighlightParams } from "../../src/highlighter";
import { cn } from "../../lib/utils";
import { CopyButton } from "./CopyButton";

export interface CodeBlockProps extends Omit<HighlightParams, "code" | "lang" | "annotations"> {
  language?: string;
  children: string;
  className?: string;
  annotations?: Annotation[];
  title?: string;
}

// Server component for code highlighting with static HTML copy button
export function CodeBlock({
  language = "plaintext",
  children,
  className,
  theme = "github-dark",
  highlightLines,
  showLineNumbers,
  focusLines,
  annotations,
  wordsToHighlight,
  title,
}: CodeBlockProps) {
  let highlightedCode: string;
  
  try {
    // Use synchronous highlightCode
    highlightedCode = highlightCode({
      code: children,
      lang: language || "plaintext",
      theme,
      highlightLines,
      showLineNumbers,
      focusLines,
      annotations,
      wordsToHighlight,
    });
  } catch (e) {
    console.error("Error highlighting code:", e);
    highlightedCode = `<pre><code>${children.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</code></pre>`;
  }

  const hasHeader = title || language !== "plaintext";
  
  // Create a unique ID for this code block to target with JS
  const codeBlockId = `code-block-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <div className={cn("relative my-6 border rounded-lg overflow-hidden text-sm font-mono code-block-container", className)}>
      {hasHeader && (
        <div className="flex justify-between items-center px-4 py-2 border-b bg-muted/30">
          <div className="flex items-center gap-2">
            {language !== "plaintext" && (
              <span className="text-xs font-semibold px-2 py-1 rounded bg-primary/10 text-primary">
                {language}
              </span>
            )}
            {title && <span className="font-medium">{title}</span>}
          </div>
          <CopyButton textToCopy={children} />
        </div>
      )}
      <div className="shiki-container overflow-x-auto p-4 bg-transparent m-0">
        {!hasHeader && (
          <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton textToCopy={children} compact className="h-8 w-8 p-0" />
          </div>
        )}
        <div
          id={codeBlockId}
          className="block text-sm leading-relaxed"
          dangerouslySetInnerHTML={{ __html: highlightedCode }}
        />
      </div>
    </div>
  );
}
