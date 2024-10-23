<template>
  <div class="container">
    <img src="~assets/img/icon/icon_membership_unavailable.svg" />
    <h3>현재 멤버십 프로그램이 진행되지 않고 있습니다.</h3>
  </div>
</template>

<script>
export default {
  name: 'MembershipRegistrationUnavailable',

  data() {
    return {};
  }
};
</script>

<style scoped lang="css">
.container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  flex-direction: column;
  min-height: max(50vh, 300px);
}
h3 {
  margin-top: 24px;
  text-align: center;
}
</style>
