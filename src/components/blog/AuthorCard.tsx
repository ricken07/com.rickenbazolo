import Image from "next/image";
import Link from "next/link";

const socials = [
  { name: "GitHub",   href: "https://github.com/ricken07",           icon: "GH" },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/rickenbazolo/",  icon: "LI" },
  { name: "X",        href: "https://twitter.com/RickenBrice",                icon: "X"  },
];

interface AuthorCardProps {
  locale: string;
}

export function AuthorCard({ locale }: AuthorCardProps) {
  const bio =
    locale === "fr"
      ? "Ingénieur logiciel & IA avec 10+ ans d'expérience. Fondateur de Gad Digital. Contributeur open-source. Conférencier."
      : "Software & AI Engineer with 10+ years of experience. Founder of Gad Digital. Open-source contributor. Speaker.";

  const writtenBy = locale === "fr" ? "Écrit par" : "Written by";

  return (
    <aside className="flex flex-col gap-4 rounded-2xl border border-border/70 bg-card/80 p-6 sm:flex-row sm:items-center">
      <Image
        src="/avatar.jpeg"
        alt="Ricken Bazolo"
        width={64}
        height={64}
        className="h-16 w-16 flex-shrink-0 rounded-full border-2 border-[#0693e3]/30 object-cover"
      />
      <div className="flex-1 space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {writtenBy}
        </p>
        <p className="font-heading text-lg font-bold text-foreground">Ricken Bazolo</p>
        <p className="text-sm leading-relaxed text-muted-foreground">{bio}</p>
        <div className="flex gap-3 pt-1">
          {socials.map(({ name, href }) => (
            <Link
              key={name}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-semibold text-[#0693e3] underline-offset-2 hover:underline"
            >
              {name}
            </Link>
          ))}
        </div>
      </div>
    </aside>
  );
}
