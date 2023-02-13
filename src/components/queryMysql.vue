<template>
  <div>
    <button @click="getStudent">更新</button>
    <button @click="getHead">发送head请求</button>
    <button @click="sendForm">发送表单数据</button>
    <div>学生</div>
    <div v-for="item in studentData" :key="item.id">
      <p>姓名:{{ item.name }}，喜欢的颜色:{{ item.favoriteColor }}，年龄:{{ item.age }}</p>
    </div>
    <div>教师</div>
    <div v-for="item in teacherData" :key="`tea_${item.id}`">
      <p>姓:{{ item.firstName }}，明:{{ item.lastName }}</p>
    </div>
  </div>
</template>

<script>
import { queryUser, queryUserHead } from '@/api/user.js'
import axios from 'axios'
let ajax = axios.create({
  timeout: 10000
})
export default {
  data() {
    return {
      studentData: [],
      teacherData: []
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    sendForm() {
      // let data = new URLSearchParams()
      let data = new FormData()
      data.append('a', 1)
      data.append('b', 2)
      ajax.post('http://127.0.0.1:3000/users/form', data, {
        headers: {
          // 'Content-Type': 'application/x-www-form-urlencoded'
          // 'Content-Type': 'multipart/form-data'
        },
        // proxy: {
        //   protocol: 'http',
        //   host: '127.0.0.1',
        //   port: 3000,
        //   // auth: {
        //   //   username: 'mikeymike',
        //   //   password: 'rapunz3l'
        //   // }
        // },
      })
    },
    init() {
      axios.all([this.getStudent(), this.getTeacher()])
      // .then((acct, perms) => {
      //   console.log(acct)
      //   console.log(perms)
      // });
    },
    getStudent() {
      queryUser()
        .then(data => {
          this.studentData = data
        }).catch(err => {
          console.log(err)
        })
    },
    getTeacher() {
      const controller = new AbortController();
      const CancelToken = axios.CancelToken;
      const source = CancelToken.source();

      ajax.request({
        url: 'http://127.0.0.1:3000/users/queryUsers',
        signal: controller.signal,
        cancelToken: source.token
      }).then((res) => {
        console.log(res)
        this.teacherData = res.data
      }).catch(err => {
        console.log(err)
        if (axios.isCancel(err)) {
          console.log('cancel')
        } else {
          console.log(err.toJSON(), 1)
        }
      })
      // source.cancel('Operation canceled by the user.');
      // console.log(controller)
      // controller.abort()
    },
    getHead() {
      queryUserHead().then((res) => {
        console.log(res)
      })
    }
  }
}
</script>