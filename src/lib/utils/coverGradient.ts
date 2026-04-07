export function getCoverGradient(tags: string[]): string {
  const t = tags.map((s) => s.toLowerCase()).join(" ");
  if (/java|jpa|hibernate|jakarta/.test(t))
    return "from-orange-500/20 via-amber-400/10 to-transparent";
  if (/spring/.test(t))
    return "from-green-500/20 via-emerald-400/10 to-transparent";
  if (/\bai\b|llm|langchain|machine.learning/.test(t))
    return "from-blue-600/20 via-indigo-400/10 to-transparent";
  if (/docker|kubernetes/.test(t))
    return "from-sky-500/20 via-cyan-400/10 to-transparent";
  if (/git/.test(t))
    return "from-rose-500/20 via-pink-400/10 to-transparent";
  if (/react|next|typescript/.test(t))
    return "from-violet-500/20 via-purple-400/10 to-transparent";
  return "from-[#0693e3]/15 via-[#0693e3]/5 to-transparent";
}
