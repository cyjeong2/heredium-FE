<template>
  <div class="edit">
    <h1 class="mb-17">{{ titleText }}</h1>
    <div v-if="pageType === 'HANA'" class="info-table">
      <div class="row">
        <label>고객번호</label>
        <div>{{ cloneDetailData.hanaBankUuid }}</div>
      </div>
      <div class="row">
        <label>이름</label>
        <div>{{ cloneDetailData.name }}</div>
      </div>
    </div>
    <div v-else class="info-table">
      <div class="row">
        <label>이메일</label>
        <div v-if="pageType === 'COMMON' && cloneDetailData.provider === 'EMAIL'" class="has-feedback">
          <div>
            <SInput
              v-model="cloneDetailData.email"
              w-size="large"
              class="mr-8"
              :class="{
                'is-error': !feedback.email.isValid,
                'is-success': feedback.email.isValid === true && feedback.email.success === false
              }"
              maxlength="50"
              @input="updateDetailData"
            />
            <SButton :disabled="!isOverlapId" @click="checkRedundancy">중복확인</SButton>
          </div>
          <p :class="{ 'is-success': !feedback.email.success }">
            {{ feedback.email.text }}
          </p>
        </div>
        <div v-else>{{ cloneDetailData.email }}</div>
      </div>
      <div class="row">
        <label>가입방법</label>
        <div>{{ providerTextConverter(cloneDetailData.provider) }}</div>
      </div>
      <div class="row">
        <label>이름</label>
        <div>{{ cloneDetailData.name }}</div>
      </div>
      <div class="row">
        <label>비밀번호</label>
        <div>
          <p class="mr-28">************</p>
          <SLink
            v-if="pageType === 'COMMON' && !cloneDetailData.provider"
            :to="{ path: '/admin/user/change-password', query: { id: cloneDetailData.id, user: true } }"
          >
            변경
          </SLink>
        </div>
      </div>
      <div class="row">
        <label>연락처</label>
        <div>{{ cloneDetailData.phone }}</div>
      </div>
      <div class="row">
        <label>가입일시</label>
        <div>{{ cloneDetailData.createdDate }}</div>
        <label>최근 로그인 일시</label>
        <div>{{ cloneDetailData.lastLoginDate }}</div>
      </div>
      <div v-if="pageType === 'NONACTIVE'" class="row">
        <label>휴면 전환 일시</label>
        <div>{{ cloneDetailData.sleepDate }}</div>
        <label>계정 자동탈퇴 일시</label>
        <div>{{ cloneDetailData.terminateDate }}</div>
      </div>
      <div class="row">
        <label>마케팅 수신 동의 여부</label>
        <div>{{ cloneDetailData.isMarketingReceive ? '동의' : '미동의' }}</div>
      </div>
      <!-- 추가: 직업 -->
      <div class="row">
        <label>직업</label>
        <div>{{ jobLabel(cloneDetailData.job) }}</div>
        <label>지역</label>
        <div>{{ regionText(cloneDetailData.state, cloneDetailData.district) }}</div>
      </div>
    </div>
    <div class="bottom-menus mb-36">
      <SLink :to="baseUrl">리스트</SLink>
      <SButton
        v-if="pageType !== 'HANA'"
        button-type="primary"
        :disabled="isOverlapId || isConfirmPending"
        @click="onModified(cloneDetailData.id)"
      >
        완료
      </SButton>
    </div>
    <SProgressTab v-model="isCoffee" :label="['입장권', '커피교환권']" class="mb-24" @input="onCoffee" />
    <SPageable
      :table-data="tableData"
      @getTableData="
        (page) => {
          $emit('changePage', page);
        }
      "
    >
      <template #data="{ data }">
        <table class="admin-table" :class="{ coffee: !isCoffee }">
          <thead :class="{ 'data-none': !data || !data[0] }">
            <tr v-if="isCoffee">
              <th>NO</th>
              <th>구분</th>
              <th>티켓구분</th>
              <th>제목</th>
              <th>입장일시</th>
              <th>구매 수</th>
              <th>금액</th>
              <th>계정</th>
              <th>이름</th>
              <th>연락처</th>
              <th>상태</th>
              <th>입장권아이디</th>
              <th>결제아이디</th>
              <th>생성일시</th>
            </tr>
            <tr v-else>
              <th>NO</th>
              <th>제목</th>
              <th>회차</th>
              <th>구매 수</th>
              <th>금액</th>
              <th>계정</th>
              <th>이름</th>
              <th>상태</th>
              <th>주문아이디</th>
              <th>결제아이디</th>
              <th>생성일시</th>
            </tr>
          </thead>
          <tbody v-if="isCoffee">
            <tr v-if="!data || !data[0]">
              <td colspan="100%"><div>리스트가 없습니다.</div></td>
            </tr>
            <tr v-for="(item, index) in data" :key="item.id">
              <td>
                <div>{{ tableData.startCount - index }}</div>
              </td>
              <td>
                <div>{{ getKind(item.kind) }}</div>
              </td>
              <td>
                <div>{{ getType(item.type) }}</div>
              </td>
              <td>
                <div class="text-left">{{ item.title }}</div>
              </td>
              <td>
                <div>
                  <p>{{ $dayjs(item.startDate).format('YYYY-MM-DD ') }}</p>
                  <span>{{ $dayjs(item.startDate).format('HH:mm') }} ~</span>
                  <span>{{ $dayjs(item.endDate).format('HH:mm') }}</span>
                </div>
              </td>
              <td>
                <div class="text-right">{{ item.number.toLocaleString() }}</div>
              </td>
              <td>
                <div class="text-right">{{ item.price.toLocaleString() }}</div>
              </td>
              <td>
                <div>{{ item.email }}</div>
              </td>
              <td>
                <div>{{ item.name }}</div>
              </td>
              <td>
                <div>{{ item.phone }}</div>
              </td>
              <td>
                <div>{{ getState(item.state) }}</div>
              </td>
              <td>
                <div>{{ item.uuid }}</div>
              </td>
              <td>
                <div>{{ item.pgId }}</div>
              </td>
              <td>
                <div>{{ $dayjs(item.createdDate).format('YYYY-MM-DD HH:mm') }}</div>
              </td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr v-if="!data || !data[0]">
              <td colspan="100%"><div>리스트가 없습니다.</div></td>
            </tr>
            <tr v-for="(item, index) in data" :key="item.id">
              <td>
                <div>{{ tableData.startCount - index }}</div>
              </td>
              <td>
                <div class="text-left">{{ item.title }}</div>
              </td>
              <td>
                <div>
                  <p>{{ $dayjs(item.startDate).format('YYYY-MM-DD ') }}</p>
                  <span>{{ $dayjs(item.startDate).format('HH:mm') }} ~</span>
                  <span>{{ $dayjs(item.endDate).format('HH:mm') }}</span>
                </div>
              </td>
              <td>
                <div class="text-right">{{ item.number.toLocaleString() }}</div>
              </td>
              <td>
                <div class="text-right">{{ item.price.toLocaleString() }}</div>
              </td>
              <td>
                <div>{{ item.email }}</div>
              </td>
              <td>
                <div>{{ item.name }}</div>
              </td>
              <td>
                <div>{{ getState(item.state) }}</div>
              </td>
              <td>
                <div>{{ item.uuid }}</div>
              </td>
              <td>
                <div>{{ item.pgId }}</div>
              </td>
              <td>
                <div>{{ $dayjs(item.createdDate).format('YYYY-MM-DD HH:mm') }}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </template>
    </SPageable>
    <SDialogModal :is-show="modal.isSave" @close="$router.push(baseUrl)">
      <template #content>회원정보가 수정되었습니다.</template>
      <template #modal-btn2>
        <SLink button-type="primary" :to="baseUrl">확인</SLink>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import SInput from '~/components/admin/commons/SInput';
