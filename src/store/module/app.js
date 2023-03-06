import {
  getHomeRoute,
  localRead,
  getMenuByToken,
  getNextRoute,
  routeEqual,
  getTagNavListFromLocalstorage,
  setTagNavListInLocalstorage,
  getRouteTitleHandled,
  routeHasExist
} from '@/libs/util';
import { getMenuApiBack, getPermissionApi } from '@/api/login';
import config from '@/config';
import router from '@/router';
const { homeName } = config;

const closePage = (state, route) => {
  const nextRoute = getNextRoute(state.tagNavList, route);
  state.tagNavList = state.tagNavList.filter(item => {
    return !routeEqual(item, route);
  });
  router.push(nextRoute);
};

export default {
  state: {
    homeRoute: {},
    local: localRead('local'),
    menuList: [],
    tagNavList: [],
    permissionList: [],
    tableHeight: document.documentElement.clientHeight - 350
  },
  getters: {},
  mutations: {
    setHomeRoute (state, routes) {
      state.homeRoute = getHomeRoute(routes, homeName);
    },
    setMenuList (state, menuList) {
      state.menuList = menuList;
    },
    setPermissionList (state, permissionList) {
      state.permissionList = permissionList;
    },
    addTag (state, { route, type = 'unshift' }) {
      let router = getRouteTitleHandled(route);
      if (!routeHasExist(state.tagNavList, router)) {
        if (type == 'push') state.tagNavList.push(router);
        else {
          if (router.name == homeName) state.tagNavList.unshift(router);
          else state.tagNavList.splice(1, 0, router);
        }
        setTagNavListInLocalstorage([...state.tagNavList]);
      }
    },
    setTagNavList (state, list) {
      let tagList = [];
      if (list) {
        tagList = [...list];
      } else tagList = getTagNavListFromLocalstorage() || [];
      // if (tagList[0] && tagList[0].name !== homeName) tagList.shift();
      let homeTagIndex = tagList.findIndex(item => item.name == homeName);
      if (homeTagIndex > 0) {
        let homeTag = tagList.splice(homeTagIndex, 1)[0];
        tagList.unshift(homeTag);
      }
      state.tagNavList = tagList;
      setTagNavListInLocalstorage([...tagList]);
    },
    closeTag (state, route) {
      let tag = state.tagNavList.filter(item => routeEqual(item, route));
      route = tag[0] ? tag[0] : null;
      if (!route) return;
      closePage(state, route);
    }
  },
  actions: {
    getMenuList ({ commit }) {
      return new Promise((resolve, reject) => {
        getMenuApiBack().then(res => {
          const data = res.data.data;
          commit('setMenuList', getMenuByToken(data));
          resolve(data);
        }).catch(err => {
          reject(err);
        });
      });
    },
    getPermissionList ({ commit }) {
      return new Promise((resolve, reject) => {
        getPermissionApi().then(res => {
          const data = res.data.data;
          commit('setPermissionList', data);
          resolve(res);
        }).catch(err => {
          reject(err);
        });
      });
    }
  }
};
