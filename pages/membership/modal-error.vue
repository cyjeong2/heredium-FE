<template>
  <KeepAlive>
    <div class="container">
      <section class="title">
        <UButton @click="setOpenModal">Click to show modal error</UButton>
        <UDialogModalError :is-show="openModal" :message-error="msgError" :is-registered="false">
          <template #modal-btn2>
            <UButton class="feedback-btn" @click="openModal = false">확인</UButton>
          </template>
        </UDialogModalError>
      </section>
    </div>
  </KeepAlive>
</template>

<script>

import UButton from '~/components/user/common/UButton';
import UDialogModalError from '~/components/user/modal/UDialogModalError.vue';

export default {
  name: 'ModalErrorPage',
  components: { UButton, UDialogModalError },
  data() {
    return {
      openModal: false,
      msgError: ''
    }
  },
  methods: {
    setOpenModal() {
      this.openModal = !this.openModal
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 500px;
}
</style>
