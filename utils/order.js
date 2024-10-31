export function discountRound(rawPrice, percentage) {
  const isValidInput = typeof rawPrice === 'number' && typeof percentage === 'number';
  if (!isValidInput) {
    return 0;
  }

  const discountPrice = (rawPrice * percentage) / 100;
  const roundedPrice = discountPrice % 1 <= 0.5 ? Math.floor(discountPrice) : Math.ceil(discountPrice);

  return roundedPrice;
}

export function getBiggestPrice(orderListItem, isHana) {
  if (!orderListItem || !orderListItem.length) {
    return 0;
  }
  const rawPriceList = orderListItem.map((orderItem) => {
    if (!orderItem.count) {
      return 0;
    }
    return isHana && orderItem.discounts[0] ? orderItem.discounts[0].price : orderItem.price;
  });
  const maxPrice = Math.max(...rawPriceList);

  return maxPrice;
}
