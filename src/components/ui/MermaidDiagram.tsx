'use client';

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidDiagramProps {
  chart: string;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current && chart) {
      mermaid.contentLoaded();
    }
  }, [chart]);

  return (
    <div
      ref={ref}
      className="mermaid flex justify-center overflow-x-auto rounded-lg bg-slate-50 p-6 dark:bg-slate-900"
    >
      {chart}
    </div>
  );
}
