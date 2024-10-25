<template>
  <div>
    <SModal :is-show="true" width="500px" @close="onclose">
      <template #title>업로드하다</template>
      <template #content>
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
          <div class="mr-28">
            <SInput
              v-model="fileName"
              w-size="large"
              readonly
              :class="{ 'is-error': isSubmitted && feedback.fileName }"
            />
            <input ref="accountFile" type="file" accept=".xlsx, .XLSX" class="is-blind" @change="updateFile($event)" />
            <p class="sub">xlsx 파일</p>
          </div>
          <SButton v-if="!fileName" @click="$refs.accountFile.click()">파일 첨부</SButton>
          <div v-else>
            <SButton @click="removeFile">삭제</SButton>
          </div>
        </div>
      </template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="handleSubmit">취소</SButton>
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
// import cloneDeep from 'lodash/cloneDeep';
// import isEmpty from 'lodash/isEmpty';
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
      isFileError: false
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
      }
    },
    removeFile() {
      this.fileName = '';
    },
    getFile() {
      const fileInputRef = this.$refs?.accountFile;
      const file = fileInputRef?.files && fileInputRef.files?.[0];
      return file;
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
        formData.append('files', file);
        await this.$axios.$post(`/admin/companies/${this.companyName}/membership-registrations/upload`, formData);
        this.onclose();
      } catch (error) {
        alert(API_ERROR);
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
}
.field-group + .field-group {
  margin-top: 24px;
}
.flex-start {
  align-items: start;
}
</style>
