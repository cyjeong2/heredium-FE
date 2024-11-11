<template>
  <div v-if="isDataReady && !!postDetail">
    <section class="contents">
      <div class="container">
        <h1 class="title" :class="{ 'mb-2rem': postDetail.sub_title }">{{ postDetail.name }}</h1>
        <h2 v-if="postDetail.sub_title" class="sub-title">{{ postDetail.sub_title }}</h2>
      </div>
      <section class="banner">
        <img :src="postImageDetail" alt="Heredium membership image" />
      </section>

      <section class="container">
        <div class="grid-content membership-content-editor">
          <h2>멤버십 소개</h2>
          <div v-html="postDetail.content_detail"></div>
        </div>
      </section>

      <section class="container">
        <div class="grid-content top-border">
          <h2>멤버십 종류</h2>
          <div class="membership-form-content">
            <div class="membership-radio-list">
              <MembershipOption
                v-for="membership in postDetail.memberships"
                :key="membership.membership_id"
                :model-value="membershipIdSelected"
                :membership="membership"
                :change="openBottomSheet"
                :disable-registration="isDisabledRegistration"
              >
              </MembershipOption>
            </div>
          </div>
        </div>
      </section>

      <section v-if="postImageNote" class="note container">
        <div class="grid-content top-border">
          <h2>문의사항</h2>
          <div>
            <img :src="postImageNote" alt="Heredium membership note" />
          </div>
        </div>
      </section>
    </section>

    <UBottomSheet :visible="isVisibleBottomSheet" @onclose="isShowBottomSheet = false">
      <div class="total-amount">
        <p>합계</p>
        <h5>
          {{ toKoreaCurrency(totalPrice) }}
        </h5>
      </div>

      <div class="agreement-list">
        <UNoticePolicy
          :model-value="isAgreeNoticePolicy"
          @update:modelValue="isAgreeNoticePolicy = $event"
          @open-term="isShowNoticePolicy = true"
        />
        <URefundPolicy
          :model-value="isAgreeRefundPolicy"
          @update:modelValue="isAgreeRefundPolicy = $event"
          @open-term="handleShowRefundPolicy"
        />
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
    </UBottomSheet>
    <UWarningDialog v-if="dialogWarning.open" :warning-message="dialogWarning.warningMessage" :on-close="closeDialog" />
    <UExistedMembershipDialog v-if="hasMembership" :on-confirm="goToMyMembership" />
    <UTermModal
      :is-show="isShowNoticePolicy"
      term-target="notice"
      @close="isShowNoticePolicy = false"
      @agree="agreeNoticePolicy"
    />
    <URegisterModal
      :is-show="isShowRefundPolicy && refundTermsContent"
      term-target="REFUND"
      :terms-data="refundTermsContent"
      @close="isShowRefundPolicy = false"
      @agree="agreeRefundPolicy"
    />
  </div>
  <section v-else class="container no-data-container">
    <h1 class="title">멤버십</h1>
    <div class="no-data">리스트가 없습니다.</div>
  </section>
</template>

<script>
import { concat } from 'lodash';
import { toKoreaCurrency } from '~/assets/js/converter';
import UBottomSheet from '~/components/user/common/UBottomSheet.vue';
import UButton from '~/components/user/common/UButton.vue';
import UNoticePolicy from '~/components/user/common/UNoticePolicy.vue';
import URefundPolicy from '~/components/user/common/URefundPolicy.vue';
import UExistedMembershipDialog from '~/components/user/modal/dialog/UExistedMembershipDialog.vue';
import UWarningDialog from '~/components/user/modal/dialog/UWarningDialog.vue';
import URegisterModal from '~/components/user/modal/URegisterModal.vue';
import UTermModal from '~/components/user/modal/UTermModal.vue';
import MembershipOption from '~/components/user/page/membership/MembershipOption.vue';
import { imageMixin } from '~/mixins/imageMixin';
import { userMixin } from '~/mixins/userMixin';
import tosspaymentsMixin from '~/store/tosspaymentsMixin';

