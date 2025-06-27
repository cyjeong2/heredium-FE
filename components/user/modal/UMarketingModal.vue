<template>
  <div v-if="isShow" class="modal-wrap" @click.self="close">
    <div class="modal-inner">
      <div class="head">개인정보 추가 입력</div>
      <div class="body" body-scroll-lock-ignore>
        <form class="content-wrap" @submit.prevent="submitForm">
          <!-- 성별 -->
          <div class="form-group">
            <label>성별</label>
            <div class="options">
              <URadio v-model="form.gender" value="M">남자</URadio>
              <URadio v-model="form.gender" value="F">여자</URadio>
            </div>
          </div>
          <!-- 생년월일 -->
          <div class="form-group">
            <label>생년월일</label>
            <UDatepicker
              v-model="form.birthDate"
              w-size="full"
            />
          </div>
          <!-- 지역 -->
          <div class="input mb-13">
            <label>거주지</label>
            <div class="region-row">
              <div class="region-col">
                <USelect
                  v-model="form.region.state"
                  :option-list="cityOptions"
                  w-size="full"
                  default-text="시/도 선택"
                />
              </div>
              <div class="region-col">
                <USelect
                  v-model="form.region.district"
                  :option-list="districtOptions"
                  w-size="full"
                  default-text="시/군/구 선택"
                />
              </div>
            </div>
          </div>
          <!-- 마케팅 동의 -->
          <div class="terms-area">
            <div class="form-group checkbox-group each-terms">
              <UCheckbox v-model="isTerms.MARKETING">
                <strong>[선택]</strong>
                <button type="button" @click="showTerm('MARKETING')">마케팅 활용 동의 및 광고 수집</button> 동의
              </UCheckbox>
            </div>
          </div>
        </form>
      </div>
      <div class="foot">
        <UButton :disabled="!isTerms.MARKETING" @click="submitForm">완료하고 쿠폰 받기</UButton>
        <UButton button-type="secondary" @click="skipMarketing">다음에 하기</UButton>
      </div>
    </div>
    <URegisterModal
      :is-show="modal.isTerms"
      :term-target="termTarget"
      :terms-data="termsData"
      @close="modal.isTerms = false"
      @agree="termAgree"
    />
  </div>
</template>

