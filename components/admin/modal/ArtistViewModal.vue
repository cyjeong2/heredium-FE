<template>
  <SModal :is-show="isShow" @close="$emit('close')">
    <template #title>작가정보</template>
    <template #content>
      <div class="artist-modal">
        <div class="representative-img">
          <img :src="getImage(thumbnail?.savedFileName)" alt="" />
        </div>
        <div class="forms">
          <div class="title">{{ name }}</div>
          <div class="contents">{{ intro }}</div>
        </div>
      </div>
    </template>
  </SModal>
</template>

<script>
import SModal from '~/components/admin/modal/SModal';

export default {
  name: 'ArtistViewModal',
  components: { SModal },
  props: {
    isShow: {
      type: Boolean,
      required: false,
      default: false
    },
    selectedArtist: {
      type: Object,
      required: false,
      default: () => ({
        isNew: true,
        thumbnail: null,
        name: '',
        intro: '',
        groupIndex: null,
        artistIndex: null
      })
    }
  },
  data() {
    return {
      isNew: true,
      thumbnail: null,
      name: '',
      intro: '',
      isShowErrorModal: false,
      errorModalMsg: ''
    };
  },
  watch: {
    isShow(newValue) {
      if (newValue) {
        this.isNew = this.selectedArtist.isNew;
        this.thumbnail = this.selectedArtist.thumbnail;
        this.name = this.selectedArtist.name;
        this.intro = this.selectedArtist.intro;
      }
    }
  },
  methods: {
    getImage(imageUrl) {
      return imageUrl ? this.$store.state.BASE_URL + imageUrl : require('~/assets/img/thumbnail_default.jpg');
    }
  }
};
</script>

<style lang="scss" scoped>
.artist-modal {
  display: flex;
}

.representative-img {
  position: relative;
  margin-right: 2rem;

  > img {
    width: 16.8rem;
    height: 16.8rem;
    object-fit: cover;
    border-radius: 0.3rem;
  }
}

.forms {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  text-align: left;

  .title {
    margin-bottom: 0.8rem;
    word-break: break-word;
  }

  .contents {
    flex: 1 0 0;
    overflow-y: auto;
    word-break: break-word;
  }
}
</style>
