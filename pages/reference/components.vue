<template>
  <div class="bg">
    <div class="container">
      <section>
        <h1>FONT</h1>
        <h1 class="txt-h0">h0 헤레디움 012345689</h1>
        <h1>h1 헤레디움 HEREDIUM heredium 012345689</h1>
        <h2>h2 헤레디움 HEREDIUM heredium 012345689</h2>
        <h3>h3 헤레디움 HEREDIUM heredium 012345689</h3>
        <h4>h4 헤레디움 HEREDIUM heredium 012345689</h4>
        <p class="txt-sub1">Subtitle 1 헤레디움 HEREDIUM heredium 012345689</p>
        <p class="txt-sub2">Subtitle 2 헤레디움 HEREDIUM heredium 012345689</p>
        <p class="txt-body1">Body 1 헤레디움 HEREDIUM heredium 012345689</p>
        <p class="txt-body2">Body 2 헤레디움 HEREDIUM heredium 012345689</p>
        <p class="txt-body3">Body 3 (Default) 헤레디움 HEREDIUM heredium 012345689</p>
        <p class="txt-sub1 color-primary">Color Primary</p>
        <p class="txt-sub1 color-secondary">Color Secondary</p>
        <p class="txt-sub1 color-white bg-black">Color White</p>
        <p class="txt-sub1 color-grey1">Color Grey1</p>
        <p class="txt-sub1 color-grey2">Color Grey2</p>
        <p class="txt-sub1 color-grey3">Color Grey3</p>
        <p class="txt-sub1 color-grey4">Color Grey4</p>
        <p class="txt-sub1 color-black">Color Black</p>
        <p class="txt-sub1 color-error">Color Error</p>
      </section>
      <section>
        <h1>ICON</h1>
        <h4>PC</h4>
        <div>
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-search" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-account" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-login" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-logout" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-home" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-close" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-link" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-detail" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-arrow_top" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-plus" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-arrow_bottom" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-minus" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-share" />
          <br />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-download" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-arrow_forward" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-arrow_backward" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-open_hours" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-info" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-guide" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-ticket" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-notice" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-attach" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-facebook" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-twitter" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-kakaotalk" />
          <br />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-arrow_next" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-arrow_pre" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-calendar" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-arrow_calendar_pre_end" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-arrow_calendar_next_end" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="pc uic-fixed" />
        </div>
        <h4>MOBIlE</h4>
        <div :style="{ fontSize: sliderValue }">
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-header_menu_open" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-header_menu_close" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-header_search" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-home" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-ticketing" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-docent" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-my" />
          <br />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-arrow_forward" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-arrow_backward" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-arrow_top" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-arrow_bottom" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-plus" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-minus" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-detail" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-calendar" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-arrow_calendar_next_end" />
          <i :style="{ fontSize: `${sliderValue}rem` }" class="m umic-arrow_calendar_pre_end" />
        </div>
        <div>
          <div>폰트사이즈: {{ sliderValue * 10 }}px</div>
          <RangeSlider v-model="sliderValue" class="slider" min="1.2" max="10" step="0.1" style="width: 100%" />
        </div>
      </section>
      <section>
        <h1>COMMON</h1>
        <h4>Button</h4>
        <div class="d-flex mb-8">
          <UButton>텍스트</UButton>
          <UButton button-type="secondary">텍스트</UButton>
          <UButton button-type="chart">텍스트</UButton>
          <UButton disabled>텍스트</UButton>
        </div>
        <div class="d-flex mb-12">
          <UButton h-size="small">텍스트</UButton>
          <UButton h-size="small" button-type="secondary">텍스트</UButton>
          <UButton h-size="small" button-type="chart">텍스트</UButton>
          <UButton h-size="small" disabled>텍스트</UButton>
        </div>
        <div>
          <UButton class="mb-8">default</UButton>
          <UButton class="mb-8" w-size="xsm">xsm</UButton>
          <UButton class="mb-8" w-size="sm">sm</UButton>
          <UButton class="mb-8" w-size="common1">common1</UButton>
          <UButton class="mb-8" w-size="common2">common2</UButton>
          <UButton class="mb-8" w-size="lg">lg</UButton>
          <UButton class="mb-8" w-size="xlg">xlg</UButton>
          <UButton class="mb-8" w-size="xxlg">xxlg</UButton>
          <UButton class="mb-8" w-size="100">100</UButton>
        </div>
        <h4 class="mt-24">Checkbox</h4>
        <div>
          <UCheckbox class="mr-16" /><UCheckbox :value="true" /><br />
          <UCheckbox class="mr-16">텍스트</UCheckbox>
          <UCheckbox :value="true">텍스트</UCheckbox>
        </div>
        <h4 class="mt-24">Select(dropdown)</h4>
        <div>
          <USelect v-model="selectValue" :option-list="selectList" />
        </div>
        <h4 class="mt-24">Input</h4>
        <UInput placeholder="텍스트" />
        <UInput placeholder="텍스트" readonly />
        <UInput placeholder="텍스트" value="텍스트" /><br /><br />
        <UInput placeholder="텍스트" value="sm" w-size="sm" /><br />
        <UInput placeholder="텍스트" value="normal" w-size="normal" /><br />
        <UInput placeholder="텍스트" value="full" w-size="full" /><br /><br />
        <UInput placeholder="텍스트" error-msg="오류 문구 텍스트" /><br /><br />
        <UInput placeholder="텍스트" h-small /><br />
        <UInput placeholder="텍스트" h-small error-msg="오류 문구 텍스트" />
        <h4 class="mt-24">Search</h4>
        <USearch class="mb-8" />
        <USearch class="mb-8" value="텍스트" />
        <USearch border-style />
        <h4 class="mt-24">Tag</h4>
        <UTag />
        <UTag type="PROGRESS" />
        <UTag type="TERMINATION" />
        <h4 class="mt-24">Progressbar</h4>
        <h4 class="mt-24">관림일 선택 캘린더</h4>
        <UCalendar @onSelectedDate="onSelectedDate" />
        <h4>Input Spinner</h4>
        <UInputSpinner v-model="inputSpinner" />
        <UInputSpinner v-model="inputSpinner" plus-disabled />
        <UInputSpinner v-model="inputSpinner" minus-disabled />
        <UInputSpinner v-model="inputSpinner" disabled />
        <h4>Modal</h4>
        <UButton @click="modal1 = true">일반 모달 띄우기</UButton>
        <UButton @click="modal2 = true">다이얼 로그 모달 띄우기</UButton>
        <UModal :is-show="modal1" @close="modal1 = false">
          <template #title>모달 타이틀</template>
          <template #content>컨텐츠</template>
          <template #modal-btn1>
            <UButton @click="modal1 = false">취소 버튼</UButton>
          </template>
          <template #modal-btn2>
            <UButton>확인 버튼</UButton>
          </template>
        </UModal>
        <UDialogModal :is-show="modal2">
          <template #content> 컨텐츠 </template>
          <template #modal-btn1>
            <UButton @click="modal2 = false">취소 버튼</UButton>
          </template>
          <template #modal-btn2>
            <UButton>확인 버튼</UButton>
          </template>
        </UDialogModal>
      </section>
    </div>
  </div>
