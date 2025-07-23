<template>
  <SModal :is-show="isShow" @close="handleClose">
    <!-- 제목 -->
    <template #title>취소 사유 입력</template>

    <!-- 내용: textarea -->
    <template #content>
      <div class="cancel-modal">
        <STextarea v-model="reason" placeholder="취소 사유를 입력해주세요" maxlength="3000" />
      </div>
    </template>

    <!-- 버튼: 왼쪽 취소, 오른쪽 확인 -->
    <template #modal-btn1>
      <SButton @click="handleClose">취소</SButton>
    </template>
    <template #modal-btn2>
      <SButton
        button-type="primary"
        :disabled="!reason.trim()"
        @click="submit"
      >
        확인
      </SButton>
    </template>
  </SModal>
</template>

<script>
import SModal from '~/components/admin/modal/SModal';
import SButton from '~/components/admin/commons/SButton';
import STextarea from '~/components/admin/commons/STextarea';

export default {
  name: 'CancelReasonForm',
  components: { SModal, SButton, STextarea },
  props: {
    isShow: { type: Boolean, default: false }
  },
  data() {
    return {
      reason: ''
    };
  },
  methods: {
    handleClose() {
      this.$emit('close');
      this.reason = '';
    },
    submit() {
      this.$emit('confirm', this.reason.trim());
      this.reason = '';
    }
  }
};
</script>

<style scoped>
.w-full { width: 100%; }
.cancel-modal textarea {
  resize: none;
  box-sizing: border-box;
}
</style>
