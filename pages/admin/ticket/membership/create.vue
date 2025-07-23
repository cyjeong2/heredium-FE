<template>
  <div class="membership-create edit">
    <!-- ① 헤더 -->
    <STitle emoji="pencil">멤버십 등록</STitle>

    <!-- 드롭다운: 기존 멤버십 선택 or 신규 등록 -->
    <div class="membership-select mb-24">
      <label>멤버십명</label>
      <div class="select-row">
        <SDropdown
          v-model="selectedMembershipId"
          :option-list="membershipOptions"
          default-text='선택'
          placeholder="멤버십을 선택해주세요"
          w-size="x-large"
          @input="onMembershipSelect"
        />
        <SButton icon="ic-arrow-down" @click="onClickCreate">멤버십 등록하기</SButton>
      </div>
    </div>

    <!-- ② 선택 시 폼 표시 -->
    <div v-if="showForm" class="membership-form">
      <h3 class="section-title">멤버십 정보</h3>
      <section class="section membership-info mb-24">
        <div class="fields">
          <!-- ① 대표 이미지 -->
          <div class="representative-img">
            <SImageUploadRepresentative
              v-model="membershipImage"
              type="PROJECT_DETAIL_IMAGE"
              :image-src="membershipImage"
              :class="{ 'is-error': isSubmitted && !membershipImage }"
              @image-uploaded="updateThumbnail"
              @image-removed="removeThumbnail"
            />
          </div>

          <!-- ② 멤버십명 / 이용실적을 세로로 쌓기 -->
          <div class="meta-fields">
            <div class="meta-row">
              <label>멤버십명</label>
              <SInput
                v-model="form.name"
                w-size="large"
                placeholder="멤버십 이름을 입력하세요"
              />
            </div>
            <div class="meta-row">
              <label>약칭</label>
              <SInput
                v-model="form.shortName"
                w-size="large"
                placeholder="약칭을 입력하세요"
              />
            </div>
            <div class="meta-row">
              <label>이용실적</label>
              <div class="mileage-input">
                <SInput
                  v-model="form.minMileage"
                  w-size="large"
                  placeholder="수치 입력"
                  suffix="점"
                />
                <span class="suffix-text">마일리지 이상</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <!-- ③ 쿠폰 정보 -->
      <h3 class="section-title">쿠폰 정보</h3>
      <section class="section coupon-section mb-24">
        <div>
          <CouponEditor
            v-for="(coupon, couponIndex) in coupons"
            :key="coupon.id || coupon.tempId"
            :coupon="coupon"
            :show-add-button="couponIndex === coupons.length - 1"
            :show-delete-button="coupons.length > 1"
            :error="isSubmitted ? feedback?.coupons?.[couponIndex] : null"
            :is-coupon-date="false"
            @add-coupon="handleAddCoupon"
            @update-coupon="(e) => handleUpdateCoupon(e, couponIndex)"
            @delete-coupon="() => handleDeleteCoupon(couponIndex)"
          />
        </div>
      </section>
      <!-- ④–⑥ 하단 버튼 -->
      <div class="button-row">
        <!-- <SButton v-if="selectedMembershipId" @click="onDelete">삭제</SButton> -->
        <SButton button-type="primary" :disabled="isSubmitted" @click="beforeOnSave">저장</SButton>
      </div>
    </div>

    <SDialogModal :is-show="modal.isConfirmSave" @close="modal.isConfirmSave = false">
      <template #content>저장하시겠습니까?</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="onSave">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isSave" @close="modal.isSave = false">
      <template #content>저장되었습니다.</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="afterSaveConfirm">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import isEmpty from 'lodash/isEmpty';
import cloneDeep from 'lodash/cloneDeep';
import { COUPON_DEFAULT } from '~/assets/js/types';
import STitle      from '~/components/admin/commons/STitle.vue';
import SDropdown   from '~/components/admin/commons/SDropdown.vue';
import SButton     from '~/components/admin/commons/SButton.vue';
import SInput      from '~/components/admin/commons/SInput.vue';
import CouponEditor from '~/components/admin/page/membership/CouponEditor.vue';
import SImageUploadRepresentative from '~/components/admin/commons/SImageUploadRepresentative.vue';
import SDialogModal from '~/components/admin/modal/SDialogModal';

