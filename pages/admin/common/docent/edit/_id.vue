<template>
  <div v-if="detailData">
    <h1 class="mb-17">{{ isNew ? '도슨트 등록' : '도슨트 수정' }}</h1>
    <div class="contents-info mb-36">
      <div class="representative-img mr-28">
        <label class="upload-img" @click.stop>
          <img
            v-if="detailData.thumbnail?.resizeImage?.small"
            :src="`${$store.state.BASE_URL}${detailData.thumbnail?.resizeImage?.small}`"
            alt="테스트"
          />
          <span v-if="!detailData.thumbnail?.resizeImage?.small" class="file-info">
            <i class="ic-plus mb-28"></i>
            <span class="h4 mb-17">이미지를 등록해주세요.</span>
            <span class="bt-1r">5MB 이하의 JPG, GIF, PNG 파일을 선택해주세요.</span>
            <input type="file" accept=".jpg, .jpeg, .png, .gif" class="is-blind" @change="thumbnail" />
          </span>
        </label>
        <SButton
          v-if="detailData.thumbnail?.resizeImage?.small"
          button-type="primary"
          w-size="small"
          h-size="small"
          @click.self="onDeleteThumbnail"
        >
          삭제
        </SButton>
      </div>
      <div class="info-table">
        <div class="row">
          <label>제목<b>*</b></label>
          <div class="has-feedback">
            <SInput v-model="detailData.title" maxlength="100" w-size="xxx-large" />
          </div>
        </div>
        <div class="row">
          <label>부제목</label>
          <div>
            <SInput v-model="detailData.subtitle" maxlength="100" w-size="xxx-large" />
          </div>
        </div>
        <div class="row">
          <label>전시홀</label>
          <div>
            <SCheckboxGroup v-model="detailData.halls" :group-list="hallOptionList" />
          </div>
        </div>
        <div class="row">
          <label>일정<b>*</b></label>
          <div class="has-feedback">
            <div>
              <SDatepicker v-model="detailData.startDate" class="mr-28" w-size="large" :max="detailData.endDate" />
              <b class="mr-28">~</b>
              <SDatepicker v-model="detailData.endDate" w-size="large" :min="detailData.startDate" />
            </div>
          </div>
        </div>
        <div class="row">
          <label>노출여부</label>
          <div>
            <SToggle v-model="detailData.isEnabled">{{ detailData.isEnabled ? '노출' : '미노출' }}</SToggle>
          </div>
        </div>
      </div>
    </div>
    <div class="list">
      <h3 class="mb-16">도슨트</h3>
      <div class="list-top mb-16">
        <SButton @click="deleteInfo">삭제</SButton>
        <SButton button-type="primary" @click="onRegisterDocentModal(true)">등록</SButton>
      </div>
      <table class="admin-table">
        <thead>
          <tr>
            <th><SCheckbox v-model="isCheckedAll" @input="setCheckedAll" /></th>
            <th>썸네일</th>
            <th>작품명</th>
            <th>작가명</th>
            <th>소개글</th>
            <th>오디오</th>
            <th>지도</th>
            <th>수정</th>
          </tr>
        </thead>
        <tbody v-if="!detailData.infos || !detailData.infos[0]">
          <tr>
            <td colspan="11"><div>리스트가 없습니다.</div></td>
          </tr>
        </tbody>
        <Draggable v-bind="dragOptions" v-model="detailData.infos" tag="tbody">
          <tr v-for="(item, index) in detailData.infos" :key="item.id">
            <td>
              <div>
                <SCheckbox v-model="item.isChecked" :check-value="item.id" />
              </div>
            </td>
            <td>
              <div class="img">
                <img :src="getImage(item?.thumbnail)" alt="테스트" />
              </div>
            </td>
            <td>
              <div class="text-left">
                {{ item.title }}
              </div>
            </td>
            <td>
              <div class="text-left">
                {{ item.writer }}
              </div>
            </td>
            <td>
              <div class="intro text-left">
                {{ item.intro }}
              </div>
            </td>
            <td>
              <div>
                {{ item.audio ? 'Y' : 'N' }}
              </div>
            </td>
            <td>
              <div>
                {{ item.map ? 'Y' : 'N' }}
              </div>
            </td>
            <td>
              <div>
                <SButton w-size="small" @click="onRegisterDocentModal(false, index)">수정</SButton>
              </div>
            </td>
          </tr>
        </Draggable>
      </table>
    </div>
    <div class="bottom-menus">
      <SButton @click="modal.isCancel = true">취소</SButton>
      <div class="right">
        <SButton button-type="primary" :disabled="isConfirmPending" @click="onRegister">완료</SButton>
      </div>
    </div>
    <SDialogModal :is-show="modal.isCancel" @close="modal.isCancel = false">
      <template #content>콘텐츠를 저장하지 않고 이전페이지로 이동 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isCancel = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SLink button-type="primary" :to="baseUrl">확인</SLink>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isSave" @close="isNew ? $router.push(baseUrl) : $router.push(`${baseUrl}/${id}`)">
      <template #content>콘텐츠가 저장되었습니다.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="isNew ? $router.push(baseUrl) : $router.push(`${baseUrl}/${id}`)"
          >확인</SButton
        >
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isShowErrorModal" @close="modal.isShowErrorModal = false">
      <template #content>{{ errorMsg }}</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="modal.isShowErrorModal = false">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isThumbnail" @close="modal.isThumbnail = false">
      <template #content>5MB 이하의 JPG, GIF, PNG 파일을 선택해주세요.</template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="modal.isThumbnail = false">확인</SButton>
      </template>
    </SDialogModal>
    <DocentRegisterModal
      :is-show="modal.isRegisterDocent"
      :docent-data="selectedDocent"
      @close="modal.isRegisterDocent = false"
      @save="modifiedDocentModal"
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable';
import cloneDeep from 'lodash/cloneDeep';
import SInput from '~/components/admin/commons/SInput';
import SDatepicker from '~/components/admin/commons/SDatepicker';
import SCheckboxGroup from '~/components/admin/commons/SCheckboxGroup';
import SToggle from '~/components/admin/commons/SToggle';
import SButton from '~/components/admin/commons/SButton';
import SCheckbox from '~/components/admin/commons/SCheckbox';
import { DOCENTS_DETAIL } from '~/assets/js/types';
import SLink from '~/components/admin/commons/SLink';
import SDialogModal from '~/components/admin/modal/SDialogModal';
import { fileValid } from '~/assets/js/commons';
import DocentRegisterModal from '~/components/admin/modal/DocentRegisterModal';

