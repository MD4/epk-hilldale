// Originals live in resources/. The page only ever shows resized copies made at build time.
const photos = import.meta.glob<{ default: ImageMetadata }>('../../resources/photos/*.jpg', { eager: true });
const logos = import.meta.glob<{ default: ImageMetadata }>('../../resources/logos/*.png', { eager: true });

function find(set: Record<string, { default: ImageMetadata }>, file: string): ImageMetadata {
  const key = Object.keys(set).find((path) => path.endsWith(`/${file}`));
  if (!key) throw new Error(`No such file in resources: ${file}`);
  return set[key].default;
}

export const photo = (file: string) => find(photos, file);
export const logo = (file: string) => find(logos, file);