export default {
  name: 'MembershipCreate',
  components: {
    STitle,
    SDropdown,
    SButton,
    SInput,
    CouponEditor,
    SImageUploadRepresentative,
    SDialogModal,
  },
  layout: 'admin/default',
  props: {
    initialValue: {
      type: Object,
      required: false,
      default: undefined
    },
  },
  data() {
    return {
      coupons: [],
      deletedCoupons: [],
      feedback: {},
      membershipOptions: [],
      couponTypeOptions: [
        { value: 'EXHIBITION', label: '전시' },
        { value: 'PROGRAM',    label: '프로그램' },
        { value: 'COFFEE',     label: '커피' },
        { value: 'ART',        label: '아트숍' },
      ],
      discountModeOptions: [
        { value: 'FIXED', label: '정액' },
        { value: 'PERCENT', label: '정률' }
      ],
      selectedMembershipId: null,
      showForm: false,
      isSubmitted: false,
      form: {
        name: '',
        minMileage: 0,
        shortName: '',
      },
      membershipImage: '',
      mode: 'create',
      modal: {
        isConfirmSave: false,
        isSave: false,
      },
    };
  },
  async mounted() {
    await this.fetchMembershipOptions()
    // 만약 query string 등으로 edit 모드 자동 진입이 필요하면
    // selectedMembershipId 에 값을 세팅하고 onMembershipSelect() 호출
  },
  methods: {
    onClickCreate() {
      this.mode = 'create'
      this.selectedMembershipId = null
      this.resetForm()
      this.showForm = true
    },
    updateThumbnail(e) {
      this.membershipImage = e.resizeImage.large;
    },
    removeThumbnail() {
      this.membershipImage = '';
    },
     // 1) 드롭다운 옵션 조회
    async fetchMembershipOptions() {
      try {
        const { data } = await this.$axios.get('/admin/memberships/options')
        // 백엔드에서 [{ id, name }] 형태로 내려준다고 가정
        this.membershipOptions = data.map(m => ({
          value: m.id,
          label: m.name
        }))
      } catch (e) {
        console.error('멤버십 옵션 조회 실패', e)
      }
    },
    async onMembershipSelect(id) {
      if (!id) return
      this.mode = 'update'
      this.showForm = true

      try {
        const { data } = await this.$axios.get(`/admin/memberships/${id}`)

        const loaded = data.coupons || [];

        // data: { name, imageUrl, usageThreshold, coupons: […] }
        this.form.name        = data.name
        this.form.minMileage  = data.usage_threshold
        this.membershipImage  = data.image_url
        this.form.shortName  = data.short_name
        this.coupons = loaded.length
          ? loaded.map(c => ({
              // id 필드
              id:               c.coupon_id,
              // 편집용 임시 key (로컬에만 남아있다가 삭제)
              tempId:           c.coupon_id,

              // CouponEditor 가 기대하는 키들
              name:             c.name,
              coupon_type:      c.coupon_type,
              discount_percent: c.discount_percent,
              period_in_days:   0,
              number_of_uses:   c.number_of_uses,
              is_permanent:     c.is_permanent,
              image_url:        c.image_url,
            }))
          : [ cloneDeep(COUPON_DEFAULT) ]
        this.deletedCoupons = []
      } catch (e) {
        console.error('멤버십 상세 조회 실패', e)
      }
    },
     // 폼 초기화
    resetForm() {
      this.form = { name: '', minMileage: 0 }
      this.membershipImage = ''
      this.coupons = [cloneDeep(COUPON_DEFAULT)]
      this.deletedCoupons = []
      this.feedback = {}
      this.isSubmitted = false
    },
    beforeOnSave() {
      if (!this.validateForm()) {
        this.isSubmitted = false;
        return;
      }
      this.modal.isConfirmSave = true;
    },
    async onSave() {
      this.saving = true;
      this.modal.isConfirmSave = false;

       // 1) tempId 제거
      const kept = this.coupons.map(c => {
        const { tempId, ...rest } = c
        return rest
      })
      // 2) 삭제된 애들 is_deleted: true 플래그 추가
      const deleted = this.deletedCoupons.map(c => ({
        id:         c.id,
        is_deleted: true
      }))

      const requestBody = {
        name: this.form.name,
        short_name: this.form.shortName,
        image_url: this.membershipImage,
        is_enabled: this.form.isEnabled ?? false,
        usage_threshold: this.form.minMileage,
        coupons: [...kept, ...deleted],
      };

      try {
        if (this.mode === 'create') {
          // 3-1) 생성(create) API 호출
          await this.$axios.post('/admin/memberships', requestBody)
        }else{
          // 3-2) 수정(put) API 호출
          await this.$axios.put(
            `/admin/memberships/${this.selectedMembershipId}`,
            requestBody
          )
        }
        this.modal.isSave = true

      } catch (err) {
        console.error(err)
        // TODO: 에러 토스트 띄우기 등
      } finally {
        this.saving = false
      }
    },
    async afterSaveConfirm() {
      // 1) 모달 닫기
      this.modal.isSave = false;
      // 2) validation 플래그 등 초기화
      this.isSubmitted = false;
      // 3) 옵션 리스트 갱신
      await this.fetchMembershipOptions();
      // 4) 동일한 membershipId 로 다시 불러오기 (새 이름 포함)
      if (this.selectedMembershipId) {
        await this.onMembershipSelect(this.selectedMembershipId);
      }
    },
    // onDelete() {
    //   if (confirm('정말 삭제하시겠습니까?')) {
    //     // TODO: 삭제 API 호출
    //     this.$router.back();
    //   }
    // },
    handleUpdateCoupon(newCouponData, couponIndex) {
      this.coupons[couponIndex] = cloneDeep(newCouponData);
    },
    handleDeleteCoupon(couponIndex) {
      if (this.coupons[couponIndex].id) {
        this.deletedCoupons.push(this.coupons[couponIndex]);
      }
      this.coupons.splice(couponIndex, 1);
    },
    handleAddCoupon() {
      this.coupons.push(cloneDeep({ ...COUPON_DEFAULT, tempId: Date.now() }));
    },
    validateCouponItem(couponItem) {
      const feedback = {};
      if (!couponItem.name) {
        feedback.name = true;
      }
      if (!couponItem.coupon_type) {
        feedback.couponType = true;
      }
      if (!couponItem.discount_percent || isNaN(Number(couponItem.discount_percent))) {
        feedback.discountPercent = true;
      } else if (Number(couponItem.discount_percent) > 100) {
        feedback.discountPercent = true;
      }
      if (!couponItem.image_url) {
        feedback.imageUrl = true;
      }
      if (!couponItem.is_permanent) {
        if (!couponItem.number_of_uses || isNaN(Number(couponItem.number_of_uses))) {
          feedback.numberOfUses = true;
        }
      }
      if (isEmpty(feedback)) {
        return null;
      }
      return feedback;
    },
    validateForm() {
      let isValid = true;

      const feedback = {
        name: false,
        thumbnailUrl: false,
        minMileage: false,
        coupons: []
      };

      // 1) 멤버십명
      if (!this.form.name || !this.form.name.trim()) {
        feedback.name = true;
        isValid = false;
      }

      // 2) 대표 이미지
      if (!this.membershipImage) {
        feedback.thumbnailUrl = true;
        isValid = false;
      }

      // 3) 이용실적 (숫자)
      if (
        this.form.minMileage == null ||
        this.form.minMileage === '' ||
        isNaN(Number(this.form.minMileage))
      ) {
        feedback.minMileage = true;
        isValid = false;
      }

      for (let couponIndex = 0; couponIndex < this.coupons.length; couponIndex++) {
        const couponItem = this.coupons[couponIndex];
        const couponFeedback = this.validateCouponItem(couponItem);
        feedback.coupons[couponIndex] = couponFeedback;
      }
      const emptyErrorCoupon = feedback.coupons.every((couponFeedback) => !couponFeedback);

      if (!emptyErrorCoupon) {
        isValid = false;
      } else {
        feedback.coupons = [];
      }
      this.feedback = feedback;
      return isValid;
    },

  },
};
</script>

