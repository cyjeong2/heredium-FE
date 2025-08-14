// backend type set
export const POLICY_TYPE = Object.freeze({
  PRIVACY: '개인정보처리방침',
  SERVICE: '서비스 이용 약관',
  AGREE: '개인정보 수집 및 이용 동의서',
  REFUND: '취소 및 환불 정책',
  VIDEO: '영상정보처리기기 운영 관리방침',
  MARKETING: '마케팅 활용 동의 및 광고 수신'
});

export const AUTH_TYPE = Object.freeze({
  ADMIN: '최고 관리자',
  SUPERVISOR: '운영 관리자',
  MANAGER: '일반 관리자',
  COFFEE: '카페 직원',
  USER: '유저'
});

export const GENDER_TYPE = Object.freeze({
  MAN: '남',
  WOMAN: '여'
});

export const DOCENT_STATE_TYPE = Object.freeze({
  SCHEDULE: '예정',
  PROGRESS: '진행',
  TERMINATION: '종료'
});

export const EXHIBITION_STATE_TYPE = Object.freeze({
  SCHEDULE: '예정',
  BOOKING: '예매',
  PROGRESS: '진행',
  TERMINATION: '종료'
});

export const LOG_ACTION = Object.freeze({
  SUCCESS: '성공',
  FAIL: '실패',
  INSERT: '추가',
  UPDATE: '수정',
  DELETE: '삭제'
});

export const LOG_TYPE = Object.freeze({
  LOGIN: '로그인',
  ACCOUNT: '마이페이지',
  EXHIBITION: '전시',
  PROGRAM: '프로그램',
  TICKET: '티켓',
  HOLIDAY: '휴일',
  POPUP: '팝업 관리',
  DOCENT: '도센트',
  ADMIN: '관리자정보',
  POLICY: '개인정보처리방침',
  SLIDE: '슬라이드',
  NOTICE: '공지사항',
  EVENT: '이벤트'
});

export const PROGRAM_STATE_TYPE = Object.freeze({
  SCHEDULE: '예정',
  BOOKING: '예매',
  PROGRESS: '진행',
  TERMINATION: '종료'
});

export const TICKET_KIND_TYPE = Object.freeze({
  EXHIBITION: '전시',
  PROGRAM: '프로그램',
  COFFEE: '커피'
});

export const TICKET_STATE_TYPE = Object.freeze({
  PAYMENT: '결제 완료',
  ISSUANCE: '발급',
  USER_REFUND: '회원 환불',
  ADMIN_REFUND: '관리자 환불',
  USED: '사용 완료',
  EXPIRED: '기간 만료'
});

export const TICKET_MEMBERSHIP_STATE_TYPE = Object.freeze({
  COMPLETED: '가입 완료',
  // REFUND: '환불 완료',
  EXPIRED: '기간 만료'
});

export const TICKET_TYPE = Object.freeze({
  NORMAL: '입장권',
  GROUP: '단체 입장권',
  INVITE: '초대권'
});

// user type set

export const USER_PAYMENT_TYPE = Object.freeze({
  PAYMENT: '결제 완료',
  ISSUANCE: '발급',
  USER_REFUND: '환불',
  ADMIN_REFUND: '환불',
  USED: '사용 완료',
  EXPIRED: '기간 만료'
});

export const ROUND_DETAIL_TYPE = Object.freeze({
  ENABLED: '예매 가능',
  CLOSE: '마감',
  SOLD_OUT: '매진',
  HOLIDAY: '휴무일'
});

// frontend type set
export const PAGE_SIZE_OPTIONS = [
  { value: 20, label: '20개' },
  { value: 30, label: '30개' },
  { value: 50, label: '50개' }
];

export const SEARCH_USER_TYPE = Object.freeze({
  CREATED_DATE: '가입일',
  LAST_LOGIN_DATE: '최근로그인'
});

export const CHART_TYPE = Object.freeze({
  COME: '입장',
  PRICE: '매출',
  SIGN_UP: '회원가입'
});

export const CHART_DATE_TYPE = Object.freeze({
  DAY: 'Day',
  MONTH: 'Month',
  DAY_WEEK: 'DayWeek',
  HOUR: 'Hour'
});

export const NOTICE_DETAIL = Object.freeze({
  title: '',
  isEnabled: true,
  isNotice: true,
  postDate: '',
  contents: '',
  files: []
});

export const TERMS_DETAIL = Object.freeze({
  id: null,
  title: '',
  postDate: '',
  isEnabled: false,
  contents: '',
  type: ''
});

export const EVENT_DETAIL = Object.freeze({
  title: '',
  isEnabled: true,
  startDate: '',
  endDate: '',
  contents: '',
  files: [],
  thumbnail: null
});

export const POPUPS_DETAIL = Object.freeze({
  title: '',
  isEnabled: true,
  startDate: '',
  endDate: '',
  pcImage: null,
  pcImageAlt: '',
  mobileImage: null,
  mobileImageAlt: '',
  isHideToday: true,
  isNewTab: true,
  link: ''
});

