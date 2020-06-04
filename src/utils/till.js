 

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

  function change_file_url(url){
    if(url.length==0) return url
    if (url.indexOf("files/") != -1) {
      return 'https://sc.imofang.cn/' + url
    } else {
      return "https://files.imofang.cn" + url
    }

  }
  function htmlspecialchars_decode(str) {
    if (str.length == 0) return str;
    str = str.replace(/&amp;/g, "&");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&quot;/g, "'");
    str = str.replace(/&#039;/g, "'");
    str=str.replace(/\<p>&nbsp;<\/p>/gi,"") 
    str = str.replace(/&amp;nbsp;/g, " ");

    str = str.replace(/{br}/g, "<br>");
      str=str.replace(/font-size: \w+;?/g,' ')
    str = str.replace(
      /\<p/gi,
      '<p class="p_class" style="margin-bottom:10px" '
    );
    str = str.replace(/\<span/gi, '<span class="span_class" ');

    
    if (str.indexOf("src='/files") != -1) {
        str = str.replace(/src='/g, `src='https://sc.imofang.cn`)
    } else {
      str = str.replace(/src='/g, `src='https://files.imofang.cn`);
    }
    str = str.replace(/\<img/gi, '<img style="max-width:100%;height:auto" ');
    return str;
  }


  function formatSeconds(value) {
    let result = parseInt(value);
    let h =
      Math.floor(result / 3600) < 10
        ? "0" + Math.floor(result / 3600)
        : Math.floor(result / 3600);
    let m =
      Math.floor((result / 60) % 60) < 10
        ? "0" + Math.floor((result / 60) % 60)
        : Math.floor((result / 60) % 60);
    let s =
      Math.floor(result % 60) < 10
        ? "0" + Math.floor(result % 60)
        : Math.floor(result % 60);
        h=h=="00"?"":h+"时"
        m=m=="00"?"":m+"分"

    result = `${h}${m}${s}秒`;
    return result;
  }

  // 
  function user_local(page,id){
    let user_local_data=localStorage.getItem("user_local")
    user_local_data=JSON.parse(user_local_data)
    let num =user_local_data.page_data.findIndex(item=>item.id==id&&item.page==page)
    if(num!=-1){
      return true
    }else{
      return false
    }
  }
  function set_local(page,id,data){
    let user_local_data=localStorage.getItem("user_local")
    user_local_data=JSON.parse(user_local_data)
    let num =user_local_data.page_data.findIndex(item=>item.id==id)
    if(num==-1){
      user_local_data.page_data.push({
        id:id,
        page:page,
        data:data
      })
    }else{
      user_local_data.page_data[num].data=data
    }
    return user_local_data
  }

  function get_local(page,id){
    let user_local_data=localStorage.getItem("user_local")
    user_local_data=JSON.parse(user_local_data)
    let num =user_local_data.page_data.findIndex(item=>item.id==id&&item.page==page)
      if(num!=-1){
        return user_local_data.page_data[num].data
      }
  }




module.exports = {
    get_time,
    change_file_url,
    htmlspecialchars_decode,
    formatSeconds,
    user_local,
    set_local,
    get_local
  }