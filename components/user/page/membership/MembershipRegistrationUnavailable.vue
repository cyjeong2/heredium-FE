<template>
  <div class="container">
    <picture>
      <source srcset="~/assets/img/mobile/noresult.png" media="(max-width: 768px)" />
      <source srcset="~/assets/img/pc/noresult.png" media="(min-width: 769px)" />
      <img src="~/assets/img/mobile/noresult.png" alt="" />
    </picture>
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
