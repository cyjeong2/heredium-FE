<template>
  <div>
    <div class="top">
      <STitle class="mb-16 mr-16" emoji="pencil">커피 {{ isNew ? '등록' : '수정' }}</STitle>
      <STag v-if="detailData.state && !isNew" :type="detailData.state" />
    </div>
    <div class="contents-info mb-36">
      <div class="representative-img mr-28">
        <label class="upload-img" @click.stop>
          <img
            v-if="detailData.thumbnail?.resizeImage?.small"
            :src="`${$store.state.BASE_URL}${detailData.thumbnail?.resizeImage?.small}`"
            alt="테스트"
          />
          <span v-if="!detailData.thumbnail?.resizeImage?.small" class="file-info">
            <i class="ic-plus mb-28" />
            <span class="h4 mb-17">이미지를 등록해주세요.</span>
            <span class="bt-1r">5MB 이하의 JPG, GIF, PNG 파일을 선택해주세요.</span>
            <input
              type="file"
              accept=".jpg, .jpeg, .png, .gif"
              class="is-blind"
              @change="thumbnail($event, 'thumbnail')"
            />
          </span>
        </label>
        <SButton
          v-if="detailData.thumbnail?.resizeImage?.small"
          button-type="primary"
          w-size="small"
          h-size="small"
          @click.self="detailData.thumbnail = null"
        >
          삭제
        </SButton>
      </div>
      <div class="info-table">
        <div class="row">
          <label>제목<b class="must">*</b></label>
          <div class="has-feedback">
            <SInput
              v-model="detailData.title"
              maxlength="100"
              w-size="xx-large"
              :class="{ 'is-error': !feedback.isTitle }"
            />
            <p v-if="!feedback.isTitle">제목을 입력해 주세요.</p>
          </div>
        </div>
        <div class="row">
          <label>부제목</label>
          <div>
            <SInput v-model="detailData.subtitle" maxlength="100" w-size="xx-large" />
          </div>
        </div>
        <div class="row">
          <label>배경 이미지</label>
          <div class="has-btn">
            <div class="mr-28">
              <SInput v-model="detailImageFileName" w-size="xx-large" readonly />
              <input
                ref="detailImage"
                type="file"
                accept=".jpg, .jpeg, .png, .gif"
                class="is-blind"
                @change="thumbnail($event, 'detailImage')"
              />
              <p class="sub">1920px x 800px, 5MB이하의 PNG, JPG, JPEG 파일</p>
            </div>
            <SButton v-if="!detailData.detailImage" @click="$refs.detailImage.click()">파일 첨부</SButton>
            <template v-else>
              <SButton button-type="primary" class="mr-8" @click="downloadFile">다운로드</SButton>
              <SButton @click="removeDetailImage">삭제</SButton>
            </template>
          </div>
        </div>
        <div class="row">
          <label>전시홀</label>
          <div>
            <SCheckboxGroup v-model="detailData.halls" :group-list="hallList" />
          </div>
        </div>
        <div class="row">
          <label>노출여부</label>
          <div>
            <SToggle v-model="detailData.isEnabled">{{ detailData.isEnabled ? '노출' : '미노출' }}</SToggle>
          </div>
        </div>
      </div>
    </div>
    <div class="edit-area">
      <div class="left">
        <div v-scroll-spy="{ allowNoActive: true }">
          <section data-index="0" class="mb-36">
            <h3 class="mb-16">일정</h3>
            <div class="info-table">
              <div class="row">
                <label>판매기간<b class="must">*</b></label>
                <div class="has-feedback">
                  <div>
                    <SDatepicker
                      v-model="detailData.startDate"
                      :min="$dayjs().format('YYYY-MM-DD')"
                      :max="detailData.endDate"
                      :readonly="getIsStartDateReadonly(detailData.state)"
                      :class="{ 'is-error': !feedback.isDate }"
                      @change="checkBookingDate"
                    />
                    <span class="mr-8 ml-8">~</span>
                    <SDatepicker
                      v-model="detailData.endDate"
                      :min="endDateMin"
                      :class="{ 'is-error': !feedback.isDate }"
                    />
                  </div>
                  <p v-if="!feedback.isDate">기간을 선택해 주세요.</p>
                </div>
                <label>예매오픈<b class="must">*</b></label>
                <div class="has-feedback">
                  <div>
                    <SDatepicker
                      v-model="detailData.bookingDate"
                      :min="$dayjs().format('YYYY-MM-DD')"
                      :readonly="!!detailData.state && detailData.state !== 'SCHEDULE'"
                      :max="detailData.startDate"
                      :class="{ 'is-error': !feedback.isBookingDate }"
                    />
                  </div>
                  <p v-if="!feedback.isBookingDate">오픈 날짜를 선택해 주세요.</p>
                </div>
              </div>
            </div>
          </section>
          <section data-index="1" class="round has-title-side-btn mb-36">
            <h3 class="mb-36">
              회차
              <SButton button-type="primary" @click="openRoundModal(true)">회차 일괄 등록</SButton>
            </h3>
            <div class="round-inner">
              <div class="mr-28">
                <SCalendar
                  :ex-start-date="detailData.startDate"
                  :ex-end-date="detailData.endDate"
                  :holiday-list="holidayList"
                  :computed-round-data="computedRoundData"
                  :selected-round-date="selectedRoundDate"
                  @onSelectedDate="onSelectedDate"
                />
              </div>
              <div class="round-wrap">
                <div class="round-menu-top mb-16">
                  <p class="h4">
                    {{ selectedRoundDate ? $dayjs(selectedRoundDate).format('YYYY년 MM월 DD일') : '-' }}
                    <span v-if="currentRoundData" class="ml-8 bt-2r">총 {{ currentRoundData.rounds.length }}회차</span>
                  </p>
                  <SButton button-type="transport-b" @click="openRoundModal(false)">회차 설정</SButton>
                </div>
                <div class="round-list">
                  <template v-if="currentRoundData && currentRoundData.rounds">
                    <div v-if="!currentRoundData.rounds || !currentRoundData.rounds[0]" class="round-item-empty">
                      리스트가 없습니다.
                    </div>
                    <div v-for="(item, index) in currentRoundData.rounds" :key="item.startDate" class="round-item">
                      <p class="count">{{ index + 1 }}</p>
                      <p class="time nt-3">
                        {{ $dayjs(item.startTime, 'HH:mm:ss').format('HH:mm') }} ~
                        {{ $dayjs(item.endTime, 'HH:mm:ss').format('HH:mm') }}
                      </p>
                      <div class="personnel">
                        <div class="bt-1m">
                          판매<span class="nt-3 ml-8">{{
                            item.ticketTotalCount > 999 ? '999+' : item.ticketTotalCount
                          }}</span>
                        </div>
                        <SDivLine />
                        <div class="bt-1m">
                          판매제한<span class="nt-3 ml-8">{{ item.maxCount > 999 ? '999+' : item.maxCount }}</span>
                        </div>
                      </div>
                    </div>
                  </template>
                </div>
              </div>
            </div>
          </section>
          <section data-index="2" class="mb-36">
            <h3 class="mb-16">운영시간<b class="must">*</b></h3>
            <div :class="{ 'is-error': !feedback.isHour }">
              <STextarea v-model="detailData.hour" />
            </div>
            <p v-if="!feedback.isHour" class="feedback-text">운영시간을 입력해 주세요.</p>
          </section>
          <section data-index="3" class="ticket has-title-side-btn">
            <h3 class="mb-24">
              가격
              <SButton button-type="transport-b" @click="addPriceType">추가</SButton>
            </h3>
            <div>
              <table>
                <thead>
                  <tr>
                    <th class="bt-1m">노출</th>
                    <th class="bt-1m">구분<b class="must">*</b></th>
                    <th class="bt-1m">원가</th>
                    <th class="bt-1m">하나1Q 할인 적용</th>
                    <th class="bt-1m">하나1Q 할인 적용가</th>
                    <th class="bt-1m">할인 비고</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in detailData.prices" :key="item.id">
                    <td>
                      <div>
                        <SCheckbox v-model="item.isEnabled" />
                      </div>
                    </td>
                    <td>
                      <div v-if="item.type === '성인' || item.type === '청소년' || item.type === '유아 및 어린이'">
                        {{ item.type }}
                      </div>
                      <div v-else>
                        <SInput v-model="item.type" :class="{ 'is-error': item.isError }" />
                        <p v-if="item.isError">입장권 구분을 입력해 주세요.</p>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>
                          <div>
                            <SInput
                              v-model="item.price"
                              w-size="normal"
                              class="mr-8"
                              :class="{ 'is-error': item.isPriceError }"
                              text-align="right"
                              is-comma-num
                            />
                            원
                          </div>
                          <p v-if="item.isPriceError" class="feedback-text">1~99의 값은 입력할 수 없습니다.</p>
                        </div>
                        <button
                          v-if="item.type !== '성인' && item.type !== '청소년' && item.type !== '유아 및 어린이'"
                          type="button"
                          @click="deletePrice(index)"
                        >
                          <i class="ic-minus" />
                        </button>
                      </div>
                    </td>
                    <td>
                      <div>
                        <SToggle v-model="item.discounts[0].enabled">
                          {{ item.discounts[0].enabled ? '적용' : '미적용' }}
                        </SToggle>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>
                          <SInput
                            v-model="item.discounts[0].price"
                            w-size="normal"
                            class="mr-8"
                            :class="{ 'is-error': item.isPriceError }"
                            text-align="right"
                            is-comma-num
                          />
                          원
                        </div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div>
                          <SInput
                            v-model="item.discounts[0].note"
                            w-size="normal"
                            class="mr-8"
                            :class="{ 'is-error': item.isPriceError }"
                          />
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
          <section data-index="4" class="editor mb-36">
            <h3 class="mb-16">메뉴 콘텐츠<b class="must">*</b></h3>
            <div class="editor-wrap" :class="{ 'is-error': !feedback.isContents }">
              <SummernoteEditor v-model.trim="detailData.contents" />
            </div>
            <p v-if="!feedback.isContents" class="feedback-text">콘텐츠를 입력해 주세요.</p>
          </section>
          <section data-index="5" class="artist has-title-side-btn">
            <h3 class="mb-24">
              인원 소개
              <SButton button-type="primary" @click="addArtistGroup">그룹 추가</SButton>
            </h3>
            <div v-if="detailData.writers.length === 0" class="no-artist-data">리스트가 없습니다.</div>
            <Draggable v-model="detailData.writers" v-bind="dragOptions" handle=".handle">
              <div v-for="(group, groupIndex) in detailData.writers" :key="groupIndex" class="artist-group-item">
                <div class="artist-group-title">
                  <div class="handle"><i class="ic-dragndrop" /></div>
                  <div class="title">
                    <span>그룹명</span>
                    <div>
                      <SInput
                        v-model="group.name"
                        w-size="xx-large"
                        maxlength="30"
                        :class="{ 'is-error': group.isError }"
                      />
                      <p v-if="group.isError" class="feedback-text">
                        인원정보가 없는 인원그룹이 존재합니다. 인원정보를 추가해 주세요.
                      </p>
                    </div>
                    <button type="button" @click="deleteArtistGroupConfirm(groupIndex)"><i class="ic-trash" /></button>
                  </div>
                  <button type="button" @click="group.isShowDetail = !group.isShowDetail">
                    <i v-if="!group.isShowDetail" class="ic-plus" />
                    <i v-else class="ic-minus" />
                  </button>
                </div>
                <div v-if="group.isShowDetail" class="artist-wrap" :class="{ 'is-error': group.isNoArtist }">
                  <SButton button-type="transport-b" @click="editArtist(true, groupIndex)">인원 추가</SButton>
                  <Draggable v-model="group.infos" :group="{ name: 'artist' }" class="artist-list" v-bind="dragOptions">
                    <div v-for="(artist, artistIndex) in group.infos" :key="artist.id" class="artist-item">
                      <img :src="getImage(artist)" alt="" />
                      <div>
                        <span class="text-area bt-1m">{{ artist.name || '이름 없음' }}</span>
                        <div class="btn-area">
                          <button type="button" @click="editArtist(false, groupIndex, artistIndex)">
                            <i class="ic-edit" />
                          </button>
                          <SDivLine />
                          <button type="button" @click="deleteArtist(groupIndex, artistIndex)">
                            <i class="ic-trash" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Draggable>
                </div>
                <p v-if="group.isNoArtist" class="feedback-text">
                  인원정보가 없는 인원그룹이 존재합니다. 인원정보를 추가해 주세요.
                </p>
              </div>
            </Draggable>
          </section>
          <section data-index="6">
            <h3 class="mb-24">
              추가 버튼
            </h3>
            <div class="has-feedback">
              <div class="info-table">
                <div class="row">
                  <label>버튼 노출</label>
                  <div>
                    <SToggle v-model="detailData.isUseButton">{{ detailData.isUseButton ? '노출' : '미노출' }}</SToggle>
                  </div>
                </div>
                <div class="row">
                  <label>버튼명</label>
                  <div class="has-feedback">
                    <SInput
                      v-model="detailData.buttonTitle"
                      maxlength="40"
                      w-size="xx-large"
                    />
                    <p v-if="!feedback.isButtonTitle">제목을 입력해 주세요.</p>
                  </div>
                </div>
                <div class="row">
                  <label>버튼 링크</label>
                  <div class="has-feedback">
                    <div>
                      <SInput v-model="detailData.buttonLink"  class="mr-8" w-size="xx-large" maxlength="1000" />
                      <SCheckbox v-model="detailData.isNewTab">새창 열기</SCheckbox>
                    </div>
                    <p v-if="!feedback.isButtonLink">http:// 또는 https://를 포함한 주소를 입력해주세요.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div class="bottom">
          <SButton @click="modal.isCancel = true">취소</SButton>
          <div class="right">
            <SButton class="mr-8" @click="showPreview">미리보기</SButton>
            <SButton button-type="primary" :disabled="isConfirmPending" @click="checkEdit">완료</SButton>
          </div>
        </div>
      </div>
      <div class="right ml-28">
        <nav v-scroll-spy-active v-scroll-spy-link class="side-menu">
          <a class="bt-1b active">일정</a>
          <a class="bt-1b">회차</a>
          <a class="bt-1b">운영시간</a>
          <a class="bt-1b">가격</a>
          <a class="bt-1b">메뉴 콘텐츠</a>
          <a class="bt-1b">인원 소개</a>
        </nav>
      </div>
    </div>
    <RoundModal
      :ex-start-date="detailData.startDate"
      :ex-end-date="detailData.endDate"
      :is-show="modal.isRound"
      :is-batch="isBatch"
      :ex-state="detailData.state"
      :current-round-data="currentRoundData"
      @close="modal.isRound = false"
      @setBatchRound="setBatchRound"
    />
    <ArtistModifyModal
      :is-show="modal.isArtist"
      :selected-artist="selectedArtist"
      @close="modal.isArtist = false"
      @save="saveArtist"
    />
    <SDialogModal :is-show="modal.isFileError" @close="modal.isFileError = false">
      <template #content>5MB이하의 JPG, GIF, PNG 파일을 업로드해주세요.</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="modal.isFileError = false">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isCancel" @close="modal.isCancel = false">
      <template #content>콘텐츠를 저장하지 않고<br />이전페이지로 이동 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isCancel = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="$router.push('/admin/coffee/manage')">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isOpen" @close="modal.isOpen = false">
      <template #content>전시정보가 홈페이지에 오픈됩니다.<br />콘텐츠를 저장 하시겠습니까?</template>
      <template #modal-btn1>
        <SButton @click="modal.isOpen = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="saveData">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isSave" @close="modal.isSave = false">
      <template #content>콘텐츠가 저장되었습니다.</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="$router.push(`/admin/coffee/manage/${id}`)">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isDeleteArtistGroup" @close="modal.isDeleteArtistGroup = false">
      <template #content>그룹을 삭제 하시겠습니까?<br />삭제 시 하위 콘텐츠가 함께 삭제됩니다.</template>
      <template #modal-btn1>
        <SButton @click="modal.isDeleteArtistGroup = false">취소</SButton>
      </template>
      <template #modal-btn2>
        <SButton button-type="primary" @click="deleteArtistGroup">확인</SButton>
      </template>
    </SDialogModal>
    <SDialogModal :is-show="modal.isNewSave" @close="$router.push(`/admin/coffee/manage`)">
      <template #content>콘텐츠가 등록되었습니다.</template>
      <template #modal-btn1>
        <SButton button-type="primary" @click="$router.push(`/admin/coffee/manage`)">확인</SButton>
      </template>
    </SDialogModal>
  </div>
