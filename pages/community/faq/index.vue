<template>
  <main class="container">
    <div class="title-wrap">
      <h1>FAQ</h1>
      <!--      <h2>서비스 이용에 불편함이 있으시면<br />빠르게 도와드리겠습니다.</h2>-->
    </div>
    <div class="search-wrap">
      <USearch v-model="searchFilter" border-style w-size="100" class="search" @search="onSearch" @reset="onReset" />
    </div>
    <div class="tabs" style="display: none">
      <button :class="data.find((item) => item.isActive) ? '' : 'is-active'" @click="resetActive">전체</button>
      <button v-for="item in data" :key="item.id" :class="{ 'is-active': item.isActive }" @click="activeTab(item)">
        {{ item.category }}
      </button>
    </div>
    <UPagination
      :data="activeContents"
      :data-option="{ currentPage: faqData.tablePage, pageSize: faqData.pageSize }"
      :is-hide-pagination="activeContents.length < 11"
      @onPageChange="onPageChange"
    >
      <!-- eslint-disable-next-line vue/no-template-shadow-->
      <template #data="{ data }">
        <div class="faq-item-wrap">
          <div v-if="!data || !data[0]" class="no-item">리스트가 없습니다.</div>
          <div v-for="(item, index) in data" :key="index" class="faq-item">
            <div class="faq-item-tab" @click="item.isOpen = !item.isOpen">
              <div class="faq-item-text">
                <h3 style="display: none">{{ item.category }}</h3>
                <p><strong>Q</strong>{{ item.questions }}</p>
              </div>
              <div class="faq-icon">
                <i v-if="item.isOpen" class="m umic-minus" />
                <i v-else class="m umic-plus" />
              </div>
            </div>
            <transition name="accordion" @enter="start" @after-enter="end" @before-leave="start" @after-leave="end">
              <div v-show="item.isOpen" class="faq-answer">
                <p v-html="item.asked" />
              </div>
            </transition>
          </div>
        </div>
      </template>
    </UPagination>
  </main>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import USearch from '~/components/user/common/USearchBar';
import FaqData from '~/assets/data/faq.js';
import UPagination from '~/components/user/common/UPagination';

export default {
  name: 'FAQPage',
  components: { UPagination, USearch },
  asyncData() {
    const data = cloneDeep(FaqData);

    data.forEach((item) => {
      item.isActive = false;
      item.content.forEach((contentItem) => {
        contentItem.isOpen = false;
      });
    });

    return { data };
  },
  data() {
    return {
      data: null,
      searchText: '',
      searchFilter: '',
      faqData: {
        tablePage: 0,
        pageSize: 10
      }
    };
  },
  computed: {
    activeContents() {
      const isAll = !this.data.find((item) => item.isActive);

      return this.data
        .reduce((pre, cur) => {
          if (isAll || cur.isActive) {
            pre.push(...cur.content);
          }

          return pre;
        }, [])
        .filter(this.searchFilters);
    }
  },
  mounted() {
    const $link = document.getElementById('addressUrl');

    if ($link) {
      $link.href = window.location.origin + '/about/intro#way';
    }
  },
  methods: {
    onSearch() {
      this.resetActive();
      this.searchText = this.searchFilter;
    },
    searchFilters(item) {
      return (
        item.questions.toUpperCase().includes(this.searchText.toUpperCase()) ||
        item.asked.toUpperCase().includes(this.searchText.toUpperCase())
      );
    },
    onReset() {
      this.searchFilter = '';
      this.searchText = '';
      this.resetActive();
    },
    resetActive() {
      this.data.forEach((item) => {
        item.isActive = false;
        item.content.forEach((contentItem) => {
          contentItem.isOpen = false;
        });
      });
    },
    activeTab(item) {
      this.resetActive();
      item.isActive = true;
      this.faqData.tablePage = 0;
    },
    onPageChange(page) {
      this.faqData.tablePage = page;
    },
    start(el) {
      el.style.height = el.scrollHeight + 'px';
    },
    end(el) {
      el.style.height = '';
    }
  }
};
</script>

