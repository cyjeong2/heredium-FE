<template>
  <div v-if="detailData">
    <STitle emoji="gear">관리자 정보</STitle>
    <div class="info-table">
      <div class="row">
        <label>이메일<b>*</b></label>
        <div class="has-feedback">
          <div>
            <SInput
              v-model="detailData.email"
              class="mr-8"
              w-size="large"
              :class="{
                'is-error': !feedback.email.isValid,
                'is-success': feedback.email.isValid === true && feedback.email.success === false
              }"
              maxlength="50"
              @input="emailOverlapCheck"
            />
            <SButton :disabled="!isOverlapId" @click="onCheckRedundancy">중복확인</SButton>
          </div>
          <p :class="{ 'is-success': !feedback.email.success }">
            {{ feedback.email.text }}
          </p>
        </div>
      </div>
      <div class="row">
        <label>이름<b>*</b></label>
        <div class="has-feedback">
          <SInput
            v-model="detailData.name"
            w-size="large"
            :class="{ 'is-error': !feedback.name.isValid }"
            maxlength="30"
            @keyup="detailData.name = detailData.name.replace(/[^a-z|A-Z|ㄱ-ㅎ|가-힣]/g, '')"
          />
          <p v-if="!feedback.name.isValid">{{ feedback.name.text }}</p>
        </div>
      </div>
      <div class="row">
        <label>비밀번호<b>*</b></label>
        <div v-if="!isNew">
          <p class="mr-28">************</p>
          <SLink
            :to="{
              path: '/admin/user/change-password',
              query: { id: detailData.id, user: false }
            }"
            >변경</SLink
          >
        </div>
        <div v-else class="has-feedback">
          <SInput
            v-model="detailData.password"
            type="password"
            w-size="large"
            :class="{ 'is-error': !feedback.password.isValid }"
            maxlength="30"
          />
          <p v-if="!feedback.password.isValid">{{ feedback.password.text }}</p>
        </div>
      </div>
      <div v-if="isNew" class="row">
        <label>비밀번호 확인<b>*</b></label>
        <div class="has-feedback">
          <SInput
            v-model="passwordConfirm"
            type="password"
            w-size="large"
            :class="{ 'is-error': !feedback.passwordConfirm.isValid }"
            maxlength="30"
          />
          <p v-if="!feedback.passwordConfirm.isValid">{{ feedback.passwordConfirm.text }}</p>
        </div>
      </div>
      <div class="row">
        <label>연락처<b>*</b></label>
        <div class="has-feedback">
          <SInput
            v-model="detailData.phone"
            type="tel"
            :is-numeric="true"
            w-size="large"
            :class="{ 'is-error': !feedback.phone.isValid }"
            @keyup="detailData.phone = detailData.phone.replace(/[^0-9]/g, '')"
          />
          <p v-if="!feedback.phone.isValid">{{ feedback.phone.text }}</p>
        </div>
      </div>
      <div v-if="!isNew" class="row">
        <label>등록 일시</label>
        <div>{{ detailData.createdDate }}</div>
        <label>최근 로그인 일시</label>
        <div>{{ detailData.lastLoginDate }}</div>
      </div>
      <div class="row">
        <label>권한</label>
        <div>
          <SDropdown v-model="detailData.auth" :option-list="AuthList" :disabled="detailData.auth === 'ADMIN'" />
        </div>
      </div>
      <div v-if="!isNew" class="row">
        <label>계정 정지 여부</label>
        <div><SCheckbox v-model="detailData.isEnabled" reverse>정지</SCheckbox></div>
      </div>
    </div>
    <div class="bottom-area">
      <div class="left">
        <SLink to="/admin/admin">리스트</SLink>
      </div>
      <div class="right">
        <SButton v-if="!isNew" @click="modal.isRemove = true">삭제</SButton>
        <SButton button-type="primary" :disabled="isOverlapId || isConfirmPending" @click="onRegister">완료</SButton>
      </div>
    </div>
    <SDialogModal :is-show="modal.isSave" @close="$router.push(`${baseUrl}`)">
      <template #content>{{ modalMsg }}</template>
      <template #modal-btn2>
        <SLink button-type="primary" :to="baseUrl">확인</SLink>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isRemove" @close="modal.isRemove = false">
      <template #content>관리자정보를 삭제하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isRemove = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="onDeletePost">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isRemoveConfirm" @close="$router.push(`${baseUrl}`)">
      <template #content>관리자정보가 삭제되었습니다.</template>
      <template #modal-btn1>
        <SLink button-type="primary" :to="baseUrl">확인</SLink>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import STitle from '~/components/admin/commons/STitle';
import SButton from '~/components/admin/commons/SButton';
import SInput from '~/components/admin/commons/SInput';
import SCheckbox from '~/components/admin/commons/SCheckbox';
import SDropdown from '~/components/admin/commons/SDropdown';
import SLink from '~/components/admin/commons/SLink';
import { ADMIN_DETAIL, AUTH_TYPE } from '~/assets/js/types';
import SDialogModal from '~/components/admin/modal/SDialogModal';