</template>

<script>
import cloneDeep from 'lodash/cloneDeep';
import draggable from 'vuedraggable';
import STitle from '~/components/admin/commons/STitle.vue';
import SButton from '~/components/admin/commons/SButton.vue';
import SInput from '~/components/admin/commons/SInput.vue';
import SToggle from '~/components/admin/commons/SToggle.vue';
import SCheckboxGroup from '~/components/admin/commons/SCheckboxGroup.vue';
import SDatepicker from '~/components/admin/commons/SDatepicker.vue';
import SCalendar from '~/components/admin/commons/SCalendar.vue';
import SDivLine from '~/components/admin/commons/SDivLine.vue';
import STextarea from '~/components/admin/commons/STextarea.vue';
import SCheckbox from '~/components/admin/commons/SCheckbox.vue';
import SummernoteEditor from '~/components/admin/commons/Summernote.vue';
import SDialogModal from '~/components/admin/modal/SDialogModal.vue';
import RoundModal from '~/components/admin/modal/RoundModal.vue';
import ArtistModifyModal from '~/components/admin/modal/ArtistModifyModal.vue';
import { EXHIBITION_DETAIL } from '~/assets/js/types';
import { roundsToHashTable } from '~/assets/js/converter';
import STag from '~/components/admin/commons/STag.vue';
import { createFormElement, fileValid } from '~/assets/js/commons';
import { exhibitionPreview } from '~/assets/js/previewConverter';

