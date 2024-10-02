<template>
  <div class="agreement-item">
    <UCheckbox v-model="isChecked" />
    <label>
      <strong class="terms-strong" role="button" @click="handleViewTerms">환불 규정</strong>에 동의합니다.
    </label>

    <URegisterModal
      :is-show="isShowTermsModal"
      :term-target="termTarget"
      :terms-data="termsData"
      @close="closeTermModal"
      @agree="termAgree"
    />
  </div>
</template>

<script>
import URegisterModal from '../modal/URegisterModal.vue';
import UCheckbox from './UCheckbox.vue';

export default {
  name: 'RefundPolicy',
  components: { URegisterModal, UCheckbox },
  props: {
    modelValue: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      termTarget: 'REFUND',
      isShowTermsModal: false,
      termsData: {}
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
    async handleViewTerms() {
      this.termsData = await this.$axios.$get('/user/policies/posting', {
        params: {
          type: this.termTarget
        }
      });
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