export const SLIDES_DETAIL = Object.freeze({
  title: '',
  subtitle: '',
  schedule: '',
  isEnabled: true,
  startDate: '',
  endDate: '',
  pcImage: null,
  pcImageAlt: '',
  mobileImage: null,
  mobileImageAlt: '',
  isUseButton: true,
  isNewTab: true,
  link: ''
});

export const EXHIBITION_DETAIL = Object.freeze({
  thumbnail: null, // file
  detailImage: null, // file
  title: '',
  subtitle: '',
  halls: ['A', 'B'], // ['A', 'B'],
  isEnabled: false,
  state: 'SCHEDULE',
  startDate: '', // 2022-10-10 00:00:00,
  endDate: '', // 2022-11-10 23:59:59,
  bookingDate: '', // 2022-10-06 00:00:00
  hour: '',
  contents: '',
  isUseButton: false,
  buttonTitle: '',
  buttonLink: '',
  isNewTab: false,
  /**
   * - rounds item
   *
   * {
   *   id: 1,
   *   startDate: '2022-10-10 09:00:00',
   *   endDate: '2022-10-10 10:00:00',
   *   limitNumber: 10
   * }
   */
  rounds: [],
  prices: [
    {
      isEnabled: true,
      type: '성인',
      price: 0,
      discounts: [
        {
          note: '',
          type: 'HANA_BANK',
          price: 0,
          enabled: false
        }
      ]
    },
    {
      isEnabled: true,
      type: '청소년',
      price: 0,
      discounts: [
        {
          note: '',
          type: 'HANA_BANK',
          price: 0,
          enabled: false
        }
      ]
    },
    {
      isEnabled: true,
      type: '유아 및 어린이',
      price: 0,
      discounts: [
        {
          note: '',
          type: 'HANA_BANK',
          price: 0,
          enabled: false
        }
      ]
    }
  ],
  writers: []
});

export const EXHIBITION_WRITERS = {};

export const EXHIBITION_WRITERS_INFO = {};

export const DOCENTS_DETAIL = {
  thumbnail: null,
  title: '',
  subtitle: '',
  halls: ['A', 'B'],
  isEnabled: false,
  startDate: '',
  endDate: '',
  infos: []
};

export const ADMIN_DETAIL = {
  email: null,
  name: '',
  password: '',
  phone: '',
  auth: 'SUPERVISOR'
};

export const EVENT_DEFAULT = {
  eventType: 'ongoing_exhibition_count',
  quantity: 0
};

export const COUPON_TYPE = {
  COFFEE: 'COFFEE',
  ARTSHOP: 'ARTSHOP',
  PROGRAM: 'PROGRAM',
  EXHIBITION: 'EXHIBITION'
};

export const COUPON_TYPE_OPTION_LIST = [
  { value: COUPON_TYPE.COFFEE, label: '커피' },
  { value: COUPON_TYPE.ARTSHOP, label: '아트숍' },
  { value: COUPON_TYPE.PROGRAM, label: '프로그램' },
  { value: COUPON_TYPE.EXHIBITION, label: '전시' }
];

export const POST_DETAIL = {
  name: '',
  memberships: [],
  note_image: {
    note_image_url: '',
    original_file_name: ''
  },
  is_enabled: true,
  content_detail: '',
  thumbnail_urls: {
    small: '',
    medium: '',
    large: ''
  },
  end_date: '',
  start_date: '',
  events: [{ ...EVENT_DEFAULT }]
};

export const COUPON_DEFAULT = {
  name: '',
  coupon_type: COUPON_TYPE.COFFEE,
  discount_percent: '',
  period_in_days: 0,
  image_url: '',
  number_of_uses: 1,
  is_permanent: false,
  start_date: '',
  end_date: '',
  tempId: Date.now(),
  // add these four here:
  is_recurring: false,
  recipient_type: [],
  send_day_of_month: 1,
  marketing_consent_benefit: false
};

export const MEMBERSHIP_DEFAULT = {
  name: '',
  price: 0,
  image_url: '',
  is_enabled: true,
  coupons: [{ ...COUPON_DEFAULT }],
  is_register_membership_button_shown: true,
  tempId: Date.now()
};

