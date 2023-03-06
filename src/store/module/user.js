import { login, getLoginInfo } from "@/api/login";
import { setToken, getToken } from "@/libs/util";
import { Message } from "iview";

export default {
  state: {
    accountName: "",
    userName: "",
    userId: "",
    avatorImgPath: "./public/favicon.ico",
    token: getToken(),
    hasGetInfo: false,
    theme: "blackTheme",
  },
  mutations: {
    setAvator(state, avatorPath) {
      state.avatorImgPath = avatorPath;
    },
    setUserId(state, id) {
      state.userId = id;
    },
    setAccountName(state, name) {
      state.accountName = name;
    },
    setUserName(state, name) {
      state.userName = name;
    },
    setToken(state, token) {
      state.token = token;
      setToken(token);
    },
    setHasGetInfo(state, status) {
      state.hasGetInfo = status;
    },
    changeTheme(state, theme) {
      state.theme = theme;
    },
  },
  getters: {},
  actions: {
    // 登录
    handleLogin({ commit }, { accountName, password }) {
      accountName = accountName.trim();
      return new Promise((resolve, reject) => {
        login({
          accountName,
          password,
        })
          .then((res) => {
            const data = res.data.data;
            if (data !== null && res.data.state.code == "200") {
              commit("setToken", data.token);
              resolve(res);
            }
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    // 退出登录
    handleLogOut({ state, commit }) {
      return new Promise((resolve, reject) => {
        commit("setToken", "");
        commit("setAvator", "");
        commit("setAccountName", "");
        commit("setUserName", "");
        commit("setUserId", "");
        commit("setHasGetInfo", false);
        commit("changeTheme", "");
        resolve();
      });
    },
    // 获取用户相关信息
    getUserInfo({ state, commit }) {
      return new Promise((resolve, reject) => {
        try {
          getLoginInfo()
            .then((res) => {
              const data = res.data;
              if (data.state.code !== 200) {
                handleLogOut({ state, commit });
                Message.error({
                  content: "由于您长时间未进行操作,请重新登录",
                  duration: 2,
                });
              } else {
                commit("setAvator", data.data.avator);
                commit("setAccountName", data.data.accountName);
                commit("setUserName", data.data.userName);
                commit("setUserId", data.data.id);
                commit("setHasGetInfo", true);
                commit("changeTheme", data.data.theme);
              }
              resolve(data);
            })
            .catch((err) => {
              reject(err);
            });
        } catch (error) {
          reject(error);
        }
      });
    },
  },
};
