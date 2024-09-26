import https from 'https';

const refreshSubscribers = [];
const onTokenRefreshed = (accessToken) => {
  refreshSubscribers.map((callback) => callback(accessToken));
};
const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};
let isTokenRefreshing = false;

export default function ({ $axios, redirect, store, error: nuxtError }) {
  // eslint-disable-next-line no-unused-vars
  const agent = new https.Agent({
    rejectUnauthorized: false
  });
  $axios.setBaseURL(process.env.API_URL + '/api');
  $axios.onRequest((config) => {
    const accessToken = config.url.startsWith('/admin')
      ? store.getters['service/auth/getAdminAccessToken']
      : store.getters['service/auth/getAccessToken'];
    config.headers.Authorization = `Bearer ${accessToken}`;
    config.httpsAgent = agent;
    config.withCredentials = true;
    config.paramsSerializer = (paramObj) => {
      const params = new URLSearchParams();
      for (const key in paramObj) {
        if (paramObj[key] != null && paramObj[key] !== undefined) {
          params.append(key, paramObj[key]);
        }
      }
      return params.toString();
    };

    return config;
  });
  $axios.onRequestError((error) => {
    Promise.reject(error);
  });
  $axios.onResponse((response) => {
    return response;
  });
  $axios.onResponseError(async (error) => {
    const adminUrl = error.config.url.startsWith('/admin');
    const errorCode = error.response?.status;
    const errorMessage = error.response?.data?.MESSAGE || '';
    const originalRequest = error.config;
    const accessToken = adminUrl
      ? store.getters['service/auth/getAdminAccessToken']
      : store.getters['service/auth/getAccessToken'];

    const redirectUrl = adminUrl ? '/admin/logout' : '/auth/logout';
    const refreshUrl = adminUrl
      ? `/admin/auth/refresh?accessToken=${accessToken}`
      : `/user/auth/refresh?accessToken=${accessToken}`;
    const setAccessTokenUrl = adminUrl ? 'service/auth/setAdminAccessToken' : 'service/auth/setAccessToken';

    if (errorCode === 400) {
      if (
        errorMessage === 'USER_DISABLED' ||
        errorMessage === 'TOKEN_VALID_FAIL' ||
        errorMessage === 'TOKEN_USER_NOT_FOUND'
      ) {
        redirect(redirectUrl);
      } else {
        return Promise.reject(error);
      }
    } else if (errorCode === 401) {
      if (errorMessage === 'UNAUTHORIZED') {
        if (!isTokenRefreshing) {
          isTokenRefreshing = true;
          const newAccessToken = await $axios
            .$get(refreshUrl)
            .catch(() => {
              nuxtError(redirect(404));
            })
            .finally(() => {
              isTokenRefreshing = false;
            });

          store.commit(setAccessTokenUrl, newAccessToken);
          $axios.defaults.headers.common.Authorization = `Bearer ${newAccessToken}`;
          onTokenRefreshed(newAccessToken);

          return $axios(originalRequest);
        }

        return new Promise((resolve) => {
          addRefreshSubscriber((accessToken) => {
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            resolve($axios(originalRequest));
          });
        });
      }
    } else if (errorCode === 500) {
      nuxtError(redirect('/error/server'));
    } else {
      return Promise.reject(error);
    }
  });
}
