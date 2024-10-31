import $dayjs from 'dayjs';

export const numberPad = (number, width, customPad) => {
  customPad = customPad || '0';
  number = number + '';
  return number.length >= width ? number : new Array(width - number.length + 1).join(customPad) + number;
};

export const threeCommaNum = (numString) => {
  if (!numString) {
    return '0';
  } else {
    const targetNum = typeof numString === 'string' ? numString : numString.toString();

    return targetNum.replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,');
  }
};

export const getFileSize = (bytes, dp = 0) => {
  const thresh = 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B';
  }

  const units = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  let u = -1;
  const r = 10 ** dp;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(dp) + units[u];
};

export const fileValid = {
  check(file, maxSize, extension) {
    if (!file) {
      return null;
    }
    if (!this.isValidSize(file, maxSize) || !this.isValidExtension(file, extension)) {
      return null;
    }
    return file;
  },

  getExtension(filename) {
    if (filename.includes('.')) {
      const parts = filename.split('.');
      return parts[parts.length - 1].toLowerCase();
    } else {
      return '';
    }
  },

  isValidSize(file, maxSize = 0) {
    return !(file.size > maxSize && maxSize > 0);
  },

  isValidExtension(file, extension = '*') {
    if (typeof extension === 'string') {
      extension = [extension];
    }
    if (!extension || extension.includes('*')) {
      return true;
    }
    extension.forEach((v, i) => {
      extension[i] = v.replace(/\.|(\s*)/g, '').toLowerCase();
    });
    const fileExtension = this.getExtension(file.name);
    return extension.includes(fileExtension);
  }
};

export const objectToFormData = (obj, rootName, maps) => {
  const formData = new FormData();

  function appendFormData(data, rootName, isMap) {
    rootName = rootName || '';
    if (data instanceof File) {
      formData.append(rootName, data);
    } else if (Array.isArray(data)) {
      for (let i = 0; i < data.length; i++) {
        appendFormData(data[i], rootName + '[' + i + ']');
      }
    } else if (typeof data === 'object' && data) {
      for (const key in data) {
        // eslint-disable-next-line no-prototype-builtins
        if (data.hasOwnProperty(key)) {
          const keyName = isMap ? rootName + '[' + key + ']' : (rootName === '' ? '' : rootName + '.') + key;
          appendFormData(data[key], keyName, maps && maps.find((x) => x === key));
        }
      }
    } else if (data !== null && typeof data !== 'undefined') {
      formData.append(rootName, data);
    }
  }

  appendFormData(obj, rootName);

  return formData;
};

export const createFormElement = (url, data, isBlank) => {
  const form = document.createElement('form');
  form.setAttribute('method', 'POST');
  form.setAttribute('action', url);

  if (isBlank) {
    form.setAttribute('target', '_blank');
  }

  function createInputData(key, value) {
    const $input = document.createElement('input');
    $input.setAttribute('type', 'hidden');
    $input.setAttribute('name', key);
    $input.setAttribute('value', value);
    return $input;
  }

  function addFormData(data, root) {
    for (const [key, value] of Object.entries(data)) {
      const rootWithKey = root ? root + '.' + key : key;
      if (value) {
        if (typeof value === 'object') {
          addFormData(value, rootWithKey);
        } else {
          form.appendChild(createInputData(rootWithKey, value));
        }
      }
    }
  }

  addFormData(data);
  return form;
};

export const getDateCommonDateOutput = (startDate, endDate) => {
  const formatStartDate = startDate ? $dayjs(startDate).format('YYYY-MM-DD') : '';
  const formatEndDate = endDate ? $dayjs(endDate).format('YYYY-MM-DD') : '';
  let returnFormat = '';

  if (formatStartDate === formatEndDate) {
    returnFormat = formatStartDate;
  } else {
    returnFormat = `${formatStartDate} ~ ${formatEndDate}`;
  }

  return returnFormat;
};

export const minDate = new Date().toISOString().slice(0, 10);
