export const roundsToHashTable = (rounds, $dayjs) => {
  const roundData = {};

  rounds.forEach((value, index) => {
    const targetDate = $dayjs(value.startDate).format('YYYY-MM-DD');
    const eachRound = {
      dataIndex: index,
      date: targetDate,
      id: value.id || null,
      startTime: $dayjs(value.startDate).format('HH:mm:ss'),
      endTime: $dayjs(value.endDate).format('HH:mm:ss'),
      ticketTotalCount: value.ticketTotalCount,
      ticketUsedCount: value.ticketUsedCount || 0,
      maxCount: value.limitNumber,
      isOverbooking: false,
      isSelected: false
    };

    roundData[targetDate] = roundData[targetDate] ?? {};
    roundData[targetDate].targetDate = targetDate;
    if (!roundData[targetDate].rounds) {
      roundData[targetDate].rounds = [eachRound];
    } else {
      roundData[targetDate].rounds.push(eachRound);
    }
    roundData[targetDate].ticketUsedCount =
      roundData[targetDate].ticketUsedCount == null
        ? value.ticketUsedCount
        : roundData[targetDate].ticketUsedCount + value.ticketUsedCount;
    roundData[targetDate].allMaxCount =
      roundData[targetDate].allMaxCount == null
        ? value.limitNumber
        : roundData[targetDate].allMaxCount + value.limitNumber;
    roundData[targetDate].allTicketingCount =
      roundData[targetDate].allTicketingCount == null
        ? value.ticketTotalCount
        : roundData[targetDate].allTicketingCount + value.ticketTotalCount;
    roundData[targetDate].isHasOverbooking = roundData[targetDate].isHasOverbooking ?? eachRound.isOverbooking;
  });

  Object.entries(roundData).forEach(([key, value]) => {
    let sortTarget = [...value.rounds];

    sortTarget = sortTarget.sort((a, b) => new Date(`${key} ${a.endTime}`) - new Date(`${key} ${b.endTime}`));
    sortTarget = sortTarget.sort((a, b) => new Date(`${key} ${a.startTime}`) - new Date(`${key} ${b.startTime}`));
    roundData[key].rounds = sortTarget;
  });

  return roundData;
};

export const weekOfDayNameToNumber = (name) => {
  const formatName = `${name}`.toUpperCase();
  let weekOfDayNumber = 0;

  switch (formatName) {
    case 'SUNDAY':
      weekOfDayNumber = 0;
      break;
    case 'MONDAY':
      weekOfDayNumber = 1;
      break;
    case 'TUESDAY':
      weekOfDayNumber = 2;
      break;
    case 'WEDNESDAY':
      weekOfDayNumber = 3;
      break;
    case 'THURSDAY':
      weekOfDayNumber = 4;
      break;
    case 'FRIDAY':
      weekOfDayNumber = 5;
      break;
    case 'SATURDAY':
      weekOfDayNumber = 6;
      break;
    default:
      weekOfDayNumber = 0;
      break;
  }

  return weekOfDayNumber;
};

export const dayOfWeekNumberToKoName = (weekNumber) => {
  let weekKoName = '';

  switch (weekNumber) {
    case 0:
      weekKoName = '일';
      break;
    case 1:
      weekKoName = '월';
      break;
    case 2:
      weekKoName = '화';
      break;
    case 3:
      weekKoName = '수';
      break;
    case 4:
      weekKoName = '목';
      break;
    case 5:
      weekKoName = '금';
      break;
    case 6:
      weekKoName = '토';
      break;
    default:
      weekKoName = '잘못된 요일 값';
      break;
  }

  return weekKoName;
};

export const dashboardCountToList = (countData) => {
  const countList = Array.from({ length: 5 }, () => ({
    type: '',
    value: '',
    subValue: '',
    unit: ''
  }));

  countList[0] = {
    type: '입장',
    value: countData.visitCount,
    subValue: null,
    unit: '명'
  };
  countList[1] = {
    type: '입장예정',
    value: countData.totalCount,
    subValue: null,
    unit: '명'
  };
  countList[2] = {
    type: '판매된 티켓 / 금액',
    value: countData.salePrice,
    subValue: countData.saleCount,
    unit: '원'
  };
  countList[3] = {
    type: '취소된 티켓 / 금액',
    value: countData.refundPrice,
    subValue: countData.refundCount,
    unit: '원'
  };
  countList[4] = {
    type: '신규가입',
    value: countData.newRegister,
    subValue: null,
    unit: '명'
  };

  return countList;
};

export function toKoreaCurrency(amount) {
  try {
    if (amount === undefined || amount === null || amount === '') {
      return '';
    }
    const amountNumber = parseInt(amount, 10);
    return `${amountNumber.toLocaleString('en-US')}원`;
  } catch (error) {
    return '';
  }
}
