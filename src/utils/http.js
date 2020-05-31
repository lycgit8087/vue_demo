import axios from 'axios';
import { Message, Loading } from 'element-ui'
import Cookies from 'js-cookie'
import qs from 'qs'
let requestCount = 0;
let loadingInstance = null
let timer;
const hash = require("./hmac-sha256")
const root = process.env.API_ROOT;
axios.defaults.retry = 4;
axios.defaults.retryDelay = 1000;

//http request 拦截器
axios.interceptors.request.use(
  config => {
    if(config.headers.action!="token_get"&&requestCount === 0&&config.headers.action!="qrcode_get"){
      loadingInstance = Loading.service({
        text: 'loading...',
        background:"rgba(255, 255, 255, 0.1)"
        
      })
    }
    requestCount++
    const token = Cookies.get("token");//注意使用的时候需要引入cookie方法，推荐js-cookie
    config.baseURL = ''
    config.url = root + config.url;
    config.withCredentials = true // 允许携带token ,这个是解决跨域产生的相关问题
    config.timeout = 15000  //超时时间
    config.data = qs.stringify(config.data);

    if(config.headers.action.indexOf("token")==-1){
      //设置请求头
    config.headers = {
        'Content-Type':'application/x-www-form-urlencoded',
        "action":config.headers.action,
        "token":token
      }
    }else{
      if(config.headers.action =="token_update"){
        config.headers = {
          'Content-Type':'application/x-www-form-urlencoded',
          "action":"token_update",
          "token":token

        }
      }else{
        config.headers = {
          'Content-Type':'application/x-www-form-urlencoded',
          "action":config.headers.action,
        }
      }

     
    }
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);

function tryHideLoading() {
  requestCount-- 
  //采用setTimeout是为了解决一个请求结束后紧接着有另一请求发起导致loading闪烁的问题
  timer = setTimeout(() => {    
    if (requestCount === 0) {
      if(loadingInstance){
        loadingInstance.close()
        clearTimeout(timer)
      }
     
    }
  })
}


//http response 拦截器
axios.interceptors.response.use(
  response => {
      let {config}=response
      tryHideLoading()
      const token_time = parseInt(Cookies.get("token_time")) ;
      let now_time=Date.parse(new Date())
      console.log(((token_time-now_time)/60000))
      let is_get_token=((token_time-now_time)/60000)>10
      if(!is_get_token&&token_time){
          get_new_token(config);
      }
      if(response.data.response_code==-1){
        let errmessage = response.data.response_msg.toLowerCase()
       
          Message({
            message: errmessage,
            type: 'error',
            offset: 380,
            duration: 3 * 1000
          })
      
       
      }
    // if(response.data.errCode ==2){
    //   router.push({
    //     path:"/login",
    //     query:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
    //   })
    // }
    return response;
  },
  error => {
    // console.log(error)
    // const msg = error.Message !== undefined ? error.Message : ''
    tryHideLoading()
    return Promise.reject(error)
  }
)


// 获取信息
function get_msg(apiaction){
  let appid = "7540d5fee7d947b8",
      ApiKey = "86101569218e47c49b26ae4c9b141b6b",
      moudle_name = apiaction == "token_get" ? '' : 'smartcube'
  let timestamp = Date.parse(new Date());
      timestamp = timestamp/1000;
  let hashfist = hash.CryptoJS.HmacSHA256(timestamp + appid +moudle_name+ apiaction, ApiKey)
  let hashInBase64 = hash.CryptoJS.enc.Base64.stringify(hashfist);
  
  let obj = {
    hashInBase64,
    timestamp,
    appid,
    apiaction
  }
  return obj
}

// 获取新token
export async function get_new_token(config){
  
  const token = Cookies.get("token");
  return new Promise((resolve,reject) => {
    axios.post("/?c=api", {}, { 
    headers: { 
    "action" : "token_update",
    token:token

  } 
}
).then((response) => {
  if(response.data.response_code==0){
    if(response.data.token){
    let token_time= Date.parse(response.data.token_expires)
    Cookies.set("token_time",token_time)
    Cookies.set("token",response.data.token)
    axios(config);
    }else{
    resolve(response.data);  

    }
  }else{
    reject(response)
  }
}).catch(err => {
    reject(err)
  });  
})
}

// 获取token
export function get_token(url,params={}){
  return new Promise((resolve,reject) => {
      axios.post(url, params, { 
      headers: { 
      "action" : "token_get",
    } 
  }
  ).then((response) => {
    if(response.data.response_code==0){
      if(response.data.token){
      let token_time= Date.parse(response.data.token_expires)
      
      Cookies.set("token_time",token_time)

      Cookies.set("token",response.data.token)

      }
      resolve(response.data);

    }else{
      reject(response)
    }
  }).catch(err => {
      reject(err)
    });  
  })
}



/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function fetch(url,params={}){
  return new Promise((resolve,reject) => {
    axios.get(url,{
      params:params
    })
    .then(response => {
      resolve(response.data);
    })
    .catch(err => {
      reject(err)
    })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

 export function post(apiaction,url,data){
  return new Promise((resolve,reject) => {
    axios.post(url, data, { headers: {
    "action":apiaction, } }
).then((response) => {
    resolve(response.data);

}).catch(err => {
    reject(err)
  });  
})
 }

 /**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.patch(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}

 /**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url,data = {}){
  return new Promise((resolve,reject) => {
    axios.put(url,data)
         .then(response => {
           resolve(response.data);
         },err => {
           reject(err)
         })
  })
}