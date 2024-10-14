<template>
  <section v-if="isDataReady && !!postDetail" class="contents">
    <section class="banner">
      <img :src="postImageDetail" alt="Heredium membership image" />
    </section>
    <div class="membership-form-container">
      <h1>{{ postDetail.name }}</h1>
      <form>
        <h2>멤버십 종류 선택</h2>
        <div class="membership-form-content">
          <div class="warning-box">
            <img src="~assets/img/emoji/emoji_information.svg" alt="note" width="20px" height="20px" />
            <p>최대 1매까지 예매할 수 있습니다</p>
          </div>

          <div class="membership-radio-list">
            <MembershipOption
              v-for="membership in postDetail.memberships"
              :key="membership.membership_id"
              :model-value="membershipIdSelected"
              :value="membership.membership_id"
              :change="updateSelection"
            >
              <template #label>오렌지</template>
              <template v-if="typeof membership.price === 'number'" #price>{{
                toKoreaCurrency(membership.price)
              }}</template>
            </MembershipOption>
          </div>

          <hr class="gray-divider" />

          <div class="total-amount">
            <p>합계</p>
            <h5>
              {{ toKoreaCurrency(totalPrice) }}
            </h5>
          </div>

          <div class="agreement-list">
            <UNoticePolicy :model-value="isAgreeNoticePolicy" @update:modelValue="isAgreeNoticePolicy = $event" />
            <URefundPolicy :model-value="isAgreeRefundPolicy" @update:modelValue="isAgreeRefundPolicy = $event" />
          </div>
        </div>

        <UButton
          class="btn-submit"
          w-size="100"
          h-size="normal"
          :disabled="!membershipIdSelected"
          @click="handleSubmit()"
        >
          결제하기
        </UButton>
      </form>
      <UWarningDialog
        v-if="dialogWarning.open"
        :warning-message="dialogWarning.warningMessage"
        :on-close="closeDialog"
      />
      <UExistedMembershipDialog v-if="hasMembership" :on-confirm="goToMyMembership" />
    </div>
  </section>
</template>

<script>
import { toKoreaCurrency } from '~/assets/js/converter';
import UButton from '~/components/user/common/UButton.vue';
import UNoticePolicy from '~/components/user/common/UNoticePolicy.vue';
import URefundPolicy from '~/components/user/common/URefundPolicy.vue';
import UExistedMembershipDialog from '~/components/user/modal/dialog/UExistedMembershipDialog.vue';
import UWarningDialog from '~/components/user/modal/dialog/UWarningDialog.vue';
import MembershipOption from '~/components/user/page/membership/MembershipOption.vue';
import { imageMixin } from '~/mixins/imageMixin';

export default {
  name: 'MembershipRegistrationPage',
  components: { MembershipOption, URefundPolicy, UButton, UNoticePolicy, UWarningDialog, UExistedMembershipDialog },
  mixins: [imageMixin],
  props: {},
  async asyncData({ query, $axios }) {
    try {
      const postId = query.id;
      if (!postId) {
        return { postDetail: null, isDataReady: true };
      }
      const postDetail = await $axios.$get(`/user/posts/${postId}`);
      return { postDetail, isDataReady: true };
    } catch (error) {
      console.error(error);
      return { postDetail: null, isDataReady: true };
    }
  },
  data() {
    return {
      isDataReady: false,
      postDetail: null,
      membershipIdSelected: '',
      totalPrice: 0,
      isAgreeNoticePolicy: false,
      isAgreeRefundPolicy: false,
      dialogWarning: {
        open: false,
        warningMessage: null
      },
      hasMembership: false
    };
  },
  computed: {
    postImageDetail() {
      return this.getImage(this.postDetail.image_url);
    }
  },
  watch: {
    agreement(newValue) {
      console.log(newValue);
    }
  },
  mounted() {
    this.checkUserLogin();
  },
  methods: {
    toKoreaCurrency,
    checkUserLogin() {
      const isLogged = !!this.$store.getters['service/auth/getAccessToken'];
      if (!isLogged) {
        this.$router.replace(`/auth/login?redirectPage=${this.$route.fullPath}`);
      }
    },
    updateSelection(id) {
      this.membershipIdSelected = id;
      const membershipOption = this.postDetail.memberships.find((item) => item.membership_id === id);
      this.totalPrice = membershipOption.price || 0;
    },
    closeDialog() {
      this.dialogWarning = {
        open: false,
        warningMessage: ''
      };
    },
    validateBeforeRegister() {
      if (!this.isAgreeNoticePolicy) {
        this.dialogWarning = {
          open: true,
          warningMessage: '관람 유의사항에 동의해주세요.'
        };
        return false;
      }
      if (!this.isAgreeRefundPolicy) {
        this.dialogWarning = {
          open: true,
          warningMessage: '환불 규정에 동의해주세요.'
        };
        return false;
      }
      return true;
    },
    handleSubmit() {
      const isValid = this.validateBeforeRegister();
      if (!isValid) {
        return null;
      }
      if (!this.membershipIdSelected) {
        return null;
      }

      this.$axios
        .post('/user/membership/register', {
          membership_id: this.membershipIdSelected
        })
        .then(() => {
          this.goToMyMembership();
        })
        .catch((err) => {
          const errorMessage = err.response.data?.MESSAGE || '';
          if (errorMessage === 'MEMBERSHIP_REGISTRATION_ALREADY_EXISTS') {
            this.hasMembership = true;
            return null;
          }
        });
    },
    goToMyMembership() {
      this.$router.push('/mypage/purchase/membership');
    }
  }
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
    display: flex;
    justify-content: center;
    img {
      object-fit: contain;
      min-height: 50px;
    }
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
      P {
        flex: 1;
      }
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
    margin: 1.2rem 0 8.8rem;
    padding: 104px 38px 12px 38px;
    display: flex;
    gap: 24px;
    flex-direction: row-reverse;
    position: relative;

    h1 {
      font-weight: 700;
      font-size: 4.2rem;
      line-height: 150%;
      position: absolute;
      top: 0px;
      left: 0;
      width: calc(100dvw - 74px);
      margin: 0 38px 20px 38px;
    }

    h2 {
      font-style: normal;
      font-weight: 500;
      font-size: 2.4rem;
      line-height: 150%;
      letter-spacing: -1px;
    }

    .banner {
      width: 100%;
      flex: 1;
      justify-content: end;
      align-items: start;
      img {
        width: 100%;
        max-width: 720px;
      }
    }
    .membership-form-container {
      width: 30%;
      max-width: 600px;
      padding: 0;
      form {
        margin-top: 0;
      }
    }
  }
}

@media screen and (min-width: 1025px) {
  .contents {
    margin: 4rem 0 8.8rem;
  }
}
</style>
