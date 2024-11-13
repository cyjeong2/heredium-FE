<template>
  <UDialogModal :is-show="true">
    <template #content>
      유효기간 내에 <br />
      인당 1회 구매 가능합니다.
    </template>
    <template #modal-btn2>
      <UButton class="feedback-btn" @click="onConfirm()">확인</UButton>
    </template>
  </UDialogModal>
</template>

<script>
import UButton from '../../common/UButton.vue';
import UDialogModal from '../UDialogModal.vue';

export default {
  name: 'UExistedMembershipDialog',
  components: { UDialogModal, UButton },
  props: {
    onConfirm: {
      type: Function,
      required: true
    }
  }
};
</script>
