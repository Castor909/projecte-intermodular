export function effectivePrice(album) {
  const d = album.discountPercent;
  return Number.isFinite(d) && d > 0 ? album.priceEth * (1 - d / 100) : album.priceEth;
}
