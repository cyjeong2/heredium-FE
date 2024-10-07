import { TICKET_KIND_TYPE } from "./types";

export const RESERVATION_TERMS = Object.freeze({
  notice: {
    title: '관람 유의사항 안내',
    listText: [
      '모든 가방류는 반입 불가합니다. 개인 차량 또는 물품 보관소에 꼭 보관해주시기 바랍니다.',
      '전시 공간 내부에 엘레베이터는 따로 설치되어 있지 않습니다. (거동이 불편하신 분들은 양해 부탁드립니다.)',
      '반입물가 물품은 준비되어 있는 사물함에 보관 후 입장해주세요.(외부음식, 셀카봉, 촬영장비, 우산, 캐리어, 유모차)',
      '안내견을 제외한 반려동물은 관람할 수 없습니다.',
      '14세 미만 어린이는 반드시 보호자의 손을 잡고 관람해주시기 바랍니다.',
      '상업적 용도나 플래시를 사용하는 과도한 촬영은 자제해주시기 바랍니다.',
      '안내견을 제외한 반려동물은 관람할 수 없습니다.',
      '헤레디움 내 모든 공간은 금연구역입니다.'
    ]
  }
});

export const dataMembershipMock= {
  id: 1,
  uuid: '550e8400-e29b-41d4-a716-446655440000',
  name: '브라운',
  startDate: "2024-09-01 00:00:00",
  endDate: "2025-02-28 23:59:59",
  benefits: [
    {
      coupon_name: '전시',
      type: TICKET_KIND_TYPE.EXHIBITION,
      quantity: 0,
    },
    {
      coupon_name: '프로그램',
      type: TICKET_KIND_TYPE.PROGRAM,
      quantity: 2,
    },
    {
      coupon_name: '커피',
      type: TICKET_KIND_TYPE.COFFEE,
      quantity: 1,
    }
  ]
}

export const dataTableMembershipMockAdmin  = {
  content: [
    {
      id: 1,
      thumbnail: {
        resizeImage: {
          small: 'https://kr.object.fin-ncloudstorage.com/heredium-bucket/coffee/15/e1235d36-3316-4425-839e-8ffd496c7472.jpg',
        }
      },
      title: '클래식 음악과',
      creator: 'Nga',
      isEnabled: true,
      createdDate: "2024-08-31 20:23:33",
      lastModifiedDate: "2024-09-27 14:21:09",
    },
    {
      id: 1,
      thumbnail: {
        resizeImage: {
          small: 'https://kr.object.fin-ncloudstorage.com/heredium-bucket/coffee/15/e1235d36-3316-4425-839e-8ffd496c7472.jpg',
        }
      },
      title: '클래식 음악과',
      creator: 'Nga',
      isEnabled: true,
      createdDate: "2024-08-31 20:23:33",
      lastModifiedDate: "2024-09-27 14:21:09",
    },
    {
      id: 2,
      thumbnail: {
        resizeImage: {
          small: 'https://kr.object.fin-ncloudstorage.com/heredium-bucket/coffee/15/e1235d36-3316-4425-839e-8ffd496c7472.jpg',
        }
      },
      title: '클래식 음악과',
      creator: 'Nga',
      isEnabled: true,
      createdDate: "2024-08-31 20:23:33",
      lastModifiedDate: "2024-09-27 14:21:09",
    },
    {
      id: 3,
      thumbnail: {
        resizeImage: {
          small: 'https://kr.object.fin-ncloudstorage.com/heredium-bucket/coffee/15/e1235d36-3316-4425-839e-8ffd496c7472.jpg',
        }
      },
      title: '클래식 음악과',
      creator: 'Nga',
      isEnabled: true,
      createdDate: "2024-08-31 20:23:33",
      lastModifiedDate: "2024-09-27 14:21:09",
    }
  ],
  pageable: {
      sort: {
          empty: true,
          unsorted: true,
          sorted: false
      },
      offset: 0,
      pageNumber: 0,
      pageSize: 20,
      paged: true,
      unpaged: false
  },
  last: false,
  totalPages: 1,
  totalElements: 4,
  size: 20,
  number: 0,
  sort: {
      empty: true,
      unsorted: true,
      sorted: false
  },
  first: true,
  numberOfElements: 20,
  empty: false
}

