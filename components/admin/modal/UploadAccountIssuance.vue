<template>
  <SModal :is-show="true" width="600px" @close="closePopup">
    <template #title>업로드하다</template>
    <template #content>
      <div class="result-container">
        <div class="result-total">
          <h2 class="success-cases mr-24">성공: {{ successCases?.length }}</h2>
          <h2 class="failed-cases">실패한: {{ failedCases?.length }}</h2>
        </div>
        <div v-if="successCases?.length" class="result-box">
          <h3 class="success-cases">성공 목록</h3>
          <!-- <ol class="result-list success-list">
            <li v-for="(item, index) in successCases" :key="index">{{ index + 1 }}. {{ item }}</li>
          </ol> -->
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>이름</th>
                <th>계정</th>
                <th>연락처</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in successCases" :key="index">
                <td>{{ index + 1 }}</td>
                <td>{{ item.name }}</td>
                <td>{{ item.email }}</td>
                <td>{{ item.phone }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="failedCases?.length" class="result-box">
          <h3 class="failed-cases">실패 목록</h3>
          <ol class="result-list failed-list">
            <li v-for="(item, index) in failedCases" :key="index">{{ index + 1 }}. {{ item }}</li>
          </ol>
        </div>
      </div>
    </template>
    <template v-if="!result" #modal-btn1>
      <SButton button-type="primary" @click="closePopup">확인</SButton>
    </template>
  </SModal>
</template>

<script>
import SButton from '../commons/SButton.vue';
import SModal from './SModal.vue';

export default {
  name: 'UploadAccountIssuance',

  components: { SModal, SButton },

  directives: {},

  filters: {},
  props: {
    successCases: {
      type: Array,
      required: true
    },
    failedCases: {
      type: Array,
      required: true
    }
  },
  methods: {
    closePopup() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped lang="scss">
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
table {
  width: 100%;
  border: 1px solid var(--color-u-grey-2);
  margin-top: 14px;
  td,
  th {
    padding: 4px;
  }
  th {
    text-align: center;
  }
  td:nth-child(1),
  th:nth-child(1) {
    width: 40px;
  }
  td:nth-child(2),
  th:nth-child(2) {
    width: auto;
    max-width: 169px;
  }
  td:nth-child(3),
  th:nth-child(3) {
    width: auto;
  }
  td:nth-child(4),
  th:nth-child(4) {
    width: 100px;
  }

  tr + tr {
    border-top: 1px solid var(--color-u-grey-2);
  }
  td + td,
  th + th {
    border-left: 1px solid var(--color-u-grey-2);
  }
  thead > tr {
    border-bottom: 1px solid var(--color-u-grey-2);
  }
}
</style>
