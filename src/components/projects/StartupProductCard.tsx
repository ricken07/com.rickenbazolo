import type { LocalizedStartupProduct } from "@/lib/products/getStartupProducts";
import { Badge } from "../ui/Badge";

interface StartupProductCardProps {
  product: LocalizedStartupProduct;
}

export function StartupProductCard({ product }: StartupProductCardProps) {
  return (
    <article className="rounded-2xl border border-border/60 bg-card p-6">
      <div className="space-y-3">
        {product.featured && <Badge>Featured</Badge>}
        <h3 className="text-2xl font-semibold">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{product.tagline}</p>
        <p>{product.localizedDescription ?? product.tagline}</p>
        <div className="flex flex-wrap gap-2 pt-2">
          {product.techStack.map((item) => (
            <Badge key={item}>{item}</Badge>
          ))}
        </div>
        {product.websiteUrl && (
          <a href={product.websiteUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Visit website
          </a>
        )}
      </div>
    </article>
  );
}
