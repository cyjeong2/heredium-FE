<template>
  <section class="contents">
    <section class="banner">
      <img src="~assets/img/intro/heredium_membership.png" alt="" />
    </section>
    <div class="membership-form-container">
      <h1>헤레디움 멤버십 오픈</h1>
      <form>
        <h2>멤버십 종류 선택</h2>
        <div class="membership-form-content">
          <div class="warning-box">
            <img src="~assets/img/emoji/emoji_information.svg" alt="note" width="20px" height="20px" />
            <p>최대 1매까지 예매할 수 있습니다</p>
          </div>

          <div class="membership-radio-list">
            <MembershipOption :model-value="membershipType" :value="'orange'" :change="updateSelection">
              <template #label>오렌지</template>
              <template #price>{{ toKoreaCurrency(30000) }}</template>
            </MembershipOption>

            <MembershipOption :model-value="membershipType" :value="'brown'" :change="updateSelection">
              <template #label>브라운</template>
              <template #price>{{ toKoreaCurrency(50000) }}</template>
            </MembershipOption>
          </div>

          <hr class="gray-divider" />

          <div class="total-amount">
            <p>합계</p>
            <h5>
              {{ toKoreaCurrency(50000) }}
            </h5>
          </div>

          <div class="agreement-list">
            <UNoticePolicy :model-value="isAgreeNoticePolicy" @update:modelValue="isAgreeNoticePolicy = $event" />
            <URefundPolicy :model-value="isAgreeRefundPolicy" @update:modelValue="isAgreeRefundPolicy = $event" />
          </div>
        </div>

        <UButton class="btn-submit" w-size="100" h-size="normal"> 결제하기 </UButton>
      </form>
    </div>
  </section>
</template>

<script>
import { toKoreaCurrency } from '~/assets/js/converter';
import UButton from '~/components/user/common/UButton.vue';
import UNoticePolicy from '~/components/user/common/UNoticePolicy.vue';
import URefundPolicy from '~/components/user/common/URefundPolicy.vue';
import MembershipOption from '~/components/user/page/MembershipOption.vue';

export default {
  name: 'MembershipRegistrationPage',
  components: { MembershipOption, URefundPolicy, UButton, UNoticePolicy },
  props: {},
  data() {
    return {
      membershipType: 'brown',
      isAgreeNoticePolicy: false,
      isAgreeRefundPolicy: false
    };
  },
  watch: {
    agreement(newValue) {
      console.log(newValue);
    }
  },
  methods: { toKoreaCurrency, updateSelection() {} }
};
</script>

<style lang="scss" scoped>
.contents {
  margin: 3.2rem 0 4rem;

  h1 {
    font-size: 2.4rem;
    font-weight: 700;
    line-height: 3.2rem;
    margin-bottom: 1.6rem;
    border-bottom: 1px solid var(--color-default);
    padding-bottom: 20px;
    color: var(--color-default);
  }

  h2 {
    font-size: 1.6rem;
    font-weight: 700;
    line-height: 2.4rem;
    color: var(--color-default);
  }

  .gray-divider {
    color: var(--color-u-grey-2);
    height: 1px;
    margin: 24px 0;
  }

  .banner {
    width: 100dvw;
  }

  .membership-form-container {
    padding: 40px 20px;
  }

  form {
    margin-top: 48px;

    .warning-box {
      margin-top: 24px;
      display: flex;
      justify-content: start;
      gap: 0.8rem;
      color: var(--color-u-grey-4);
    }

    .membership-radio-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
      margin-top: 12px;
    }

    .total-amount {
      display: flex;
      justify-content: space-between;
      align-items: center;
      p {
        font-size: 1.8rem;
        line-height: 2.8rem;
      }
      h5 {
        font-size: 1.8rem;
        line-height: 2.8rem;
        color: var(--color-u-primary);
        font-weight: bold;
      }
    }

    .agreement-list {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
      .agreement-item {
        display: flex;
        align-items: start;
        gap: 0.8rem;
      }
    }

    .btn-submit {
      margin-top: 24px;
      width: 100%;
      /* height: 48px; */
    }
  }
}

@media screen and (min-width: 769px) {
  .contents {
    margin: 4.8rem 0 8.8rem;

    h1 {
      font-weight: 700;
      font-size: 4.2rem;
      line-height: 150%;
    }

    h2 {
      font-style: normal;
      font-weight: 500;
      font-size: 3.6rem;
      line-height: 150%;
      text-align: right;
      letter-spacing: -1px;
    }
  }
}
</style>
