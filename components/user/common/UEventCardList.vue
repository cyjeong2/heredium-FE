<template>
  <section class="membership-benefits">
    <h2 class="membership-benefits__title">멤버십 혜택</h2>
    <div class="membership-benefits__content">
      <div v-for="event in eventList" :key="`${event.name}_${event.tag}`">
        <UEventCard :event="event" :tag="event.tag" />
      </div>
    </div>
  </section>
</template>

<script>
import UEventCard from './UEventCard.vue';

export default {
  name: 'UEventCardList',
  components: { UEventCard },
  props: {
    eventList: {
      type: Array,
      required: true
    }
  },
  data() {
    return {};
  },

  computed: {},

  watch: {},

  created() {},

  mounted() {},

  beforeDestroy() {},

  methods: {}
};
</script>

<style scoped lang="scss">
.membership-benefits {
  .membership-benefits__title {
    text-align: center;
    font-size: 1.6rem;
    line-height: 2.4rem;
    font-weight: 700;
    margin-bottom: 20px;
  }
  .membership-benefits__content {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    justify-content: center;
    & > div {
      display: flex;
      justify-content: center;
    }
  }
  @media screen and (min-width: 769px) {
    .membership-benefits__title {
      text-align: left;
      border-bottom: 1px solid var(--color-u-grey-2);
      padding-bottom: 20px;
    }
  }
}
</style>
