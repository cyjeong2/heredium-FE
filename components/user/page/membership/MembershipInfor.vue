<template>
  <KeepAlive>
    <div class="container">
      <div class="center">
        <div v-if="!dataMerbership">
          <no-membership />
        </div>
        <div v-else>
          <has-membership :data-merbership="dataMerbership" />
        </div>
      </div>
    </div>
  </KeepAlive>
</template>

<script>
import NoMembership from './NoMembership.vue';
import HasMembership from './HasMembership.vue';

export default {
  name: 'MembershipInfor',
  components: { NoMembership, HasMembership },
  props: {
    dataMerbership: {
      type: Object,
      required: false,
      default: () => {}
    }
  }
};
</script>

<style lang="scss" scoped>
.container {
  background: #f3f4f6;
  padding: 4rem 1.6rem 1.6rem;
}
</style>