export default {
  name: 'EditPage',
  components: { SDialogModal, SLink, SDropdown, SCheckbox, SInput, SButton, STitle },
  layout: 'admin/default',
  async asyncData({ params, $axios, redirect }) {
    const { id } = params;
    const isNew = id == null;
    const detailData = id
      ? await $axios.$get(`/admin/admins/${id}`).catch(() => {
          redirect('/admin/admins/');
        })
      : cloneDeep(ADMIN_DETAIL);
    detailData.originEmail = detailData.email;

    return { id, isNew, detailData };
  },
  data() {
    return {
      id: '',
      isNew: false,
      detailData: null,
      isOverlapId: false,
      baseUrl: '/admin/admin/',
      modalMsg: '',
      passwordConfirm: '',
      feedback: {
        email: {
          success: true,
          isValid: true,
          text: ''
        },
        name: {
          isValid: true,
          text: '이름을 입력해 주세요.'
        },
        password: {
          isValid: true,
          text: ''
        },
        passwordConfirm: {
          isValid: true,
          text: ''
        },
        phone: {
          isValid: true,
          text: '연락처를 입력해 주세요.'
        }
      },
      modal: {
        isSave: false,
        isRemove: false,
        isRemoveConfirm: false
      },
      isConfirmPending: false
    };
  },
  computed: {
    AuthList() {
      const authList = Object.entries(AUTH_TYPE).map(([key, value]) => ({
        label: value,
        value: key
      }));

      authList.shift();
      authList.pop();
      if (!this.isNew && this.detailData.auth === 'ADMIN') {
        authList.unshift({ value: 'ADMIN', label: '최고 운영자' });
      }

      return authList;
    }
  },
  methods: {
    async onCheckRedundancy() {
      if (this.isValidateEmail()) {
        const isOverlap = await this.$axios.$get(`/admin/admins/duplicate`, {
          params: {
            email: this.detailData.email
          }
        });

        const email = this.feedback.email;

        if (!isOverlap) {
          email.isValid = true;
          email.success = false;
          email.text = '사용가능한 이메일입니다.';
          this.isOverlapId = false;
        } else {
          email.isValid = false;
          email.success = true;
          email.text = '가입된 이메일입니다';
        }

        this.modal.isError = true;
      }
    },
    async onRegister() {
      this.isConfirmPending = true;
      if (this.isValidate()) {
        if (this.isNew) {
          await this.$axios.$post(`/admin/admins/`, this.detailData);
          this.modalMsg = '관리자정보가 등록되었습니다.';
        } else {
          await this.$axios.$put(`/admin/admins/${this.id}`, {
            ...this.detailData,
            originEmail: null
          });
          this.modalMsg = '관리자정보가 수정되었습니다.';
        }
        this.modal.isSave = true;
      }
      this.isConfirmPending = false;
    },
    emailOverlapCheck() {
      const newValue = this.detailData.email;
      const originValue = this.detailData.originEmail;
      const email = this.feedback.email;

      if ((this.isOverlapId = newValue !== originValue)) {
        email.isValid = false;
        email.success = true;
        email.text = '이메일 중복확인을 해주세요.';
      } else {
        email.isValid = true;
        email.success = true;
        email.text = '';
      }
    },
    isValidate() {
      const clearValid = () => {
        Object.values(this.feedback).forEach((value) => {
          value.isValid = true;
        });
      };
      const isClearForm = () => !Object.values(this.feedback).find((value) => value.isValid === false);
      const { email, password, name, phone } = this.detailData;
      const emailFeedback = this.feedback.email;
      const passwordFeedback = this.feedback.password;
      const passwordConfirmFeedback = this.feedback.passwordConfirm;

      clearValid();
      if (!email) {
        emailFeedback.isValid = false;
        emailFeedback.text = '이메일을 입력해 주세요.';
      }
      if (!name) {
        this.feedback.name.isValid = false;
      }
      if (!password && this.isNew) {
        passwordFeedback.isValid = false;
        passwordFeedback.text = '비밀번호를 입력해 주세요.';
      } else if ((this.isNew && password.length < 8) || (this.isNew && password.length > 16)) {
        passwordFeedback.isValid = false;
        passwordFeedback.text = '비밀번호를 8자리에서 16자리로 조합해주세요.';
      }
      if (!phone) {
        this.feedback.phone.isValid = false;
      }
      if (!this.passwordConfirm && this.isNew) {
        passwordConfirmFeedback.isValid = false;
        passwordConfirmFeedback.text = '비밀번호 확인을 입력해 주세요.';
      } else if (password !== this.passwordConfirm && this.isNew) {
        passwordConfirmFeedback.isValid = false;
        passwordConfirmFeedback.text = '비밀번호가 일치하지 않습니다.';
      }

      return isClearForm();
    },
    isValidateEmail() {
      const clearValid = () => {
        Object.values(this.feedback).forEach((value) => {
          value.isValid = true;
        });
      };
      const emailPattern =
        /^([\w._-])*[a-zA-Z0-9]+([\w._-])*([a-zA-Z0-9])+([\w._-])+@([\w_-])*([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;
      const isClearForm = () => !Object.values(this.feedback).find((value) => value.isValid === false);
      const emailFeedback = this.feedback.email;
      const { email } = this.detailData;

      clearValid();
      if (!email) {
        emailFeedback.isValid = false;
        emailFeedback.success = true;
        emailFeedback.text = '이메일을 입력해 주세요.';
      }

      if (!emailPattern.test(email)) {
        emailFeedback.isValid = false;
        emailFeedback.success = true;
        emailFeedback.text = '잘못된 이메일 양식입니다.';
      }

      return isClearForm();
    },
    onDeletePost() {
      this.$axios.$delete(`/admin/admins/${this.id}`);
      this.modal.isRemoveConfirm = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.bottom-area {
  display: flex;
  justify-content: space-between;

  .right {
    display: flex;

    button {
      margin-right: 0.8rem;
    }

    button:last-child {
      margin-right: 0;
    }
  }
}

.has-feedback > div {
  display: flex;
}
</style>
