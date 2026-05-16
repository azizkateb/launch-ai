export function getHeroImage(hero: { image?: { type?: string; url?: string; alt?: string } } | undefined) {
  const placeholder = "/placeholder.jpg";
  if (!hero) return placeholder;
  const img = hero.image;
  if (!img) return placeholder;
  if (img.url && img.url.trim() !== "") return img.url;
  return placeholder;
}
