<template>
  <ul class="tab-wrap">
    <li v-for="item in langList" :key="item.value" :class="{ active: value === item.value }">
      <button type="button" @click="btnHandler($event, item)">
        {{ item.name }}
      </button>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'ULangTab',
  props: {
    value: {
      type: [String, Number, Boolean, null],
      required: false,
      default: null
    }
  },
  data() {
    return {
      langList: [
        {
          name: '한국어',
          value: 'ko'
        },
        {
          name: 'English',
          value: 'en'
        }
      ]
    };
  },
  methods: {
    btnHandler(e, item) {
      this.$emit('input', item.value);
    }
  }
};
</script>

<style lang="scss" scoped>
.tab-wrap {
  display: flex;
  width: 100%;
  border-bottom: 1px solid var(--color-default);
}

button {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-u-grey-3);
  font-size: 2.4rem;
  width: 16rem;
  height: 6rem;
  border: 1px solid var(--color-u-grey-3);
  border-bottom: 1px solid var(--color-default);
  transform: translateY(1px);
  background-color: #fff;
}

li:not(li:first-child) {
  button {
    transform: translate(-1px, 1px);
  }
}

li:not(li:last-child) {
  button {
    border-right: 0;
  }
}

li.active {
  z-index: 1;

  button {
    color: var(--color-default);
    font-weight: 700;
    border: 1px solid var(--color-default);
    border-right: 1px solid var(--color-default) !important;
    border-bottom: 0;
  }

  & + li button {
    border-left: 0;
  }
}

@media screen and (max-width: 768px) {
  button {
    width: 8.4rem;
    height: 3.8rem;
    font-size: 1.6rem;
  }
}
</style>