export default {
  name: 'MembershipRegistrationPage',
  components: {
    MembershipOption,
    URefundPolicy,
    UButton,
    UNoticePolicy,
    UWarningDialog,
    UExistedMembershipDialog,
    UBottomSheet,
    UTermModal,
    URegisterModal
  },
  mixins: [imageMixin, userMixin, tosspaymentsMixin],
  props: {},
  async asyncData({ $axios }) {
    try {
      const postDetail = await $axios.$get(`/user/posts`);
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
      membershipIdSelected: null,
      totalPrice: 0,
      isAgreeNoticePolicy: false,
      isAgreeRefundPolicy: false,
      dialogWarning: {
        open: false,
        warningMessage: null
      },
      hasMembership: false,
      isShowBottomSheet: false,
      isShowRefundPolicy: false,
      refundTermsContent: null,
      isShowNoticePolicy: false
    };
  },
  computed: {
    postImageDetail() {
      return this.getImage(this.postDetail?.thumbnail_urls?.large);
    },
    postImageNote() {
      return this.getImage(this.postDetail?.note_image?.note_image_url);
    },
    eventList() {
      let list = [];
      if (!this.postDetail?.additional_info) {
        return list;
      }
      const additionalInfo = this.postDetail.additional_info;
      const eventList = ['exhibitions', 'programs'];
      const statusList = ['future', 'ongoing', 'completed'];
      for (const status of statusList) {
        for (const event of eventList) {
          const concatList = additionalInfo?.[event]?.[status];
          if (concatList?.length) {
            const adaptedList = concatList.map((item) =>
              Object.assign(item, { tag: status === 'completed' ? 'complete' : 'on-going' })
            );
            list = concat(list, adaptedList);
          }
        }
      }
      return list;
    },
    isVisibleBottomSheet() {
      if (this.dialogWarning?.open || this.isShowNoticePolicy || this.isShowRefundPolicy) {
        return false;
      }
      return this.isShowBottomSheet;
    },
    isDisabledRegistration() {
      let isDisabled = false;
      if (this.postDetail.open_date) {
        const today = this.$dayjs();
        const openDate = this.$dayjs(this.postDetail.open_date, 'YYYY-MM-DD', true);
        isDisabled = today.isBefore(openDate);
      }
      return isDisabled;
    }
  },
  methods: {
    toKoreaCurrency,
    updateSelection(membershipOption) {
      if (this.membershipIdSelected === membershipOption.membership_id) {
        return;
      }
      this.membershipIdSelected = membershipOption.membership_id;
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
          warningMessage: '멤버십 가입 유의사항에 동의해주세요.'
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
      const membershipSelected = this.postDetail.memberships?.find(
        (option) => option.membership_id === this.membershipIdSelected
      );
      if (!membershipSelected) {
        return null;
      }

      this.$axios
        .post('/user/membership/register', {
          membership_id: this.membershipIdSelected
        })
        .then((res) => {
          const amount = res.data?.amount;
          const orderId = res.data?.payment_order_id;
          if (amount !== this.totalPrice) {
            alert('가격이 일치하지 않습니다.');
            return null;
          }
          if (!orderId || !amount) {
            alert('결제 오류');
            return null;
          }
          this.membershipPayment(orderId, amount, membershipSelected?.name);
        })

        .catch((err) => {
          const errorMessage = err.response.data?.MESSAGE || '';
          if (errorMessage === 'MEMBERSHIP_REGISTRATION_ALREADY_EXISTS') {
            this.hasMembership = true;
            this.isShowBottomSheet = false;
            return null;
          }
        });
    },
    goToMyMembership() {
      this.$router.push('/mypage/purchase/membership');
    },
    openBottomSheet(membershipOption) {
      this.updateSelection(membershipOption);

      const isLogged = this.checkUserLogin({
        callbackUrl: this.$route.fullPath
      });
      if (!isLogged) {
        return null;
      }

      this.isShowBottomSheet = true;
    },
    handleShowRefundPolicy(termsData) {
      this.refundTermsContent = termsData;
      this.isShowRefundPolicy = true;
    },
    agreeNoticePolicy() {
      this.isAgreeNoticePolicy = true;
      this.isShowNoticePolicy = false;
    },
    agreeRefundPolicy() {
      this.isAgreeRefundPolicy = true;
      this.isShowRefundPolicy = false;
    }
  }
};
</script>

<style lang="css" scoped>
.contents {
  display: grid;
  row-gap: 40px;
  grid-template-columns: 1fr;
  padding: 0 !important;
}

