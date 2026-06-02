import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/Container";
import Link from "next/link";
import Image from "next/image";

export default async function GadDigitalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <main className="py-16 md:py-24">
      <Container className="space-y-24">
        {/* 6.1. INTRODUCTION */}
        <section className="mx-auto max-w-4xl space-y-0 text-center">
          <div className="relative mx-auto h-64 w-64 items-center justify-center overflow-hidden">
             <Image
               src="/logo_gd_a.png"
               alt="Gad Digital Logo"
               fill
               className="object-contain"
             />
          </div>
          <p className="text-xl leading-relaxed text-muted-foreground">
            {locale === "fr"
              ? "Gad Digital est l’entreprise technologique que j’ai fondée pour accompagner les organisations dans la conception, le développement et l’intégration de solutions numériques modernes."
              : "Gad Digital is the technology company I founded to support organizations in the design, development and integration of modern digital solutions."}
          </p>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground/80">
             {locale === "fr"
               ? "Elle porte mes activités entrepreneuriales autour du développement de solutions digitales, de l’intelligence artificielle appliquée, de l’architecture logicielle, de la formation technique et de l’accompagnement de projets numériques."
               : "It carries my entrepreneurial activities around digital solution development, applied artificial intelligence, software architecture, technical training and support for digital projects."}
          </p>
        </section>

        {/* 6.2. POSITIONNEMENT */}
        <section className="rounded-3xl border border-border/70 bg-card/50 p-8 md:p-16">
          <div className="grid gap-12 md:grid-cols-2 md:items-center">
             <div className="space-y-6">
                <h2 className="font-heading text-3xl font-bold">
                  {locale === "fr" ? "Une entreprise technologique orientée solutions" : "A Solution-Oriented Tech Company"}
                </h2>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {locale === "fr"
                    ? "Gad Digital intervient à la croisée de l’ingénierie logicielle, de l’intelligence artificielle appliquée et du développement de produits numériques. L’entreprise accompagne les organisations dans la création de solutions utiles, robustes et adaptées à leurs enjeux métier."
                    : "Gad Digital operates at the crossroads of software engineering, applied artificial intelligence and digital product development. The company supports organizations in creating useful, robust solutions adapted to their business challenges."}
                </p>
             </div>
             <div className="relative h-72 overflow-hidden rounded-2xl border border-border/60 bg-background/50 md:h-full">
                <Image
                  src="/bg2.png"
                  alt="Gad Digital Tech Background"
                  fill
                  className="object-cover"
                />
             </div>
          </div>
        </section>

        {/* 6.3. DOMAINES D'INTERVENTION */}
        <section className="space-y-12">
          <h2 className="text-center font-heading text-3xl font-bold">
            {locale === "fr" ? "Domaines d’intervention" : "Areas of Expertise"}
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: locale === "fr" ? "Applications Web & Mobiles" : "Web & Mobile Apps",
                text: locale === "fr" ? "Développement d’applications sur mesure orientées performance et UX." : "Custom application development focused on performance and UX."
              },
              {
                title: locale === "fr" ? "Architecture logicielle" : "Software Architecture",
                text: locale === "fr" ? "Conception de systèmes robustes, évolutifs et maintenables." : "Design of robust, scalable and maintainable systems."
              },
              {
                title: locale === "fr" ? "IA appliquée" : "Applied AI",
                text: locale === "fr" ? "Intégration de LLM, RAG et agents IA dans vos processus métier." : "Integration of LLM, RAG and AI agents into your business processes."
              },
              {
                title: locale === "fr" ? "Formation technique" : "Technical Training",
                text: locale === "fr" ? "Montée en compétence des équipes sur Java, Spring et l'IA." : "Upskilling teams on Java, Spring and AI."
              },
              {
                title: locale === "fr" ? "Accompagnement de projets" : "Project Support",
                text: locale === "fr" ? "Conseil stratégique et technique pour vos initiatives numériques." : "Strategic and technical advice for your digital initiatives."
              },
              {
                title: locale === "fr" ? "Solutions métier" : "Business Solutions",
                text: locale === "fr" ? "Création de produits numériques répondant à des besoins concrets." : "Creation of digital products meeting concrete needs."
              }
            ].map((domain) => (
              <div key={domain.title} className="rounded-2xl border border-border/60 bg-card p-8 space-y-4 shadow-sm transition hover:border-accent/40">
                <h3 className="font-heading text-xl font-bold">{domain.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{domain.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 6.4. PROJETS & CTA FINAL */}
        <section className="relative overflow-hidden rounded-3xl bg-[#1a1d2e] p-8 md:p-16 text-center text-white">
          <div className="relative z-10 mx-auto max-w-2xl space-y-8">
            <h2 className="font-heading text-3xl font-bold md:text-4xl">
              {locale === "fr" ? "Prêt à transformer vos idées en réalité ?" : "Ready to transform your ideas into reality?"}
            </h2>
            <p className="text-lg text-slate-300">
              {locale === "fr"
                ? "Les projets portés ou accompagnés par Gad Digital disposent de leurs propres sites web ou espaces dédiés. Le site Gad Digital présente l’écosystème, les solutions et les initiatives développées par l’entreprise."
                : "Projects carried out or supported by Gad Digital have their own websites or dedicated spaces. The Gad Digital site presents the ecosystem, solutions and initiatives developed by the company."}
            </p>
            <Link
              href="https://gaddigital.io"
              target="_blank"
              className="inline-flex items-center gap-2 rounded-full bg-white px-10 py-4 font-bold text-[#1a1d2e] transition hover:scale-[1.02] hover:bg-slate-100"
            >
              {locale === "fr" ? "Aller sur le site Gad Digital" : "Visit Gad Digital website"}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-accent/10 blur-3xl" />
        </section>

      </Container>
    </main>
  );
}
