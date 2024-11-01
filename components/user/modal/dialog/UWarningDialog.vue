<template>
  <UDialogModal :is-show="true">
    <template #content>
      {{ warningMessage }}
    </template>
    <template #modal-btn2>
      <UButton class="feedback-btn" @click="onClose()">확인</UButton>
    </template>
  </UDialogModal>
</template>

<script>
import UButton from '../../common/UButton.vue';
import UDialogModal from '~/components/user/modal/UDialogModal';

export default {
  name: 'UWarningDialog',
  components: { UDialogModal, UButton },
  props: {
    warningMessage: {
      type: String,
      required: true,
      default: ''
    },
    onClose: {
      type: Function,
      required: true
    }
  }
};
</script>
