import axios from "@/libs/api.request";
import md5 from "js-md5";

export const login = ({ accountName, password }) => {
  password = md5(password);
  return axios.request({
    url: "/sysmgr/login",
    data: {
      accountName,
      password,
    },
    method: "post",
  });
};

export const getLoginInfo = () => {
  return axios.request({
    url: "/sysmgr/sysUser/info",
    method: "post",
  });
};

export const getMenuApiBack = () => {
  return axios.request({
    url: "/sysmgr/sysMenuInfo/findMenuByRouteName",
    method: "get",
    params: {
      // 通过路由的唯一名称获取到appCode再获取菜单
      routeName: "menu",
    },
  });
};
export const getMenuApi = () => {
  return axios.request({
    url: "/sysmgr/sysMenuInfo/findApp",
    method: "get",
    params: {
      // 通过路由的唯一名称获取到appCode再获取菜单
      routeName: "menu",
    },
  });
};

export const getPermissionApi = () => {
  return axios.request({
    url: "/sysmgr/sysMenuInfo/findButtonByRouteName",
    method: "get",
    // 通过路由的唯一名称获取到appCode再获取菜单
    params: {
      routeName: "menu",
    },
  });
};

export const getDictionaryListByCode = (code) => {
  return axios.request({
    url: "/sysmgr/sysDictionaryField/findByTypeCode",
    method: "post",
    data: {
      data: {
        EQ_typeCode: code,
      },
    },
  });
};

// 登陆微达安的系统 拿到微达安CAS的TGC和SESSION
export const loginWeiDaAn = (accountName, passWord) => {
  if (accountName == "admin") {
    accountName = "016750";
    passWord = "lzs016750";
  }
  return axios.request({
    url: "/detentionHouse/detentionHouse/loginCas",
    method: "get",
    params: {
      username: accountName,
      password: passWord,
    },
  });
};

export const getModuleApi = () => {
  return axios.request({
    url: "/sysmgr/sysMenuInfo/findApp",
    method: "get",
  });
};

// 获取授权
export const getLicense = () => {
  return axios.request({
    url: "/sysmgr/sysLicense/getLicense",
    method: "post",
    data: {
      softwareName: "GKsoftMeetV3",
    },
  });
};

// 导入授权
export const saveLicense = (params) => {
  return axios.request({
    url: "/sysmgr/sysLicense/saveLicense",
    method: "post",
    data: params,
  });
};
