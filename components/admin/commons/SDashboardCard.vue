<template>
  <div>
    <div class="statistics-list">
      <div v-for="item in cardList" :key="item.type" class="statistics-item">
        <div class="top" :class="getClass(item.type)">
          <img class="mr-8" :src="getImage(item.type)" alt="" />
          <span class="bt-1m">{{ item.type }}</span>
          <p v-if="item.subValue !== null" class="count">{{ getCommaNum(item.subValue) }}<span>명</span></p>
        </div>
        <div class="bottom">
          <span class="nt-1">{{ getCommaNum(item.value) }}</span>
          {{ item.unit }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { threeCommaNum } from '~/assets/js/commons';

export default {
  name: 'SDashboardCard',
  props: {
    cardList: {
      type: Array,
      required: false,
      default: () => []
    }
  },
  methods: {
    getImage(type) {
      return require(`~/assets/img/dashboard_${this.getClass(type)}.png`);
    },
    getClass(type) {
      let className = '';

      switch (type) {
        case '입장':
          className = 'visit';
          break;
        case '입장예정':
          className = 'total';
          break;
        case '판매된 티켓 / 금액':
          className = 'sale';
          break;
        case '취소된 티켓 / 금액':
          className = 'refund';
          break;
        case '신규가입':
          className = 'register';
          break;
        default:
          className = 'visit';
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
      height: 3.6rem;
      width: 3.6rem;
    }

    .count {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      min-width: 6.2rem;
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

    &.visit {
      background: linear-gradient(92.1deg, rgba(198, 241, 208, 0.6) 0%, rgba(222, 242, 227, 0.3) 69.55%);
      border-bottom: 1px solid #d0e6d5;

      .count {
        color: #3c6c45;
        border-color: #41bc58;
        background-color: rgba(198, 241, 208, 0.5);
      }
    }

    &.total {
      background: linear-gradient(92.27deg, rgba(255, 215, 204, 0.6) 0%, rgba(255, 231, 224, 0.3) 65.46%);
      border-bottom: 1px solid #ead3cd;

      .count {
        color: #9c5f4d;
        border-color: #c09a93;
        background-color: #fbebe7;
      }
    }

    &.sale {
      background: linear-gradient(92.26deg, rgba(217, 213, 245, 0.6) 0%, rgba(237, 235, 254, 0.3) 65.71%);
      border-bottom: 1px solid #dfd9fa;

      .count {
        color: #695f9b;
        border-color: #a29aca;
        background-color: #ebe8fa;
      }
    }

    &.refund {
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

    &.register {
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
