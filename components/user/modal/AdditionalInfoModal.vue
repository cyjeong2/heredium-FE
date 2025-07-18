<template>
  <transition name="fade">
    <div v-if="isShow" class="modal-wrap">
      <div class="modal-inner">
        <!-- Head -->
        <div class="head">
          <h3 class="title">추가 정보 입력</h3>
          <button type="button" class="close-btn" @click="skipMarketing">
            <i class="ic-close" />
          </button>
        </div>

        <!-- Body -->
        <div class="body">
          <div class="subtitle">
            추가 정보 입력 및 마케팅 정보 수신활용에 동의하시면 혜택을 드려요!
          </div>
          <hr class="divider" />

          <!-- 직업 입력 -->
          <div class="form-group">
            <label for="jobSelect">직업</label>
            <USelect
              id="jobSelect"
              v-model="form.job"
              :option-list="jobOptions"
              default-text="선택"
              w-size="full"
            />
          </div>

          <!-- 지역 입력 -->
          <div class="form-group region">
            <label>지역</label>
            <div class="region-selects">
              <USelect
                v-model="form.region.state"
                :option-list="stateOptions"
                default-text="시/도 선택"
                w-size="full"
              />
              <USelect
                v-model="form.region.district"
                :option-list="districtOptions"
                default-text="시/군/구 선택"
                w-size="full"
              />
            </div>
          </div>

          <!-- 동의 항목 -->
          <div class="terms-area">
            <UCheckbox v-model="form.additionalInfoAgreed">
              <strong>(선택)</strong> 추가 개인정보 수집 및 활용에 동의합니다.
            </UCheckbox>
            <UCheckbox v-model="form.agreeMarketing">
              <strong>(선택)</strong> 마케팅 정보 활용에 동의합니다.
            </UCheckbox>
            <div class="marketing-info">
              <p>
                고객(정보주체)의 개인정보보호 및 권리는
                <strong>「개인정보 보호법」</strong> 및 관계 법령에 따라 안전하게
                관리하고 있습니다. 자세한 사항은 헤리디움 사이트에서 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="foot">
          <UButton button-type="secondary" @click="skipMarketing">다음에 하기</UButton>
          <UButton :disabled="!isFormValid" @click="submitForm">완료하고 혜택받기</UButton>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import USelect from '~/components/user/common/USelect.vue';
import UCheckbox from '~/components/user/common/UCheckbox.vue';
import UButton from '~/components/user/common/UButton.vue';
import { REGION_DATA, JOB_OPTIONS } from '~/assets/js/types';

export default {
  name: 'AdditionalInfoModal',
  components: { USelect, UCheckbox, UButton },
  props: {
    isShow: { type: Boolean, required: true }
  },
  data() {
    return {
      form: {
        job: null,
        region: { state: null, district: null },
        additionalInfoAgreed: false,
        agreeMarketing: false
      },
      regionData: REGION_DATA,
      jobOptions: JOB_OPTIONS,
    };
  },
  computed: {
    stateOptions() {
      return this.regionData.map(r => ({ value: r.state, label: r.state }));
    },
    districtOptions() {
      const region = this.regionData.find(r => r.state === this.form.region.state);
      return region
        ? region.districts.map(d => ({ value: d, label: d }))
        : [];
    },
    isFormValid() {
      return (
        this.form.job &&
        this.form.region.state &&
        this.form.region.district &&
        this.form.additionalInfoAgreed &&
        this.form.agreeMarketing
      );
    },
  },
  methods: {
    async submitForm() {
      // 직업, 지역, 동의 여부 등록 로직 수정
      const isLocal = (this.form.region.state === '대전광역시');

      const payload = {
        job: this.form.job,
        state: this.form.region.state,
        district: this.form.region.district,
        isLocalResident: isLocal,
        isMarketingReceive: true,
        marketingPending: false,
        additionalInfoAgreed: true,
      };

      const updated = await this.$axios.$put('/user/account/marketing', payload);
      this.$store.commit('service/auth/setUserInfo', updated);

      this.$emit('issued', { ...this.form });
      this.$emit('close');
    },
    async skipMarketing() {
      try {
        // 마케팅 동의 안 함(0)
        await this.$axios.$put('/user/account/marketing', {
          marketingPending: false,
          isMarketingReceive: false,
          isLocalResident: false,
          additionalInfoAgreed: false,
        });

      } catch (err) {
        console.warn('마케팅 스킵 처리 실패', err);
      } finally {
        this.$emit('close');
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.modal-wrap {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.5);
  z-index: 500;
}
.modal-inner {
  display: flex; flex-direction: column;
  width: 100%; height: 100%; background: #fff;
  @media screen and (min-width: 769px) {
    width: 60.4rem; height: auto;
    position: absolute; top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.175);
  }
}
.head {
  display: flex; align-items: center; position: relative;
  height: 6rem; padding: 0 6rem 0 2rem;
  font-weight: 700; font-size: 2rem;
  border-bottom: 1px solid var(--color-u-grey-1);
  @media (min-width: 769px) {
    padding: 3.2rem 3.6rem; font-size: 2.4rem;
  }
  .title { flex: 1; margin: 0; }
  .close-btn {
    position: absolute; top:50%; right:2rem;
    transform: translateY(-50%);
    background:none; border:none; cursor:pointer;
    i { font-size:3.2rem; }
  }
}
.body {
  flex: 1; overflow-y: auto; padding: 2rem;
  @media (min-width: 769px) {
    max-height: 46.8rem;
    padding: 2.4rem 3.6rem;
  }
  .subtitle {
    font-size: 1.6rem; line-height:1.4; margin-bottom:1rem;
  }
  .divider {
    border: none; border-top:1px solid var(--color-u-grey-1); margin-bottom:2rem;
  }
  .form-group {
    margin-bottom: 2rem;
    label { display:block; margin-bottom:0.8rem; font-size:1.4rem; }
    &.region .region-selects {
      display:flex; gap:1.6rem;
    }
  }
  .terms-area {
    display:flex; flex-direction:column; gap:1rem;
    margin-top: 1rem;
    .marketing-info {
      padding: 1.2rem 1.2rem;
      background-color: var(--color-grey-1);
      border: 1px solid var(--color-grey-2);
      border-radius: 0.3rem;
      font-size: 1.4rem;
      color: var(--color-grey-8);

      p {
        font-size: 1.4rem;
        font-weight: 500;
        margin: 0;
        line-height: 1.6;
        text-align: left; /* 기본 왼쪽 정렬 */
      }

      strong {
        font-weight: 700;
      }
    }
  }
}
.foot {
  display:flex; justify-content:center; gap:1.6rem;
  padding:1.4rem 2rem; border-top:1px solid var(--color-u-grey-1);
  background:#fff; margin-top:auto;

  @media (min-width: 769px) {
    padding:0 3.2rem 3.6rem; margin-top:0;
    button {
      margin-top: 3.6rem;
    }
  }
  button[button-type="secondary"] {
    background:transparent; border:1px solid var(--color-u-grey-1);
    color:var(--color-black);
  }
  button:not([button-type="secondary"]) {
    background:var(--color-u-primary); color:#fff;
  }

  ::v-deep button:disabled {
    background-color: var(--color-u-grey-2) !important;
    border-color: var(--color-u-grey-3) !important;
    cursor: not-allowed;
  }
}
  /* 모바일에서 지역 셀렉트가 컨테이너에 맞춰 축소되도록 */
  .form-group.region .region-selects {
    display: flex;
    gap: 1.6rem;
  }
  .form-group.region .region-selects > * {
    flex: 1 1 0;
    min-width: 0;
  }
</style>
