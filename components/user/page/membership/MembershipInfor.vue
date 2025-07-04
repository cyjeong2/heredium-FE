<template>
  <KeepAlive>
    <div class="center box">
      <!-- <div v-if="!dataMerbership">
        <no-membership />
      </div> -->
      <div>
        <has-membership :data-membership="dataMerbership" />
      </div>
    </div>
  </KeepAlive>
</template>

<script>
// import NoMembership from './NoMembership.vue';
import HasMembership from './HasMembership.vue';

export default {
  name: 'MembershipInfor',
  // NoMembership
  components: { HasMembership },
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
  padding: 1rem 1.6rem 1.6rem;
  & > div {
    height: 100%;
    width: 100%;
  }
}
</style>
