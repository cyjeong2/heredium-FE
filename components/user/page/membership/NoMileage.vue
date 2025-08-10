<template>
  <KeepAlive>
    <div class="center no-mileage">
      <div class="content">
        <div class="center">
          <p>마일리지 내역이 없습니다.</p>
        </div>
      </div>
    </div>
  </KeepAlive>
</template>

<script>
export default {
  name: 'NoMileage'
};
</script>

<style lang="scss" scoped>
.no-mileage {
  padding: 1.5rem 0;
  min-height: 211px;
  .content {
    font-size: 1.6rem;
    font-weight: 500;
    color: #666666;
  }
}
</style>
