import { ShikiTransformer, Highlighter, createHighlighter } from 'shiki';

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

// Pre-initialize the highlighter
let highlighterInstance: Highlighter | null = null;
let highlighterPromise: Promise<Highlighter> | null = null;

// Initialize with specific languages
export async function initializeHighlighter(languages: string[] = []) {
    // Standard languages to always include
    const standardLangs = ['javascript', 'typescript', 'jsx', 'tsx', 'json', 'html', 
                          'css', 'markdown', 'bash', 'shell', 'plaintext', 'rust'];
    
    // Combine with any additional languages
    const allLangs = Array.from(new Set([...standardLangs, ...languages]));
    
    console.log(`🔄 Initializing highlighter with languages: ${allLangs.join(', ')}`);
    
    try {
        highlighterInstance = await createHighlighter({
            themes: ['github-dark', 'github-light'],
            langs: allLangs,
        });
        console.log('✅ Highlighter initialized successfully');
        return highlighterInstance;
    } catch (err) {
        console.error('❌ Failed to initialize highlighter:', err);
        // Try with minimal languages as fallback
        try {
            highlighterInstance = await createHighlighter({
                themes: ['github-dark', 'github-light'],
                langs: ['plaintext'],
            });
            console.log('⚠️ Initialized minimal fallback highlighter');
            return highlighterInstance;
        } catch (fallbackErr) {
            console.error('❌ Critical error initializing highlighter:', fallbackErr);
            return null;
        }
    }
}

// Synchronous highlightCode that uses the pre-initialized highlighter
export function highlightCode({
    code,
    lang,
    theme = 'github-dark',
    highlightLines,
    showLineNumbers,
    focusLines,
    annotations,
    wordsToHighlight,
}: HighlightParams): string {
    // Trim code to remove empty lines at the beginning and end
    const trimmedCode = code.replace(/^\s*\n|\n\s*$/g, '');

    // If highlighter isn't ready, return simple HTML
    if (!highlighterInstance) {
        console.warn('Highlighter not initialized yet, using fallback rendering');
        // Simple HTML fallback with minimal styling
        return `<pre class="fallback-highlight"><code class="language-${lang}">${
            trimmedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        }</code></pre>`;
    }

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

    // Safely access the highlighter with fallbacks
    try {
        // Make sure the language exists in the highlighter
        const supportedLang = highlighterInstance.getLoadedLanguages().includes(lang as any) ? 
            lang : 'plaintext';
        
        // Make sure the theme exists in the highlighter
        const supportedTheme = highlighterInstance.getLoadedThemes().includes(theme as any) ? 
            theme : 'github-dark';
            
        let html = highlighterInstance.codeToHtml(trimmedCode, {
            lang: supportedLang,
            theme: supportedTheme,
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
    } catch (error) {
        console.error('Error highlighting code:', error);
        return `<pre class="fallback-highlight"><code class="language-${lang}">${
            trimmedCode.replace(/</g, '&lt;').replace(/>/g, '&gt;')
        }</code></pre>`;
    }
}

// Helper function to extract code languages from MDX content
export function extractLanguagesFromMdx(mdxContent: string): string[] {
    const languages = new Set<string>(['plaintext']); // Always include plaintext as fallback
    
    // Pattern 1: Detect languages in markdown fenced code blocks ```lang
    const fencedCodeRegex = /```([a-z0-9+\-#.]+)?/g;
    let match;
    while ((match = fencedCodeRegex.exec(mdxContent)) !== null) {
        const lang = match[1]?.trim();
        if (lang) {
            languages.add(normalizeLang(lang));
        }
    }
    
    // Pattern 2: Detect languages in <CodeBlock language="lang"> components
    const codeBlockComponentRegex = /<CodeBlock[^>]*language=["']([a-z0-9+\-#.]+)["'][^>]*>/gi;
    while ((match = codeBlockComponentRegex.exec(mdxContent)) !== null) {
        const lang = match[1]?.trim();
        if (lang) {
            languages.add(normalizeLang(lang));
        }
    }
    
    // Log all found languages
    if (languages.size > 1) { // More than just plaintext
        console.log('🔍 Found languages in MDX:', Array.from(languages).filter(l => l !== 'plaintext').join(', '));
    }
    
    return Array.from(languages);
}

// Add a helper function to get the normalized language name
function normalizeLang(lang: string): string {
    // Map some common aliases
    const aliases: Record<string, string> = {
        'js': 'javascript',
        'ts': 'typescript',
        'py': 'python',
        'rb': 'ruby',
        'sh': 'bash',
        'yml': 'yaml'
    };
    
    return aliases[lang.toLowerCase()] || lang.toLowerCase() || 'plaintext';
}