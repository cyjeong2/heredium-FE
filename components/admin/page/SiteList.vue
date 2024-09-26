<template>
  <div>
    <STitle :emoji="`${emojiType}`">{{ titleText }}</STitle>
    <SProgressTab v-model="isProgress" class="mb-24" @input="onprogress" />
    <div class="search mb-28">
      <SSearchBar v-model="searchText" class="mr-28" @search="onSearch()" />
      <SButton button-type="primary" class="mr-8" @click="onSearch()">검색</SButton>
      <SButton @click="onSearch(true)">초기화</SButton>
    </div>
    <div class="top-menus mb-16" :class="{ 'is-end': !isProgress }">
      <SToggle v-if="isProgress" v-model="isShowDisabled" @input="onToggle"> 미 노출 리스트 보기 </SToggle>
      <SLink :to="`${baseUrl}/edit`" button-type="primary">등록</SLink>
    </div>
    <SPageable
      :table-data="cloneTableData"
      :is-hide-pagination="isProgress"
      @getTableData="
        (page) => {
          $emit('changePage', page);
        }
      "
    >
      <template #data="{ data }">
        <table class="admin-table">
          <thead>
            <tr>
              <th>순서</th>
              <th>썸네일</th>
              <th class="text-left">제목</th>
              <th>상태</th>
              <th>진행기간</th>
              <th>수정 일시</th>
              <th>노출 여부</th>
            </tr>
          </thead>
          <tbody v-if="!data || !data[0]">
            <tr>
              <td colspan="100%"><div>리스트가 없습니다.</div></td>
            </tr>
          </tbody>
          <template v-if="cloneTableData.content && cloneTableData.content[0]">
            <Draggable
              v-model="cloneTableData.content"
              tag="tbody"
              v-bind="dragOptions"
              :disabled="!isProgress"
              @change="changeDrag"
            >
              <tr v-for="(item, index) in data" :key="item.id" @click="onGoDetail(item.id)">
                <td>
                  <div>{{ cloneTableData.startCount - index }}</div>
                </td>
                <td>
                  <div class="img">
                    <img :src="`${$store.state.BASE_URL}${item.pcImage?.savedFileName}`" :alt="`${item.pcImageAlt}`" />
                  </div>
                </td>
                <td>
                  <div class="text-left">{{ item.title }}</div>
                </td>
                <td>
                  <div><STag :type="item.state" /></div>
                </td>
                <td>
                  <div>
                    <p>{{ $dayjs(item.startDate).format('YYYY-MM-DD HH:mm') }}</p>
                    <p>~ {{ $dayjs(item.endDate).format('YYYY-MM-DD HH:mm') }}</p>
                  </div>
                </td>
                <td>
                  <div>{{ $dayjs(item.lastModifiedDate).format('YYYY-MM-DD HH:mm') }}</div>
                </td>
                <td @click.stop>
                  <div>
                    <SToggle v-model="item.isEnabled" @input="onEnabled(item.id, item.isEnabled)">{{
                      item.isEnabled ? '노출' : '미노출'
                    }}</SToggle>
                  </div>
                </td>
              </tr>
            </Draggable>
          </template>
        </table>
      </template>
    </SPageable>
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import cloneDeep from 'lodash/cloneDeep';
import SLink from '~/components/admin/commons/SLink';
import SButton from '~/components/admin/commons/SButton';
import SProgressTab from '~/components/admin/commons/SProgressTab';
import STitle from '~/components/admin/commons/STitle';
import SSearchBar from '~/components/admin/commons/SSearchBar';
import SToggle from '~/components/admin/commons/SToggle';
import SPageable from '~/components/admin/commons/SPageable';
import STag from '~/components/admin/commons/STag';

export default {
  name: 'SiteList',
  components: { SLink, SButton, SProgressTab, STitle, SSearchBar, SToggle, SPageable, Draggable: draggable, STag },
  props: {
    // pageType: SLIDER | POPUP
    pageType: {
      type: String,
      required: false,
      default: 'SLIDER'
    },
    tableData: {
      type: Object,
      required: false,
      default: () => null
    },
    queryOptions: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  asyncData({ params }) {
    const { id } = params;
    return { id };
  },
  data() {
    return {
      id: null,
      titleText: '',
      baseUrl: '',
      emojiType: '',
      searchText: '',
      cloneTableData: cloneDeep(this.tableData),
      isProgress: this.queryOptions.isProgress,
      isShowDisabled: false
    };
  },
  computed: {
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'sortable_ghost'
      };
    }
  },
  watch: {
    tableData: {
      deep: true,
      handler(newValue) {
        this.cloneTableData = cloneDeep(newValue);
      }
    }
  },
  created() {
    let titleText = '';
    let baseUrl = '';
    let emojiType = '';

    switch (this.pageType) {
      case 'SLIDER':
        titleText = '이미지 슬라이드';
        baseUrl = '/admin/site/slider';
        emojiType = 'scissors';
        break;
      case 'POPUP':
        titleText = '팝업';
        baseUrl = '/admin/site/popup';
        emojiType = 'laptop';
        break;
      default:
        titleText = '올바르지 않은 페이지 타입';
        break;
    }

    this.titleText = titleText;
    this.baseUrl = baseUrl;
    this.emojiType = emojiType;
  },
  methods: {
    async onEnabled(targetId, targetIsEnabled) {
      const apiUrl =
        this.pageType === 'POPUP' ? `/admin/popups/${targetId}/enabled` : `/admin/slides/${targetId}/enabled`;

      await this.$axios.$put(apiUrl, null, { params: { isEnabled: targetIsEnabled } }).then(() => {
        this.$emit('search', this.searchText);
      });
    },
    async changeDrag({ moved }) {
      const { newIndex, oldIndex } = moved;
      const diff = newIndex < oldIndex ? 1 : -1;
      const params = {
        isProgress: this.isProgress,
        isShowDisabled: this.isShowDisabled,
        dragId: moved.element.id,
        dropId: this.cloneTableData.content[newIndex + diff].id
      };
      const apiUrl = this.pageType === 'POPUP' ? `/admin/popups/order` : `/admin/slides/order`;
      await this.$axios.$put(apiUrl, null, { params });
    },
    onprogress() {
      this.$emit('progress', this.isProgress);
    },
    onToggle() {
      this.$emit('toggle', this.isShowDisabled);
    },
    onSearch(isReset) {
      if (isReset) {
        this.searchText = '';
      }

      this.$emit('search', this.searchText);
    },
    onGoDetail(id) {
      this.$router.push(`${this.baseUrl}/edit/${id}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.search {
  display: flex;
  width: 100%;
  padding: 2.8rem 3.2rem;
  background: #ffffff;
  box-shadow: 0 0.7rem 1rem rgba(0, 0, 0, 0.06);
  border-radius: 0.3rem;
}

.top-menus {
  display: flex;
  justify-content: space-between;
  align-items: center;

  &.is-end {
    justify-content: flex-end;
  }
}

.admin-table {
  th {
    &:first-of-type {
      width: 5%;
    }
    &:nth-of-type(2) {
      width: 11%;
    }
    &:nth-of-type(3) {
      width: 21%;
    }
    &:nth-of-type(4) {
      width: 10%;
    }
    &:nth-of-type(5) {
      width: 26%;
    }
    &:nth-of-type(6) {
      width: 18%;
    }
    &:last-of-type {
      width: 9%;
    }
  }
}
</style>
