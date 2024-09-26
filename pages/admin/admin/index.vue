<template>
  <div>
    <STitle emoji="gear">관리자</STitle>
    <div class="top-menus mb-16">
      <SLink button-type="primary" to="/admin/admin/edit">등록</SLink>
    </div>
    <SPageable :table-data="tableData" @getTableData="changePage">
      <template #data="{ data }">
        <table class="admin-table">
          <thead>
            <tr>
              <th>NO</th>
              <th>아이디</th>
              <th>이름</th>
              <th>연락처</th>
              <th>등록일시</th>
              <th>최근 로그인일시</th>
              <th>권한</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="!data || !data[0]">
              <td colspan="100%"><div>리스트가 없습니다.</div></td>
            </tr>
            <tr v-for="(item, index) in data" :key="item.id" @click="$router.push(`/admin/admin/edit/${item.id}`)">
              <td>
                <div>{{ tableData.startCount - index }}</div>
              </td>
              <td>
                <div class="text-left">{{ item.email }}</div>
              </td>
              <td>
                <div>{{ item.name }}</div>
              </td>
              <td>
                <div>{{ item.phone }}</div>
              </td>
              <td>
                <div>{{ item.createdDate }}</div>
              </td>
              <td>
                <div>{{ item.lastLoginDate }}</div>
              </td>
              <td>
                <div>{{ getAuth(item.auth) }}</div>
              </td>
              <td>
                <div>{{ item.isEnabled ? '일반' : '정지' }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </SPageable>
  </div>
</template>

<script>
import STitle from '~/components/admin/commons/STitle';
import SPageable from '~/components/admin/commons/SPageable';
import SLink from '~/components/admin/commons/SLink';
import { AUTH_TYPE } from '~/assets/js/types';

export default {
  name: 'AdminUserPage',
  components: { SLink, SPageable, STitle },
  layout: 'admin/default',
  asyncData({ params }) {
    const id = params;

    return { id };
  },
  data() {
    return {
      queryOptions: {
        page: this.$route.query.page || 0,
        size: Number(this.$route.query.size) || 20
      },
      tableData: null,
      id: null
    };
  },
  async fetch() {
    this.$router
      .replace({
        path: this.$route.path,
        query: this.queryOptions
      })
      .catch(() => {});
    this.tableData = await this.$axios.$get('/admin/admins/', {
      params: this.queryOptions
    });
    this.tableData.startCount = this.tableData.totalElements - this.tableData.number * this.tableData.size;
  },
  methods: {
    getAuth(auth) {
      return AUTH_TYPE[auth];
    },
    changePage(page) {
      if (!this.$fetchState.pending) {
        this.queryOptions.page = page;
        this.$fetch();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.top-menus {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.admin-table {
  th {
    &:first-of-type {
      width: 4%;
    }
    &:nth-of-type(2) {
      width: 20%;
    }
    &:nth-of-type(3) {
      width: 15%;
    }
    &:nth-of-type(4) {
      width: 15%;
    }
    &:nth-of-type(5) {
      width: 14%;
    }
    &:nth-of-type(6) {
      width: 14%;
    }
    &:nth-of-type(7) {
      width: 9%;
    }
    &:last-of-type {
      width: 9%;
    }
  }
}
</style>
