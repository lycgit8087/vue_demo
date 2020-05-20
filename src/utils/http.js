import axios from 'axios';
import { Message, Loading } from 'element-ui'
import Cookies from 'js-cookie'
import qs from 'qs'

let loadingInstance = null
const hash = require("./hmac-sha256")
console.log(process.env.NODE_ENV,process.env.API_UR)


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

// 获取token方法
export function get_token(url,params={}){
  let {timestamp,hashInBase64,apiaction,appid}=get_msg("token_get")
    return new Promise((resolve,reject) => {
        axios.post(url, params, { 
        headers: { 
        "timestamp" : timestamp,
        "appid" : appid,
        "signature" : hashInBase64,
        "action" : apiaction,
        "module" : "" 
      } 
    }
    ).then((response) => {
        Cookies.set("token",response.data.token)

        resolve(response.data);
    
    }).catch(err => {
        reject(err)
      });  
    })
  }

//http request 拦截器


axios.interceptors.request.use(
  config => {

    loadingInstance = Loading.service({
      lock: true,
      text: 'loading...'
    })
     const token = Cookies.get("token");//注意使用的时候需要引入cookie方法，推荐js-cookie
    console.log(config)
    config.baseURL = ''
    config.withCredentials = true // 允许携带token ,这个是解决跨域产生的相关问题
    config.timeout = 6000  //超时时间
    config.data = qs.stringify(config.data);
    if(config.headers.action!="token_get"){
    let {timestamp,hashInBase64,apiaction,appid}=get_msg(config.headers.action)

        //设置请求头
    config.headers = {
        'Content-Type':'application/x-www-form-urlencoded',
        "action":apiaction,
      }
    }
    
    // if(token){
    //   config.params = {'token':token}
    // }
    console.log(config)
    return config;
  },
  error => {
    return Promise.reject(err);
  }
);


//http response 拦截器
axios.interceptors.response.use(
  response => {
      console.log(response)
      loadingInstance.close()

      if(response.data.response_code==-1){
        
        Message({
          message: response.data.response_msg,
          type: 'error',
          duration: 3 * 1000
        })
      }

      

      // loadingInstance.close()

    // if(response.data.errCode ==2){
    //   router.push({
    //     path:"/login",
    //     query:{redirect:router.currentRoute.fullPath}//从哪个页面跳转
    //   })
    // }
    return response;
  },
  error => {
    console.log(error)
    // const msg = error.Message !== undefined ? error.Message : ''
  
  loadingInstance.close()
    return Promise.reject(error)
  }
)




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