<template>
  <TicketsDetail page-type="all" :page-id="id" :fetch-detail-data="detailData" />
</template>

<script>
import TicketsDetail from '~/components/admin/page/TicketsDetail';

export default {
  name: 'DetailPage',
  components: { TicketsDetail },
  layout: 'admin/default',
  async asyncData({ params, $axios, redirect, $dayjs }) {
    const { id } = params;
    const detailData = await $axios.$get(`/admin/tickets/${id}`).catch(() => {
      redirect('/admin/site/popup');
    });

    return { id, detailData };
  },
  data() {
    return {
      id: null,
      detailData: null
    };
  }
};
</script>

<style lang="scss" scoped>
h1 .blue {
  color: var(--color-blue);
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-grey-2);
  padding-bottom: 1.6rem;
  margin-bottom: 3.6rem;
}

.red {
  color: var(--color-red);
}

.top-div {
  border-top: 1px solid var(--color-grey-2);
  padding-top: 1.2rem;
}

.info-table .row {
  &.all-title {
    height: 4.4rem;

    > * {
      color: var(--color-grey-4);
      background-color: #fafafa;
      justify-content: center;
      font-size: 1.4rem;
      font-weight: 500;
      min-height: auto;
    }
  }

  &.all-contents * {
    color: var(--color-black);
    background-color: var(--color-white);
    font-size: 1.4rem;
    font-weight: 500;
    justify-content: flex-end;

    &:first-child {
      justify-content: center;
    }
  }

  div.col {
    flex-direction: column;
    flex: auto;
    min-height: auto;
    padding: 0.8rem 0;
    align-items: flex-start;
  }

  .col-row {
    display: block;
    padding: 0;

    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.8rem 1.9rem;
      min-height: 6rem;

      &:not(:first-child) {
        align-items: flex-start;
        flex-direction: column;
        justify-content: center;
      }

      &:first-child {
        border-bottom: 1px solid var(--color-grey-2);
      }

      > div {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
