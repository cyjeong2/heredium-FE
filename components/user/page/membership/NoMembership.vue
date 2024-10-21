<template>
  <div class="center">
    <div>
      <img src="~assets/img/icon/icon_no_membership.svg" />
    </div>
    <div class="content">
      <div class="center">
        <p>멤버십 회원이 아닙니다.</p>
        <p>헤레디움 멤버십 가입을 통해 다양한 혜택을 누려보세요!</p>
      </div>
    </div>

    <UButton class="button" @click="goToMembershipRegister">멤버십 가입하러 가기 </UButton>
  </div>
</template>

<script>
import UButton from '~/components/user/common/UButton';

export default {
  name: 'NoMembership',
  components: { UButton },
  methods: {
    goToMembershipRegister() {
      this.$router.push(`/membership/registration`);
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  width: 250px;
  text-align: center;
  color: var(--color-u-placeholder);
  margin-bottom: 3.2rem;
  margin-top: 2rem;
}

.button {
  width: 100% !important;
  height: 4.8rem;
}
</style>
