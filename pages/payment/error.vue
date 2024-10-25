<template>
  <div class="container">
    <img src="~assets/img/icon/icon_error.svg" alt="" />
    <h3>결제 처리 중 오류가 발생했습니다. 다시 시도해 주시거나 고객 지원팀에 문의해 주세요.</h3>
    <p v-if="errorMessage">{{ errorMessage }}</p>
  </div>
</template>

<script>
export default {
  name: 'PaymentError',
  data() {
    return {
      errorMessage: ''
    };
  },
  created() {
    this.errorMessage = this.$route.query.error || '';
  },
  methods: {}
};
</script>

<style scoped lang="scss">
.container {
  margin: 70px 0;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  & > * {
    max-width: 620px;
  }
  img {
    width: 100%;
    max-width: 300px;
    object-fit: contain;
    height: auto;
  }
  h3 {
    margin-top: 28px;
  }
  p {
    margin-top: 12px;
  }
}
</style>
