import { CodeToHastOptions, ShikiTransformer, createHighlighter } from 'shiki';
export interface Annotation {
    line: number;
    message: string;
    style?: string;
}
export type HighlightParams = {
    code: string;
    lang: string;
    theme?: string;
    highlightLines?: number[];
    showLineNumbers?: boolean;
    focusLines?: number[];
    annotations?: Annotation[];
    wordsToHighlight?: string[];
};


export async function highlightCode({
    code,
    lang,
    theme = 'github-dark',
    highlightLines,
    showLineNumbers,
    focusLines,
    annotations,
    wordsToHighlight,
}: HighlightParams): Promise<string> {
    // Trim code to remove empty lines at the beginning and end
    const trimmedCode = code.replace(/^\s*\n|\n\s*$/g, '');

    const highlighter = await createHighlighter({
        themes: [theme],
        langs: [lang],
    });

    // Determine if the theme is dark or light
    const isDarkTheme = theme.includes('dark') ||
        theme.includes('night') ||
        theme.includes('black') ||
        theme === 'dracula' ||
        theme === 'nord';

    // Convert annotations to a map for easy lookup
    const annotationMap: Record<number, { message: string, style?: string }> = {};
    if (Array.isArray(annotations)) {
        annotations.forEach((ann) => {
            if (ann && typeof ann.line === 'number' && ann.message) {
                const style = ['info', 'warning', 'error'].includes(ann.style || '') ? ann.style : undefined;
                annotationMap[ann.line] = { message: ann.message, style };
            }
        });
    }

    // Words to highlight - convert to lowercase for case-insensitive matching
    const wordsToHighlightMap = wordsToHighlight?.map(i => i.toLowerCase()) || [];

    const transformers: ShikiTransformer[] = [
        {
            name: 'custom-transformer',
            line(hast, lineNumber) {
                if (Array.isArray(highlightLines) && highlightLines.includes(lineNumber)) {
                    this.addClassToHast(hast, 'highlighted-line');
                }
                if (Array.isArray(focusLines) && focusLines.includes(lineNumber)) {
                    this.addClassToHast(hast, 'focus-line');
                }
                if (showLineNumbers) {
                    hast.children.unshift({
                        type: 'element',
                        tagName: 'span',
                        properties: { class: 'line-number' },
                        children: [{ type: 'text', value: String(lineNumber) }]
                    });
                }
                const ann = annotationMap[lineNumber];
                if (ann) {
                    hast.children.push({
                        type: 'element',
                        tagName: 'span',
                        properties: {
                            class: `annotation${ann.style ? ` annotation-${ann.style}` : ''}`
                        },
                        children: [{ type: 'text', value: ann.message }]
                    });
                }
                return hast;
            },
            span(hast, line, column, lineElement, token) {
                if (wordsToHighlightMap.length > 0) {
                    const tokenLower = token.content.toLowerCase().trim();
                    if (wordsToHighlightMap.includes(tokenLower)) {
                        this.addClassToHast(hast, 'word-highlight');
                    }
                }
                return hast;
            },
        }
    ];

    let html = highlighter.codeToHtml(trimmedCode, {
        lang,
        theme,
        transformers
    });

    const styles = `
    .shiki .line { display: block; }
    .shiki code { display: flex; flex-direction: column; }
    ${isDarkTheme ? `
      .highlighted-line { background-color: rgba(255, 255, 0, 0.15); border-left: 3px solid rgba(255, 255, 0, 0.5); }
      .focus-line { background-color: rgba(58, 130, 247, 0.15); border-left: 3px solid rgba(58, 130, 247, 0.5); }
      .line-number { color: rgba(255, 255, 255, 0.5); font-size: 0.8em; margin-right: 10px; }
      .annotation { color: rgba(255, 255, 255, 0.7); font-style: italic; margin-left: 8px; padding: 0 4px; }
      .annotation-info { background-color: rgba(58, 130, 247, 0.6); color: #fff; padding: 2px 4px; border-radius: 3px; }
      .annotation-warning { background-color: rgba(255, 152, 0, 0.6); color: #fff; padding: 2px 4px; border-radius: 3px; }
      .annotation-error { background-color: rgba(244, 67, 54, 0.6); color: #fff; padding: 2px 4px; border-radius: 3px; }
      .word-highlight {
        background: rgba(120,130,150,0.22);
        color: #fff;
        border-radius: 4px;
        padding: 1px 4px;
        font-weight: 500;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,0.04);
        transition: background 0.2s;
      }
    ` : `
      .highlighted-line { background-color: rgba(255, 213, 0, 0.1); border-left: 3px solid rgba(255, 213, 0, 0.7); }
      .focus-line { background-color: rgba(33, 150, 243, 0.1); border-left: 3px solid rgba(33, 150, 243, 0.7); }
      .line-number { color: rgba(0, 0, 0, 0.5); font-size: 0.8em; margin-right: 10px; }
      .annotation { color: rgba(0, 0, 0, 0.7); font-style: italic; margin-left: 8px; padding: 0 4px; }
      .annotation-info { background-color: rgba(33, 150, 243, 0.15); color: #0d47a1; padding: 2px 4px; border-radius: 3px; }
      .annotation-warning { background-color: rgba(255, 152, 0, 0.15); color: #e65100; padding: 2px 4px; border-radius: 3px; }
      .annotation-error { background-color: rgba(244, 67, 54, 0.15); color: #b71c1c; padding: 2px 4px; border-radius: 3px; }
      .word-highlight {
        background: rgba(120,130,150,0.13);
        color: #222;
        border-radius: 4px;
        padding: 1px 4px;
        font-weight: 500;
        box-shadow: 0 1px 2px 0 rgba(0,0,0,0.03);
        transition: background 0.2s;
      }
    `}
  `;

    if (html.includes('<style>')) {
        html = html.replace(/<style>([\s\S]*?)<\/style>/, (match, p1) => {
            return `<style>${p1}${styles}</style>`;
        });
    } else {
        html = `<style>${styles}</style>` + html;
    }

    return html;
}