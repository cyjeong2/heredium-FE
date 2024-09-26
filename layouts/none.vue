<template>
  <div>
    <MountedProcessor />
    <Nuxt />
  </div>
</template>

<script>
import '~/assets/style/user/style.scss';
import MountedProcessor from '~/components/user/sections/mountedProcessor.vue';

export default {
  name: 'NoneLayout',
  components: { MountedProcessor }
};
</script>
