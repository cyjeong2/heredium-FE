export const exhibitionPreview = (detailData) => {
  return {
    id: -1,
    thumbnail: detailData.thumbnail ?? null,
    title: detailData.title ?? '',
    subtitle: detailData.subtitle ?? '',
    state: 'SCHEDULE',
    startDate: detailData.startDate ?? '',
    endDate: detailData.endDate ?? '',
    bookingDate: detailData.bookingDate ?? '',
    hour: detailData.hour ?? '',
    contents: detailData.contents ?? '',
    prices: detailData.prices.map((price, index) => ({
      id: index + 1,
      type: price.type,
      price: price.price
    })),
    writers: detailData.writers.map((writer, index) => ({
      id: index + 1,
      name: writer.name,
      infos: writer.infos.map((info, infoIndex) => ({
        id: infoIndex + 1,
        intro: info.intro,
        name: info.name,
        thumbnail: info.thumbnail
      }))
    }))
  };
};

export const sliderPreview = (detailData) => {
  return {
    pcImage: detailData.pcImage ?? null,
    pcImageAlt: detailData.pcImageAlt ?? '',
    mobileImage: detailData.mobileImage ?? '',
    mobileImageAlt: detailData.mobileImageAlt ?? '',
    isUseButton: detailData.isUseButton ?? false,
    isNewTab: detailData.isNewTab ?? false,
    link: detailData.link ?? '',
    title: detailData.title ?? '',
    subtitle: detailData.subtitle ?? '',
    schedule: detailData.schedule ?? '',
    startDate: detailData.startDate ?? '',
    endDate: detailData.endDate ?? ''
  };
};

export const noticePreview = (detailData) => {
  return {
    id: null,
    title: detailData.title ?? '',
    isNotice: detailData.isNotice ?? false,
    postDate: detailData.postDate ?? '',
    contents: detailData.contents ?? '',
    files: detailData.files ?? [],
    prev: {
      id: null,
      title: '미리보기 페이지'
    },
    next: {
      id: null,
      title: '미리보기 페이지'
    }
  };
};

export const termsPreview = (detailData) => {
  return {
    id: 0,
    title: detailData.title ?? '',
    postDate: detailData.postDate ?? '',
    contents: detailData.contents ?? '',
    type: detailData.type ?? ''
  };
};

export const eventPreview = (detailData) => {
  return {
    id: 0,
    title: detailData.title ?? '',
    startDate: detailData.startDate ?? '',
    endDate: detailData.endDate ?? '',
    contents: detailData.contents ?? '',
    files: detailData.files ?? [],
    thumbnail: detailData.thumbnail ?? null,
    state: detailData.state ?? '',
    prev: {
      id: null,
      title: '미리보기 페이지'
    },
    next: {
      id: null,
      title: '미리보기 페이지'
    }
  };
};
