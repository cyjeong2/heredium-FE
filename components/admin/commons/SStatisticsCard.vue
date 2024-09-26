<template>
  <div>
    <div v-if="isLoading" class="is-loading">로딩중</div>
    <div v-else-if="isError" class="is-error">에러</div>
    <div v-else class="statistics-list">
      <div v-for="item in statisticsList" :key="item.type" class="statistics-item">
        <div class="top" :class="getClass(item.type)">
          <img class="mr-8" :src="getImage(item.type)" alt="" />
          <span class="bt-1m">{{ item.type }}</span>
          <p class="count">{{ getCommaNum(item.number) }}<span>명</span></p>
        </div>
        <div class="bottom">
          <span class="nt-1">{{ getCommaNum(item.price) }}</span
          >원
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { threeCommaNum } from '~/assets/js/commons';

export default {
  name: 'SStatisticsCard',
  props: {
    statisticsList: {
      type: Array,
      required: false,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      required: false,
      default: false
    },
    isError: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  methods: {
    getImage(type) {
      return require(`~/assets/img/statistics_${this.getClass(type)}.png`);
    },
    getClass(type) {
      let className = '';

      switch (type) {
        case '총 예매':
          className = 'total';
          break;
        case '성인':
          className = 'adult';
          break;
        case '청소년':
          className = 'teen';
          break;
        case '유아 및 어린이':
          className = 'child';
          break;
        default:
          className = 'etc';
          break;
      }

      return className;
    },
    getCommaNum(num) {
      return threeCommaNum(num);
    }
  }
};
</script>

<style lang="scss" scoped>
.is-loading,
.is-error {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 13.9rem;
  width: 100%;
}

.is-loading {
  color: var(--color-blue);
}

.is-error {
  color: var(--color-red);
}

.statistics-list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  column-gap: 2rem;
}

.statistics-item {
  border-radius: 1rem;
  background-color: var(--color-white);
  box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.06);

  .top {
    display: flex;
    position: relative;
    height: 6.4rem;
    padding: 0 2.4rem;
    align-items: center;

    img {
      height: 2.4rem;
      width: 2.4rem;
    }

    .count {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      min-width: 7.2rem;
      height: 3.6rem;
      top: 50%;
      right: 2.4rem;
      border: 1px solid var(--color-grey-2);
      border-radius: 3rem;
      transform: translateY(-50%);

      span {
        margin-left: 0.2rem;
      }
    }

    &.total {
      background: linear-gradient(92.1deg, rgba(198, 241, 208, 0.6) 0%, rgba(222, 242, 227, 0.3) 69.55%);
      border-bottom: 1px solid #d0e6d5;

      .count {
        color: #3c6c45;
        border-color: #41bc58;
        background-color: rgba(198, 241, 208, 0.5);
      }
    }

    &.adult {
      background: linear-gradient(92.27deg, rgba(255, 215, 204, 0.6) 0%, rgba(255, 231, 224, 0.3) 65.46%);
      border-bottom: 1px solid #ead3cd;

      .count {
        color: #9c5f4d;
        border-color: #c09a93;
        background-color: #fbebe7;
      }
    }

    &.teen {
      background: linear-gradient(92.26deg, rgba(217, 213, 245, 0.6) 0%, rgba(237, 235, 254, 0.3) 65.71%);
      border-bottom: 1px solid #dfd9fa;

      .count {
        color: #695f9b;
        border-color: #a29aca;
        background-color: #ebe8fa;
      }
    }

    &.child {
      background: linear-gradient(
        92.26deg,
        rgba(254, 255, 224, 0.6) 0%,
        rgba(254, 255, 224, 0.3) 65.71%,
        rgba(254, 255, 224, 0.3) 65.71%
      );
      border-bottom: 1px solid #eaebcb;

      .count {
        color: #919121;
        border-color: #bdbd50;
        background-color: #f8f8db;
      }
    }

    &.etc {
      background: linear-gradient(92.1deg, rgba(198, 233, 241, 0.6) 0%, rgba(198, 233, 241, 0.3) 69.55%);
      border-bottom: 1px solid #d0dee6;

      .count {
        color: #2f6c80;
        border-color: #62aebd;
        background-color: #d1ecf3;
      }
    }
  }

  .bottom {
    display: flex;
    align-items: flex-end;
    height: 7.5rem;
    padding: 0 2.4rem 2rem;

    span {
      margin-right: 0.4rem;
    }
  }
}
</style>