.mb-2rem {
  margin-bottom: 2rem;
}

h1 {
  font-size: 2.4rem;
  font-weight: 700;
  line-height: 100%;
  margin-top: 3.2rem;
  margin-bottom: 0;
  color: var(--color-default);
}

h2 {
  margin-bottom: 2.8rem;
  font-size: 2rem;
  font-weight: 700;
  line-height: 100%;
  color: var(--color-default);
}

.sub-title {
  margin-bottom: 0;
}

.top-border {
  border-top: 1px solid var(--color-default);
  padding-top: 2rem;
}

.gray-divider {
  color: var(--color-u-grey-2);
  height: 1px;
  margin: 24px 0;
}

.no-data-container .title {
  margin: 3.2rem 0 6.4rem;
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 100%;
  margin-bottom: 1.6rem;
  padding-bottom: 1.6rem;
  border-bottom: none;
}
.no-data {
  height: auto;
  padding: 12rem 0;
  border-top: 1px solid var(--color-black);
  font-weight: 500;
  font-size: 2rem;
  line-height: 150%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12rem;
  color: var(--color-u-grey-3);
}

.banner {
  padding: 0;
  display: flex;
  justify-content: center;
}
.banner img {
  object-fit: contain;
  min-height: 50px;
  width: 100%;
}

.membership-section-content {
  margin-left: 20px;
  margin-right: 20px;
}

.content-detail {
  max-width: 100%;
}

.warning-box {
  margin-top: 20px;
  display: flex;
  justify-content: start;
  gap: 0.8rem;
  color: var(--color-u-grey-4);
}
.warning-box p {
  flex: 1;
}

.membership-radio-list {
  display: grid;
  grid-template-columns: 1fr;
  column-gap: 1rem;
  row-gap: 3rem;
  width: 100%;
  margin-top: 12px;
}
.membership-radio-list > div {
  margin: auto;
}

.membership-form-container .total-amount,
.membership-form-container .agreement-list,
.membership-form-container .btn-submit {
  display: none;
}

.note img {
  width: 100%;
  object-fit: contain;
  height: auto;
}

.total-amount {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
}

.total-amount p {
  font-size: 1.8rem;
  line-height: 2.8rem;
}
.total-amount h5 {
  font-size: 1.8rem;
  line-height: 2.8rem;
  color: var(--color-u-primary);
  font-weight: bold;
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
  display: block;
  margin-top: 24px;
  width: 100%;
}

@media screen and (min-width: 769px) {
  .contents {
    /* margin: 0 0 8.8rem; */
    padding: unset;
  }

  .membership-section-content {
    margin-left: 20px;
    margin-right: 20px;
  }

  .contents h1 {
    font-weight: 700;
    font-size: 4.2rem;
    line-height: 150%;
    margin-top: 4.8rem;
    margin-bottom: 2rem;
  }

  .contents .sub-title {
    margin-bottom: 2rem;
  }

  .contents h2 {
    margin-bottom: 2.8rem;
    font-weight: 600;
    font-size: 3.6rem;
    line-height: 150%;
  }

  .top-border {
    padding-top: 3.2rem;
  }

  .no-data-container .title {
    margin: 4.8rem 0 8.8rem 0;
    font-weight: 700;
    font-size: 4.2rem;
    line-height: 150%;
  }

  .contents .banner {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: start;
  }
  .contents .banner img {
    max-height: 80rem;
    width: 100%;
    object-fit: contain;
  }

  .grid-content {
    display: flex;
  }
  .grid-content > h2 {
    margin: 0;
    padding: 0;
    width: 34.0176%;
    padding-right: 3.2rem;
  }
  .grid-content > div {
    width: 65.9824%;
    margin-left: auto;
  }

  .membership-content-editor {
    margin-top: 40px;
  }

  .contents .membership-form-container {
    padding: 0;
    form {
      margin-top: 0;
    }
  }
  .membership-radio-list {
    grid-template-columns: 1fr 1fr;
  }
  .membership-radio-list > div {
    margin: unset;
  }
  .contents .total-amount,
  .contents .agreement-list {
    display: flex;
  }
  .contents .btn-submit {
    display: block;
  }

  .warning-text {
    font-size: 2rem;
    line-height: 2.6rem;
  }
}
</style>
