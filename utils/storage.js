export const localStorageKeyName = {
  couponIssuance: 'coupon-issuance-storage'
};

export function getCouponIssuanceStorage() {
  try {
    const stringData = localStorage.getItem(localStorageKeyName.couponIssuance);
    if (!stringData) {
      return null;
    }
    return JSON.parse(stringData);
  } catch (error) {
    return null;
  }
}

export function setCouponIssuanceStorage(payload) {
  try {
    if (payload) {
      localStorage.setItem(localStorageKeyName.couponIssuance, JSON.stringify(payload));
      return true;
    }
  } catch (error) {
    return null;
  }
}