import SLink from '~/components/admin/commons/SLink';
import SButton from '~/components/admin/commons/SButton';
import SPageable from '~/components/admin/commons/SPageable';
import SProgressTab from '~/components/admin/commons/SProgressTab';
import { GENDER_TYPE, TICKET_KIND_TYPE, TICKET_STATE_TYPE, TICKET_TYPE, JOB_OPTIONS } from '~/assets/js/types';
import SDialogModal from '~/components/admin/modal/SDialogModal';

export default {
  name: 'UserDetail',
  components: { SDialogModal, SProgressTab, SPageable, SButton, SLink, SInput },
  props: {
    // pageType: COMMON | NONACTIVE | HANA
    pageType: {
      type: String,
      required: false,
      default: 'privacy'
    },
    detailData: {
      type: Object,
      required: false,
      default: () => null
    },
    tableData: {
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
      titleText: '계정 정보',
      baseUrl: '',
      isOverlapId: false,
      isCoffee: true,
      originEmail: this.detailData.email,
      cloneDetailData: cloneDeep(this.detailData),
      feedback: {
        email: {
          success: true,
          isValid: true,
          text: ''
        }
      },
      modal: {
        isSave: false
      },
      isConfirmPending: false
    };
  },
  computed: {
    // 직업 코드 → 라벨 매핑용
    jobMap() {
      return JOB_OPTIONS.reduce((acc, cur) => {
        acc[cur.value] = cur.label;
        return acc;
      }, {});
    }
  },
  created() {
    let baseUrl = '';

    switch (this.pageType) {
      case 'COMMON':
        baseUrl = '/admin/user/common';
        break;
      case 'NONACTIVE':
        baseUrl = '/admin/user/nonactive';
        break;
      case 'HANA':
        baseUrl = '/admin/user/hana';
        break;
      default:
        break;
    }

    this.baseUrl = baseUrl;
  },
  methods: {
    // 직업 라벨 반환 (숫자/문자 모두 대응, null/빈값은 '-')
    jobLabel(jobValue) {
      const key = jobValue === 0 ? '0' : String(jobValue ?? '');
      return this.jobMap[key] ?? '-';
    },
    // 지역 표시 (둘 다 있으면 줄바꿈)
    regionText(state, district) {
      const s = (state || '').trim();
      const d = (district || '').trim();
      if (!s && !d) return '-';
      if (s && !d) return s;
      if (!s && d) return d;
      return `${s}\n${d}`;
    },
    async onModified(id) {
      this.isConfirmPending = true;
      await this.$axios.$put(`/admin/accounts/${id}`, this.cloneDetailData);
      this.modal.isSave = true;
      this.isConfirmPending = false;
    },
    updateDetailData() {
      const newValue = this.cloneDetailData.email;
      const originValue = this.originEmail;
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
    onCoffee() {
      this.$emit('coffee', !this.isCoffee);
    },
    getGender(gender) {
      return GENDER_TYPE[gender];
    },
    getKind(kind) {
      return TICKET_KIND_TYPE[kind];
    },
    getType(type) {
      return TICKET_TYPE[type];
    },
    getState(state) {
      return TICKET_STATE_TYPE[state];
    },
    async checkRedundancy() {
      if (this.isValidate()) {
        const isOverlap = await this.$axios.$get(`/admin/accounts/duplicate`, {
          params: {
            email: this.cloneDetailData.email
          }
        });

        if (!isOverlap) {
          this.feedback.email.isValid = true;
          this.feedback.email.success = false;
          this.feedback.email.text = '사용가능한 이메일 입니다.';
          this.isOverlapId = false;
        } else {
          this.feedback.email.isValid = false;
          this.feedback.email.success = true;
          this.feedback.email.text = '가입된 이메일 입니다';
        }

        this.modal.isError = true;
      }
    },
    isValidate() {
      const clearValid = () => {
        Object.values(this.feedback).forEach((value) => {
          value.isValid = true;
        });
      };

      const emailPattern =
        /^([\w._-])*[a-zA-Z0-9]+([\w._-])*([a-zA-Z0-9])+([\w._-])+@([\w_-])*([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,8}$/;
      const isClearForm = () => !Object.values(this.feedback).find((value) => value.isValid === false);
      const emailFeedback = this.feedback.email;
      const { email } = this.cloneDetailData;

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
    providerTextConverter(type) {
      return type === 'KAKAO'
        ? '카카오'
        : type === 'GOOGLE'
        ? '구글'
        : type === 'NAVER'
        ? '네이버'
        : type === 'APPLE'
        ? '애플'
        : '이메일';
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
  }

  .has-feedback > div {
    display: flex;
  }

  .admin-table {
    th {
      &:first-of-type {
        width: 5rem;
      }
      &:nth-of-type(2) {
        width: 8rem;
      }
      &:nth-of-type(3) {
        width: 10rem;
      }
      &:nth-of-type(4) {
        width: 30rem;
      }
      &:nth-of-type(5) {
        width: 13rem;
      }
      &:nth-of-type(6) {
        width: 10rem;
      }
      &:nth-of-type(7) {
        width: 11rem;
      }
      &:nth-of-type(8) {
        width: 26rem;
      }
      &:nth-of-type(9) {
        width: 10rem;
      }
      &:nth-of-type(10) {
        width: 14rem;
      }
      &:nth-of-type(11) {
        width: 10rem;
      }
      &:nth-of-type(12) {
        width: 18rem;
      }
      &:nth-of-type(13) {
        width: 45rem;
      }
      &:last-of-type {
        width: 10rem;
      }
    }

    &.coffee {
      th {
        &:first-of-type {
          width: 5rem;
        }
        &:nth-of-type(2) {
          width: 30rem;
        }
        &:nth-of-type(3) {
          width: 13rem;
        }
        &:nth-of-type(4) {
          width: 10rem;
        }
        &:nth-of-type(5) {
          width: 11rem;
        }
        &:nth-of-type(6) {
          width: 26rem;
        }
        &:nth-of-type(7) {
          width: 10rem;
        }
        &:nth-of-type(8) {
          width: 10rem;
        }
        &:nth-of-type(9) {
          width: 18rem;
        }
        &:nth-of-type(10) {
          width: 45rem;
        }
        &:last-of-type {
          width: 10rem;
        }
      }
    }
  }
}
</style>
