<template>
  <Fragment v-if="tableData">
    <div :class="tableWrapClass">
      <slot name="data" :data="tableData.content" />
    </div>
    <slot name="pagination">
      <div v-show="!isHidePagination" class="pagination" :class="paginationClass">
        <div class="pagination__wrap">
          <button type="button" class="pagination--prev" :disabled="tableData.first" @click="firstPage">
            <i class="ic-arrow-first" />
          </button>
          <button type="button" class="pagination--prev" :disabled="tableData.first" @click="prevPage">
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
          <button type="button" class="pagination--next" :disabled="tableData.last" @click="nextPage">
            <i class="ic-arrow-next" />
          </button>
          <button type="button" class="pagination--next" :disabled="tableData.last" @click="lastPage">
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
  name: 'SPageable',
  components: { Fragment },
  props: {
    tableData: {
      type: Object,
      required: false,
      default: () => null
    },
    tableOption: {
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
    },
    tableWrapClass: {
      type: String,
      default: 'admin-table-wrap'
    }
  },
  computed: {
    firstPageIndex() {
      const pageCount = this.pageCount;
      let count = this.tableData.number - Math.floor(pageCount / 2);

      if (count < 0) {
        count = 0;
      }
      if (this.tableData.totalPages - count < pageCount) {
        count = this.tableData.totalPages - pageCount;
      }
      return count;
    },
    pageCount() {
      let count = this.tableOption.pageSize;

      if (process.client && window.screen.width < 768) {
        count = this.tableOption.mobilePageSize;
      }
      if (count > this.tableData.totalPages) {
        count = this.tableData.totalPages;
      }
      return count;
    }
  },
  methods: {
    checkAll(e) {
      this.tableData.content.forEach((value) => {
        this.$set(value, 'isChecked', e.target.checked);
      });
    },
    checked() {
      this.$set(this.tableData, 'isAllCheck', this.tableData?.content.filter((item) => !item.isChecked).length === 0);
    },
    getCheckedData() {
      return this.tableData?.content.filter((item) => item.isChecked);
    },
    firstPage() {
      this.getTableData(0);
    },
    prevPage() {
      let index = this.tableData.number - 1;
      if (index < 0) {
        index = 0;
      }
      this.getTableData(index);
    },
    nextPage() {
      let index = this.tableData.number + 1;
      if (index >= this.tableData.totalPages) {
        index = this.tableData.totalPages;
      }
      this.getTableData(index);
    },
    lastPage() {
      this.getTableData(this.tableData.totalPages - 1);
    },
    clickPageNum(index) {
      this.getTableData(index - 1);
    },
    isCurrentPage(index) {
      return this.firstPageIndex + index === this.tableData.number + 1;
    },
    getTableData(index) {
      this.$emit('getTableData', index);
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
  line-height: 2.4rem;
  text-align: center;
  margin-right: 1.65rem;
}

.pagination__group li:last-child button {
  margin-right: 0;
}

.pagination__group button.active {
  color: var(--color-blue);
  border-bottom: 1px solid var(--color-blue);
}
</style>
