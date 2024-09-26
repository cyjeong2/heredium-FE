<template>
  <div class="for-pc-container">
    <h1>단체 입장권 예매 신청</h1>
    <div class="notice">
      <div class="row">
        <div class="number">1.</div>
        <div class="text">15명 이상이 관람 예정이라면 단체 관람권으로 예매해 주시기 바랍니다.</div>
      </div>
      <div class="row">
        <div class="number">2.</div>
        <div class="text">신청이 완료되면 담당자가 관람일 및 시간, 결제 방법을 안내 드릴 예정입니다.</div>
      </div>
    </div>
    <div class="container">
      <div class="input">
        <label class="bold">{{ type === 'EXHIBITION' ? '전시' : '프로그램' }}명</label>
        <h2>{{ title }}</h2>
      </div>
      <div class="divider" />
      <div class="two-grid">
        <div class="input mb-24">
          <label>관람 희망 일자 <b class="must">*</b></label>
          <UDatepicker
            v-model="dateSelected"
            w-size="full"
            :is-error="error.date.isError"
            :min="$dayjs().format('YYYY-MM-DD')"
          />
          <p v-if="error.date.isError" class="error-msg">{{ error.date.msg }}</p>
        </div>
        <div class="input mb-24">
          <label>관람 희망 시간 <b class="must">*</b></label>
          <USelect v-model="timeSelected" :option-list="timeOptionList" w-size="full" />
        </div>
      </div>
      <div class="input">
        <label>신청 인원 <b class="must">*</b></label>
        <UInput
          v-model="formData.number"
          w-size="full"
          sub-icon="명"
          is-comma-num
          :error-msg="error.number.isError ? error.number.msg : ''"
        />
      </div>
      <div class="divider" />
      <div class="two-grid">
        <div class="input mb-24">
          <label>단체 이름 <b class="must">*</b></label>
          <UInput v-model="formData.name" w-size="full" :error-msg="error.name.isError ? error.name.msg : ''" />
        </div>
        <div class="input mb-24">
          <label>인솔자 이름 <b class="must">*</b></label>
          <UInput v-model="formData.reader" w-size="full" :error-msg="error.reader.isError ? error.reader.msg : ''" />
        </div>
      </div>
      <div class="two-grid">
        <div class="input">
          <label>인솔자 연락처 <b class="must">*</b></label>
          <UInput
            v-model="formData.tel"
            w-size="full"
            maxlength="11"
            is-number-only
            placeholder="- 없이 번호만 기재해주시기 바랍니다."
            :error-msg="error.tel.isError ? error.tel.msg : ''"
          />
        </div>
        <div class="input">
          <label>인솔자 이메일</label>
          <UInput v-model="formData.email" w-size="full" :error-msg="error.email.isError ? error.email.msg : ''" />
        </div>
      </div>
      <div class="divider" />
      <div class="input">
        <label>세부사항</label>
        <textarea
          v-model="formData.note"
          placeholder="참여 목적과 요청 사항을 기재해주시면 보다 더 자세한 안내를 도와드릴 수 있습니다."
        />
      </div>
      <div class="btn-area">
        <UButton button-type="secondary" @click="isCancelModal = true">취소</UButton>
        <UButton :disabled="!isCanApplication" @click="submit">신청</UButton>
      </div>
    </div>
    <UDialogModal :is-show="isCancelModal">
      <template #content>지금 취소하시면 작성한 정보가 저장되지 않아요!</template>
      <template #modal-btn1>
        <UButton button-type="secondary" w-size="sm" @click="isCancelModal = false">예매 계속하기</UButton>
      </template>
      <template #modal-btn2>
        <UButton w-size="sm" @click="$router.go(-1)">예매 취소하기</UButton>
      </template>
    </UDialogModal>
    <UDialogModal :is-show="isShowDoneModal">
      <template #content>단체 입장권 예매 신청이 완료되었습니다.</template>
      <template #modal-btn1>
        <UButton @click="goTicketingPage">확인</UButton>
      </template>
    </UDialogModal>
  </div>