export default {
  name: 'EditPage',
  components: {
    STag,
    ArtistModifyModal,
    RoundModal,
    SDialogModal,
    SummernoteEditor,
    SCheckbox,
    STextarea,
    SDivLine,
    SCalendar,
    SDatepicker,
    SCheckboxGroup,
    SToggle,
    SInput,
    SButton,
    STitle,
    Draggable: draggable
  },
  layout: 'admin/default',
  async asyncData({ $axios, params, $dayjs }) {
    const { id } = params;
    const isNew = id == null;
    const detailData = isNew
      ? {
          ...cloneDeep(EXHIBITION_DETAIL),
          startDate: $dayjs().format('YYYY-MM-DD'),
          endDate: $dayjs().add(30, 'days').format('YYYY-MM-DD'),
          prices: [
            {
              id: null,
              isError: false,
              isEnabled: false,
              type: '',
              price: 0,
              discounts: [
                {
                  note: '',
                  type: 'HANA_BANK',
                  price: 0,
                  enabled: false
                }
              ]
            }
          ]
        }
      : await $axios.$get(`/admin/coffees/${id}`).then((detailData) => ({
          ...detailData,
          prices: detailData.prices.map((price) => {
            if (!price.discounts || !price.discounts[0]) {
              price.discounts = [
                {
                  note: '',
                  type: 'HANA_BANK',
                  price: 0,
                  enabled: false
                }
              ];
            }

            return { ...price, isError: false, isPriceError: false };
          }),
          writers: detailData.writers.map((writer) => ({
            id: writer.id || null,
            isShowDetail: writer.infos.length > 0,
            isError: false,
            isNoArtist: false,
            name: writer.name,
            infos: writer.infos
          }))
        }));
    const detailImageFileName = detailData.detailImage?.originalFileName ?? null;
    const holidayList = await $axios.$get(`/admin/holidays`, {
      params: {
        startDate: $dayjs().format('YYYY-MM-DD'),
        endDate: null
      }
    });

    return { id, isNew, detailData, detailImageFileName, holidayList };
  },
  data() {
    return {
      id: null,
      isNew: true,
      detailData: null,
      detailImageFileName: null,
      holidayList: null,
      selectedRoundDate: this.$dayjs().format('YYYY-MM-DD'),
      isBatch: false,
      selectedArtist: null,
      modal: {
        isRound: false,
        isArtist: false,
        isSave: false,
        isCancel: false,
        isOpen: false,
        isNewSave: false,
        isFileError: false,
        isDeleteArtistGroup: false
      },
      deleteArtistIndex: null,
      scrollSpyList: [],
      dragOptions: {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'sortable_ghost'
      },
      feedback: {
        isTitle: true,
        isDate: true,
        isBookingDate: true,
        isHour: true,
        isContents: true,
        isButtonTitle: true,
        isButtonLink: true,
      },
      isConfirmPending: false
    };
  },
  computed: {
    hallList() {
      return this.$store.state.HALL_LIST.map((hall) => ({
        label: hall,
        value: hall
      }));
    },
    computedRoundData() {
      const rounds = this.detailData.rounds;

      return roundsToHashTable(rounds, this.$dayjs);
    },
    endDateMin() {
      const startDate = this.detailData.startDate;
      const state = this.detailData.state;
      let minDate = '';

      if (!state || state === 'SCHEDULE') {
        minDate = startDate;
      } else if (state === 'BOOKING') {
        minDate = this.$dayjs(startDate).add(91, 'd').format('YYYY-MM-DD');
      } else {
        minDate = this.$dayjs().add(91, 'd').format('YYYY-MM-DD');
      }

      return minDate;
    },
    currentRoundData() {
      const defaultData = {
        targetDate: this.selectedRoundDate,
        allMaxCount: 0,
        allTicketingCount: 0,
        rounds: [],
        isHasOverbooking: false
      };

      return this.computedRoundData[this.selectedRoundDate] || defaultData;
    }
  },
  created() {
    if (this.detailData.state === 'SCHEDULE' || this.detailData.state === 'BOOKING') {
      this.selectedRoundDate = this.$dayjs(this.detailData.startDate).format('YYYY-MM-DD');
    }
  },
  methods: {
    getIsStartDateReadonly(state) {
      return state === 'BOOKING' || state === 'PROGRESS' || state === 'TERMINATION';
    },
    checkBookingDate() {
      if (this.detailData.bookingDate && this.$dayjs(this.detailData.startDate).isBefore(this.detailData.bookingDate)) {
        this.detailData.bookingDate = '';
      }
    },
    async thumbnail(e, target) {
      const input = event.target;
      const type = target === 'thumbnail' ? 'PROJECT_THUMBNAIL' : 'PROJECT_DETAIL_IMAGE';

      if (input.files && input.files[0]) {
        const file = e.target.files[0];
        const maxSize = 5 * 1024 * 1024;
        const extension = e.target.accept.split(',');
        const isValid = fileValid.check(e.target.files[0], maxSize, extension) !== null;

        if (isValid) {
          const formData = new FormData();
          formData.append('files', file);
          await this.$axios
            .$post('/file', formData, {
              params: { type }
            })
            .then((fileForm) => {
              this.detailData[target] = fileForm;

              if (target === 'detailImage') {
                this.detailImageFileName = fileForm.originalFileName;
              }
            });
        } else {
          this.modal.isFileError = true;
        }
        e.target.value = null;
        e.target.files = null;
      }
    },
    removeDetailImage() {
      this.detailData.detailImage = null;
      this.detailImageFileName = null;
    },
    downloadFile() {
      const href = `${this.$store.state.BASE_URL}${this.detailData.detailImage?.savedFileName}`;
      const link = document.createElement('a');

      link.href = href;
      link.setAttribute('target', '_blink');
      link.setAttribute('download', this.detailData.detailImage.originalFileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(href);
    },
    openRoundModal(isBatch) {
      if (!isBatch && !this.selectedRoundDate) {
        alert('날짜를 선택해주세요.');
        return;
      }

      this.isBatch = isBatch;
      this.modal.isRound = true;
    },
    setBatchRound({ roundList, targetDate, updatedDateList, removeDateList, isDeleteModify, isSingleModify }) {
      let filteredRoundList = [...this.detailData.rounds];

      if (isDeleteModify) {
        filteredRoundList = filteredRoundList.filter(
          (round) => !removeDateList.includes(this.$dayjs(round.startDate).format('YYYY-MM-DD'))
        );
      } else {
        filteredRoundList = filteredRoundList.filter((round) =>
          isSingleModify
            ? this.$dayjs(round.startDate).format('YYYY-MM-DD') !== targetDate
            : !updatedDateList.includes(this.$dayjs(round.startDate).format('YYYY-MM-DD'))
        );
      }

      this.detailData.rounds = [...roundList, ...filteredRoundList];
      this.modal.isRound = false;
    },
    onSelectedDate(selectedDate) {
      this.selectedRoundDate = selectedDate;
    },
    addPriceType() {
      this.detailData.prices.push({
        id: null,
        isError: false,
        isEnabled: false,
        type: '',
        price: 0,
        discounts: [
          {
            note: '',
            type: 'HANA_BANK',
            price: 0,
            enabled: false
          }
        ]
      });
    },
    deletePrice(index) {
      this.detailData.prices.splice(index, 1);
    },
    addArtistGroup() {
      this.detailData.writers.push({
        id: null,
        name: '',
        isShowDetail: true,
        isError: false,
        isNoArtist: false,
        infos: []
      });
    },
    deleteArtistGroupConfirm(groupIndex) {
      this.deleteArtistIndex = groupIndex;
      this.modal.isDeleteArtistGroup = true;
    },
    deleteArtistGroup() {
      this.detailData.writers.splice(this.deleteArtistIndex, 1);
      this.modal.isDeleteArtistGroup = false;
    },
    getImage(image) {
      return image?.thumbnail?.resizeImage?.small
        ? `${this.$store.state.BASE_URL}${image.thumbnail?.resizeImage?.small}`
        : require('~/assets/img/thumbnail_default.jpg');
    },
    editArtist(isNew, groupIndex, artistIndex) {
      const defaultArtistInfo = {
        thumbnail: null,
        name: '',
        intro: ''
      };
      const { thumbnail, name, intro } = !isNew
        ? this.detailData.writers[groupIndex].infos[artistIndex]
        : defaultArtistInfo;

      this.selectedArtist = {
        isNew,
        thumbnail,
        name,
        intro,
        groupIndex,
        artistIndex
      };
      this.modal.isArtist = true;
    },
    deleteArtist(groupIndex, artistIndex) {
      this.detailData.writers[groupIndex].infos.splice(artistIndex, 1);
    },
    saveArtist({ isNew, thumbnail, name, intro, groupIndex, artistIndex }) {
      if (isNew) {
        this.detailData.writers[groupIndex].infos.push({
          thumbnail,
          name,
          intro
        });
      } else {
        const targetArtist = this.detailData.writers[groupIndex].infos[artistIndex];

        this.detailData.writers[groupIndex].infos[artistIndex] = {
          ...targetArtist,
          thumbnail,
          name,
          intro
        };
      }
      this.modal.isArtist = false;
    },
    isValidate() {
      const resetFeedback = () => {
        Object.keys(this.feedback).forEach((key) => {
          this.feedback[key] = true;
        });
        this.detailData.writers.forEach((writerGroup) => {
          writerGroup.isError = false;
          writerGroup.isNoArtist = false;
        });
      };
      let isVerifyPrice = true;
      let isVerifyArtist = true;

      resetFeedback();
      if (!this.detailData.title) {
        this.feedback.isTitle = false;
      }
      if (!(this.detailData.startDate && this.detailData.endDate)) {
        this.feedback.isDate = false;
      }
      if (!this.detailData.bookingDate) {
        this.feedback.isBookingDate = false;
      }
      if (!this.detailData.hour) {
        this.feedback.isHour = false;
      }
      if (this.detailData.prices.length > 0) {
        this.detailData.prices.forEach((price) => {
          if (!price.type) {
            price.isError = true;
            isVerifyPrice = false;
          }
          if (price.price >= 1 && price.price <= 99) {
            price.isPriceError = true;
            isVerifyPrice = false;
          }
        });
      }
      if (!this.detailData.contents) {
        this.feedback.isContents = false;
      }
      if (this.detailData.writers.length > 0) {
        this.detailData.writers.forEach((writerGroup) => {
          if (!writerGroup.name) {
            writerGroup.isError = true;
            isVerifyArtist = false;
          }
          if (writerGroup.infos.length === 0) {
            writerGroup.isNoArtist = true;
            isVerifyArtist = false;
          }
        });
      }

      if (this.detailData.isUseButton) {
        if (!this.detailData.buttonTitle) {
          this.feedback.isButtonTitle = false;
        }
        if (!this.detailData.buttonLink || !(this.detailData.buttonLink.startsWith('http://') || this.detailData.buttonLink.startsWith('https://'))) {
          this.feedback.isButtonLink = false;
        }
      }

      this.$nextTick(() => {
        const $errorDom = document.querySelector('.is-error');

        if ($errorDom) {
          window.scrollTo({ top: $errorDom.offsetTop - 15 });
        }
      });

      return Object.keys(this.feedback).every((key) => this.feedback[key] === true) && isVerifyPrice && isVerifyArtist;
    },
    checkEdit() {
      if (this.isValidate()) {
        const isOpen = this.detailData.isEnabled && this.detailData.bookingDate === this.$dayjs().format('YYYY-MM-DD');

        if (isOpen) {
          this.modal.isOpen = true;
        } else {
          this.saveData();
        }
      }
    },
    async saveData() {
      this.isConfirmPending = true;
      const detailData = {
        ...this.detailData,
        startDate: this.$dayjs(this.detailData.startDate).format('YYYY-MM-DD 00:00:00'),
        endDate: this.$dayjs(this.detailData.endDate).format('YYYY-MM-DD 23:59:59'),
        bookingDate: this.$dayjs(this.detailData.bookingDate).format('YYYY-MM-DD 00:00:00'),
        rounds: this.detailData.rounds.map((round) => ({
          id: round.id != null ? round.id : null,
          startDate: round.startDate,
          endDate: round.endDate,
          limitNumber: round.limitNumber
        })),
        writers: this.detailData.writers.map((writer) => ({
          id: writer.id != null ? writer.id : null,
          name: writer.name,
          infos: writer.infos
        })),
        prices: this.detailData.prices.map((price) => ({ ...price, isError: null, isPriceError: null }))
      };

      if (this.isNew) {
        await this.$axios
          .$post('/admin/coffees', detailData)
          .then(() => {
            this.modal.isNewSave = true;
          })
          .catch(() => {
            alert('error');
          });
      } else {
        await this.$axios
          .$put(`/admin/coffees/${this.id}`, detailData)
          .then(() => {
            this.modal.isSave = true;
          })
          .catch(() => {
            alert('error');
          });
      }
      this.isConfirmPending = false;
    },
    showPreview() {
      const convertData = { previewData: JSON.stringify(exhibitionPreview(this.detailData)) };
      const $formEl = createFormElement('/coffee/preview', convertData, true);

      document.querySelector('body').append($formEl);
      $formEl.submit();
      $formEl.remove();
    }
  }
};
</script>

<style lang="scss" scoped>
.top {
  display: flex;
  align-items: center;
}

.must {
  color: var(--color-blue);
}

.contents-info {
  display: flex;
  align-items: flex-start;

  .representative-img {
    position: relative;
    flex: 1 1 56rem;

    .upload-img {
      position: relative;
      display: block;
      width: 100%;
      height: 0;
      padding-bottom: 63.92857142857143%;
      background-color: rgba(221, 221, 221, 0.5);
      border-radius: 0.3rem;
      cursor: pointer;

      img {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 100%;
        border-radius: 0.3rem;
        object-fit: cover;
        object-position: center;
        background-color: #d9d9d9;
      }

      .file-info {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        i {
          font-size: 6.8rem;
        }
      }
    }

    button {
      position: absolute;
      right: 0.8rem;
      top: 0.8rem;
    }
  }

  .info-table {
    flex: 1 1 calc(100% - 58.8rem);
  }
}

.edit-area {
  display: flex;

  .left {
    flex: 1 1 auto;
  }

  .right {
    position: relative;

    .side-menu {
      display: flex;
      position: sticky;
      flex-direction: column;
      top: 0;
      padding-top: 4.4rem;

      > a {
        display: flex;
        height: 6rem;
        width: 18rem;
        align-items: center;
        justify-content: center;
        background-color: var(--color-white);
        border: 1px solid var(--color-grey-2);
        border-bottom: 0;
        cursor: pointer;

        &.active {
          color: var(--color-white);
          background-color: var(--color-black);
        }

        &:last-child {
          border-bottom: 1px solid var(--color-grey-2);
        }
      }
    }
  }
}

.has-title-side-btn {
  h3 {
    position: relative;

    > a,
    > button {
      position: absolute;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }
  }
}

.round {
  .round-inner {
    display: flex;
    border-top: 1px solid var(--color-grey-2);
    padding-top: 3.6rem;
  }

  .round-wrap {
    flex: 1 1 0;
  }

  .round-menu-top {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > p {
      flex: 1 0 0;

      > span {
        color: rgba(0, 0, 0, 0.4);
      }
    }
  }

  .round-list {
    height: 53.7rem;
    overflow-y: auto;
    background-color: var(--color-white);
    margin-top: 1rem;
    border-radius: 0.3rem;
    border: 1px solid var(--color-grey-2);
  }

  .round-item-empty {
    color: var(--color-grey-3);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 53.7rem;
    width: 100%;
    font-size: 1.6rem;
    font-weight: 500;
  }

  .round-item {
    display: flex;
    border-bottom: 1px solid var(--color-grey-2);
    padding-right: 6.2rem;
    align-items: center;

    .count {
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--color-grey-4);
      min-height: 5.5rem;
      width: 5.5rem;
      background-color: #fafafa;
      border-right: 1px solid var(--color-grey-2);
    }

    .time {
      flex: 1 1 0;
      padding: 0 2rem;
    }

    .personnel {
      display: flex;
      align-items: center;

      .bt-1m {
        width: 9.6rem;
      }

      .nt-3 {
        color: var(--color-blue);
      }
    }
  }
}

