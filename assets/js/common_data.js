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

