<template>
  <div>
    <div v-if="type === 'EVENT'" class="top-event-img">
      <img :src="getImage(detailData.thumbnail)" alt="" />
    </div>
    <div class="container title-info" :class="{ 'top-p': type === 'NOTICE' }">
      <div v-if="type === 'EVENT' && detailData.state" class="tag">
        <UTag :type="detailData.state" />
      </div>
      <h1>{{ detailData.title }}</h1>
      <p v-if="type === 'EVENT'">
        {{ $dayjs(detailData.startDate).format('YYYY-MM-DD') }} ~ {{ $dayjs(detailData.endDate).format('YYYY-MM-DD') }}
      </p>
      <p v-else-if="type === 'NOTICE'">
        {{ $dayjs(detailData.postDate).format('YYYY-MM-DD') }}
      </p>
    </div>
    <div class="divider" />
    <div class="container content">
      <EditorContentOutput :contents="detailData.contents" />
    </div>
    <div v-if="detailData.files && detailData.files[0]" class="file-wrap">
      <a
        v-for="(item, index) in detailData.files"
        :key="index"
        :href="`${fileBaseUrl}/file/download?path=${item.savedFileName}&fileName=${item.originalFileName}`"
        class="file-item"
        download
      >
        <div class="icon">
          <i class="pc uic-download" />
        </div>
        <div class="name">{{ item.originalFileName }}</div>
        <div class="volume">{{ getFileSize(item.fileSize) }}</div>
      </a>
    </div>
    <div class="container nav">
      <nav class="post-nav">
        <NuxtLink :to="`${baseUrl}/${detailData.next?.id}`" :class="{ disabled: !detailData.next }">
          <div class="left">
            <span>다음</span>
            <i class="m umic-arrow_top" />
          </div>
          <div class="post-name">
            {{ detailData.next?.title || '다음 글이 존재하지 않습니다.' }}
          </div>
        </NuxtLink>
        <NuxtLink :to="`${baseUrl}/${detailData.prev?.id}`" :class="{ disabled: !detailData.prev }">
          <div class="left">
            <span>이전</span>
            <i class="m umic-arrow_bottom" />
          </div>
          <div class="post-name">{{ detailData.prev?.title || '이전 글이 존재하지 않습니다.' }}</div>
        </NuxtLink>
      </nav>
      <ULink :to="`${baseUrl}`" button-type="secondary">목록</ULink>
    </div>
  </div>
</template>

<script>
import UTag from '~/components/user/common/UTag';
import { getFileSize } from '~/assets/js/commons';
import EditorContentOutput from '~/components/common/EditorContentOutput.vue';
import ULink from '~/components/user/common/ULink.vue';

export default {
  name: 'PostDetail',
  components: { ULink, EditorContentOutput, UTag },
  props: {
    // EVENT | NOTICE
    type: {
      type: String,
      required: false,
      default: ''
    },
    detailData: {
      type: Object,
      required: false,
      default: () => ({})
    }
  },
  data() {
    return {
      baseUrl: ''
    };
  },
  computed: {
    fileBaseUrl() {
      return this.$axios.defaults.baseURL;
    }
  },
  created() {
    this.baseUrl = this.type === 'NOTICE' ? '/community/notice' : '/event';
  },
  methods: {
    getImage(image) {
      return image
        ? `${this.$store.state.BASE_URL}${image.savedFileName}`
        : require('~/assets/img/thumbnail_default.jpg');
    },
    getFileSize(size) {
      return getFileSize(size);
    }
  }
};
</script>

<style lang="scss" scoped>
.top-event-img {
  margin-bottom: 2rem;
  padding: 0 2rem;

  img {
    aspect-ratio: 320/106;
    width: 100%;
    border-radius: 0.8rem;
    object-fit: cover;
  }
}

.divider {
  height: 1px;
  width: 100%;
  background-color: var(--color-black);
}

