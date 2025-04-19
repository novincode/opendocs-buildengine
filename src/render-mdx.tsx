import { renderToStaticMarkup } from "react-dom/server";
import { MDXRemote } from "next-mdx-remote/rsc";
import { mdxComponents } from "../components/mdx-components";

export async function renderMdxToHtml(mdxCode: string) {
  // Use next-mdx-remote/rsc to get a React element
  const jsx = await MDXRemote({ source: mdxCode, components: mdxComponents });
  // Render to HTML string
  const html = renderToStaticMarkup(jsx);
  return html;
}
