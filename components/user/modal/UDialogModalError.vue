<template>
  <KeepAlive>
    <div class="container">
      <section class="title">
        <UDialogModal :is-show="isShow">
          <template #content>
            <div class="center">
              <img v-if="isRegistered" src="~assets/img/icon/icon_error_registered.svg" />
              <img v-else src="~assets/img/icon/icon_error.svg" />
              <p>{{ messageError }}</p>
            </div>
          </template>
          <template #modal-btn2>
            <slot name="modal-btn2" />
          </template>
        </UDialogModal>
      </section>
    </div>
  </KeepAlive>
</template>

<script>

import UDialogModal from './UDialogModal.vue';

export default {
  name: 'UDialogModalError',
  components: { UDialogModal },
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    messageError: {
      type: String,
      required: true,
      default: ''
    },
    isRegistered: {
      type: Boolean,
      required: false,
      default: false
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 500px;

  .center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    img {
      margin-bottom: 2rem;
    }
  }
}

@media screen and (min-width: 769px) {}
</style>