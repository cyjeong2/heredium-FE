<template>
  <UDialogModalError :message-error="warningMessage">
    <template #image-slot>
      <img src="~assets/img/icon/icon_error.svg" alt="" />
    </template>
    <template #modal-btn2>
      <UButton class="feedback-btn" @click="onClose()">확인</UButton>
    </template>
  </UDialogModalError>
</template>

<script>
import UButton from '../../common/UButton.vue';
import UDialogModalError from '../UDialogModalError.vue';

export default {
  name: 'UWarningDialog',
  components: { UDialogModalError, UButton },
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
