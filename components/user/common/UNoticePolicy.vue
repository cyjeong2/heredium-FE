<template>
  <div class="agreement-item">
    <UCheckbox v-model="isChecked" />
    <label class="agreement-label">
      멤버십 가입&ensp;
      <strong class="terms-strong" role="button" @click="handleViewTerm"> 유의사항</strong>에 동의합니다.
    </label>
  </div>
</template>

<script>
import UCheckbox from './UCheckbox.vue';

export default {
  name: 'NoticePolicy',
  components: { UCheckbox },
  props: {
    modelValue: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {};
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
      this.$emit('open-term');
    }
  }
};
</script>

<style scoped>
.agreement-item {
  display: flex;
  align-items: center;
  gap: 8px;
}
.checkbox {
  width: 20px;
}
.terms-strong {
  font-weight: bold;
  cursor: pointer;
  color: var(--color-u-primary);
  display: flex;
}
.agreement-label {
  display: flex;
  align-items: center;
}
</style>
