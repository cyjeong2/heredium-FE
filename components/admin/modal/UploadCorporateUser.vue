<template>
  <div>
    <SModal :is-show="true" width="600px" @close="onclose">
      <template #title>업로드</template>
      <template #content>
        <div v-if="!result">
          <div class="field-group">
            <label class="mr-24"> 법인 회원 이름 </label>
            <SDropdown
              v-model="companyName"
              :class="{ 'is-error': isSubmitted && feedback.companyName }"
              :option-list="companyList"
              w-size="large"
            ></SDropdown>
          </div>
          <div class="field-group flex-start">
            <div class="mr-28 select-file-box">
              <SInput
                v-model="fileName"
                w-size="full"
                readonly
                :class="{ 'is-error': isSubmitted && feedback.fileName }"
              />
              <input
                ref="accountFile"
                type="file"
                accept=".xlsx, .XLSX"
                class="is-blind"
                @change="updateFile($event)"
              />
              <p class="sub">xlsx 파일</p>
            </div>

            <SButton v-if="!fileName" @click="$refs.accountFile.click()">파일 첨부</SButton>
            <SButton v-else @click="removeFile">삭제</SButton>
          </div>

          <div v-if="invalidFileContent" class="validate-container">
            <div class="result-box">
              <h3 class="failed-cases">실패: {{ invalidFileContent.length }}</h3>
              <ol class="result-list failed-list">
                <li v-for="(item, index) in invalidFileContent" :key="index">{{ index + 1 }}. {{ item }}</li>
              </ol>
            </div>
          </div>
        </div>

        <div v-else class="result-container">
          <div class="result-total">
            <h2 class="success-cases mr-24">성공: {{ result?.success_cases?.length }}</h2>
            <h2 class="failed-cases">실패: {{ result?.failed_cases?.length }}</h2>
          </div>
          <div v-if="result?.success_cases?.length" class="result-box">
            <h3 class="success-cases">성공 목록</h3>
            <ol class="result-list success-list">
              <li v-for="(item, index) in result.success_cases" :key="index">{{ index + 1 }}. {{ item }}</li>
            </ol>
          </div>
          <div v-if="result?.failed_cases?.length" class="result-box">
            <h3 class="failed-cases">실패 목록</h3>
            <ol class="result-list failed-list">
              <li v-for="(item, index) in result.failed_cases" :key="index">{{ index + 1 }}. {{ item }}</li>
            </ol>
          </div>
        </div>
      </template>
      <template v-if="!result" #modal-btn1>
        <SButton v-if="!invalidFileContent" button-type="primary" @click="handleSubmit">확인</SButton>
        <SButton v-if="invalidFileContent" @click="removeFile">재업로드</SButton>
      </template>
      <template v-if="invalidFileContent && !result" #modal-btn2>
        <SButton button-type="primary" @click="handleSubmit">계속</SButton>
      </template>
    </SModal>
    <SDialogModal :is-show="isFileError" @close="isFileError = false">
      <template #content>5MB이하의 XLSX 파일을 업로드해주세요.</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="isFileError = false">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import SModal from './SModal.vue';
import SInput from '~/components/admin/commons/SInput';
import SDialogModal from '~/components/admin/modal/SDialogModal.vue';
import SButton from '~/components/admin/commons/SButton';
import SDropdown from '~/components/admin/commons/SDropdown';
import { fileValid } from '~/assets/js/commons';
import { API_ERROR } from '~/utils/message';

export default {
  name: 'UploadCorporateUser',

  components: { SModal, SDropdown, SButton, SInput, SDialogModal },

  directives: {},

  filters: {},
  props: {},
  data() {
    return {
      companyName: '',
      fileName: '',
      companyList: [],
      feedback: {},
      isSubmitted: false,
      isFileError: false,
      result: null,
      invalidFileContent: null
    };
  },
  async fetch() {
    try {
      const data = (await this.$axios.$get('/admin/companies')) || [];
      this.companyList = data.map((item) => ({ value: item.id, label: item.name }));
    } catch (error) {
      this.companyList = [];
    }
  },
  methods: {
    onclose() {
      this.$emit('close');
    },
    updateFile(e) {
      const input = e.target;
      if (input.files && input.files[0]) {
        const file = e.target.files[0];
        const fileName = file.name;
        const maxSize = 5 * 1024 * 1024;
        const extension = e.target.accept.split(',');
        const isValid = fileValid.check(e.target.files[0], maxSize, extension) !== null;
        if (!isValid) {
          this.isFileError = true;
          return null;
        }
        this.fileName = fileName;
        this.validateFileContent(file);
      }
    },
    removeFile() {
      this.invalidFileContent = null;
      this.fileName = '';
      this.feedback = {};
      if (this.$refs.accountFile?.value) {
        this.$refs.accountFile.value = null;
        this.$refs.accountFile.files = null;
      }
    },
    getFile() {
      const fileInputRef = this.$refs?.accountFile;
      const file = fileInputRef?.files && fileInputRef.files?.[0];
      return file;
    },
    async validateFileContent(file) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        await this.$axios.$post('/admin/companies/membership-registrations/validate', formData);
      } catch (error) {
        const errorList = error.response.data;
        if (Array.isArray(errorList)) {
          this.invalidFileContent = errorList;
          return;
        }
        this.handleErrorUploadFile(error);
      }
    },
    checkValidFile() {
      if (!this.fileName) {
        return false;
      }

      const file = this.getFile();
      if (!file) {
        this.feedback.fileName = true;
        this.fileName = '';
        return false;
      }

      return true;
    },
    validateData() {
      let isValid = true;
      const feedback = {};
      if (!this.companyName) {
        feedback.companyName = true;
        isValid = false;
      }
      if (!this.checkValidFile()) {
        feedback.fileName = true;
        isValid = false;
      }
      this.feedback = feedback;
      return isValid;
    },
    async handleSubmit() {
      this.isSubmitted = true;
      const isValidForm = this.validateData();
      if (!isValidForm) {
        return null;
      }
      try {
        const file = this.getFile();
        const formData = new FormData();
        formData.append('file', file);
        const res = await this.$axios.$post(
          `/admin/companies/${this.companyName}/membership-registrations/upload`,
          formData
        );
        this.result = res;
      } catch (error) {
        this.handleErrorUploadFile(error);
      }
    },
    handleErrorUploadFile(error) {
      const errorMessage = error.response.data?.MESSAGE || '';
      switch (errorMessage) {
        case 'INVALID_EXCEL_FILE':
          alert('xlsx 파일을 선택해주세요.');
          break;
        case 'INVALID_EXCEL_COLUMNS':
          alert('업로드된 엑셀 파일의 열이 지정된 템플릿과 일치하지 않습니다.');
          break;
        default:
          alert(API_ERROR);
          break;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.field-group {
  width: 100%;
  text-align: start;
  display: flex;
  align-items: center;
  .select-file-box {
    flex: 1;
  }
}
.field-group + .field-group {
  margin-top: 24px;
}
.flex-start {
  align-items: start;
}

.validate-container {
  text-align: start;
  max-height: 50vh;
  overflow-y: auto;
}
.result-container {
  text-align: start;
  max-height: 80vh;
  overflow-y: auto;
}
.result-total {
  display: flex;
  justify-content: start;
}
.result-box {
  margin-top: 12px;
}
.success-cases {
  text-align: center;
  color: var(--color-green);
}
.failed-cases {
  text-align: center;
  color: var(--color-u-error);
}
.result-list {
  ol {
    list-style-type: decimal;
  }
  ol + ol {
    margin-top: 3px;
  }
}
</style>
