<template>
  <main class="component-preview">
    <h1>Color</h1>
    <section>
      <h2 style="color: var(--color-default)">--color-default: #000</h2>
      <h2 style="color: var(--color-blue)">--color-blue: #18a0fb</h2>
      <h2 style="color: var(--color-black)">--color-black: #111</h2>
      <h2 style="color: var(--color-white)">--color-white: #fff</h2>
      <h2 style="color: var(--color-green)">--color-green: #21cc47</h2>
      <h2 style="color: var(--color-grey-1)">--color-grey-1: #f4f4f4</h2>
      <h2 style="color: var(--color-grey-2)">--color-grey-2: #ddd</h2>
      <h2 style="color: var(--color-grey-3)">--color-grey-3: #ababab</h2>
    </section>
    <h1>Typography</h1>
    <section>
      <h1>Headline 1</h1>
      <h2>Headline 2</h2>
      <h3>Headline 3</h3>
      <h4>Subtitle 1</h4>
    </section>
    <h1>Component</h1>
    <section>
      <h2>Button</h2>
      <div class="wrap buttons">
        <SButton>Button</SButton>
        <SButton button-type="primary">Button</SButton>
        <SButton disabled>Button</SButton>
      </div>
      <div class="wrap buttons">
        <SButton h-size="small">Button</SButton>
        <SButton button-type="primary" h-size="small">Button</SButton>
        <SButton h-size="small">Button</SButton>
      </div>
      <div class="wrap buttons">
        <SButton w-size="normal">96</SButton>
        <SButton w-size="large">128</SButton>
        <SButton w-size="x-large">208</SButton>
        <SButton w-size="xx-large">320</SButton>
      </div>
    </section>
    <section>
      <h2>Checkbox</h2>
      <div class="wrap checkboxes">
        <SCheckbox v-model="checkboxSample[0]" />
        <SCheckbox v-model="checkboxSample[0]">라벨명</SCheckbox><br />
        <SCheckbox v-model="checkboxSample[1]" />
        <SCheckbox v-model="checkboxSample[1]">라벨명</SCheckbox><br />
        <SCheckbox v-model="checkboxSample[1]" disabled />
        <SCheckbox v-model="checkboxSample[1]" disabled>라벨명</SCheckbox>
      </div>
      <h2>Checkbox Group</h2>
      <SCheckboxGroup v-model="state" :group-list="stateList" />
      <p>선택 된 체크박스: {{ state }}</p>
    </section>
    <section>
      <h2>Radio</h2>
      <div class="wrap checkboxes">
        <SRadio v-model="radioSelected" value="radio1">라디오1</SRadio>
        <SRadio v-model="radioSelected" value="radio2">라디오2</SRadio>
        <SRadio v-model="radioSelected" value="radio3" disabled>Disabled</SRadio>
        <br />
        선택된 라디오 값: "{{ radioSelected }}"
      </div>
    </section>
    <section>
      <h2>Search Bar</h2>
      <SSearchBar v-model="searchBarText1" /><br />
      <SSearchBar v-model="searchBarText2" /><br />
      <SSearchBar value="152" w-size="small" />
      <SSearchBar value="200" w-size="normal" />
      <SSearchBar value="320" w-size="large" />
      <SSearchBar value="460" w-size="x-large" />
      <SSearchBar value="584" w-size="xx-large" />
      <SSearchBar value="744 (기본)" w-size="xxx-large" />
    </section>
    <section>
      <h2>Dropdown</h2>
      <SDropdown v-model="dropdownSelected" :option-list="dropdownList">카테고리명</SDropdown>
      <SDropdown v-model="dropdownSelected" :option-list="dropdownList" /><br /><br />
      <SDropdown default-text="95" w-size="x-small" /><br />
      <SDropdown default-text="122" w-size="small" /><br />
      <SDropdown default-text="152(기본)" w-size="normal" /><br />
    </section>
    <section>
      <h2>Select</h2>
      <SSelect v-model="dropdownSelected" :option-list="dropdownList" /><br />
      <SSelect v-model="dropdownSelected" :option-list="dropdownList">카테고리명</SSelect>
    </section>
    <section>
      <h2>Input</h2>
      <SInput placeholder="텍스트" />
      <SInput value="텍스트" />
      <SInput value="텍스트" readonly /><br /><br />
      <SInput value="152" w-size="small" /><br />
      <SInput value="200 (기본)" w-size="normal" /><br />
      <SInput value="320" w-size="large" /><br />
      <SInput value="460" w-size="x-large" /><br />
      <SInput value="584" w-size="xx-large" /><br />
      <SInput value="744" w-size="xxx-large" />
    </section>
    <section>
      <h2>Toggle</h2>
      <SToggle v-model="toggle1" />
      <SToggle v-model="toggle2" />
      <SToggle v-model="toggle2">토글 라벨</SToggle>
    </section>
    <section>
      <h2>Week Tab</h2>
      <SWeekTab v-model="selectedWeek" />
      <br />
      선택 된 요일: {{ selectedWeek }}
    </section>
    <section>
      <h2>Table & Pagination</h2>
      <SPageable :table-data="sampleTableData">
        <template #data="{ data }">
          <table class="admin-table">
            <thead>
              <tr>
                <th>헤드1</th>
                <th>헤드2</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in data" :key="item">
                <td>1-{{ item }}</td>
                <td>2-{{ item }}</td>
              </tr>
            </tbody>
          </table>
        </template>
      </SPageable>
    </section>
    <section>
      <h2>Title</h2>
      <STitle emoji="frame">대제목1</STitle>
      <STitle emoji="mic">대제목2</STitle>
      <STitle emoji="camera">대제목3</STitle>
      <STitle emoji="calendar">대제목4</STitle>
    </section>
    <section>
      <h2>Tag</h2>
      <STag>기본값</STag>
      <STag type="schedule">예정</STag>
      <STag type="booking">예매진행</STag>
      <STag type="progress">진행</STag>
      <STag type="end">종료</STag>
    </section>
    <section>
      <h2>진행 탭</h2>
      <SProgressTab v-model="isProgress" />
    </section>
    <section>
      <h2>Datepicker / Calendar (임시)</h2>
      <SDatepicker /><br />
      <SDatepicker is-error /><br />
      <SDatepicker w-size="large" /><br />
      <SDatepicker w-size="x-large" /><br />
      <SDatepicker v-model="startDate" :max="endDate" />~<SDatepicker v-model="endDate" :min="startDate" /><br />
      <br /><br />
      <div>
        <SCalendar />
      </div>
    </section>
    <h1>Icon</h1>
    <section class="icons">
      <i class="ic-plus" />
      <i class="ic-minus" />
      <i class="ic-dragndrop" />
      <i class="ic-download" />
      <i class="ic-search" />
      <i class="ic-check" />
      <i class="ic-arrow-end" />
      <i class="ic-arrow-first" />
      <i class="ic-arrow-left" />
      <i class="ic-arrow-next" />
      <i class="ic-arrow-pre" />
      <i class="ic-arrow-right" />
      <i class="ic-calendar-arrow-l" />
      <i class="ic-calendar-arrow_r" />
      <i class="ic-close" />
      <i class="ic-edit" />
      <i class="ic-expand-more" />
      <i class="ic-logout" />
      <i class="ic-more" />
      <i class="ic-settings" />
      <i class="ic-sound-off" />
      <i class="ic-sound-on" />
      <i class="ic-today" />
      <i class="ic-trash" />
    </section>
    <h1>Modal</h1>
    <section>
      <SButton @click="isShowDialogModal = !isShowDialogModal">다이얼로그 모달보기</SButton>
      <SButton @click="isShowCommonModal = !isShowCommonModal">일반 모달보기</SButton>
      <SDialogModal :is-show="isShowDialogModal" @close="isShowDialogModal = false">
        <template #content>모달 컨텐츠</template>
        <template #modal-btn1><SButton @click="isShowDialogModal = false">취소</SButton></template>
        <template #modal-btn2><SButton button-type="primary">확인</SButton></template>
      </SDialogModal>
      <SModal :is-show="isShowCommonModal" @close="isShowCommonModal = false">
        <template #title>모달 제목</template>
        <template #content>모달 컨텐츠</template>
        <template #modal-btn1><SButton @click="isShowCommonModal = false">취소</SButton></template>
        <template #modal-btn2><SButton button-type="primary">확인</SButton></template>
      </SModal>
    </section>
  </main>
