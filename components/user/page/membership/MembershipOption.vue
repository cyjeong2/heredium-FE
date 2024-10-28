<template>
  <div class="membership-option">
    <div class="content" :style="{ backgroundImage: `url(${membershipImage})` }">
      <p class="membership-name">{{ membership.name }}</p>
      <b class="membership-price">{{ toKoreaCurrency(membership.price) }}</b>
      <UButton class="register-membership" w-size="small" h-size="small" @click="toggleCheck">가입하기</UButton>
    </div>
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
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;

  .content {
    max-width: 100%;
    width: 100%;
    height: 169px;
    max-width: 400px;
    overflow: hidden;
    border-radius: 8px;
    padding: 24px;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    color: var(--color-white);
    .membership-name {
      font-size: 2rem;
      line-height: 2.8rem;
    }
    .membership-price {
      font-size: 3.6rem;
      line-height: 4.8rem;
    }
    .register-membership {
      margin-top: 12px;
    }
  }
}
</style>
