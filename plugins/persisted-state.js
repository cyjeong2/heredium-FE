import createPersistedState from 'vuex-persistedstate';

export default ({ store, $cookies }) => {
  createPersistedState({
    key: ['tokens'],
    paths: ['service.auth.adminAccessToken', 'service.auth.accessToken'],
    storage: {
      getItem(key) {
        return $cookies.get(key);
      },
      setItem(key, value) {
        $cookies.set(key, value, {
          path: '/',
          maxAge: 60 * 60 * 24 * 14
        });
      },
      removeItem(key) {
        $cookies.remove(key);
      }
    }
  })(store);
};
