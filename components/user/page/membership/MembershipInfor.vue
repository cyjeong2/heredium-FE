<template>
  <KeepAlive>
    <div class="center box">
      <div v-if="!dataMerbership">
        <no-membership />
      </div>
      <div v-else>
        <has-membership :data-merbership="dataMerbership" />
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
.box {
  background: #f3f4f6;
  padding: 1rem 1.6rem 1.6rem;
  & > div {
    height: 100%;
    width: 100%;
  }
}
</style>
