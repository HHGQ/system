import request from '@/utils/request'
import axios from 'axios'

export function getPoint(data) {
  return request({
    method: 'post',
    url: 'map/point',
    data
  })
}


const params = new URLSearchParams();
      params.append('param1', 'value1');
      params.append('param2', 'value2');
      // axios.post('/foo', params);
const controller = new AbortController();
axios.post('http://127.0.0.1:3000/users/ttt', {a:1,b:2}, {
    signal: controller.signal,
    params: {a:1},
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
}).then(res => {
  console.log(res, 'ttt')
}).catch(err => {
  console.log(axios.isCancel(err),'yyy') // true
});
  // function getUserAccount() {
//   return axios.get('http://127.0.0.1:3000/users/sss');
// }

// function getUserPermissions() {
//   return axios.head('http://127.0.0.1:3000/users/ttt', {
//     data: 'Country=Brasil&City',
//     params: {
//       a: 1
//     },
//   });
// }
// // 未用 axios.spread 只有一个参数
// Promise.all([getUserAccount(), getUserPermissions()])
//   .then(function (results) {
//     console.log(results, 'results')
//     const acct = results[0];
//     const perm = results[1];
//   })
//   .catch(err => {
//     console.log(err, 'err')
//   })
// // 用 axios.spread 有两个参数
// Promise.all([getUserAccount(), getUserPermissions()])
//   .then(axios.spread((acct, perms) => {
//     console.log(acct, perms, 'acct, perms')
//   }))