<template>
  <KeepAlive>
    <div class="container">
      <section class="title">
        <UDialogModal :is-show="true">
          <template #content>
            <div class="content-box center">
              <img v-if="imageSrc" :src="imageSrc" alt="" />
              <slot name="image-slot"></slot>
              <p v-if="messageError" class="content-dialog">{{ messageError }}</p>
              <p class="content-dialog"><slot name="content"></slot></p>
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
    messageError: {
      type: String,
      required: false,
      default: ''
    },
    imageSrc: {
      type: String,
      required: false,
      default: undefined
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  height: 500px;

  img {
    margin-bottom: 2rem;
  }
  .content-box {
    gap: 12px;
  }
  .content-dialog {
    width: 100%;
    text-align: center;
  }
}

@media screen and (min-width: 769px) {
}
</style>