<style lang="scss" scoped>
.membership-create {
  .membership-select {
    display: flex;
    align-items: center;
    label {
      font-weight: bold;
    }
    .select-row {
      display: flex;
      gap: 8px;
     /* ① 멤버십명 / 셀렉트박스 사이 margin */
      margin-left: 16px;
    }
    background: #fff;
    padding: 24px;
    border: 1px solid var(--color-grey-2);
    border-radius: 4px;
  }

  .membership-form {
    background: #fff;
    padding: 24px;
    border: 1px solid var(--color-grey-2);
    border-radius: 4px;

    .fields {
      display: flex;
      align-items: flex-start;
      gap: 24px;
    }

    /* ① 대표 이미지 너비 고정 */
    .representative-img {
      flex: 0 0 492px;    /* 너비 280px 고정, 필요시 조정 */
      width: 495px;
    }

    /* ② 텍스트 필드 영역 */
    .meta-fields {
      flex: 1;            /* 남은 공간을 모두 차지 */
      display: flex;
      flex-direction: column;
      gap: 16px;
      margin-left: 30px;
    }

    /* 각각의 라벨+인풋 세로 스택 */
    .meta-row {
      display: flex;
      flex-direction: column;

      label {
        font-weight: bold;
        margin-bottom: 8px;
      }

      /* suffix 텍스트를 input 옆에 표시하고 싶다면 이렇게 */
      .mileage-input {
        display: flex;
        align-items: center;
        gap: 8px;

        .suffix-text {
          white-space: nowrap;
        }
      }
    }
  }

  .button-row {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 24px;
  }

  .section {
      background: #fff;
      padding: 24px;
      border: 1px solid var(--color-grey-2);
      border-radius: 4px;
    }
}

.membership-info{
  margin-top: 2rem;
}

.coupon-section {
  margin-top: 2rem;
}
</style>
