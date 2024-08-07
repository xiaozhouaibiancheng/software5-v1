<template>
  <div>
    <el-container class="con">
      <el-header class="header">
        <el-menu
          :default-active="activeIndex"
          background-color="#071135"
          text-color="#fff"
          active-text-color="#fff"
          class="el-menu-demo"
          mode="horizontal"
        >
          <span index="1" style="float: left; color: cornflowerblue">
            <i class="el-icon-box"></i>
            <span style="font-size: 20px"
              >多病种关联关系挖掘工具软件</span
            ></span>
          <!--            <template slot="title">当前服务器：</template>-->
          <el-menu-item index="2" style="float: right"
            ></el-menu-item
          >
          <el-dropdown index="3" style="float: right; color: #fff; font-size: 17px" @command="handleCommand">
            <span
            ><i class="el-icon-user"></i>欢迎您：{{LoginUserName}}<i class="el-icon-arrow-down el-icon--right"></i></span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/userCenter">个人中心</el-dropdown-item>
              <el-dropdown-item command="/updatePassword">修改密码</el-dropdown-item>
              <el-dropdown-item command="/">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-menu>
      </el-header>
      <el-container>
        <el-aside width="280px" class="side">
          <el-menu
              :default-active="activeMenu"
              router
              class="el-menu-vertical-demo"
              @open="handleOpen"
              background-color="#071135"
              text-color="#fff"
              active-text-color="#ffd04b"
              font-size="14px"
              :default-openeds="opends"

          >
            <template>
              <div v-for="item in visibleMenuItems" :key="item.name">
                <el-submenu
                    v-if="item.children && item.children.length"
                    :index="item.path"
                >
                  <template #title>
                    <i :class="item.icon"></i>
                    {{ item.name }}</template
                  >
                  <el-menu-item
                      v-for="subItem in item.children"
                      :key="subItem.name"
                      :index="subItem.path"
                  >
                    <i :class="subItem.icon"></i>
                    <router-link :to="subItem.path">{{
                        subItem.name
                      }}</router-link>
                  </el-menu-item>
                </el-submenu>
                <el-menu-item v-else :index="item.path">
                  <template #title>
                    <router-link :to="item.path">
                      <i :class="item.icon"></i>
                      {{ item.name }}</router-link
                    >
                  </template>
                </el-menu-item>
              </div>
            </template>
            <div class="menu-footer">
              <el-menu-item index="/sideBar/introduce"> 软件介绍</el-menu-item>
              <el-menu-item index="/sideBar/operation"> 操作手册</el-menu-item>
            </div>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <app-main></app-main>
        </el-main>
      </el-container>

      <el-footer>
        <h1>
          重庆邮电大学 大数据智能计算创新研发团队 @CopyRight 2020-2023 All
          Rights Reserved
        </h1>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
// import AppMain from "@/components/AppMain";
import AppMain from "@/components/AppMain.vue";
import {postRequest} from "@/utils/api";
import Muldisease from "@/views/manageAll/multi_disease_manage.vue";

