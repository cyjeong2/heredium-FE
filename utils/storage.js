export const localStorageKeyName = {
  couponIssuance: 'coupon-issuance-storage'
};

export function getCouponIssuanceStorage() {
  try {
    const stringData = localStorage.getItem(localStorageKeyName.couponIssuance);
    if (!stringData) {
      return null;
    }
    return Number(stringData);
  } catch (error) {
    return null;
  }
}

export function setCouponIssuanceStorage(couponId) {
  try {
    if (couponId) {
      localStorage.setItem(localStorageKeyName.couponIssuance, String(couponId));
      return true;
    }
  } catch (error) {
    return null;
  }
}

export function removeCouponIssuanceStorage() {
  localStorage.removeItem(localStorageKeyName.couponIssuance);
}
