export const BASE={
    timestamp:function (url){
        var getTimestamp=new Date().getTime();
        if(url&&url.indexOf("?")>-1){
            url=url+"&timestamp="+getTimestamp
        }else{
            url=url+"?timestamp="+getTimestamp
        }
        return url;
    },
    download(url,filename){
        /**
         * 获取 blob
         * @param  {String} url 目标文件地址
         * @return {cb}
         */
        function getBlob(url,cb) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'blob';
            xhr.onload = function() {
                if (xhr.status === 200) {
                    var data = xhr.response;
                    if ((typeof data === 'string' || data instanceof String) && data.substr(0,2) == "/*") {
                      data = data.substring(2, txt.length - 2);
                    }
                    cb(data);
                }
            };
            xhr.send();
        }

        /**
         * 保存
         * @param  {Blob} blob
         * @param  {String} filename 想要保存的文件名称
         */
        function saveAs(blob, filename) {
            if (window.navigator.msSaveOrOpenBlob) {
                navigator.msSaveBlob(blob, filename);
            } else {
                var link = document.createElement('a');
                var body = document.querySelector('body');

                link.href = window.URL.createObjectURL(blob);
                link.download = filename;

                // fix Firefox
                link.style.display = 'none';
                body.appendChild(link);

                link.click();
                body.removeChild(link);

                window.URL.revokeObjectURL(link.href);
            };
        }

        getBlob(url, function(blob) {
            saveAs(blob, filename);
        });
    },
    cutString:function(str,len){
        var strlen = 0;
        var restr = "";
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 128) {
                strlen += 2;
            }
            else {
                strlen++;
            }
            restr += str.charAt(i);
            if (strlen >= len) {
                return restr;
            }
        }
        return restr;
    },
     compare(val) {
       return function (a, b) {
         var value1 = a[val];
         var value2 = b[val];
          return value2 - value1;
     }
  },
}