.ticket {
  table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 0.3rem;
    border-style: hidden;
    box-shadow: 0 0 0 1px var(--color-grey-2);
    overflow: hidden;
    margin-bottom: 2.75rem;

    thead {
      background-color: #fafafa;
    }

    tbody {
      background-color: var(--color-white);
    }

    th,
    td {
      border: 1px solid var(--color-grey-2);
    }

    th {
      color: var(--color-grey-4);
      height: 4.5rem;

      &:nth-child(1) {
        width: 5.6rem;
      }

      &:nth-child(2) {
        width: 24rem;
        padding: 0 2rem;
        text-align: left;
      }

      &:nth-child(4) {
        padding: 0 2rem;
      }
    }

    td:nth-child(1) > div,
    td:nth-child(4) > div {
      display: flex;
      align-items: center;
      justify-content: center;
    }

    td:nth-child(2) > div {
      position: relative;
      padding: 0.8rem 2rem;

      p {
        margin-top: 0.8rem;
        color: var(--color-red);
      }
    }

    td:nth-child(3) > div,
    td:nth-child(5) > div,
    td:nth-child(6) > div {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding: 0.8rem 2rem;

      > button {
        position: absolute;
        height: 2.4rem;
        width: 2.4rem;
        top: 50%;
        right: 1.6rem;
        transform: translateY(-50%);
      }
    }
  }
}

