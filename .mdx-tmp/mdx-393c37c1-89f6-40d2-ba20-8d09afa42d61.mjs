import * as React from "react";
import * as runtime from "react/jsx-runtime";
import { mdx } from "@mdx-js/react";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/*@jsxRuntime automatic*/
/*@jsxImportSource react*/
function _createMdxContent(props) {
  const _components = {
      h2: "h2",
      hr: "hr",
      p: "p",
      ...props.components
    },
    {
      CodeBlock
    } = _components;
  if (!CodeBlock) _missingMdxReference("CodeBlock", true);
  return /*#__PURE__*/_jsxs(_Fragment, {
    children: [/*#__PURE__*/_jsx(_components.hr, {}), "\n", /*#__PURE__*/_jsx(_components.h2, {
      children: "title: Getting Started"
    }), "\n", /*#__PURE__*/_jsx(_components.p, {
      children: "Welcome to your Rust journey! Before we dive in, here’s a taste of what Rust code can look like when you combine many of its powerful features:"
    }), "\n", /*#__PURE__*/_jsx(CodeBlock, {
      language: "rust",
      showLineNumbers: true,
      highlightLines: [2, 5, 10],
      focusLines: [5, 6],
      wordsToHighlight: ["unsafe", "unwrap", "Result"],
      annotations: [{
        line: 2,
        message: "This is the main function!",
        style: "info"
      }, {
        line: 5,
        message: "Be careful with unsafe code.",
        style: "warning"
      }, {
        line: 10,
        message: "Handle errors properly!",
        style: "error"
      }],
      children: `
fn main() {
  // Entry point
  let nums = vec![1, 2, 3, 4, 5];
  let sum: i32 = nums.iter().sum();
  unsafe {
      println!("Sum (unsafe!): {}", sum);
  }
  let res: Result<(), &str> = Err("Oops!");
  res.unwrap();
}
`
    }), "\n", /*#__PURE__*/_jsx(_components.p, {
      children: "This example demonstrates Rust’s syntax, macros, enums, pattern matching, error handling, generics, lifetimes, attributes, doc comments, raw strings, and more. Try editing and highlighting your own code next! 🚀"
    })]
  });
}
export default function MDXContent(props = {}) {
  const {
    wrapper: MDXLayout
  } = props.components || {};
  return MDXLayout ? /*#__PURE__*/_jsx(MDXLayout, {
    ...props,
    children: /*#__PURE__*/_jsx(_createMdxContent, {
      ...props
    })
  }) : _createMdxContent(props);
}
function _missingMdxReference(id, component) {
  throw new Error("Expected " + (component ? "component" : "object") + " `" + id + "` to be defined: you likely forgot to import, pass, or provide it.");
}
