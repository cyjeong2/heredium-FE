import isEmpty from 'lodash/isEmpty';

export function getErrorCouponEditor(coupon, isRangeDate) {
  const feedback = {};
  if (!coupon.name) {
    feedback.name = true;
  }
  if (!coupon.coupon_type) {
    feedback.couponType = true;
  }
  if (!coupon.discount_percent || isNaN(Number(coupon.discount_percent))) {
    feedback.discountPercent = true;
  } else if (Number(coupon.discount_percent) > 100) {
    feedback.discountPercent = true;
  }
  if (isRangeDate) {
    if (!coupon.start_date || !this.$dayjs(coupon.start_date, 'YYYY-MM-DD', true).isValid()) {
      feedback.start_date = true;
    }
    if (!coupon.end_date || !this.$dayjs(coupon.end_date, 'YYYY-MM-DD', true).isValid()) {
      feedback.end_date = true;
    }
    if (coupon.start_date && coupon.end_date && this.$dayjs(coupon.start_date).isAfter(this.$dayjs(coupon.end_date))) {
      feedback.start_date = true;
      feedback.end_date = true;
    }
  } else if (!coupon.period_in_days || isNaN(Number(coupon.period_in_days))) {
    feedback.periodInDays = true;
  }

  if (!coupon.image_url) {
    feedback.imageUrl = true;
  }
  if (!coupon.is_permanent) {
    if (!coupon.number_of_uses || isNaN(Number(coupon.number_of_uses))) {
      feedback.numberOfUses = true;
    }
  }
  if (isEmpty(feedback)) {
    return null;
  }
  return feedback;
}