.container.title-info {
  padding-bottom: 3.2rem;

  &.top-p {
    padding-top: 3.2rem;
  }

  .tag {
    margin-bottom: 2rem;
  }

  h1 {
    font-style: normal;
    font-weight: 700;
    font-size: 2.4rem;
    line-height: 160%;
    letter-spacing: -1px;
    margin-bottom: 1.2rem;
  }

  p {
    font-weight: 500;
    font-size: 1.4rem;
    line-height: 100%;
  }
}

.container.content {
  padding-top: 4rem;
  padding-bottom: 4rem;
}

.file-wrap {
  background-color: rgba(235, 235, 235, 0.4);
  padding: 2.4rem 2rem;

  .file-item {
    display: flex;
    align-items: center;
    margin-bottom: 1.6rem;

    .icon {
      display: flex;
      height: 2.4rem;
      width: 2.4rem;
      align-items: center;
      justify-content: center;
      background-color: var(--color-white);
      border: 1px solid var(--color-u-grey-2);
      border-radius: 0.2rem;
      margin-right: 1.2rem;

      i {
        font-size: 2rem;
      }
    }

    .name {
      flex-shrink: 1;
      font-size: 1.4rem;
      line-height: 120%;
      margin-right: 0.8rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .volume {
      color: var(--color-u-grey-3);
      font-weight: 400;
      font-size: 12px;
      line-height: 100%;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

.container.nav {
  padding-top: 4rem;
  padding-bottom: 12rem;

  .post-nav {
    border-top: 1px solid var(--color-black);
    border-bottom: 1px solid var(--color-black);
    margin-bottom: 4rem;

    a {
      display: flex;
      padding: 1.3rem 0;
      border-bottom: 1px solid var(--color-u-grey-2);

      &.disabled {
        pointer-events: none;

        .post-name {
          color: var(--color-u-grey-3);
        }
      }

      &:last-child {
        border-bottom: 0;
      }
    }

    .left {
      display: flex;
      align-items: center;
      font-size: 1.2rem;
      font-weight: 500;
      line-height: 100%;
      margin-right: 1.9rem;

      i {
        font-size: 1.6rem;
        margin-left: 0.8rem;
      }
    }

    .post-name {
      flex: 1 0 0;
      font-weight: 400;
      font-size: 1.4rem;
      line-height: 160%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.go-list {
  width: 100% !important;
}

@media screen and (min-width: 769px) {
  .top-event-img {
    margin-bottom: 1.6rem;
    padding: 0;

    img {
      aspect-ratio: 1920/632;
      border-radius: 0;
    }
  }

  .container.title-info {
    padding-bottom: 3.2rem;

    &.top-p {
      padding-top: 3.2rem;
    }

    .tag {
      margin-bottom: 3.6rem;
    }

    h1 {
      font-size: 4.2rem;
      line-height: 150%;
      margin-bottom: 1.9rem;
    }

    p {
      font-size: 1.6rem;
      line-height: 160%;
    }
  }

  .container.content {
    max-width: 92.8rem;
    padding-top: 8rem;
    padding-bottom: 5.2rem;
  }

  .file-wrap {
    max-width: 90rem;
    padding: 2.4rem;
    margin: 0 auto;

    .file-item {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;

      .icon {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 2.8rem;
        width: 2.8rem;
        margin-right: 1.2rem;

        i {
          font-size: 2.4rem;
        }
      }

      .name {
        font-size: 1.6rem;
        line-height: 160%;
        margin-right: 1.2rem;
      }

      .volume {
        font-weight: 400;
        font-size: 14px;
        line-height: 160%;
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .container.nav {
    max-width: 92.8rem;
    padding-top: 5.2rem;
    text-align: -webkit-center;

    .post-nav {
      margin-bottom: 5.2rem;

      a {
        padding: 2rem 0;
      }

      .left {
        font-size: 1.6rem;
        line-height: 160%;
        margin-right: 5.1rem;

        i {
          font-size: 2rem;
          margin-left: 1.3rem;
        }
      }

      .post-name {
        font-size: 1.6rem;
        line-height: 160%;
        text-align: left;
      }
    }

    > a {
      max-width: 15.2rem;
    }
  }

  .go-list {
    width: auto !important;
  }
}
</style>