export default {
  components: {AppMain},
  // components: { AppMain },
  mounted() {
    this.LoginUserName = sessionStorage.getItem("username");
  },
  data() {
    return {
      activeMenu: "/introduce",
      dialogVisible: false,
      activeIndex: "0",
      LoginUserName:'',
      opends:["/sideBar/task/list", "/sideBar/data/list", "/manage"],
      menuItems: [
        {
          name: "首页",
          path: "/dash",
          roles: ["0", "1"],
          icon: "el-icon-s-home",
        },
        {
          name: "数据管理",
          path: "/sideBar/data/list",
          roles: ["0","1"],
          icon: "el-icon-document-copy",
          children: [
            {
              name: "多病种任务数据管理",
              path: "/sideBar/data/list",
              roles: ["0","1"],
              icon: "el-icon-chat-line-square",
            },
            {
              name: "单病种任务数据管理",
              path: "/sideBar/data/list4",
              roles: ["0","1"],
              icon: "el-icon-document",
            }
          ]
        },
        {
          name: "任务管理",
          path: "/sideBar/task/list",
          roles: ["0", "1"],
          icon: "el-icon-folder-add",
          children:[
            {
              name: "多病种关联挖掘历史任务",
              path: "/sideBar/task/list",
              roles: ["0", "1"],
              icon: "el-icon-edit-outline",
            },
            {
              name: "疾病危险因素挖掘历史任务",
              path: "/sideBar/taskManager4",
              roles: ["0", "1"],
              icon: "el-icon-search",
            },
            {
              name: "多病种关联挖掘",
              path: "/sideBar/mining",
              roles: ["0", "1"],
              icon: "el-icon-s-data",
            },
            {
              name: "疾病危险因素挖掘",
              path: "/sideBar/DisFactor",
              roles: ["0", "1"],
              icon: "el-icon-share",
            },
          ]
        },
        {
          name: "系统管理",
          path: "/manage",
          roles: ["0"],
          icon:"el-icon-s-tools",
          children: [
            {
              name: "用户管理",
              path: "/userManage",
              roles: ["0"],
              icon: "el-icon-s-custom",
            },
            {
              name: "信息发布",
              path: "/inform",
              roles: ["0"],
              icon: "el-icon-s-comment",
            },
            {
              name: "系统数据管理",
              path: "/dataManageManager",
              roles: ["0"],
              icon: "el-icon-s-order",
            },
            {
              name: "多病种知识库管理",
              path: '/Muldisease',
              roles: ['0'],
              icon: "el-icon-folder-add"
            },
            {
              name: "算法管理",
              path: "/sideBar/model/list",
              roles: ["0"],
              icon: "el-icon-edit",
            },
            {
              name: "日志查看",
              path: "/logManager",
              roles: ["0"],
              icon: "el-icon-camera-solid",
            },
            {
              name: "病种设置",
              path: "/diseaseManager",
              roles: ["0"],
              icon: "el-icon-s-management",
            },
          ],
        },
      ],
      // describVision: false,
      // description1: "基于多任务学习的多病种疾病风险预测软件是一款医疗健康软件，通过调用相关算法，用户可以进行多种疾病（共病）的风险预测，可以帮助用户更好",
      // description2:"地管理自己的健康状况。本软件现有首页，健康咨询、单例预测和批量预测等功能，具体流程如此下图:"
    };
  },
  computed: {
    visibleMenuItems() {
      const userRoles = sessionStorage.getItem("userrole");
      return this.menuItems.filter((item) => {
        const hasRole = item.roles.some((role) => userRoles.includes(role));
        if (hasRole && item.children) {
          // Filter children based on user roles
          item.children = item.children.filter((child) =>
              child.roles.some((role) => userRoles.includes(role))
          );
        }
        return hasRole;
      });
    },
  },
  created() {
    this.setMenuHighlight();
  },
  methods: {
    handleSelect(key) {
      if (key == 2) {
        postRequest("/user/logout").then((resp) => {
          if (resp.code == "200") {
            this.$router.replace("/");
          }
        });
      }
    },
    handleOpen(key, keyPath) {
      console.log("=============")
      console.log(key, keyPath);
    },
    setMenuHighlight() {
      // 如果有直接跳转，比如从一个外部链接或直接输入URL访问
      this.activeMenu = this.$route.path;
    },
    handleCommand(command){
      this.$router.push(command);
    },
    logout(){
      sessionStorage.clear();
      this.$router.replace("/");
    }
  },
  watch: {
    // 监听路由变化来更新菜单高亮
    $route(newRoute) {
      this.activeMenu = newRoute.path;
    },
  },
};
</script>

<style scoped>
a {
  color: inherit; /* 继承父元素颜色或指定颜色 */
  text-decoration: none; /* 去除下划线 */
}
.el-icon-mobile-phone {
  color: white;
}
.el-menu-vertical-demo {
  /*解决侧边栏颜色无法撑起整个高度问题*/
  /*解决侧边栏凸起问题*/
  border-right: none;
  height: 100%;
  overflow: auto;
}

.header {
  background-color: #071135;
  text-align: center;
  line-height: 57px;
}

.side {
  background-color: #071135;
  /* color: #333; */
  height: calc(100vh - 81px);
}

.main {
  height: calc(100vh - 81px);
}
.menu-footer {
  //position: absolute;
  //bottom: 0;
  margin-left: 40px;
}
.el-footer {
  height: 20px !important;
  font-size: 10px;
  background-color: #8e909794;
  color: #252525;
  display: flex;
  justify-content: center;
  align-items: center;
}
/* .el-main {
    display: block;
    flex: 1;
    flex-basis: auto;
    box-sizing: border-box;
} */

.el-main {
  display: block;
  flex: 1;
  flex-basis: auto;
  box-sizing: border-box;
}
</style>
