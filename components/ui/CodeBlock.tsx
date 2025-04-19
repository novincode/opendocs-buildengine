"use client";

import * as React from "react";
import { FiCopy, FiCheck } from "react-icons/fi";
import { Button } from "./button";
import { Annotation, highlightCode, HighlightParams } from "../../src/highlighter";

export interface CodeBlockProps extends Omit<HighlightParams, "code" | "lang" | "annotations"> {
  /**
   * The code language (e.g. "rust", "ts")
   */
  language?: string;
  /**
   * The code string (children)
   */
  children: string;
  /**
   * Additional className for the wrapper
   */
  className?: string;
  /**
   * Array of annotation objects: { line, message, style }
   */
  annotations?: Annotation[];
  /**
   * Optional title for the code block
   */
  title?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({
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
}) => {
  const [highlighted, setHighlighted] = React.useState<string>("");
  const [copied, setCopied] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    highlightCode({
      code: children,
      lang: language,
      theme,
      highlightLines,
      showLineNumbers,
      focusLines,
      annotations,
      wordsToHighlight,
    })
      .then((html) => {
        if (!cancelled) {
          setHighlighted(html);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Failed to highlight code");
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [children, language, theme, highlightLines, showLineNumbers, focusLines, annotations, wordsToHighlight]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const hasHeader = title || language !== "plaintext";

  return (
    <div className={`relative group my-6 border rounded-lg overflow-hidden text-sm font-mono ${className || ""}`}>
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
          <Button
            type="button"
            aria-label="Copy code"
            onClick={handleCopy}
            size="sm"
            variant="ghost"
            className="h-8 px-2 flex items-center gap-1 hover:bg-muted"
          >
            {copied ? (
              <>
                <FiCheck className="text-green-500" />
                <span className="text-xs">Copied!</span>
              </>
            ) : (
              <>
                <FiCopy />
                <span className="text-xs">Copy</span>
              </>
            )}
          </Button>
        </div>
      )}
      <div className={`shiki overflow-x-auto p-4 bg-transparent m-0`}>
        {!hasHeader && (
          <Button
            type="button"
            aria-label="Copy code"
            onClick={handleCopy}
            size="icon"
            variant="outline"
            className="absolute top-2 right-2 z-10 transition-opacity opacity-0 group-hover:opacity-100 focus:opacity-100 h-8 w-8 bg-muted/50 backdrop-blur-sm hover:bg-muted"
          >
            {copied ? <FiCheck className="text-green-500" /> : <FiCopy />}
          </Button>
        )}
        {loading ? (
          <span className="text-muted-foreground">Loading…</span>
        ) : error ? (
          <span className="text-destructive">{error}</span>
        ) : (
          <div
            className="block text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        )}
      </div>
    </div>
  );
};
