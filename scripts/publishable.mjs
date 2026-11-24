// Only image files leave resources/. Stray system files (.DS_Store and the like) stay behind.
export const isPublishable = (name) => /\.(jpe?g|png|svg)$/i.test(name);
