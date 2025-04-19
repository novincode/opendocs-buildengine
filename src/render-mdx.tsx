import { renderToStaticMarkup } from "react-dom/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "../components/mdx-components";
import { initializeHighlighter, extractLanguagesFromMdx } from "./highlighter";

export async function renderMdxToHtml(mdxCode: string) {
  try {
    // Extract languages used in the MDX file
    const languages = extractLanguagesFromMdx(mdxCode);
    console.log(`📝 Detected languages in MDX: ${languages.join(', ')}`);
    
    // Initialize highlighter with these languages
    await initializeHighlighter(languages);
    
    // Optionally log the loaded languages if your highlighter exposes such a method
    // console.log(`🚀 Rendering MDX with supported languages: ${highlighterInstance?.getLoadedLanguages().join(', ') || 'none'}`);
    
    // Now render the MDX after highlighter is initialized
    const jsx = await MDXRemote({ source: mdxCode, components: mdxComponents });
    const html = renderToStaticMarkup(jsx);
    
    // Add basic HTML structure
    return html;
  } catch (error) {
    console.error("Error rendering MDX:", error);
    return `Error occurred while rendering MDX:`;
  }
}
