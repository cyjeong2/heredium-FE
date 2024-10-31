import { API_ERROR } from '~/utils/message';

export const downloadMixin = {
  methods: {
    downloadExcel(fileName, url, params) {
      if (!fileName || !url) {
        return null;
      }

      try {
        this.$axios
          .$get(url, {
            method: 'GET',
            responseType: 'blob',
            params
          })
          .then((res) => {
            const href = URL.createObjectURL(res);
            const link = document.createElement('a');

            link.href = href;
            link.setAttribute('download', `${fileName}.XLSX`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(href);
          });
      } catch (error) {
        alert(API_ERROR);
      }
    }
  }
};