export const CONTENT_TAG = {
  complete: '완전한',
  'on-going': '일어나고있다'
};
export const REGION_DATA = [
  {
    state: '서울특별시',
    districts: [
      '종로구','중구','용산구','성동구','광진구','동대문구','중랑구','성북구',
      '강북구','도봉구','노원구','은평구','서대문구','마포구','양천구','강서구',
      '구로구','금천구','영등포구','동작구','관악구','서초구','강남구','송파구','강동구'
    ]
  },
  {
    state: '부산광역시',
    districts: [
      '중구','서구','동구','영도구','부산진구','동래구','남구','북구',
      '해운대구','사하구','금정구','강서구','연제구','수영구','사상구','기장군'
    ]
  },
  {
    state: '대구광역시',
    districts: [
      '중구','동구','서구','남구','북구','수성구','달서구','달성군','군위군'
    ]
  },
  {
    state: '인천광역시',
    districts: [
      '중구','동구','미추홀구','연수구','남동구','부평구','계양구','서구','강화군','옹진군'
    ]
  },
  {
    state: '광주광역시',
    districts: ['동구','서구','남구','북구','광산구']
  },
  {
    state: '대전광역시',
    districts: ['동구','중구','서구','유성구','대덕구']
  },
  {
    state: '울산광역시',
    districts: ['중구','남구','동구','북구','울주군']
  },
  {
    state: '세종특별자치시',
    districts: [
      '조치원읍','연기면','연동면','부강면','금남면','장군면','연서면','전의면','전동면','소정면',
      '한솔동','새롬동','도담동','아름동','종촌동','고운동','보람동','대평동','소담동','반곡동',
      '가람동','다정동','어진동','나성동','산울동','해밀동','합강동','집현동','세종동','누리동',
      '한별동','다솜동','용호동'
    ]
  },
  {
    state: '경기도',
    districts: [
      '수원시','성남시','의정부시','안양시','부천시','광명시','평택시','동두천시','안산시',
      '고양시','과천시','구리시','남양주시','오산시','시흥시','군포시','의왕시','하남시',
      '용인시','파주시','이천시','안성시','김포시','화성시','광주시','양주시','포천시',
      '여주시','연천군','가평군','양평군'
    ]
  },
  {
    state: '강원특별자치도',
    districts: [
      '춘천시','원주시','강릉시','동해시','태백시','속초시','삼척시','홍천군','횡성군',
      '영월군','평창군','정선군','철원군','화천군','양구군','인제군','고성군','양양군'
    ]
  },
  {
    state: '충청북도',
    districts: [
      '청주시','충주시','제천시','보은군','옥천군','영동군','증평군','진천군','괴산군',
      '음성군','단양군'
    ]
  },
  {
    state: '충청남도',
    districts: [
      '천안시','공주시','보령시','아산시','서산시','논산시','계룡시','당진시',
      '금산군','부여군','서천군','청양군','홍성군','예산군','태안군'
    ]
  },
  {
    state: '전북특별자치도',
    districts: [
      '전주시','군산시','익산시','정읍시','남원시','김제시','완주군','진안군','무주군',
      '장수군','임실군','순창군','고창군','부안군'
    ]
  },
  {
    state: '전라남도',
    districts: [
      '목포시','여수시','순천시','나주시','광양시','담양군','곡성군','구례군','고흥군',
      '보성군','화순군','장흥군','강진군','해남군','영암군','무안군','함평군','영광군',
      '장성군','완도군','진도군','신안군'
    ]
  },
  {
    state: '경상북도',
    districts: [
      '포항시','경주시','김천시','안동시','구미시','영주시','영천시','상주시','문경시',
      '경산시','의성군','청송군','영양군','영덕군','청도군','고령군','성주군','칠곡군',
      '예천군','봉화군','울진군','울릉군'
    ]
  },
  {
    state: '경상남도',
    districts: [
      '창원시','김해시','진주시','통영시','사천시','밀양시','거제시','양산시','의령군',
      '함안군','창녕군','고성군','남해군','하동군','산청군','함양군','거창군','합천군'
    ]
  },
  {
    state: '제주특별자치도',
    districts: ['제주시','서귀포시']
  }
];

export const CATEGORY_TYPE = Object.freeze({
  0: '전시',
  1: '프로그램',
  2: '커피',
  3: '아트숍'
});

export const PAYMENT_METHOD_TYPE = Object.freeze({
  1: '온라인',
  2: '오프라인',
});

export const MILEAGE_EVENT_TYPE = Object.freeze({
  0: '적립',
  1: '승급',
  2: '소멸(유효기간 경과)',
  3: '소멸(취소)',
  4: '소멸완료(유효기간 경과)',
  5: '소멸완료(취소)',
  6: '승급취소',
});
export default { CATEGORY_TYPE, MILEAGE_EVENT_TYPE };
/**
 * 회원가입 · 프로필 작성 시 사용할 직업 옵션
 */
export const JOB_OPTIONS = [
  { value: '1',  label: '학생' },
  { value: '2',  label: '취업준비생' },
  { value: '3',  label: '회사원' },
  { value: '4',  label: '공무원' },
  { value: '5',  label: '교사/교수' },
  { value: '6',  label: '자영업/프리랜서' },
  { value: '7',  label: '전문직' },
  { value: '8',  label: '서비스직' },
  { value: '9',  label: '생산직/기술직' },
  { value: '10', label: '금융업 종사자' },
  { value: '11', label: 'IT 개발자' },
  { value: '12', label: '연구원' },
  { value: '13', label: '엔지니어' },
  { value: '14', label: '예술/문화/디자인' },
  { value: '15', label: '방송/연예/미디어' },
  { value: '16', label: '농림어업' },
  { value: '17', label: '가사/육아' },
  { value: '18', label: '무직' },
  { value: '19', label: '은퇴/퇴직자' },
  { value: '20', label: '기타' }
];
