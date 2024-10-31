<template>
  <div class="membership-option">
    <div class="image-box">
      <img :src="membershipImage" :alt="`${membership.name}-membership-image`" />
    </div>

    <UButton class="register-membership" w-size="full" h-size="small" @click="toggleCheck">가입하기</UButton>
  </div>
</template>

<script>
import UButton from '../../common/UButton.vue';
import { imageMixin } from '~/mixins/imageMixin';
import { toKoreaCurrency } from '~/assets/js/converter';

export default {
  name: 'MembershipOption',
  components: { UButton },
  mixins: [imageMixin],
  props: {
    modelValue: {
      required: true,
      validator(value) {
        return typeof value === 'string' || typeof value === 'number' || value === null || value === undefined;
      }
    },
    membership: {
      type: Object,
      required: true
    },
    change: {
      type: Function,
      required: true
    }
  },
  computed: {
    membershipImage() {
      return this.getImage(this.membership?.image_url);
    }
  },
  methods: {
    toKoreaCurrency,
    toggleCheck() {
      this.change({ ...this.membership });
    }
  }
};
</script>

<style scoped lang="scss">
.membership-option {
  border: none;
  background-color: transparent;
  width: 350px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  .image-box {
    padding: 20px;
    border-radius: 8px;
    border: 1px solid var(--color-u-grey-1);
    box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.06);
    img {
      width: 310px;
      height: 630px;
      object-fit: cover;
      border-radius: 4px;
    }
  }
}
</style>
