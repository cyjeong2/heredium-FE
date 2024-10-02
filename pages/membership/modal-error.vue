<template>
  <KeepAlive>
    <div class="container">
      <section class="title">
        <UButton @click="setOpenModal">Click to show modal error</UButton>
        <UDialogModalError :is-show="modal1" :message-error="msgError" :is-registered="false">
          <template #modal-btn2>
            <UButton class="feedback-btn" @click="modal1 = false">확인</UButton>
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
      modal1: false,
      msgError: 'Message Error Here'
    }
  },
  methods: {
    setOpenModal() {
      this.modal1 = !this.modal1
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 500px;
}

</style>