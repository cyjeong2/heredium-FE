import jwtDecode from 'jwt-decode';

export default ({ redirect, store, route }) => {
  const isAdminPath = route.path.startsWith('/admin');

  if (isAdminPath) {
    /**
     * depth
     *    - level1: /admin/{level1}
     *    - level2: /admin/{level1}/{level2}
     *    - levelN: /admin/{level1}/{level2} ... /{levelN}
     */
    const depthLevel1 = route.path.split('/')[2] ?? '';
    const adminToken = store.getters['service/auth/getAdminAccessToken'];
    const checkAdminLogin = () => {
      const exceptionPathList = ['login', 'user-find', 'change-password', 'password-not-found'];

      if (!exceptionPathList.includes(depthLevel1) && !adminToken) {
        redirect('/admin/login');
      } else if (exceptionPathList.includes(depthLevel1) && adminToken) {
        redirect('/admin');
      }
    };
    const adminAuthProcess = () => {
      if (process.server) {
        const authLevel1ExceptionPage = {
          ADMIN: [],
          // "ADMIN(최고권한)"의 경우 모든 페이지에 접근이 가능한 기준으로 하여 따로 페이지 권한 처리를 하지 않음.
          SUPERVISOR: ['admin'],
          MANAGER: ['common', 'ticket', 'terms', 'statistics', 'user', 'admin', 'coffee'],
          COFFEE: ['', 'site', 'common', 'ticket', 'terms', 'statistics', 'user', 'admin']
        };
        let adminAuth;

        try {
          const adminUserInfo = jwtDecode(adminToken);

          adminAuth = adminUserInfo.role;
          store.commit('service/auth/setAdminUserInfo', adminUserInfo);
        } catch (e) {
          adminAuth = null;
          // console.error(e);
        }

        if (adminAuth === 'SUPERVISOR' && authLevel1ExceptionPage.SUPERVISOR.includes(depthLevel1)) {
          redirect('/admin/no-auth');
        } else if (adminAuth === 'MANAGER' && authLevel1ExceptionPage.MANAGER.includes(depthLevel1)) {
          redirect('/admin/no-auth');
        } else if (adminAuth === 'COFFEE' && authLevel1ExceptionPage.COFFEE.includes(depthLevel1)) {
          redirect('/admin/no-auth');
        }
      }
    };

    checkAdminLogin();
    adminAuthProcess();
  } else {
    /**
     * depth
     *    - level1: /{level1}
     *    - level2: /{level1}/{level2}
     *    - levelN: /{level1}/{level2} ... /{levelN}
     */

    const depthLevel1 = route.path.split('/')[1] ?? '';
    const userToken = store.getters['service/auth/getAccessToken'];

    if (depthLevel1 === 'mypage' && !userToken) {
      redirect('/auth/login');
    }
  }
};
