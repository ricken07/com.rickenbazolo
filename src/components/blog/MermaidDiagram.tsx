"use client";

import { MermaidBlock } from "react-markdown-mermaid";

type MermaidDiagramProps = {
  code: string;
};

// Rendered in place of ```mermaid fences (see rehypeMermaid in mdx.ts).
// A fixed light mermaid theme keeps diagrams legible in both light and dark
// page themes without needing to react to the site's theme toggle.
export function MermaidDiagram({ code }: MermaidDiagramProps) {
  return (
    <MermaidBlock
      code={code}
      className="mermaid-diagram"
      mermaidConfig={{
        theme: "neutral",
        fontFamily: "inherit",
        flowchart: { useMaxWidth: true },
        sequence: { useMaxWidth: true },
      }}
      loadingText="Rendering diagram…"
      errorText="Unable to render diagram"
    />
  );
}