export const dataCouponMock= [
  {
    id: 1,
    name: '쿠폰명[(미코노스 블루, 1잔)]',
    img: `https://kr.object.fin-ncloudstorage.com/heredium-bucket/coffee/15/e1235d36-3316-4425-839e-8ffd496c7472.jpg`,
    startDate: "2024-09-01 00:00:00",
    endDate: "2025-02-28 23:59:59",
    quantity: 2,
    isActive: true
  },
  {
    id: 2,
    name: '쿠폰명[(미코노스 블루, 1잔)]',
    img: `https://kr.object.fin-ncloudstorage.com/heredium-bucket/coffee/15/e1235d36-3316-4425-839e-8ffd496c7472.jpg`,
    startDate: "2024-09-01 00:00:00",
    endDate: "2025-02-28 23:59:59",
    quantity: 0,
    isActive: false
  },
  {
    id: 3,
    name: '쿠폰명[(미코노스 블루, 1잔)]',
    img: `https://kr.object.fin-ncloudstorage.com/heredium-bucket/coffee/15/e1235d36-3316-4425-839e-8ffd496c7472.jpg`,
    startDate: "2024-09-01 00:00:00",
    endDate: "2024-09-28 23:59:59",
    quantity: 2,
    isActive: true
  },
  {
    id: 4,
    name: '쿠폰명[(미코노스 블루, 1잔)]',
    img: `https://kr.object.fin-ncloudstorage.com/heredium-bucket/coffee/15/e1235d36-3316-4425-839e-8ffd496c7472.jpg`,
    startDate: "2024-09-01 00:00:00",
    endDate: "2025-02-28 23:59:59",
    quantity: 0,
    isActive: false
  }
]

export const dataPostMock = [
  {
    id: 1,
    img: 'https://kr.object.fin-ncloudstorage.com/heredium-bucket/coffee/15/e1235d36-3316-4425-839e-8ffd496c7472.jpg',
    title: '클래식 음악과',
    content: '<p>1922년 일제강점기, 대전역 근처 쌀시장이 형성된 동구 인동 지역에 지어진 구 동양척식회사 대전 지점은 대영제국의 동인도회사를 본뜬 대표적인 수탈 기관이었습니다. 당시 9개 지역 지점으로 운영되던 동양척식주식회사는 현재 부산, 목포, 대전 지점 세 건물만이 남아 있습니다.</p>'
  },
  {
    id: 2,
    img: 'https://kr.object.fin-ncloudstorage.com/heredium-bucket/coffee/15/e1235d36-3316-4425-839e-8ffd496c7472.jpg',
    title: '클래식 음악과',
    content: '<p>1922년 일제강점기, 대전역 근처 쌀시장이 형성된 동구 인동 지역에 지어진 구 동양척식회사 대전 지점은 대영제국의 동인도회사를 본뜬 대표적인 수탈 기관이었습니다. 당시 9개 지역 지점으로 운영되던 동양척식주식회사는 현재 부산, 목포, 대전 지점 세 건물만이 남아 있습니다.</p>'
  },
  {
    id: 3,
    img: 'https://kr.object.fin-ncloudstorage.com/heredium-bucket/coffee/15/e1235d36-3316-4425-839e-8ffd496c7472.jpg',
    title: '클래식 음악과',
    content: '<p>1922년 일제강점기, 대전역 근처 쌀시장이 형성된 동구 인동 지역에 지어진 구 동양척식회사 대전 지점은 대영제국의 동인도회사를 본뜬 대표적인 수탈 기관이었습니다. 당시 9개 지역 지점으로 운영되던 동양척식주식회사는 현재 부산, 목포, 대전 지점 세 건물만이 남아 있습니다.</p>'
  },
  {
    id: 4,
    img: 'https://kr.object.fin-ncloudstorage.com/heredium-bucket/coffee/15/e1235d36-3316-4425-839e-8ffd496c7472.jpg',
    title: '클래식 음악과',
    content: '<p>1922년 일제강점기, 대전역 근처 쌀시장이 형성된 동구 인동 지역에 지어진 구 동양척식회사 대전 지점은 대영제국의 동인도회사를 본뜬 대표적인 수탈 기관이었습니다. 당시 9개 지역 지점으로 운영되던 동양척식주식회사는 현재 부산, 목포, 대전 지점 세 건물만이 남아 있습니다.</p>'
  },
]