</template>

<script>
import RangeSlider from 'vue-range-slider';
import UButton from '~/components/user/common/UButton';
import USelect from '~/components/user/common/USelect';
import UCheckbox from '~/components/user/common/UCheckbox';
import 'vue-range-slider/dist/vue-range-slider.css';
import UInput from '~/components/user/common/UInput';
import USearch from '~/components/user/common/USearchBar';
import UTag from '~/components/user/common/UTag';
import UCalendar from '~/components/user/common/UCalendar';
import UInputSpinner from '~/components/user/common/UInputSpinner';
import UModal from '~/components/user/modal/UModal';
import UDialogModal from '~/components/user/modal/UDialogModal';

export default {
  name: 'UserComponents',
  components: {
    UDialogModal,
    UModal,
    UInputSpinner,
    UCalendar,
    UTag,
    USearch,
    UInput,
    RangeSlider,
    UCheckbox,
    USelect,
    UButton
  },
  data() {
    return {
      sliderValue: 3.2,
      selectValue: 1,
      selectList: [
        {
          label: '1',
          value: 1
        },
        {
          label: '2',
          value: 2
        },
        {
          label: '3',
          value: 3
        }
      ],
      selectedDate: '',
      inputSpinner: 0,
      modal1: false,
      modal2: false
    };
  },
  methods: {
    onSelectedDate(id) {}
  }
};
</script>

<style lang="scss" scoped>
.d-flex {
  display: flex;

  & button {
    margin-right: 1rem;
  }
}

.bg {
  background-color: var(--color-u-grey-1);

  > .container {
    background-color: var(--color-white);
  }
}

.bg-black {
  background-color: var(--color-black);
}

section {
  margin-bottom: 3rem;

  h1:first-child {
    color: var(--color-u-secondary);
  }
}
</style>
