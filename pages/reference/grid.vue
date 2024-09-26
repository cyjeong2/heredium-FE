<template>
  <div>
    <div class="container">
      <div class="title-area mb-36">
        <h1>Grid example</h1>
        <a class="link fs-20 fw-medium ml-32" href="https://sass2css.herokuapp.com/" target="_blank"
          >Scss Converter Site Link</a
        >
      </div>
      <h3 class="mb-32">Class 정의</h3>
      <div class="class-area mb-32">
        <p class="fs-20 fw-medium mb-8">grid.col-none : 열(column)의 배치 제거</p>
        <p class="fs-20 fw-medium mb-8">grid.row-none : 행(row)의 배치 제거</p>
        <p class="fs-20 fw-medium mb-8">grid.flow-col : 각 열(column) 축을 따라 차례로 배치</p>
        <p class="fs-20 fw-medium mb-8">grid.flow-row : 각 행(row) 축을 따라 차례로 배치</p>
        <p class="fs-20 fw-medium mb-8">
          grid.flow-col-dense : 각 열(column) 축을 따라 차례로 배치, 배치 중 나중에 크기가 작은 아이템이 존재할 경우,
          그리드 영역 앞부분의 남은 공간에 자동 배치
        </p>
        <p class="fs-20 fw-medium mb-8">
          grid.flow-row-dense : 각 행(row) 축을 따라 차례로 배치, 배치 중 나중에 크기가 작은 아이템이 존재할 경우,
          그리드 영역 앞부분의 남은 공간에 자동 배치
        </p>
        <p class="fs-20 fw-medium mb-8">grid > column.col-span-full : column span 전체 적용</p>
        <p class="fs-20 fw-medium mb-8">grid > row.row-span-full : row span 전체 적용</p>
      </div>
      <h3 class="mb-32">Size 정의</h3>
      <div class="size-area mb-32">
        <p class="fs-20 fw-medium mb-8">xs: 0px ~ 639px;</p>
        <p class="fs-20 fw-medium mb-8">sm: 640px ~ 767px;</p>
        <p class="fs-20 fw-medium mb-8">md: 768px ~ 1023px;</p>
        <p class="fs-20 fw-medium mb-8">lg: 1024px ~ 1279px;</p>
        <p class="fs-20 fw-medium mb-8">xl: 1280px ~ 1535px;</p>
        <p class="fs-20 fw-medium mb-8">xxl: 1536px ~</p>
      </div>
      <h3 class="mb-32">Columns 설정 정의</h3>
      <div class="columns-area mb-32">
        <p class="fs-20 fw-medium mb-32">col-[size]-[n]</p>
        <div class="example-box mb-32">
          <p class="fs-20 fw-medium mb-8">ex) col-xxl-6</p>
          <div class="grid col-xxl-6">
            <div>col-xxl-6</div>
          </div>
        </div>
        <div class="example-box mb-32">
          <p class="fs-20 fw-medium mb-8">ex) col-xxl-12</p>
          <div class="grid col-xxl-12">
            <div>col-xxl-12</div>
          </div>
        </div>
      </div>
      <h3 class="mb-32">Row 설정 정의</h3>
      <div class="row-area mb-32">
        <p class="fs-20 fw-medium mb-32">row-[size]-[n]</p>
        <div class="example-box mb-32">
          <p class="fs-20 fw-medium mb-8">ex) row-xxl-2</p>
          <div class="grid row-xxl-2">
            <div>row-xxl-2</div>
          </div>
        </div>
        <div class="example-box mb-32">
          <p class="fs-20 fw-medium mb-8">ex) row-xxl-3</p>
          <div class="grid row-xxl-3">
            <div>row-xxl-3</div>
          </div>
        </div>
      </div>
      <h3 class="mb-32">Grid > columns 설정 정의</h3>
      <div class="columns-area mb-32">
        <p class="fs-20 fw-medium mb-32">col-[size]-span-[n]</p>
        <div class="example-box mb-32">
          <p class="fs-20 fw-medium mb-8">ex) col-xxl-span-8</p>
          <div class="grid col-xxl-12">
            <div class="col-xxl-span-8">col-xxl-span-8</div>
          </div>
        </div>
        <div class="example-box mb-32">
          <p class="fs-20 fw-medium mb-8">ex) col-xxl-span-12</p>
          <div class="grid col-xxl-12">
            <div class="col-xxl-span-12">col-xxl-span-12</div>
          </div>
        </div>
      </div>
      <h3 class="mb-32">Grid > row 설정 정의</h3>
      <div class="columns-area mb-32">
        <p class="fs-20 fw-medium mb-32">row-[size]-span-[n]</p>
        <div class="example-box mb-32">
          <p class="fs-20 fw-medium mb-8">ex) row-xxl-span-8</p>
          <div class="grid row-xxl-12">
            <div class="row-xxl-span-8">row-xxl-span-8</div>
          </div>
        </div>
        <div class="example-box mb-32">
          <p class="fs-20 fw-medium mb-8">ex) row-xxl-span-12</p>
          <div class="grid row-xxl-12">
            <div class="row-xxl-span-12">row-xxl-span-12</div>
          </div>
        </div>
      </div>
      <h3 class="mb-32">Gap 설정 정의</h3>
      <div class="gap-area mb-32">
        <p class="fs-20 fw-medium mb-8">gap-[size]-[n] : grid-gap 설정</p>
        <p class="fs-20 fw-medium mb-8">gap-[size]-row-[n] : grid-row-gap 설정</p>
        <p class="fs-20 fw-medium mb-32">gap-[size]-col-[n] : grid-column-gap 설정</p>
        <div class="example-box mb-32">
          <p class="fs-20 fw-medium mb-8">ex) gap-xxl-15</p>
          <div class="grid gap-xxl-15" style="grid-template-columns: repeat(3, minmax(100px, 1fr))">
            <div>gap-xxl-15</div>
            <div>gap-xxl-15</div>
            <div>gap-xxl-15</div>
            <div>gap-xxl-15</div>
            <div>gap-xxl-15</div>
            <div>gap-xxl-15</div>
          </div>
        </div>
        <div class="example-box mb-32">
          <p class="fs-20 fw-medium mb-8">ex) gap-xxl-row-10</p>
          <div class="grid col-xxl-12 gap-xxl-row-10 col-none">
            <div>gap-xxl-row-10</div>
            <div>gap-xxl-row-10</div>
            <div>gap-xxl-row-10</div>
          </div>
        </div>
        <div class="example-box mb-32">
          <p class="fs-20 fw-medium mb-8">ex) gap-xxl-col-10</p>
          <div class="grid col-xxl-12 gap-xxl-col-10">
            <div>gap-xxl-col-10</div>
            <div>gap-xxl-col-10</div>
            <div>gap-xxl-col-10</div>
          </div>
        </div>
      </div>
      <h3 class="mb-32">Example Grid</h3>
      <div class="example-area mb-32">
        <p class="fs-20 fw-medium mb-8">ex) class="grid gap-sm-20 col-sm-1 col-md-3 col-lg-6 col-xl-9 col-xxl-12"</p>
        <div class="grid gap-sm-20 col-sm-1 col-md-3 col-lg-6 col-xl-9 col-xxl-12">
          <div>columns 1</div>
          <div>columns 2</div>
          <div>columns 3</div>
          <div>columns 4</div>
          <div>columns 5</div>
          <div>columns 6</div>
          <div>columns 7</div>
          <div>columns 8</div>
          <div>columns 9</div>
          <div>columns 10</div>
          <div>columns 11</div>
          <div>columns 12</div>
        </div>
      </div>
      <div class="example-area mb-32">
        <p class="fs-20 fw-medium mb-8">ex) grid.col-xxl-12 > col-xxl-span-8 , col-xxl-span-4</p>
        <div class="grid col-xxl-12">
          <div class="col-xxl-span-8">col-xxl-span-8</div>
          <div class="col-xxl-span-4">col-xxl-span-4</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GridExamplePage'
};
</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  padding: 0 2rem;

  .title-area {
    display: flex;
    align-items: center;
    a.link {
      display: inline-block;
      padding: 1rem;
      border: 1px solid var(--color-u-primary);
      background-color: var(--color-u-primary);
      color: var(--color-white);
    }
  }
}

.grid {
  border: 1px solid var(--color-u-primary);
  div {
    padding: 1rem;
    background-color: var(--color-u-primary);
    text-align: center;
    font-size: 1.6rem;
    font-weight: 500;
    color: #fff;
  }
}
</style>
