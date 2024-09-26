<template>
  <div class="edit">
    <h1 class="mb-17">{{ titleText }} {{ isNew ? '등록' : '수정' }}</h1>
    <div class="info-table">
      <div class="row">
        <label>제목<b>*</b></label>
        <div class="has-feedback">
          <SInput v-model="editData.title" w-size="xxx-large" :class="{ 'is-error': !feedback.title.isValid }" />
          <p v-if="!feedback.title.isValid">{{ feedback.title.text }}</p>
        </div>
      </div>
      <div class="row">
        <label>노출여부</label>
        <div>
          <SToggle v-model="editData.isEnabled">{{ editData.isEnabled ? '노출' : '미노출' }}</SToggle>
        </div>
      </div>
      <div class="row">
        <label>게시일<b>*</b></label>
        <div class="has-feedback">
          <SDatepicker v-model="editData.postDate" :class="{ 'is-error': !feedback.postDate.isValid }" />
          <p v-if="!feedback.postDate.isValid">{{ feedback.postDate.text }}</p>
        </div>
      </div>
    </div>
    <div class="contents-title mb-16">
      <p class="h4">내용<b>*</b></p>
      <SButton @click="modal.isLegacy = true">이전 버전 불러오기</SButton>
    </div>
    <div class="contents" :class="{ is_error: !feedback.contents.isValid }">
      <SummernoteEditor ref="editor" v-model="editData.contents" />
    </div>
    <p v-if="!feedback.contents.isValid" class="contents-error">{{ feedback.contents.text }}</p>
    <div class="bottom-menus">
      <SButton @click="modal.isCancel = true">취소</SButton>
      <div class="right">
        <SButton class="mr-8" @click="showPreview">미리보기</SButton>
        <SButton button-type="primary" :disabled="isDisabledSubmitButton || isConfirmPending" @click="saveDetailPage"
          >완료</SButton
        >
      </div>
    </div>
    <!-- Modals -->
    <SModal :is-show="modal.isLegacy" @close="modal.isLegacy = false">
      <template #title>이전 버전 불러오기</template>
      <template #content>
        <SPageable
          :table-data="tableData"
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
                  <th>NO</th>
                  <th>제목</th>
                  <th>게시일</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in data" :key="item.id" @click="setLegacyData(item.id)">
                  <td>
                    <div>{{ tableData.startCount - index }}</div>
                  </td>
                  <td>
                    <div class="text-left">{{ item.isProgress ? '[진행] ' : '' }}{{ item.title }}</div>
                  </td>
                  <td>
                    <div>{{ $dayjs(item.postDate).format('YYYY-MM-DD') }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </template>
        </SPageable>
      </template>
    </SModal>
    <SDialogModal :is-show="modal.isCancel" @close="modal.isCancel = false">
      <template #content>콘텐츠를 저장하지 않고 이전페이지로 이동 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isCancel = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SLink button-type="primary" :to="baseUrl">확인</SLink>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isSaveAndOpen" @close="modal.isSaveAndOpen = false">
      <template #content>약관이 홈페이지에 오픈 됩니다.<br />콘텐츠를 저장 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isSaveAndOpen = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="saveData">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isSave" @close="$router.push(isNew ? `${baseUrl}` : `${baseUrl}/${id}`)">
      <template #content>콘텐츠가 저장되었습니다.</template>
      <template #modal-btn2>
        <SLink button-type="primary" :to="isNew ? `${baseUrl}` : `${baseUrl}/${id}`">확인</SLink>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import { cloneDeep, isEqual } from 'lodash/lang';
import SButton from '~/components/admin/commons/SButton';
import SToggle from '~/components/admin/commons/SToggle';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SInput from '~/components/admin/commons/SInput';
import SummernoteEditor from '~/components/admin/commons/Summernote';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import SLink from '~/components/admin/commons/SLink';
import SModal from '~/components/admin/modal/SModal';
import SPageable from '~/components/admin/commons/SPageable';
import { termsPreview } from '~/assets/js/previewConverter';
import { createFormElement } from '~/assets/js/commons';

export default {
  name: 'TermsEdit',
  components: { SPageable, SModal, SLink, SDialogModal, SummernoteEditor, SInput, SDatepicker, SToggle, SButton },
  props: {
    pageType: {
      type: String,
      required: false,
      default: 'privacy'
    },
    detailData: {
      type: Object,
      required: false,
      default: null
    },
    tableData: {
      type: Object,
      required: false,
      default: () => null
    },
    isNew: {
      type: Boolean,
      required: false,
      default: true
    },
    id: {
      type: [String, Number],
      required: false,
      default: null
    }
  },
  data() {
    return {
      titleText: '',
      baseUrl: '',
      feedback: {
        title: {
          isValid: true,
          text: '제목을 입력해 주세요.'
        },
        postDate: {
          isValid: true,
          text: '게시일을 선택해 주세요.'
        },
        contents: {
          isValid: true,
          text: '내용을 입력해 주세요.'
        }
      },
      modal: {
        isLegacy: false,
        isCancel: false,
        isSave: false,
        isSaveAndOpen: false
      },
      editData: this.detailData,
      editDataOrigin: cloneDeep(this.detailData),
      isConfirmPending: false
    };
  },
  computed: {
    isDisabledSubmitButton() {
      return this.isNew ? false : isEqual(this.editData, this.editDataOrigin);
    }
  },
  created() {
    let titleText = '';
    let baseUrl = '';

    switch (this.pageType) {
      case 'PRIVACY':
        titleText = '개인정보처리방침';
        baseUrl = '/admin/terms/privacy';
        break;
      case 'AGREE':
        titleText = '개인정보 수집 및 이용 동의서';
        baseUrl = '/admin/terms/agree';
        break;
      case 'SERVICE':
        titleText = '서비스 이용약관';
        baseUrl = '/admin/terms/service';
        break;
      case 'REFUND':
        titleText = '취소 및 환불약관';
        baseUrl = '/admin/terms/refund';
        break;
      case 'VIDEO':
        titleText = '영상정보처리기기 운영 관리방침';
        baseUrl = '/admin/terms/video';
        break;
      default:
        titleText = '올바르지 않은 페이지 타입';
        break;
    }

    this.titleText = titleText;
    this.baseUrl = baseUrl;
  },
  methods: {
    isValidate() {
      const clearValid = () => {
        Object.entries(this.feedback).forEach(([_, value]) => {
          value.isValid = true;
        });
      };
      const isClearForm = () => !Object.values(this.feedback).find((value) => value.isValid === false);
      const { title, postDate, contents } = this.editData;

      clearValid();
      if (!title) {
        this.feedback.title.isValid = false;
      }
      if (!postDate) {
        this.feedback.postDate.isValid = false;
      }
      if (!contents) {
        this.feedback.contents.isValid = false;
      }

      return isClearForm();
    },
    async setLegacyData(id) {
      this.editData = await this.$axios.$get(`/admin/policies/${id}`);
      this.$refs.editor.setContent(this.editData.contents);
      this.modal.isLegacy = false;
    },
    async saveDetailPage() {
      if (this.isValidate()) {
        const isPostNow = await this.$axios.$get('/admin/policies/post-check', {
          params: {
            postDate: this.$dayjs(this.editData.postDate).format('YYYY-MM-DD 00:00:00'),
            type: this.pageType
          }
        });

        if (isPostNow && this.editData.isEnabled) {
          this.modal.isSaveAndOpen = true;
        } else {
          await this.saveData();
        }
      }
    },
    async saveData() {
      this.isConfirmPending = true;
      if (this.isValidate()) {
        const editData = {
          ...this.editData,
          postDate: this.$dayjs(this.editData.postDate).format('YYYY-MM-DD 00:00:00')
        };
        if (this.isNew && this.id == null) {
          await this.$axios.$post('/admin/policies', editData);
        } else {
          await this.$axios.$put(`/admin/policies/${this.id}`, editData);
        }

        this.modal.isSaveAndOpen = false;
        this.modal.isSave = true;
      }
      this.isConfirmPending = false;
    },
    showPreview() {
      const convertData = { previewData: JSON.stringify(termsPreview(this.detailData)) };
      const $formEl = createFormElement(`/terms/${this.pageType.toLowerCase()}`, convertData, true);

      document.querySelector('body').append($formEl);
      $formEl.submit();
      $formEl.remove();
    }
  }
};
</script>

<style lang="scss" scoped>
.edit {
  > h1 {
    b {
      color: var(--color-blue);
      margin-right: 2rem;
    }
  }
  > h4 {
    display: flex;
    align-items: center;
    padding-bottom: 1.9rem;
    border-bottom: 1px solid var(--color-grey-2);
  }

  .contents-title {
    display: flex;
    justify-content: space-between;
    align-items: center;

    b {
      color: var(--color-blue);
      margin-right: 2rem;
    }
  }

  .contents {
    background-color: var(--color-white);
    border-radius: 0.3rem;
    overflow: hidden;
  }

  .bottom-menus {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2.4rem;
    padding-top: 2.4rem;
    border-top: 1px solid var(--color-grey-2);

    .right {
      display: flex;
    }
  }

  .contents-error {
    color: var(--color-red);
  }
}

.admin-table thead {
  th:nth-child(1) {
    width: 15%;
  }

  th:nth-child(2) {
    width: 60%;
  }

  th:nth-child(3) {
    width: 25%;
  }
}
</style>
