<template>
  <div class="event-card">
    <img :src="eventImageSrc" :alt="`${event.name} event`" />
    <h3 class="event-name">
      {{ event.name }}
    </h3>
    <div class="event-footer">
      <span class="event-date">{{ period }}</span>
      <button v-if="!!contentTag?.[tag]" class="event-tag complete" :class="tag">{{ contentTag[tag] }}</button>
    </div>
  </div>
</template>

<script>
import { CONTENT_TAG } from '~/assets/js/types';
import { imageMixin } from '~/mixins/imageMixin';

export default {
  name: 'UEventCard',
  mixins: [imageMixin],
  props: {
    event: {
      type: Object,
      required: true
    },
    tag: {
      type: String,
      required: false,
      default: ''
    }
  },
  data() {
    return {
      contentTag: CONTENT_TAG
    };
  },

  computed: {
    eventImageSrc() {
      return this.getImage(this.event.image_url);
    },
    period() {
      if (this.event.start_time && this.event.end_time) {
        return `${this.$dayjs(this.event.start_time).format('YYYY-MM-DD')} ~ ${this.$dayjs(this.event.end_time).format(
          'YYYY-MM-DD'
        )}`;
      }
      if (!this.event.end_time) {
        return `${this.$dayjs(this.event.start_time).format('YYYY-MM-DD')}`;
      }
      return '';
    }
  },

  watch: {},

  created() {},

  mounted() {},

  beforeDestroy() {},

  methods: {}
};
</script>

<style scoped lang="scss">
.event-card {
  display: flex;
  flex-direction: column;
  max-width: 350px;
  gap: 12px;
  background-color: white;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  padding: 20px;
  cursor: pointer;
  justify-content: start;
  width: 100%;
}

.event-card img {
  width: 100%;
  object-fit: cover;
  height: 212px;
}

.event-name {
  font-size: 16px;
  font-weight: 600;
  display: -webkit-box;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  color: #888;
  flex-wrap: wrap;
  flex: 1;
  align-items: center;
}

.event-date {
  font-size: 14px;
  color: #6b7280;
}

.event-tag.complete {
  background-color: #fef2f2;
  color: #b91c1c;
  border: 1px solid #fecaca;
  border-radius: 6px;
  padding: 1px 5px;
  font-size: 12px;
}
.event-tag.on-going {
  background-color: #f0fdf4;
  color: #15803d;
  border: 1px solid #bbf7d0;
  border-radius: 6px;
  padding: 1px 5px;
  font-size: 12px;
}
</style>
