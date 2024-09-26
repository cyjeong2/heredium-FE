<template>
  <div class="terms-wrap">
    <h1>{{ getPageType(pageType) }}</h1>
    <div v-if="termsData.contents" class="select-wrap">
      <USelect
        :value="termsOptionList[0].value"
        :option-list="termsOptionList"
        w-size="full"
        :default-text="termsData.title"
        @input="onDataChange"
      />
    </div>
    <section class="contents-wrap">
      <div v-if="!termsData.contents" class="none-list">리스트가 없습니다.</div>
      <EditorContentOutput :contents="termsData.contents" />
    </section>
  </div>
</template>

<script>
import USelect from '~/components/user/common/USelect';
import { POLICY_TYPE } from '~/assets/js/types';
import EditorContentOutput from '~/components/common/EditorContentOutput.vue';

export default {
  name: 'TermsProgress',
  components: { EditorContentOutput, USelect },
  props: {
    // pageType: PRIVACY | AGREE | SERVICE | REFUND | VIDEO
    pageType: {
      type: String,
      required: false,
      default: 'PRIVACY'
    },
    termsData: {
      type: Object,
      required: false,
      default: () => null
    },
    previousTermsData: {
      type: Array,
      required: false,
      default: () => null
    }
  },
  data() {
    return {
      titleText: '',
      baseUrl: ''
    };
  },
  computed: {
    termsOptionList() {
      return this.previousTermsData.map((terms) => ({
        value: terms.id,
        label: terms.title
      }));
    }
  },
  methods: {
    getPageType(type) {
      return POLICY_TYPE[type];
    },
    onDataChange(value) {
      this.$emit('changeData', value);
    }
  }
};
</script>

<style scoped lang="scss">
.terms-wrap {
  margin-top: 3.2rem;
  margin-bottom: 12rem;
}

h1 {
  font-size: 2.8rem;
  font-weight: 700;
  line-height: 150%;
  margin-bottom: 1.6rem;
}

.contents-wrap {
  margin-top: 3.2rem;
  padding-top: 3.2rem;
  border-top: 1px solid var(--color-u-grey-2);

  .none-list {
    margin-top: 8.2rem;
    font-size: 1.6rem;
    font-weight: 400;
    line-height: 160%;
    letter-spacing: -0.05rem;
    color: var(--color-u-grey-3);
    text-align: center;
  }
}

@media screen and (min-width: 769px) {
  .terms-wrap {
    max-width: 90rem;
    margin: 12.4rem auto 12rem;

    .select-wrap {
      display: flex;
      justify-content: flex-end;
    }

    ::v-deep .dropdown {
      width: 22rem !important;
      justify-self: flex-end;
    }
  }

  h1 {
    font-size: 4.2rem;
    font-weight: 700;
    line-height: 150%;
    margin-bottom: 4rem;
    text-align: center;
  }

  .contents-wrap {
    margin-top: 3.2rem;
    padding-top: 3.2rem;
    border-top: 1px solid var(--color-u-grey-2);

    .none-list {
      margin-top: 8.8rem;
      font-size: 2rem;
      font-weight: 500;
      line-height: 150%;
    }
  }
}
</style>