<style lang="scss" scoped>
.accordion-enter-active,
.accordion-leave-active {
  will-change: height, opacity;
  transition: height 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.accordion-enter,
.accordion-leave-to {
  height: 0 !important;
  opacity: 0;
}

.container {
  padding-top: 3.2rem;
  padding-bottom: 12.6rem;
}

h1 {
  font-style: normal;
  font-weight: 600;
  font-size: 2.8rem;
  line-height: 100%;
  margin-bottom: 1.6rem;
}

h2 {
  font-weight: 300;
  font-size: 16px;
  line-height: 160%;
  margin-bottom: 6.4rem;
}

::v-deep b {
  font-weight: 700;
  border-bottom: 1px solid;
}

.search {
  margin-bottom: 4rem;
}

.tabs {
  display: flex;
  margin: 0 -2rem;
  padding: 0 2rem;
  overflow-x: auto;
  margin-bottom: 3.2rem;

  button {
    font-size: 1.8rem;
    margin-right: 2.4rem;

    &.is-active {
      color: var(--color-u-primary);
      font-weight: 700;
      line-height: 100%;
    }

    &:last-child {
      margin-right: 0;
    }
  }
}

.faq-item-wrap {
  border-top: 1px solid var(--color-black);

  .faq-item-tab {
    display: flex;
    justify-content: space-between;
    padding: 1.4rem 1.6rem 1.2rem 1rem;
    border-bottom: 1px solid var(--color-grey-1);
    cursor: pointer;
  }

  .faq-answer {
    border-top: 1px solid var(--color-grey-1);
    background: rgba(235, 235, 235, 0.4);

    p {
      font-weight: 400;
      font-size: 1.4rem;
      line-height: 160%;
      padding: 2rem 1.6rem;

      ::v-deep a {
        color: var(--color-u-secondary);
      }
    }
  }

  .no-item {
    display: flex;
    height: 8.1rem;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 1.4rem;
    line-height: 100%;
  }

  .faq-item-text {
    flex: 1 0 0;

    h3 {
      font-weight: 700;
      font-size: 1.4rem;
      line-height: 100%;
      margin-bottom: 1.2rem;
    }

    p {
      display: flex;
      font-weight: 500;
      font-size: 1.6rem;
      line-height: 160%;
      padding-right: 1.6rem;
      word-break: keep-all;

      strong {
        display: flex;
        align-items: center;
        color: var(--color-u-primary);
        font-size: 1.8rem;
        font-weight: 700;
        line-height: 100%;
        margin-right: 1.2rem;
        transform: translateY(-0.2rem);
      }
    }
  }

  .faq-icon {
    display: flex;
    width: 2.4rem;
    align-items: center;
    justify-content: center;
  }
}

@media screen and (min-width: 769px) {
  .container {
    padding-top: 4.8rem;
    padding-bottom: 12.8rem;
  }

  .title-wrap {
    display: flex;
    justify-content: space-between;
    margin-bottom: 8.8rem;
  }

  h1 {
    font-size: 4.2rem;
    line-height: 150%;
    margin-bottom: 0;
  }

  h2 {
    font-weight: 500;
    font-size: 3.6rem;
    line-height: 150%;
    margin-bottom: 0;
    text-align: right;
  }

  .search-wrap {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 3.2rem;
  }

  .search {
    width: 43.6rem !important;
    margin-bottom: 0;
    height: 6.4rem;

    & ::v-deep {
      .init {
        right: 6.4rem !important;
      }

      button i {
        font-size: 3.2rem;
      }

      input {
        padding-right: 8.2rem !important;
      }
    }
  }

  .tabs {
    display: flex;
    margin: 0 -2rem;
    padding: 0 2rem;
    overflow-x: auto;
    margin-bottom: 3.2rem;

    button {
      font-size: 1.8rem;
      margin-right: 2.4rem;

      &.is-active {
        color: var(--color-u-primary);
        font-weight: 700;
        line-height: 100%;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .faq-item-wrap {
    border-top: 1px solid var(--color-black);

    .faq-item-tab {
      padding: 3.3rem 2.8rem 3.3rem 4rem;
    }

    .faq-answer {
      p {
        font-weight: 500;
        font-size: 1.8rem;
        line-height: 160%;
        padding: 3.2rem 4rem;
      }
    }

    .no-item {
      height: 10rem;
      font-size: 2rem;
    }

    .faq-item-text {
      padding-right: 4rem;

      p {
        display: flex;
        font-size: 2rem;
        line-height: 150%;
        align-items: center;

        strong {
          display: flex;
          align-items: center;
          color: var(--color-u-primary);
          font-size: 2.4rem;
          font-weight: 700;
          line-height: 100%;
          margin-right: 1.8rem;
          transform: translateY(-0.2rem);
        }
      }
    }

    .faq-icon {
      display: flex;
      width: 3.2rem;
      align-items: center;
      justify-content: center;

      i {
        font-size: 3.2rem;
      }
    }
  }
}
</style>
