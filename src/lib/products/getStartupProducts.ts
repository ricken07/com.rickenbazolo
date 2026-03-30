import path from "node:path";
import { promises as fs } from "node:fs";

export interface StartupProduct {
  slug: string;
  name: string;
  tagline: string;
  description: Record<string, string>;
  techStack: string[];
  websiteUrl?: string;
  featured?: boolean;
}

const PRODUCTS_PATH = path.join(process.cwd(), "src", "content", "products", "gad-digital-products.json");

export interface LocalizedStartupProduct extends StartupProduct {
  localizedDescription: string;
}

export async function getStartupProducts(locale: string): Promise<LocalizedStartupProduct[]> {
  const raw = await fs.readFile(PRODUCTS_PATH, "utf-8");
  const products: StartupProduct[] = JSON.parse(raw);
  return products.map((product) => ({
    ...product,
    localizedDescription: product.description?.[locale] ?? product.tagline,
  }));
}
