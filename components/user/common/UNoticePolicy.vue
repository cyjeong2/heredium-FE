<template>
  <div class="agreement-item">
    <UCheckbox v-model="isChecked" />
    <label>
      관람 시
      <strong class="terms-strong" role="button" @click="handleViewTerm"> 유의사항 </strong>
      에 동의합니다.
    </label>

    <UTermModal :is-show="isShowTermsModal" term-target="notice" @close="closeTermModal" @agree="termAgree" />
  </div>
</template>

<script>
import UTermModal from '../modal/UTermModal.vue';
import UCheckbox from './UCheckbox.vue';

export default {
  name: 'NoticePolicy',
  components: { UTermModal, UCheckbox },
  props: {
    modelValue: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      isShowTermsModal: false
    };
  },
  computed: {
    isChecked: {
      get() {
        return this.modelValue;
      },
      set(value) {
        this.$emit('update:modelValue', value);
      }
    }
  },
  methods: {
    handleViewTerm() {
      this.isShowTermsModal = true;
    },
    closeTermModal() {
      this.isShowTermsModal = false;
    },
    termAgree() {
      this.$emit('update:modelValue', true);
      this.closeTermModal();
    }
  }
};
</script>

<style scoped>
.agreement-item {
  display: flex;
  align-items: start;
  gap: 8px;
}
.checkbox {
  width: 20px;
}
.terms-strong {
  font-weight: bold;
  cursor: pointer;
  color: var(--color-u-primary);
}
</style>
