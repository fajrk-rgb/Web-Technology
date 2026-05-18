function normalizePrice(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function roundMoney(value) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

function getDisplayPrice(product) {
  if (!product) {
    return 0;
  }

  const basePrice = normalizePrice(product.price);

  if (product.isOnSale) {
    return roundMoney(basePrice * 0.9);
  }

  return roundMoney(basePrice);
}

module.exports = {
  getDisplayPrice,
  roundMoney
};