export default {
  name: 'EditPage',
  components: {
    DocentRegisterModal,
    SDialogModal,
    SLink,
    SCheckbox,
    SButton,
    SToggle,
    SCheckboxGroup,
    SDatepicker,
    SInput,
    Draggable: draggable
  },
  layout: 'admin/default',
  async asyncData({ params, $axios, redirect, $dayjs }) {
    const { id } = params;
    const isNew = id == null;
    const detailData = id
      ? await $axios
          .$get(`/admin/docents/${id}`)
          .then((detailData) => ({
            ...detailData,
            infos: detailData.infos.map((info) => ({ ...info, isChecked: false })),
            startDate: $dayjs(detailData.startDate).format('YYYY-MM-DD'),
            endDate: $dayjs(detailData.endDate).format('YYYY-MM-DD')
          }))
          .catch(() => {
            redirect('/admin/common/docent');
          })
      : cloneDeep(DOCENTS_DETAIL);
    if (isNew) {
      detailData.startDate = $dayjs().format('YYYY-MM-DD');
      detailData.endDate = $dayjs().add(30, 'days').format('YYYY-MM-DD');
    }
    return { id, isNew, detailData };
  },
  data() {
    return {
      isNew: false,
      baseUrl: '/admin/common/docent',
      id: null,
      detailData: null,
      selectedDocent: null,
      errorMsg: '',
      modal: {
        isSave: false,
        isCancel: false,
        isLegacy: false,
        isRegisterDocent: false,
        isShowErrorModal: false,
        isThumbnail: false
      },
      dragOptions: {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'sortable_ghost'
      },
      isConfirmPending: false
    };
  },
  computed: {
    hallOptionList() {
      return this.$store.state.HALL_LIST.map((hall) => ({
        value: hall,
        label: `${hall} 전시홀`
      }));
    }
  },
  watch: {
    'detailData.infos': {
      deep: true,
      handler(newValue) {
        this.isCheckedAll = newValue.every((item) => item.isChecked);
      }
    }
  },
  methods: {
    getImage(image) {
      return image?.resizeImage?.small
        ? `${this.$store.state.BASE_URL}${image.resizeImage?.small}`
        : require('~/assets/img/thumbnail_default.jpg');
    },
    deleteInfo() {
      this.detailData.infos = this.detailData.infos.filter((info) => !info.isChecked);
    },
    setCheckedAll(newValue) {
      this.detailData.infos.forEach((info) => {
        info.isChecked = newValue;
      });
    },
    async onRegister() {
      this.isConfirmPending = true;

      if (this.isValidate()) {
        const detailData = {
          ...this.detailData,
          startDate: `${this.detailData.startDate} 00:00:00`,
          endDate: `${this.detailData.endDate} 23:59:59`
        };
        if (this.isNew) {
          await this.$axios.$post(`/admin/docents`, detailData);
        } else {
          await this.$axios.$put(`/admin/docents/${this.id}`, detailData);
        }
        this.modal.isSave = true;
      }

      this.isConfirmPending = false;
    },
    async thumbnail(e) {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024;
        const extension = e.target.accept.split(',');
        const isValid = fileValid.check(e.target.files[0], maxSize, extension) !== null;

        if (isValid) {
          const formData = new FormData();
          formData.append('files', file);
          await this.$axios
            .$post('/file', formData, {
              params: {
                type: 'PROJECT_THUMBNAIL'
              }
            })
            .then((fileForm) => {
              this.detailData.thumbnail = fileForm;
            });
        } else {
          this.modal.isThumbnail = true;
        }
        e.target.value = null;
        e.target.files = null;
        this.$forceUpdate();
      }
    },
    onDeleteThumbnail() {
      this.detailData.thumbnail = null;
      this.$forceUpdate();
    },
    onRegisterDocentModal(isNew, index) {
      const defaultDocent = {
        thumbnail: null,
        title: '',
        writer: '',
        position: '',
        intro: '',
        audio: null,
        map: null
      };
      const targetDocent = !isNew ? this.detailData.infos[index] : defaultDocent;

      this.selectedDocent = {
        ...targetDocent,
        isNew,
        index
      };
      this.modal.isRegisterDocent = true;
    },
    modifiedDocentModal({ newDocent, isNew, index }) {
      if (isNew) {
        this.detailData.infos.push(newDocent);
      } else {
        this.detailData.infos[index] = {
          ...this.detailData.infos[index],
          ...newDocent
        };
      }
      this.modal.isRegisterDocent = false;
    },
    isValidate() {
      let isValid = true;

      if (!this.detailData.title) {
        this.errorMsg = '제목을 입력해 주세요.';
        isValid = false;
      } else if (!this.detailData.startDate || this.detailData.startDate === 'Invalid Date') {
        this.errorMsg = '기간을 선택해 주세요.';
        isValid = false;
      } else if (!this.detailData.endDate || this.detailData.endDate === 'Invalid Date') {
        this.errorMsg = '기간을 선택해 주세요.';
        isValid = false;
      }

      if (isValid === false) {
        this.modal.isShowErrorModal = true;
      }

      return isValid;
    }
  }
};
</script>

