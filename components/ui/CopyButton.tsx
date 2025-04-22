import * as React from "react";
import { Button } from "./button";

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    textToCopy: string;
    compact?: boolean;
}

export function CopyButton({ textToCopy, compact, className, ...props }: CopyButtonProps) {
    return (
        <Button
            variant="outline"
            size="sm"
            className={className}
            data-copy={textToCopy}
            {...props}
        >
            <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {!compact && <span className="ml-2 text-xs">Copy</span>}
        </Button>
    );
}
