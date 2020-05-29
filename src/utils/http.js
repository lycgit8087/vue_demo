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
    if(config.headers.action!="token_get"&&requestCount === 0){
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
    config.timeout = 10000  //超时时间
    config.data = qs.stringify(config.data);
    if(config.headers.action.indexOf("token")==-1){
      //设置请求头
    config.headers = {
        'Content-Type':'application/x-www-form-urlencoded',
        "action":config.headers.action,
        "token":token
      }
    }else{

      config.headers = {
        'Content-Type':'application/x-www-form-urlencoded',
        "action":config.headers.action,
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
      loadingInstance.close()
      clearTimeout(timer)
    }
  })
}


//http response 拦截器
axios.interceptors.response.use(
  response => {
      // console.log(response)
      let {config}=response
      tryHideLoading()
      if(response.data.response_code==-1){
        let errmessage = response.data.response_msg.toLowerCase()
        if(errmessage.indexOf("token")!=-1){
          // Cookies.set("token","")
          get_new_token(config);
          return
        }else{
          Message({
            message: response.data.response_msg,
            type: 'error',
            duration: 3 * 1000
          })
        }
       
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
 async function get_new_token(config){
  return new Promise((resolve,reject) => {
    axios.post(config.url, config.data, { 
    headers: { 
    "action" : "token_update",
  } 
}
).then((response) => {
  if(response.data.response_code==0){
    // axios(config);
    Cookies.set("token",response.data.token)
    resolve(response.data);  

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
      Cookies.set("token",response.data.token)
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
  // console.log(response)
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