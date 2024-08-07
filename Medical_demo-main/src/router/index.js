import Vue from 'vue'
import VueRouter from 'vue-router'
import SideBar from '@/components/sideBar/index.vue'
import dash from '@/views/dash/index.vue'
import dataList from '@/views/data/index.vue'
import dataList4 from '@/views/data/dataManager4.vue'
import modelList from '@/views/model/list.vue'
import modelEdit from '@/views/model/edit.vue'
import modelUpload from '@/views/model/upload.vue'
import taskList from '@/views/task/list'
import taskManage4 from "@/views/task/TaskManage4.vue";
import mining from '@/views/mining/index.vue'
import diseaseResult from '@/views/mining/disease/result.vue'
import factorResult from '@/views/mining/factor/result.vue'
import diseaseFactorResult from '@/views/mining/diseaseFactor/result.vue'
import introduce from '@/views/introduce/index.vue'
import operation from '@/views/operation/operation.vue'
import DisFactor from '@/components/tab/DisFactor.vue'
import Login from "@/views/User/Login.vue"
import Register from "@/views/User/register.vue"
import diseaseManager  from "@/views/manageAll/diseaseManager.vue";
import userCenter from "@/views/User/userCenter.vue"
import updatePassword from "@/views/User/updatePassword.vue"
import logManager from "@/views/manageAll/logManager.vue"
import forget from "@/views/User/forget.vue"
import unauthorized from "@/views/404.vue"
import userManage from "@/views/manageAll/userManage.vue"
import inform from "@/views/manageAll/inform.vue"
import dataManageManager from "@/views/manageAll/AdminDataManage.vue"
import Muldisease from "@/views/manageAll/multi_disease_manage.vue"
import TaskResult from "@/components/tab/subcomponents/TaskResult.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: "/",
    name: "LogIn",
    component: Login,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: '/forget',
    name: 'forget',
    component: forget
  },
  {
    path: '/sideBar',
    name: 'SideBar',
    component: SideBar,
    meta: { roles: ['1', '0'] }, // 只允许管理员和普通用户访问
    children: [
      {
        path: '/dash',
        name: 'dash',
        component: dash,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/updatePassword",
        name: "updatePassword",
        component: updatePassword,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/userCenter",
        name: "userCenter",
        component: userCenter,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/logManager",
        name: "logManager",
        component: logManager,
        meta: { roles: ['0'] },
      },
      {
        path: 'DisFactor',
        name: 'DisFactor',
        component: DisFactor,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'introduce',
        name: 'introduce',
        component: introduce,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'operation',
        name: 'operation',
        component: operation,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'data/list',
        name: 'dataList',
        component: dataList,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'data/list4',
        name: 'dataList4',
        component: dataList4,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'model/list',
        name: 'modelList',
        component: modelList,
        meta: { roles: ['0'] },
      },
      {
        path: '/model/upload',
        name: 'modelUpload',
        component: modelUpload,
        meta: { roles: ['0'] },
      },
      {
        path: 'model/edit',
        name: 'modelEdit',
        component: modelEdit,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'task/list',
        name: 'tasklList',
        component: taskList,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'taskManager4',
        name: 'taskManager4',
        component: taskManage4,
        meta: { roles: ['1', '0'] },
      },
      {
        path: "/TaskResult",
        name: "TaskResult",
        component: TaskResult,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'mining',
        name: 'mining',
        component: mining,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'disease/result',
        name: 'diseaseResult',
        component: diseaseResult,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'factor/result',
        name: 'factorResult',
        component: factorResult,
        meta: { roles: ['1', '0'] },
      },
      {
        path: 'diseaseFactor/result',
        name: 'diseaseFactorResult',
        component: diseaseFactorResult,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/diseaseManager',
        name: 'diseaseManager',
        component: diseaseManager,
        meta: { roles: ['0'] },
      },
      {
        path:'/manage',
        redirect: '/userManage',
        name: 'manage',
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/userManage',
        name: 'userManage',
        component: userManage,
        meta: { roles: ['0'] },
      },
      {
        path: '/inform',
        name: 'inform',
        component: inform,
        meta: { roles: ['0'] },
      },
      {
        path: '/unauthorized',
        name: 'unauthorized',
        component: unauthorized,
        meta: { roles: ['1', '0'] },
      },
      {
        path: '/dataManageManager',
        name: 'dataManageManager',
        component: dataManageManager,
        meta: { roles: ['0'] },
      },
      {
        path: '/Muldisease',
        name: 'Muldisease',
        component: Muldisease,
        meta: { roles: ['0'] },
      },
    ],
  },
]
const whiteList = ['/logIn', '/register', '/unauthorized','/forget']

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  if (whiteList.indexOf(to.path) !== -1) {
    // 如果在白名单中，则直接放行
    next()
  } else {
    const userRoles = sessionStorage.getItem('userrole'); // 从sessionStorage获取用户角色信息
    let record = to.matched[to.matched.length - 1]
    let isAuthorized = false; // 初始化权限标志为false

    if (record.meta.roles) {
      // 检查用户角色是否在路由允许的角色列表中
      if (record.meta.roles.includes(userRoles)) {
        isAuthorized = true; // 如果找到匹配的角色，设置权限标志为true
      }
    }
    if (isAuthorized) {

      next(); // 用户有权限，允许访问
    } else if (to.matched.some(record => record.meta.roles)) {

      next({ path: '/unauthorized' }); // 用户无权限，重定向到未授权页面
    } else {

      next(); // 如果没有定义roles元数据，允许所有用户访问
    }
  }
});

export default router

