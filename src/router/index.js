import Vue from 'vue'
import Router from 'vue-router'
import Hello from '@/components/Hello'
import VideoPlayer from '@/components/VideoPlayer'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/video',
      name: 'Video',
      component: VideoPlayer
    }
  ]
})
