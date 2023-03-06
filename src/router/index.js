import Vue from "vue";
import Router from "vue-router";
import routes from "./routers";
import store from "@/store";
import iView from "iview";
import { setToken, getToken, canTurnTo, setTitle } from "@/libs/util";
import config from "@/config";
const { homeName } = config;

// Vue-Router的教程 详见 https://router.vuejs.org/zh/
// 1.将Router挂载到Vue的实例上
Vue.use(Router);
// 2.实例化Router对象，并使用History模式（还有一种模式为Hash模式）
const router = new Router({
  routes,
  mode: "history",
});
const LOGIN_PAGE_NAME = "login";

// 3.对权限进行控制的函数
const turnTo = (to, next) => {
  if (canTurnTo(to.name, routes)) next(); // 有权限，可访问
  else next({ replace: true, name: "error_401" }); // 无权限，重定向到401页面
};

// 4.每当路由发生跳转时的进行的全局操作 主要是通过token判断用户状态进行跳转
// https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E5%85%A8%E5%B1%80%E5%89%8D%E7%BD%AE%E5%AE%88%E5%8D%AB
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start();
  const token = getToken();
  if (!token && to.name !== LOGIN_PAGE_NAME) {
    // 未登录且要跳转的页面不是登录页
    next({
      name: LOGIN_PAGE_NAME, // 跳转到登录页
    });
  } else if (!token && to.name == LOGIN_PAGE_NAME) {
    // 未登陆且要跳转的页面是登录页
    next(); // 跳转
  } else if (token && to.name == LOGIN_PAGE_NAME) {
    // 已登录且要跳转的页面是登录页
    setToken("");
    next({
      name: to.name, // 跳转到login页
    });
  } else {
    if (store.state.user.hasGetInfo) {
      turnTo(to, next);
    } else {
      store
        .dispatch("getUserInfo")
        .then(() => {
          turnTo(to, next);
        })
        .catch(() => {
          setToken("");
          next({
            name: "login",
          });
        });
    }
  }
});

// 全局后置的路由守卫 主要是设置页面的title 关闭loading的动画 将页面滚至最上方
router.afterEach((to) => {
  setTitle(to, router.app);
  iView.LoadingBar.finish();
  window.scrollTo(0, 0);
});

export default router;