</template>

<script>
import USelect from '~/components/user/common/USelect';
import UInput from '~/components/user/common/UInput';
import UButton from '~/components/user/common/UButton';
import UDatepicker from '~/components/user/common/UDatepicker';
import UDialogModal from '~/components/user/modal/UDialogModal';
import { numberPad } from '~/assets/js/commons';

export default {
  name: 'GroupTicketing',
  components: { UDialogModal, UDatepicker, UButton, UInput, USelect },
  asyncData({ query, redirect }) {
    const { id, type, title } = query;

    if (!id || !type || !title) {
      redirect('/');
    }
    const timeOptionList = Array.from({ length: 24 }, (_, index) => ({
      label: `${numberPad(index + 1, 2)}:00`,
      value: index + 1
    }));

    return { id, type, title, timeOptionList };
  },
  data() {
    return {
      id: null,
      type: null,
      title: null,
      dateSelected: '',
      timeOptionList: [],
      timeSelected: 1,
      formData: {
        kind: 'EXHIBITION',
        title: '',
        date: '',
        number: '',
        name: '',
        reader: '',
        tel: '',
        email: '',
        note: ''
      },
      error: {
        date: {
          isError: false,
          msg: '관람 희망 일자를 선택해주세요.'
        },
        number: {
          isError: false,
          msg: '신청 인원을 입력해주세요.'
        },
        name: {
          isError: false,
          msg: '단체 이름을 작성해주세요.'
        },
        reader: {
          isError: false,
          msg: '인솔자 이름을 작성해주세요.'
        },
        tel: {
          isError: false,
          msg: '인솔자 연락처를 작성해주세요.'
        },
        email: {
          isError: false,
          msg: '인솔자 이메일을 작성해주세요.'
        }
      },
      isCancelModal: false,
      isShowDoneModal: false
    };
  },
  computed: {
    isCanApplication() {
      const date = this.dateSelected;
      const time = this.timeSelected;
      const { number, name, reader, tel } = this.formData;

      return date && time && number && number > 0 && name && reader && tel;
    }
  },
  created() {
    this.formData.kind = this.type;
    this.formData.title = this.title;
  },
  methods: {
    isValidate() {
      const data = this.formData;
      const clearError = () => {
        Object.entries(this.error).forEach(([_, value]) => {
          value.isError = false;
        });
      };
      const emailPattern =
        /^([\w._-])*[a-zA-Z0-9]+([\w._-])*([a-zA-Z0-9])+([\w._-])+@([\w_-])*([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;
      let isValid = true;

      clearError();
      if (!this.dateSelected) {
        this.error.date.isError = true;
        isValid = false;
      }
      if (data.number <= 0) {
        this.error.number.isError = true;
        isValid = false;
      }
      if (!data.name) {
        this.error.name.isError = true;
        isValid = false;
      }
      if (!data.reader) {
        this.error.reader.isError = true;
        isValid = false;
      }
      if (!data.tel) {
        this.error.tel.isError = true;
        isValid = false;
      }
      if (data.email && data.email.length > 0 && !emailPattern.test(data.email)) {
        this.error.email.isError = true;
        this.error.email.msg = '올바른 이메일을 작성해주세요.';
        isValid = false;
      }

      if (!isValid) {
        this.$nextTick(() => {
          const $errorDom = document.querySelector('.is-error');

          if ($errorDom) {
            window.scrollTo({ top: $errorDom.offsetTop - 70 });
          }
        });
      }

      return isValid;
    },
    async submit() {
      if (this.isValidate()) {
        this.formData.date = `${this.dateSelected} ${numberPad(this.timeSelected, 2)}:00:00`;
        await this.$axios.$post('/user/tickets/group', this.formData).then(() => {
          this.isShowDoneModal = true;
        });
      }
    },
    goTicketingPage() {
      this.$router.push('/ticketing');
    }
  }
};
</script>

<style lang="scss" scoped>
h1 {
  font-weight: 700;
  font-size: 2.4rem;
  padding: 3.2rem 2rem 2rem;
  line-height: 160%;
  text-align: center;
  letter-spacing: -1px;
}

h2 {
  font-weight: 700;
  font-size: 1.8rem;
  line-height: 100%;
}

.dropdown {
  display: block;
  width: 100%;
}

.notice {
  background: rgba(235, 235, 235, 0.4);
  border-top: 1px solid var(--color-u-grey-1);
  border-bottom: 1px solid var(--color-u-grey-1);
  padding: 2rem;

  .row {
    display: flex;
    margin-bottom: 0.8rem;

    .number {
      margin-right: 0.4rem;
    }

    .text {
      flex: 1;
      font-size: 1.4rem;
      font-weight: 400;
      word-break: keep-all;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.container {
  padding-top: 3.2rem;
  margin-bottom: 12rem;

  .input {
    margin-bottom: 3.2rem;

    label {
      display: block;
      font-weight: 500;
      font-size: 1.4rem;
      line-height: 100%;
      margin-bottom: 1.6rem;
    }
  }

  .divider {
    height: 1px;
    width: 100%;
    background-color: var(--color-u-grey-2);
    margin: 3.2rem 0;
  }

  textarea {
    height: 16rem;
    width: 100%;
    border-radius: 0;
    border: 1px solid var(--color-u-grey-2);
    padding: 1.2rem 1.2rem 0;
    resize: none;

    &::placeholder {
      color: var(--color-u-grey-2);
    }
  }

  .btn-area {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-column-gap: 1.6rem;
    margin-top: 4rem;

    button {
      width: 100%;
    }
  }
}

.error-msg {
  color: var(--color-u-error);
  font-weight: 500;
  font-size: 1.2rem;
  line-height: 100%;
  margin-top: 0.8rem;
}

.must {
  color: var(--color-u-error);
}

@media screen and (min-width: 769px) {
  .for-pc-container {
    max-width: 66.4rem;
    margin: 0 auto;

    .container {
      padding: 0;
    }
  }

  h1 {
    font-weight: 700;
    font-size: 4.2rem;
    padding: 0;
    line-height: 150%;
    margin-top: 12.4rem;
    margin-bottom: 4rem;
  }

  h2 {
    font-size: 2rem;
    line-height: 150%;
  }

  .two-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 2.8rem;
  }

  .notice {
    background: rgba(235, 235, 235, 0.4);
    border: 1px solid var(--color-u-grey-1);
    padding: 2.2rem 2.4rem;
    margin-bottom: 3.2rem;

    .row {
      margin-bottom: 0.6rem;

      .number {
        font-size: 1.6rem;
        font-weight: 400;
        line-height: 160%;
      }

      .text {
        font-size: 1.6rem;
        font-weight: 400;
        line-height: 160%;
      }
    }
  }

  .container {
    padding-top: 3.2rem;
    margin-bottom: 12rem;

    .input {
      label {
        font-size: 1.6rem;
        line-height: 160%;
        letter-spacing: 0.25px;

        &.bold {
          font-weight: 700;
        }
      }

      &.mb-24 {
        margin-bottom: 2.4rem;
      }
    }

    textarea {
      height: 18.8rem;
      padding: 1.3rem 1.6rem 0;
      font-size: 1.8rem;
      line-height: 160%;

      &::placeholder {
        font-size: 1.8rem;
        line-height: 160%;
        font-weight: 500;
      }
    }

    .btn-area {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-column-gap: 1.6rem;
      margin-top: 4rem;

      button {
        width: 15.2rem !important;

        &:first-child {
          justify-self: flex-end;
        }
      }
    }
  }

  .error-msg {
    font-size: 1.4rem;
    line-height: 160%;
    margin-top: 0.7rem;
  }
}
</style>