.editor {
  .editor-wrap {
    background-color: var(--color-white);
  }
}

.artist {
  .artist-group-item {
    margin-bottom: 2.4rem;

    .artist-group-title {
      display: flex;
      background-color: var(--color-white);
      border: 1px solid var(--color-grey-2);
      border-radius: 0.3rem;

      .handle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 5.6rem;
        border-right: 1px solid var(--color-grey-2);
      }

      .title {
        flex: 1 0 auto;
        display: flex;
        align-items: center;
        padding: 0.8rem 2rem;

        > span {
          margin-right: 1.2rem;
        }

        > button {
          height: 100%;
          width: 2.4rem;
          margin-left: 1.2rem;
        }
      }

      > button {
        margin-right: 1.6rem;
      }

      i {
        font-size: 2.4rem;
      }
    }
  }

  .artist-wrap {
    position: relative;
    background-color: #ddd;
    padding-top: 8.4rem;
    border-radius: 0.3rem;

    > button {
      position: absolute;
      top: 2.4rem;
      right: 2rem;
    }
  }

  .artist-list {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    column-gap: 2rem;
    row-gap: 3.2rem;
    padding: 2.4rem 3.2rem;

    .artist-item {
      border-radius: 0.3rem;
      background-color: var(--color-white);
      overflow: hidden;

      > img {
        height: 19.7rem;
        width: 100%;
        object-fit: cover;
      }

      > div {
        display: flex;
        height: 4.8rem;
        align-items: center;
        justify-content: space-between;
        padding: 0 1.6rem;

        i {
          font-size: 2.4rem;
        }
      }

      .text-area {
        flex: 1 0 0;
        padding-right: 1.6rem;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .btn-area {
        display: flex;
        align-items: center;

        > span {
          height: 2.4rem;
        }
      }
    }
  }

  .no-artist-data {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 20rem;
    font-size: 1.6rem;
    padding-bottom: 1rem;
  }
}

.bottom {
  display: flex;
  justify-content: space-between;
  padding-top: 2.4rem;
  border-top: 1px solid var(--color-grey-2);

  .right {
    display: flex;
  }
}

.feedback-text {
  margin-top: 0.8rem;
  color: var(--color-red);
  font-size: 1.4rem;
  text-align: left;
}
</style>