</template>

<script>
import SButton from '~/components/admin/commons/SButton';
import SCheckbox from '~/components/admin/commons/SCheckbox';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SDropdown from '~/components/admin/commons/SDropdown';
import SInput from '~/components/admin/commons/SInput';
import SToggle from '~/components/admin/commons/SToggle';
import STitle from '~/components/admin/commons/STitle';
import STag from '~/components/admin/commons/STag';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SCalendar from '~/components/admin/commons/SCalendar';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import SWeekTab from '~/components/admin/commons/SWeekTab';
import SPageable from '~/components/admin/commons/SPageable';
import SProgressTab from '~/components/admin/commons/SProgressTab';
import SModal from '~/components/admin/modal/SModal';
import SRadio from '~/components/admin/commons/SRadio';
import SCheckboxGroup from '~/components/admin/commons/SCheckboxGroup';
import SSelect from '~/components/admin/commons/SSelect';

export default {
  name: 'ComponentExample',
  components: {
    SSelect,
    SCheckboxGroup,
    SRadio,
    SModal,
    SProgressTab,
    SPageable,
    SWeekTab,
    SCalendar,
    SDatepicker,
    STag,
    STitle,
    SToggle,
    SInput,
    SDropdown,
    SSearchBar,
    SCheckbox,
    SButton,
    SDialogModal
  },
  layout: 'admin/default',
  data() {
    return {
      checkboxSample: [true, false],
      searchBarText1: '',
      searchBarText2: '검색결과',
      dropdownSelected: null,
      dropdownList: [
        { value: 1, label: '옵션명 1' },
        { value: 2, label: '옵션명 2' },
        {
          value: 3,
          label:
            '옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 '
        },
        {
          value: 4,
          label:
            '옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 옵션명이 너무 길때 '
        }
      ],
      toggle1: false,
      toggle2: true,
      radioSelected: 'radio1',
      isShowDialogModal: false,
      isShowCommonModal: false,
      isProgress: true,
      selectedWeek: ['일', '수'],
      startDate: '',
      endDate: '',
      state: [],
      stateList: [
        { label: '예정', value: 'SCHEDULE' },
        { label: '예매진행', value: 'BOOKING' },
        { label: '진행', value: 'PROGRESS' },
        { label: '종료', value: 'TERMINATION' }
      ],
      sampleTableData: {
        content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        pageable: {
          sort: {
            sorted: true,
            unsorted: false,
            empty: false
          },
          pageNumber: 0,
          pageSize: 10,
          offset: 0,
          unpaged: false,
          paged: true
        },
        last: false,
        totalPages: 5,
        totalElements: 45,
        first: true,
        sort: {
          sorted: true,
          unsorted: false,
          empty: false
        },
        size: 10,
        number: 0,
        numberOfElements: 10,
        empty: false,
        startCount: 1
      }
    };
  }
};
</script>

<style lang="scss" scoped>
.component-preview {
  padding: 0 4rem;
  margin: 0 -4rem;

  > h1 {
    padding-bottom: 1rem;
    margin-bottom: 1rem;
    border-bottom: 1px solid var(--color-grey-3);
  }

  > section {
    margin-bottom: 4rem;

    > h2 {
      margin-bottom: 1rem;
    }
  }
}

.wrap {
  margin-bottom: 1rem;

  &.buttons {
    display: flex;
    flex-wrap: wrap;

    > button {
      margin-right: 1rem;
    }
  }

  &.checkboxes label {
    margin-right: 2rem;
  }
}

.icons {
  font-size: 2.4rem;
}
</style>
