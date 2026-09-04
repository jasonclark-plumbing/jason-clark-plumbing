const ASSET_PREFIX = import.meta.env.DEV ? "/public-assets" : "";

export function assetUrl(filename: string) {
  return `${ASSET_PREFIX}/manus-storage/${filename}`;
}