<template>
  <div class="edit">
    <h1 class="mb-17">계정정보</h1>
    <div class="info-table">
      <div class="row">
        <label>이메일</label>
        <div>{{ adminInfo.email }}</div>
      </div>
      <div class="row">
        <label>비밀번호</label>
        <div>
          <SLink :to="{ path: '/admin/user/change-password', query: { userEmail: adminInfo.email } }">변경</SLink>
        </div>
      </div>
      <div class="row">
        <label>이름</label>
        <div>{{ adminInfo.name }}</div>
      </div>
      <div class="row">
        <label>연락처</label>
        <div>{{ adminInfo.phone }}</div>
      </div>
      <div class="row">
        <label>권한</label>
        <div>{{ getAuth(adminInfo.auth) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import SLink from '~/components/admin/commons/SLink';
import { AUTH_TYPE } from '~/assets/js/types';

export default {
  name: 'MyInfoPage',
  components: { SLink },
  layout: 'admin/default',
  data() {
    return {
      adminInfo: this.$store.getters['service/auth/getAdminUserInfo']
    };
  },
  methods: {
    getAuth(auth) {
      return AUTH_TYPE[auth];
    }
  }
};
</script>

<style lang="scss" scoped></style>
