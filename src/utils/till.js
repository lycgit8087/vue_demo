

  function get_time(timestamp, format) {
        const formatNumber = n => {
            n = n.toString()
            return n[1] ? n : '0' + n
        }
    　　const formateArr = ['Y', 'M', 'D', 'h', 'm', 's'];
    　　let returnArr = [];
    　　let date = new Date(timestamp); //13位的时间戳,    如果不是13位的,  就要乘1000,就像这样 let date = new Date(timestamp*1000)
    　　let year = date.getFullYear()
    　　let month = date.getMonth() + 1
    　　let day = date.getDate()
    　　let hour = date.getHours()
    　　let minute = date.getMinutes()
    　　let second = date.getSeconds()
    　　returnArr.push(year, month, day, hour, minute, second);
    　　returnArr = returnArr.map(formatNumber);
    　　for (var i in returnArr) {
      　　format = format.replace(formateArr[i], returnArr[i]);
    }
    　　return format;
  }




module.exports = {
    get_time
  }