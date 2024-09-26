<template>
  <Fragment v-if="listData">
    <slot name="data" :data="listData.content" />
    <slot name="pagination">
      <div v-show="!isHidePagination" class="pagination" :class="paginationClass">
        <div class="pagination__wrap">
          <button
            v-show="!listData.first && listData.totalPages > 4"
            type="button"
            class="pagination--prev"
            :disabled="listData.first"
            @click="firstPage"
          >
            <i class="ic-arrow-first" />
          </button>
          <button
            v-show="!listData.first && listData.totalPages > 4"
            type="button"
            class="pagination--prev"
            :disabled="listData.first"
            @click="prevPage"
          >
            <i class="ic-arrow-pre" />
          </button>
          <ul class="pagination__group">
            <li v-for="index in pageCount || 1" :key="index">
              <button
                type="button"
                :class="{ active: isCurrentPage(index) }"
                @click="clickPageNum(firstPageIndex + index)"
              >
                {{ firstPageIndex + index }}
              </button>
            </li>
          </ul>
          <button
            v-show="!listData.last && listData.totalPages > 4"
            type="button"
            class="pagination--next"
            :disabled="listData.last"
            @click="nextPage"
          >
            <i class="ic-arrow-next" />
          </button>
          <button
            v-show="!listData.last && listData.totalPages > 4"
            type="button"
            class="pagination--next"
            :disabled="listData.last"
            @click="lastPage"
          >
            <i class="ic-arrow-end" />
          </button>
        </div>
        <slot name="side" />
      </div>
    </slot>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment';

export default {
  name: 'UPageable',
  components: { Fragment },
  props: {
    listData: {
      type: Object,
      required: false,
      default: () => null
    },
    listOption: {
      type: Object,
      default: () => ({
        pageSize: 10, // 페이지네이션 페이지 번호 버튼 최대로 보여줄 수
        mobilePageSize: 4 // 모바일에서 페이지네이션 페이지 번호 버튼 최대로 보여줄 수
      })
    },
    paginationClass: {
      type: String,
      default: ''
    },
    isHidePagination: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  computed: {
    firstPageIndex() {
      const pageCount = this.pageCount;
      let count = this.listData.number - Math.floor(pageCount / 2);

      if (count < 0) {
        count = 0;
      }
      if (this.listData.totalPages - count < pageCount) {
        count = this.listData.totalPages - pageCount;
      }

      return count;
    },
    pageCount() {
      let count = this.listOption.pageSize;

      if (process.client && window.screen.width < 768) {
        count = this.listOption.mobilePageSize;
      }
      if (count > this.listData.totalPages) {
        count = this.listData.totalPages;
      }

      return count;
    }
  },
  methods: {
    checkAll(e) {
      this.listData.content.forEach((value) => {
        this.$set(value, 'isChecked', e.target.checked);
      });
    },
    checked() {
      this.$set(this.listData, 'isAllCheck', this.listData?.content.filter((item) => !item.isChecked).length === 0);
    },
    getCheckedData() {
      return this.listData?.content.filter((item) => item.isChecked);
    },
    firstPage() {
      this.getListData(0);
    },
    prevPage() {
      let index = this.listData.number - 1;
      if (index < 0) {
        index = 0;
      }
      this.getListData(index);
    },
    nextPage() {
      let index = this.listData.number + 1;
      if (index >= this.listData.totalPages) {
        index = this.listData.totalPages;
      }
      this.getListData(index);
    },
    lastPage() {
      this.getListData(this.listData.totalPages - 1);
    },
    clickPageNum(index) {
      this.getListData(index - 1);
    },
    isCurrentPage(index) {
      return this.firstPageIndex + index === this.listData.number + 1;
    },
    getListData(index) {
      this.$emit('getListData', index);
    }
  }
};
</script>

<style lang="scss" scoped>
.pagination {
  position: relative;
  margin-top: 2.55rem;
}

.pagination__wrap {
  display: flex;
  align-items: center;
  justify-content: center;

  > button {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  i {
    font-size: 1.6rem !important;
  }
}

.pagination--prev,
.pagination--next {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  width: 1.6rem;
  height: 2.5rem;
  transform: translateY(0.1rem);
}

.pagination--prev {
  margin-right: 0.8rem;
}

.pagination--next {
  margin-left: 0.8rem;
}

.pagination--prev:disabled,
.pagination--next:disabled {
  color: var(--color-grey-3);
}

.pagination__group {
  display: flex;
  margin: 0 2.7rem;
}

.pagination__group button {
  color: var(--color-black);
  font-size: 1.6rem;
  width: 1rem;
  line-height: 2.4rem;
  text-align: center;
  margin-right: 2rem;
}

.pagination__group li:last-child button {
  margin-right: 0;
}

.pagination__group button.active {
  color: var(--color-u-primary);
  font-weight: 500;
  border-bottom: 1px solid var(--color-u-primary);
}

@media screen and (min-width: 769px) {
  .pagination {
    margin-top: 5.2rem;
  }
}
</style>
