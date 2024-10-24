<template>
  <SModal :is-show="true" width="500px" @close="onclose">
    <template #title>업로드하다</template>
    <template #content>
      <div class="field-group">
        <label class="mr-24"> 법인 회원 이름 </label>
        <SDropdown
          v-model="companyName"
          :class="{ 'is-error': false }"
          :option-list="companyList"
          w-size="large"
        ></SDropdown>
      </div>
      <div class="field-group">
        <div class="mr-28">
          <SInput v-model="fileName" w-size="large" readonly />
          <input ref="detailFile" type="file" accept=".xlsx, .XLSX" class="is-blind" @change="updateFile($event)" />
          <!-- <p class="sub">xlsx 파일</p> -->
        </div>
        <SButton v-if="!fileName" @click="$refs.detailFile.click()">파일 첨부</SButton>
        <div v-else>
          <SButton @click="removeFile">삭제</SButton>
        </div>
      </div>
    </template>
    <template #modal-btn1>
      <SButton button-type="primary">취소</SButton>
    </template>
  </SModal>
</template>

<script>
// import cloneDeep from 'lodash/cloneDeep';
// import isEmpty from 'lodash/isEmpty';
import SModal from './SModal.vue';
import SInput from '~/components/admin/commons/SInput';
import SButton from '~/components/admin/commons/SButton';
import SDropdown from '~/components/admin/commons/SDropdown';
import { fileValid } from '~/assets/js/commons';

export default {
  name: 'UploadCorporateUser',

  components: { SModal, SDropdown, SButton, SInput },

  directives: {},

  filters: {},
  props: {},
  data() {
    return {
      companyName: '',
      fileName: '',
      companyList: []
    };
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
          return null;
        }
        this.fileName = fileName;
      }
    },
    removeFile() {
      this.fileName = '';
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
</style>
