<template>
  <main>
    <div class="container top">
      <h1>{{ docentDetail.title }}</h1>
      <div class="info">
        <div class="left">
          <p>{{ docentDetail.writer }}</p>
          <div class="divider" />
          <p>{{ docentDetail.position }}</p>
        </div>
        <button v-if="docentDetail.map?.savedFileName" class="location-btn" @click="modal.isMap = true">
          <i class="m umic-location" />
        </button>
      </div>
      <div class="thumb">
        <img :src="getImage(docentDetail.thumbnail?.savedFileName)" alt="" />
      </div>
    </div>
    <div class="container bottom">
      <div v-if="docentDetail.audio?.savedFileName" class="audio">
        <audio
          :src="`${$store.state.BASE_URL}${docentDetail.audio?.savedFileName}`"
          class="player"
          controls
          controlsList="nodownload"
        />
      </div>
      <div class="intro">
        {{ docentDetail.intro }}
      </div>
      <nav class="post-nav">
        <NuxtLink :to="`/docent/${id}/${docentDetail.prev?.id}`" :class="{ disabled: !docentDetail.prev }">
          <div class="left">
            <span>이전</span>
            <i class="m umic-arrow_top" />
          </div>
          <div class="post-name">{{ docentDetail.prev?.title || '이전 글이 존재하지 않습니다.' }}</div>
        </NuxtLink>
        <NuxtLink :to="`/docent/${id}/${docentDetail.next?.id}`" :class="{ disabled: !docentDetail.next }">
          <div class="left">
            <span>다음</span>
            <i class="m umic-arrow_bottom" />
          </div>
          <div class="post-name">
            {{ docentDetail.next?.title || '다음 글이 존재하지 않습니다.' }}
          </div>
        </NuxtLink>
      </nav>
      <UButton button-type="secondary" class="go-list" @click="$router.push(`/docent/${id}`)">목록</UButton>
    </div>
    <UDocentMapModal
      :is-show="modal.isMap"
      :img-src="getImage(docentDetail.map?.resizeImage.small)"
      :img-alt="docentDetail.map?.originalFileName"
      @close="modal.isMap = false"
    />
  </main>
</template>

<script>
import UDocentMapModal from '~/components/user/modal/UDocentMapModal.vue';
import UButton from '~/components/user/common/UButton.vue';

export default {
  name: 'DocentDetailPage',
  components: { UButton, UDocentMapModal },
  async asyncData({ params, $axios, redirect }) {
    if (!params.id) {
      redirect('/docents');
    }
    const id = Number(params.id);
    const infosId = Number(params.infosId);
    const docentDetail = await $axios.$get(`/user/docents/${id}/infos/${infosId}`);

    return { id, docentDetail };
  },
  data() {
    return {
      docentDetail: null,
      id: null,
      modal: {
        isMap: false
      }
    };
  },
  methods: {
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    }
  }
};
</script>

<style scoped lang="scss">
.container.top {
  padding-top: 3.2rem;
  padding-bottom: 2rem;
}

.container.bottom {
  padding-top: 2rem;
  padding-bottom: 14rem;
  border-top: 1px solid var(--color-grey-1);
}

h1 {
  font-weight: 700;
  font-size: 2.4rem;
  line-height: 160%;
  letter-spacing: -1px;
  margin-bottom: 2.8rem;
}

.info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2rem;

  .left {
    flex: 1 0 0;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    word-break: keep-all;

    p {
      max-width: 100%;
      font-weight: 400;
      font-size: 1.4rem;
      line-height: 100%;
      word-break: keep-all;
    }
  }

  .divider {
    height: 1.6rem;
    width: 1px;
    background-color: var(--color-u-grey-2);
    margin: 0 1.2rem;
  }

  .location-btn {
    height: 3.2rem;
    width: 3.2rem;

    i {
      font-size: 3.2rem;
    }
  }
}

.thumb {
  img {
    width: 100%;
    aspect-ratio: 16/11;
    border-radius: 0.8rem;
    object-fit: cover;
  }
}

.audio {
  audio {
    width: 100%;
  }
}

.intro {
  max-height: 47.2rem;
  overflow-y: auto;
  margin: 4rem 0;
}

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
    font-weight: 300;
    font-size: 1.4rem;
    line-height: 160%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.map-image {
  width: 100%;
}

::v-deep .go-list {
  width: 100% !important;
}
</style>
