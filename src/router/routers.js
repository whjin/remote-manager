import bgMainBack from "@/view/bgMainBack";
import bgMain from "@/view/bgMain";

export default [
  {
    path: "/login",
    name: "login",
    meta: {
      title: "Login - 登录",
      hideInMenu: true,
    },
    component: () => import("@/view/login/login.vue"),
  },
  {
    path: "/choosePlatform",
    name: "choosePlatform",
    meta: {
      title: "选择平台",
      hideInMenu: true,
    },
    component: () => import("@/view/choosePlatform/choosePlatform"),
  },
  {
    path: "/background",
    name: "_department",
    redirect: "/background/department",
    component: bgMainBack,
    meta: {
      hideInMenu: true,
      notCache: true,
    },
    children: [
      {
        path: "user",
        name: "user",
        meta: {
          hideInMenu: true,
          title: "用户管理",
          notCache: true,
          icon: "ios-contacts-outline",
        },
        component: () => import("@/view/single-page/bg-manage/user"),
      },
      {
        path: "department",
        name: "department",
        meta: {
          icon: "ios-construct-outline",
          title: "部门管理",
        },
        component: () => import("@/view/single-page/bg-manage/department"),
      },
      {
        path: "station",
        name: "station",
        meta: {
          icon: "ios-stats-outline",
          title: "岗位管理",
        },
        component: () => import("@/view/single-page/bg-manage/station"),
      },
      {
        path: "role",
        name: "role",
        meta: {
          icon: "ios-cog-outline",
          title: "角色管理",
        },
        component: () => import("@/view/single-page/bg-manage/role"),
      },
      {
        path: "menu",
        name: "menu",
        meta: {
          icon: "ios-cog-outline",
          title: "系统菜单管理",
        },
        component: () => import("@/view/single-page/bg-manage/menu"),
      },
      {
        path: "dictionary",
        name: "dictionary",
        meta: {
          icon: "ios-cog-outline",
          title: "数据字典",
        },
        component: () => import("@/view/single-page/bg-manage/dictionary"),
      },
      {
        path: "system",
        name: "system",
        meta: {
          icon: "ios-cog-outline",
          title: "新增子系统",
        },
        component: () => import("@/view/single-page/bg-manage/system"),
      },
      {
        path: "log",
        name: "log",
        meta: {
          icon: "ios-cog-outline",
          title: "操作日志",
        },
        component: () => import("@/view/single-page/bg-manage/log"),
      },
      {
        path: "runlog",
        name: "runlog",
        meta: {
          icon: "ios-cog-outline",
          title: "运行日志",
        },
        component: () => import("@/view/single-page/bg-manage/runlog"),
      },
    ],
  },
  {
    path: "/",
    name: "_audit",
    redirect: "/home",
    component: bgMain,
    meta: {
      hideInMenu: true,
      notCache: true,
    },
    children: [
      {
        path: "/home",
        name: "home",
        meta: {
          hideInMenu: true,
          title: "首页",
        },
        component: () => import("@/view/home"),
      },
      {
        path: "/case",
        name: "case",
        meta: {
          hideInMenu: true,
          title: "案件管理",
        },
        component: () => import("@/view/caseManage"),
      },
      {
        path: "/appointment",
        name: "appointment",
        meta: {
          hideInMenu: true,
          title: "预约申请",
        },
        component: () => import("@/view/appointment"),
      },
      {
        path: "/manage",
        name: "manage",
        meta: {
          hideInMenu: true,
          title: "提讯管理",
        },
        component: () => import("@/view/inquiryManage"),
      },
      {
        path: "/audit",
        name: "audit",
        meta: {
          hideInMenu: true,
          title: "提讯审批",
        },
        component: () => import("@/view/inquiryAudit"),
      },
      {
        path: "/room",
        name: "room",
        meta: {
          hideInMenu: true,
          title: "提讯室管理",
        },
        component: () => import("@/view/roomManage"),
      },
      {
        path: "/statistics",
        name: "statistics",
        meta: {
          hideInMenu: true,
          title: "统计分析",
        },
        component: () => import("@/view/statistics"),
      },
      {
        path: "/dataSync",
        name: "dataSync",
        meta: {
          hideInMenu: true,
          title: "数据订阅",
        },
        component: () => import("@/view/dataSync"),
      },
      {
        path: "/query",
        name: "query",
        meta: {
          hideInMenu: true,
          title: "提讯查询",
        },
        component: () => import("@/view/inquiryQuery"),
      },
    ],
  },
  {
    path: "/401",
    name: "error_401",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/view/error-page/401.vue"),
  },
  {
    path: "/500",
    name: "error_500",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/view/error-page/500.vue"),
  },
  {
    path: "*",
    name: "error_404",
    meta: {
      hideInMenu: true,
    },
    component: () => import("@/view/error-page/404.vue"),
  },
];
