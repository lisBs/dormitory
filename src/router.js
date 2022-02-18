import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Building from './views/DormitoryBuilding.vue'
import Dormitory from './views/Dormitory.vue'
import Repairlist from './views/RepairList.vue'
import Studentrepairlist from './views/StudentRepairList.vue'
import StudentRepair from './views/StudentRepair.vue'
import Visitors from './views/Visitors.vue'
import Console from './views/Console.vue'
import Users from './views/Users.vue'
import Outleave from './views/Outleave.vue'
import Profile from './views/Profile.vue'
import Updatepwd from './views/Updatepwd.vue'
import Intoleave from './views/Intoleave.vue'
import Student from './views/Student.vue'
import Echarts from './views/Echarts.vue'
import Login from './views/Login.vue'
import NotFound from './views/NotFound.vue'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
      path: '/',
      component: Index,
      children: [
        // {
        //   path:"/setting",
        //   component: Setting,
        //   children:[
        //     {
        //       path: 'profile',
        //       component: Profile
        //     },
        //     {
        //       path: 'updatepwd',
        //       name: 'updatepwd',
        //       component: Updatepwd
        //     },
        //   ]
        // },
        {
          path: '/visitors',
          name: 'visitors',
          component: Visitors
        },
        
        {
          path: '/dormitory',
          name: 'dormitory',
          component: Dormitory
        },
        {
          path: '/dormitorybuilding',
          name: 'dormitorybuilding',
          component: Building
        },
        {
          path: '/repairlist',
          name: 'repairlist',
          component: Repairlist
        },
        {
          path: '/studentrepairlist',
          name: 'studentrepairlist',
          component: Studentrepairlist
        },
        {
          path: '/studentrepair',
          name: 'studentrepair',
          component: StudentRepair
        },
        {
          path: '/profile',
          name: 'profile',
          component: Profile
        },
        {
          path: '/updatepwd',
          name: 'updatepwd',
          component: Updatepwd
        },
        {
          path: '/console',
          name: 'console',
          component: Console
        },
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/student',
          name: 'student',
          component: Student
        },
        {
          path: '/intoleave',
          name: 'intoleave',
          component: Intoleave
        },
        {
          path: '/outleave',
          name: 'outleave',
          component: Outleave
        },
        {
          path: '/echarts',
          name: 'echarts',
          component: Echarts
        },
        {
          path: '/404',
          component: NotFound
        }
      ]
    },
    {
      path: '*',
      redirect: { path: '/404' }
    }
  ]
})

// 全局路由守卫
router.beforeEach((to, from, next) => {
  const LOGINURL = '/login'
  let url, user

  url = to.path
  user = sessionStorage.getItem('user')

  if (url === LOGINURL) {
    sessionStorage.removeItem('user')
  }

  // 判断是否登录
  if (!user && url !== LOGINURL) {
    next({ path: LOGINURL })
  } else {
    next()
  }
})

export default router