<script>
import { disableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';
import UButton from '~/components/user/common/UButton';
import URadio from '~/components/user/common/URadio.vue';
import UDatepicker from '~/components/user/common/UDatepicker';
import USelect from '~/components/user/common/USelect.vue';
import UCheckbox from '~/components/user/common/UCheckbox';
import URegisterModal from '~/components/user/modal/URegisterModal';

export default {
  name: 'AdditionalInfoModal',
  components: { UButton, URadio, UDatepicker, USelect, UCheckbox, URegisterModal},
  props: {
    isShow: { type: Boolean, default: false }
  },
  data() {
    return {
      form: {
        region: { state: '대전광역시', district: '동구' },
        birthDate: '1990-01-01',
        gender: 'M',
      },
      regionData: [
        { state: '서울특별시', districts: ['종로구','중구','용산구','성동구','광진구','동대문구','중랑구','성북구','강북구','도봉구','노원구','은평구','서대문구','마포구','양천구','강서구','구로구','금천구','영등포구','동작구','관악구','서초구','강남구','송파구','강동구'] },
        { state: '부산광역시', districts: ['중구','서구','동구','영도구','부산진구','동래구','남구','북구','해운대구','사하구','금정구','강서구','연제구','수영구','사상구','기장군'] },
        { state: '대구광역시', districts: ['중구','동구','서구','남구','북구','수성구','달서구','달성군'] },
        { state: '인천광역시', districts: ['중구','동구','미추홀구','연수구','남동구','부평구','계양구','서구','강화군','옹진군'] },
        { state: '광주광역시', districts: ['동구','서구','남구','북구','광산구'] },
        { state: '대전광역시', districts: ['동구','중구','서구','유성구','대덕구'] },
        { state: '울산광역시', districts: ['중구','남구','동구','북구','울주군'] },
        { state: '세종특별자치시', districts: ['세종시'] },
        { state: '경기도', districts: ['수원시','성남시','의정부시','안양시','부천시','광명시','평택시','동두천시','안산시','고양시','과천시','구리시','남양주시','오산시','시흥시','군포시','의왕시','하남시','용인시','파주시','이천시','안성시','김포시','화성시','광주시','양주시','포천시','여주시','연천군','가평군','양평군'] },
        { state: '강원도', districts: ['춘천시','원주시','강릉시','동해시','태백시','속초시','삼척시','홍천군','횡성군','영월군','평창군','정선군','철원군','화천군','양구군','인제군','고성군','양양군'] },
        { state: '충청북도', districts: ['청주시','충주시','제천시','보은군','옥천군','영동군','진천군','괴산군','음성군','단양군','증평군'] },
        { state: '충청남도', districts: ['천안시','공주시','보령시','아산시','서산시','논산시','계룡시','당진시','금산군','부여군','서천군','청양군','홍성군','예산군','태안군'] },
        { state: '전라북도', districts: ['전주시','군산시','익산시','정읍시','남원시','김제시','완주군','진안군','무주군','장수군','임실군','순창군','고창군','부안군'] },
        { state: '전라남도', districts: ['목포시','여수시','순천시','나주시','광양시','담양군','곡성군','구례군','고흥군','보성군','화순군','장흥군','강진군','해남군','영암군','무안군','함평군','영광군','장성군','완도군','진도군','신안군'] },
        { state: '경상북도', districts: ['포항시','경주','김천시','안동시','구미시','영주시','영천시','상주시','문경시','경산시','군위군','의성군','청송군','영양군','영덕군','청도군','고령군','성주군','칠곡군','예천군','봉화군','울진군','울릉군'] },
        { state: '경상남도', districts: ['창원시','김해시','진주시','통영시','사천시','밀양시','거제시','양산시','의령군',' 함안군','창녕군','고성군','남해군','하동군','산청군','함양군','거창군','합천군'] },
        { state: '제주특별자치도', districts: ['제주시','서귀포시'] },
      ],
      beforeScroll: 0,
      isTerms: {
        MARKETING: true
      },
      modal: {
        isTerms: false,
        isError: false
      },
      termTarget: '',
      termsData: null,
    };
  },
  computed: {
    cityOptions() {
      return this.regionData.map(r => ({ value: r.state, label: r.state }));
    },
    districtOptions() {
      const region = this.regionData.find(r => r.state === this.form.region.state);
      return region ? region.districts.map(d => ({ value: d, label: d })) : [];
    }
  },
  watch: {
    'form.region.state'(newState) {
      const region = this.regionData.find(r => r.state === newState);
      this.form.region.district = region && region.districts.length
        ? region.districts[0]
        : '';
      this.feedback.region.isValid = true;
      this.feedback.region.text = '';
    },
    isShow(val) {
      if (val) {
        this.beforeScroll = window.scrollY;
        disableBodyScroll(document, {
          allowTouchMove: el => el.hasAttribute('body-scroll-lock-ignore')
        });
      } else {
        clearAllBodyScrollLocks();
        this.restoreScroll();
      }
    }
  },
  beforeDestroy() {
    clearAllBodyScrollLocks();
  },
  methods: {
    async submitForm() {
      try {
        const isLocal = (this.form.region.state === '대전광역시');

        const payload = {
          gender: this.form.gender,
          birthDate: this.form.birthDate,
          state: this.form.region.state,
          district: this.form.region.district,
          isLocalResident: isLocal,
          isMarketingReceive: true,
          marketingPending: false
        };

        const updated = await this.$axios.$put('/user/account/info', payload);

        this.$store.commit('service/auth/setUserInfo', updated);
        this.$emit('issued');
        this.$emit('close');
      } catch (err) {
        console.error(err);
      }

    },
    async skipMarketing() {
      try {
        // 마케팅 동의 안 함(0)
        await this.$axios.$put('/user/account/info', {
          marketingPending: false,
          isMarketingReceive: false,
          isLocalResident: false,
        });

        localStorage.removeItem('userInfo');
      } catch (err) {
        console.warn('마케팅 스킵 처리 실패', err);
      } finally {
        this.$emit('close');
      }
    },
    restoreScroll() {
      this.$nextTick(() => {
        window.scrollTo(0, this.beforeScroll);
        this.beforeScroll = 0;
      });
    },
    async showTerm(target) {
      this.termTarget = target;
      this.termsData = await this.$axios.$get('/user/policies/posting', {
        params: {
          type: this.termTarget
        }
      });
      this.modal.isTerms = true;
    },
    termAgree() {
      this.isTerms[this.termTarget] = true;
      this.modal.isTerms = false;
    },
    setCheckedAll(newValue) {
      for (const key in this.isTerms) {
        this.isTerms[key] = newValue;
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
  display: flex;
  flex-direction: column;
  height: 100%; width: 100%;
  background: #fff;

  .head {
    padding: 2rem;
    font-size: 2rem; font-weight: 700;
    border-bottom: 1px solid var(--color-u-grey-1);
  }
  .body {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
    .content-wrap { padding-bottom: 10rem; }
    .form-group { margin-bottom: 1.6rem; }
    .options { display: flex; gap: 1.6rem; }
    .date-selects, .region-selects { display: flex; gap: 1rem; }
    .checkbox-group { font-size: 1.4rem; }
  }
  .foot {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.6rem;
    padding: 1.4rem 2rem;
    border-top: 1px solid var(--color-u-grey-1);
    background: #fff;
  }
}
@media screen and (min-width: 769px) {
  .modal-inner {
    width: 60.4rem; height: auto;
    margin: auto; top: 50%; left: 50%;
    position: absolute; transform: translate(-50%,-50%);
    box-shadow: 0 1rem 3rem rgba(0,0,0,0.175);
    .head { padding: 3.2rem 3.6rem; font-size: 2.4rem; }
    .body {
      max-height: 40.8rem;
      padding: 2.4rem 3.6rem;
      .content-wrap { background: rgba(235,235,235,0.4); overflow-y: auto; padding: 2.4rem; }
    }
    .foot { position: static; padding: 0 3.2rem 3.6rem; margin-top: 3.6rem; }
  }
}

.terms-area {
  strong {
    margin-right: 0.5rem;
    font-size: 1.7rem;
    font-weight: 700;
    line-height: 100%;
    transform: translateY(0.2rem);
  }

  .each-terms {
    display: flex;
    flex-direction: column;
    padding: 2.4rem 0;
    margin-bottom: 2rem;
    border-top: 1px solid var(--color-grey-1);
    label + label {
      margin-top: 2rem;
    }

    strong {
      font-size: 1.4rem;
    }
  }

  button {
    margin-right: 0.5rem;
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--color-u-primary);
    line-height: 150%;
  }
}

.region-row {
  display: flex;
  gap: 1.6rem;
}
.region-row .region-col {
  flex: 1;
}
</style>
