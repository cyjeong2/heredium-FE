<template>
  <section v-if="isDataReady && !!postDetail" class="contents container">
    <section class="banner">
      <img :src="postImageDetail" alt="Heredium membership image" />
    </section>
    <h1 class="membership-section-content">{{ postDetail.name }}</h1>
    <section class="content-detail membership-section-content">
      <div v-html="postDetail.content_detail"></div>
    </section>
    <!-- <UEventCardList class="membership-section-content membership-benefits" :event-list="eventList" /> -->
    <div class="membership-section-content membership-form-container">
      <form>
        <div class="membership-form-content">
          <h1>멤버십 종류</h1>
          <div class="warning-box">
            <img src="~assets/img/emoji/emoji_information.svg" alt="note" width="20px" height="20px" />
            <p class="warning-text">최대 1매까지 예매할 수 있습니다</p>
          </div>

          <div class="membership-radio-list">
            <MembershipOption
              v-for="membership in postDetail.memberships"
              :key="membership.membership_id"
              :model-value="membershipIdSelected"
              :membership="membership"
              :change="openBottomSheet"
            >
            </MembershipOption>
          </div>
        </div>
      </form>
      <UWarningDialog
        v-if="dialogWarning.open"
        :warning-message="dialogWarning.warningMessage"
        :on-close="closeDialog"
      />
      <UExistedMembershipDialog v-if="hasMembership" :on-confirm="goToMyMembership" />
    </div>
    <section v-if="postImageNote" class="note membership-section-content">
      <img :src="postImageNote" alt="Heredium membership note" />
    </section>
    <UBottomSheet :visible.sync="isShowBottomSheet">
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
  </section>
  <section v-else class="container">
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
    UBottomSheet
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
      isShowBottomSheet: false
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
        this.isShowBottomSheet = false;
        return false;
      }
      if (!this.isAgreeRefundPolicy) {
        this.dialogWarning = {
          open: true,
          warningMessage: '환불 규정에 동의해주세요.'
        };
        this.isShowBottomSheet = false;
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
          this.membershipPayment(orderId, amount);
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
h1 {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 100%;
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
}

.banner {
  padding: 48px 20px 0 20px;
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
  }

  .contents h2 {
    font-style: normal;
    font-weight: 500;
    font-size: 2.4rem;
    line-height: 150%;
    letter-spacing: -1px;
  }

  .contents .banner {
    width: 100%;
    flex: 1;
    justify-content: start;
    align-items: start;
    img {
      width: 100%;
      min-width: 100%;
      max-width: 720px;
    }
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
