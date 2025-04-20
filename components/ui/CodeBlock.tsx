import * as React from "react";
import { highlightCode, Annotation, HighlightParams } from "../../src/highlighter";
import { cn } from "../../lib/utils";
import { Button } from "./button";

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

  // Since React sanitizes onclick attributes, we'll use a custom attribute that will be
  // transformed to onclick in the HTML output through string replacement
  const copyButtonHtml = `<button 
    class="inline-flex items-center active:scale-90 justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 copy-button"
    onclick="var codeEl = document.getElementById('${codeBlockId}'); var code = codeEl.textContent || codeEl.innerText; navigator.clipboard.writeText(code); var btn = this; var oldHTML = btn.innerHTML; btn.innerHTML = '<svg width=\\'16\\' height=\\'16\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' class=\\'text-green-500\\'><polyline points=\\'20 6 9 17 4 12\\'></polyline></svg><span class=\\'text-xs ml-2\\'>Copied!</span>'; setTimeout(function(){ btn.innerHTML = oldHTML; }, 1500); return false;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
      <span class="text-xs">Copy</span>
    </button>`;

  const floatingButtonHtml = `<button 
    class="copy-button absolute top-2 right-2 z-10 inline-flex h-8 w-8 items-center justify-center rounded-md border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground opacity-0 hover:opacity-100 focus:opacity-100 transition-opacity"
    onclick="var codeEl = document.getElementById('${codeBlockId}'); var code = codeEl.textContent || codeEl.innerText; navigator.clipboard.writeText(code); var btn = this; var oldHTML = btn.innerHTML; btn.innerHTML = '<svg width=\\'16\\' height=\\'16\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'currentColor\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\' class=\\'text-green-500\\'><polyline points=\\'20 6 9 17 4 12\\'></polyline></svg>'; setTimeout(function(){ btn.innerHTML = oldHTML; }, 1500); return false;">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
    </button>`;

  return (
    <div className={cn("relative my-6 border rounded-lg overflow-hidden text-sm font-mono", className)}>
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
          <div dangerouslySetInnerHTML={{ __html: copyButtonHtml }} />
        </div>
      )}
      <div className="shiki overflow-x-auto p-4 bg-transparent m-0">
        {!hasHeader && (
          <div dangerouslySetInnerHTML={{ __html: floatingButtonHtml }} />
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