<style lang="scss" scoped>
.contents-info {
  display: flex;
  align-items: flex-start;

  .representative-img {
    position: relative;
    flex: 1 1 56rem;

    .upload-img {
      position: relative;
      display: block;
      width: 100%;
      height: 0;
      padding-bottom: 63.92857142857143%;
      background-color: rgba(221, 221, 221, 0.5);
      border-radius: 0.3rem;
      cursor: pointer;

      img {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        border-radius: 0.3rem;
        object-fit: cover;
        object-position: center;
        background-color: #d9d9d9;
      }

      .file-info {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        i {
          font-size: 6.8rem;
        }
      }
    }
    button {
      position: absolute;
      right: 0.8rem;
      top: 0.8rem;
    }
  }

  .info-table {
    flex: 1 1 calc(100% - 58.8rem);
  }
}

.list {
  .list-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .admin-table {
    th {
      &:first-of-type {
        width: 4%;
      }
      &:nth-of-type(2) {
        width: 11%;
      }
      &:nth-of-type(3) {
        width: 20%;
      }
      &:nth-of-type(4) {
        width: 15%;
      }
      &:nth-of-type(5) {
        width: 34%;
      }
      &:nth-of-type(6) {
        width: 5%;
      }
      &:nth-of-type(7) {
        width: 5%;
      }
      &:last-of-type {
        width: 6%;
      }
    }
    td {
      div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        &.intro {
          display: -webkit-box;
          padding: 0 1.2rem;
          white-space: unset;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
        }
      }
      button {
        margin: 0 auto;
      }
    }
  }
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
</style>
