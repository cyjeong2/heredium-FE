<template>
  <KeepAlive>
    <div class="container">
      <section class="title">
        <h1>헤레디움 멤버십</h1>
      </section>
      <section class="contents">
        <div class="list-item">
          <div>
            <UButton class="reservation-btn" @click="goMembershipPage">
              헤레디움 멤버십 오픈
              <span>
                <img src="~assets/img/icon/icon_arrow_right_small.svg" />
              </span>
            </UButton>
            <h4>유효기간: 가입일로부터 1년</h4>
          </div>
          <div>
            <NuxtLink :to="urlMembershipPage" class="img-wrap">
              <img src="~assets/img/intro/heredium_membership.png" alt="heredium_membership" class="only-mobile" />
              <img src="~assets/img/intro/heredium_membership_pc.png" alt="heredium_membership" class="only-pc" />
            </NuxtLink>
          </div>
        </div>
      </section>
    </div>
  </KeepAlive>
</template>

<script>

import UButton from '~/components/user/common/UButton';

export default {
  name: 'MembershipIntroducePage',
  components: { UButton },
  data() {
    return {
      urlMembershipPage: '/mypage/info?type=membership'
    }
  },
  methods: {
    goMembershipPage() {
      this.$router.push(`${this.urlMembershipPage}`);
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  margin: 3.2rem 0 6.4rem;

  h1 {
    font-size: 2.8rem;
    font-weight: 700;
    margin-bottom: 1.6rem;
  }

  h2 {
    font-weight: 300;
    font-size: 1.6rem;
  }
}

.contents {
  margin-bottom: 12rem;
  border-top: 1px solid var(--color-black);

  .list-item {
    .reservation-btn {
      font-size: 2rem;
      flex: 1 0 0;
      margin-right: 1.6rem;
      padding: 1.2rem;
      margin-top: 1.6rem;
      width: 100% !important;

      span {
        margin-left: 1.2rem;
      }
    }

    h4 {
      font-weight: 400;
      display: -webkit-box;
      font-size: 1.6rem;
      margin-top: 2rem;
      margin-bottom: 3.6rem;
      line-height: 140%;
      white-space: normal;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .img-wrap {
      display: flex;
      align-items: center;
      justify-content: center;

      >img {
        width: 100%;
        object-fit: contain;
      }
    }
  }
}

@media screen and (min-width: 769px) {
  .title {
    display: flex;
    margin: 4.8rem 0 8.8rem;
    justify-content: space-between;

    h1 {
      font-size: 4.2rem;
      line-height: 150%;
      margin-bottom: 0;
    }

    h2 {
      font-weight: 500;
      line-height: 150%;
      font-size: 3.6rem;
      text-align: right;
    }
  }

  .contents {
    margin-bottom: 22.4rem;

    .list-item {
      margin-top: 4.4rem;
      margin-bottom: 0;
      display: flex;
      justify-content: space-between;

      .reservation-btn {
        margin-top: 0;
        width: initial !important;
      }

      >div:nth-child(2) {
        width: 70%;
      }

      .img-wrap {
        margin-bottom: 2rem;
      }
    }
  }

}
</style>
