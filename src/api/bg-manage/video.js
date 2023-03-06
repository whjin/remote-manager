/**
 * @description 插件对象1
 */
export let oWebControl = null;
/**
 * @description 初始化加载次数
 */
export let initCount = 0;
/**
 * @description RSA公钥
 */
export let pubKey = '';

/**
 * @description 初始化视频web插件
 * @param params  插件初始化参数 （详细见initParams方法下的paramsOptions）【必填】
 * @param playWndId div窗口标识Id【必填】
 * @param width 视频播放窗口初始宽度【选填】
 * @param height 视频播放窗口初始高度【选填】
 * @param callback 回调函数【选填】
 */
export const initPlugin = (params, playWndId, width = 700, height = 400, callback = () => {}) => {
  let pluginParams = initParams(params);
  oWebControl = new WebControl({
    szPluginContainer: playWndId,
    iServicePortStart: 15900,
    iServicePortEnd: 15909,
    cbConnectSuccess: function () {
      // 设置窗口控制回调
      oWebControl.JS_SetWindowControlCallback({
        cbIntegrationCallBack: callback
      });

      oWebControl.JS_StartService('window', {
        dllPath: './VideoPluginConnect.dll'
      }).then(function () {
        oWebControl.JS_CreateWnd(playWndId, width, height).then(function () {
          loadPlugin(pluginParams);
        });
      }, function () {

      });
    },
    cbConnectError: function () {
      oWebControl = null;
      WebControl.JS_WakeUp('VideoWebPlugin://');
      initCount++;
      if (initCount < 2) {
        setTimeout(function () {
          initPlugin(params, playWndId, width, height, callback);
        }, 2000);
      } 
    },
    cbConnectClose: function () {
      oWebControl = null;
    }
  });
};

/**
 * @description 获取当前initCount
 */
export const hasPlugin = () => {
  return initCount < 2;
};

/**
 * @description 开始视频预览
 * @param cameraIndexCode 监控点编号【必填】
 * @param wndId 预览模式(-1为空闲窗口预览，0为选中窗口预览，1及以上为指定窗口预览)【选填】
 * @param streamMode 主子码流标识(0为主码流，1为子码流)【选填】
 * @param transMode 传输协议(0为UDP，1为TCP)【选填】
 * @param gpuMode 是否启用GPU硬解(0为不启用，1为启用)【选填】
 */
export const startPreview = (cameraIndexCode, wndId = -1, streamMode = 0, transMode = 1, gpuMode = 0) => {
  cameraIndexCode = replaceParam(cameraIndexCode);

  if (!cameraIndexCode) {
    console.log('监控点编号不能为空！');
    return;
  }
  oWebControl.JS_RequestInterface({
    funcName: 'startPreview',
    argument: JSON.stringify({
      cameraIndexCode: cameraIndexCode,
      streamMode: streamMode,
      transMode: transMode,
      gpuMode: gpuMode,
      wndId: wndId
    })
  }).then(function (oData) {
    console.log(JSON.stringify(oData ? oData.responseMsg : ''));
  });
};

/**
 * @description 开始视频回放
 * @param cameraIndexCode 监控点编号【必填】
 * @param startTimeStamp 录像查询开始时间戳，单位：秒
 * @param endTimeStamp 录像查询结束时间戳，单位：秒
 * @param wndId 预览模式(-1为选中窗口预览，0为空闲窗口预览，1及以上为指定窗口预览)【选填】
 * @param recordLocation 录像存储类型（0为中心存储，1为设备存储）【选填】
 * @param transMode 传输协议(0为UDP，1为TCP)【选填】
 * @param gpuMode 是否启用GPU硬解(0为不启用，1为启用)【选填】
 */
export const startPlayback = (cameraIndexCode, startTimeStamp, endTimeStamp, wndId = -1, recordLocation = 0, transMode = 1, gpuMode = 0) => {
  cameraIndexCode = replaceParam(cameraIndexCode);

  if (!cameraIndexCode) {
    console.log('监控点编号不能为空！');
    return;
  }

  if (!Number.isNaN) {
    Number.isNaN = function (n) {
      return (
        typeof n === 'number' &&
        window.isNaN(n)
      );
    };
  }
  if (Number.isNaN(+startTimeStamp) || Number.isNaN(+endTimeStamp)) {
    console.log('时间格式有误！');
    return;
  }
  oWebControl.JS_RequestInterface({
    funcName: 'startPlayback',
    argument: JSON.stringify({
      cameraIndexCode: cameraIndexCode,
      startTimeStamp: startTimeStamp,
      endTimeStamp: endTimeStamp,
      recordLocation: recordLocation,
      transMode: transMode,
      gpuMode: gpuMode,
      wndId: wndId
    })
  }).then(function (oData) {
    console.log(JSON.stringify(oData ? oData.responseMsg : ''));
  });
};

/**
 * @description 停止所有实时视频预览
 */
export const stopAllPreview = () => {
  oWebControl.JS_RequestInterface({
    funcName: 'stopAllPreview'
  }).then(function (oData) {
    console.log(JSON.stringify(oData ? oData.responseMsg : ''));
  });
};

/**
 * @description 停止所有录像回放
 */
export const stopAllPlayback = () => {
  oWebControl.JS_RequestInterface({
    funcName: 'stopAllPlayback'
  }).then(function (oData) {
    console.log(JSON.stringify(oData ? oData.responseMsg : ''));
  });
};

/**
 * @description 设置视频web插件布局
 * @param layout 插件布局 (1x1、2x2、3x3、4x4、5x5、1x2、1+2、1+5、1+7、1+8、1+9、1+12、1+16、4+9、1+1+12、3+4、1x4、4x6
 */
export const setLayout = (layout) => {
  oWebControl.JS_RequestInterface({
    funcName: 'setLayout',
    argument: JSON.stringify({
      layout: layout
    })
  }).then(function (oData) {
    console.log(JSON.stringify(oData ? oData.responseMsg : ''));
  });
};

/**
 * @description 获取视频web插件布局
 * @param callback 回调函数
 */
export const getLayout = (callback) => {
  oWebControl.JS_RequestInterface({
    funcName: 'getLayout'
  }).then(function (oData) {
    console.log(JSON.stringify(oData ? oData.responseMsg : ''));
    callback(oData.responseMsg);
  });
};

/**
 * @description 视频抓图
 * @param snapName 图片绝对路径名称 (如：d:\SnapDir\test.jpg)
 * @param wndId 抓图模式(0为选中窗口抓图，1及以上为指定窗口抓图)【选填】
 */
export const snapShot = (snapName, wndId = 0) => {
  snapName = replaceParam(snapName);

  oWebControl.JS_RequestInterface({
    funcName: 'snapShot',
    argument: JSON.stringify({
      name: snapName,
      wndId: wndId
    })
  }).then(function (oData) {
    console.log(JSON.stringify(oData ? oData.responseMsg : ''));
  });
};

/**
 * @description 扣除部分插件窗口
 * @param left 距离插件窗口左边距【必填】
 * @param top 距离插件窗口上边距【必填】
 * @param width 需要扣除的宽度【必填】
 * @param height 需要扣除的高度【必填】
 */
export const cuttingPartPlugin = (left, top, width, height) => {
  if (oWebControl != null) {
    oWebControl.JS_CuttingPartWindow(left, top, width, height);
  }
};

/**
 * @description 扣除插件窗口还原
 * @param left 距离插件窗口左边距【必填】
 * @param top 距离插件窗口上边距【必填】
 * @param width 需要扣除的宽度【必填】
 * @param height 需要扣除的高度【必填】
 */
export const repairPartPlugin = (left, top, width, height) => {
  if (oWebControl != null) {
    oWebControl.JS_RepairPartWindow(left, top, width, height);
  }
};

/**
 * @description 隐藏插件窗口
 */
export const hideWnd = () => {
  if (oWebControl != null) {
    oWebControl.JS_HideWnd();
  }
};

/**
 * @description 显示插件窗口
 */
export const showWnd = () => {
  if (oWebControl != null) {
    oWebControl.JS_ShowWnd();
  }
};

/**
 * @description 重新绘制视频web插件窗口
 * @param width 视频插件宽度
 * @param height 视频插件高度
 */
export const resizePlugin = (width = 700, height = 400) => {
  if (oWebControl != null) {
    oWebControl.JS_Resize(width, height);
  }
};

/**
 * @description 裁剪像素大小
 */
let iLastCoverLeft = 0;
let iLastCoverTop = 0;
let iLastCoverRight = 0;
let iLastCoverBottom = 0;

/**
 * @description 裁剪视频web插件窗口
 * @param playWndId div窗口标识Id
 * @param width 视频插件宽度
 * @param height 视频插件高度
 */
export const setPluginWndCover = (playWndId, width = 700, height = 400) => {
  let iWidth = document.body.clientWidth;
  let iHeight = document.body.clientHeight;
  let oDivRect = document.getElementById(playWndId).getBoundingClientRect();

  let iCoverLeft = (oDivRect.left < 0) ? Math.abs(oDivRect.left) : 0;
  let iCoverTop = (oDivRect.top < 0) ? Math.abs(oDivRect.top) : 0;
  let iCoverRight = (oDivRect.right - iWidth > 0) ? Math.round(oDivRect.right - iWidth) : 0;
  let iCoverBottom = (oDivRect.bottom - iHeight > 0) ? Math.round(oDivRect.bottom - iHeight) : 0;

  iCoverLeft = (iCoverLeft > width) ? width : iCoverLeft;
  iCoverTop = (iCoverTop > height) ? height : iCoverTop;
  iCoverRight = (iCoverRight > width) ? width : iCoverRight;
  iCoverBottom = (iCoverBottom > height) ? height : iCoverBottom;

  if (iLastCoverLeft !== iCoverLeft) {
    iLastCoverLeft = iCoverLeft;
    oWebControl.JS_SetWndCover('left', iCoverLeft);
  }
  if (iLastCoverTop !== iCoverTop) {
    iLastCoverTop = iCoverTop;
    oWebControl.JS_SetWndCover('top', iCoverTop);
  }
  if (iLastCoverRight !== iCoverRight) {
    iLastCoverRight = iCoverRight;
    oWebControl.JS_SetWndCover('right', iCoverRight);
  }
  if (iLastCoverBottom !== iCoverBottom) {
    iLastCoverBottom = iCoverBottom;
    oWebControl.JS_SetWndCover('bottom', iCoverBottom);
  }
};

/**
 * @description 反初始化视频web插件
 */
export const uninitPlugin = () => {
  oWebControl.JS_RequestInterface({
    funcName: 'uninit'
  }).then(function (oData) {
    console.log(JSON.stringify(oData ? oData.responseMsg : ''));
  });
};

/**
 * @description 断开视频web插件服务连接
 */
export const disConnect = () => {
  if (oWebControl != null) {
    oWebControl.JS_HideWnd();
    oWebControl.JS_Disconnect().then(function () {}, function () {});
  }
};

const initParams = (params) => {
  let paramsOptions = {
    appkey: null, // 8700平台appkey 【必填】
    secret: null, // 8700平台secret 【必填】
    ip: null, // ip 【必填】
    port: null, // 端口【必填】
    enableHTTPS: 1, // 是否启用 HTTPS(是为 1，否为 0)【必填】
    playMode: 0, // 初始播放模式(0为预览，1为回放)【选填】
    layout: '2x2', // 插件布局【选填】
    showToolbar: 1, // 工具栏(0为隐藏，1为显示)【选填】
    showSmart: 1, // 智能信息(0为隐藏，1为显示)【选填】
    buttonIDs: '0,16,256,257,258,259,260,512,513,514,515,516,517,768,769', // 自定义工具条按钮【选填】
    snapDir: 'D:\\SnapDir', // 抓图存储路径【选填】
    videoDir: 'D:\\VideoDir', // 紧急录像或录像剪辑存储路径【选填】
    encryptedFields: 'secret' // 加密字段【选填】
  };

  if (params.appkey != null && params.appkey !== undefined) {
    paramsOptions.appkey = replaceParam(params.appkey);
  } else {
    console.log('appkey不能为空！');
    return;
  }
  if (params.secret != null && params.secret !== undefined) {
    paramsOptions.secret = replaceParam(params.secret);
  } else {
    console.log('secret不能为空！');
    return;
  }
  if (params.ip != null && params.ip !== undefined) {
    paramsOptions.ip = replaceParam(params.ip);
  } else {
    console.log('ip不能为空！');
    return;
  }
  if (params.port != null && params.port !== undefined) {
    if (!/^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/.test(params.port)) {
      console.log('端口填写有误！');
      return;
    } else {
      paramsOptions.port = params.port;
    }
  } else {
    console.log('端口不能为空！');
    return;
  }
  if (params.enableHttps != null && params.enableHttps !== undefined) {
    paramsOptions.enableHTTPS = params.enableHttps;
  } else {
    console.log('enableHTTPS不能为空！');
    return;
  }
  if (params.playMode != null && params.playMode !== undefined) { paramsOptions.playMode = parseInt(params.playMode); }
  if (params.layout != null && params.layout !== undefined) { paramsOptions.layout = replaceParam(params.layout); }
  if (params.showToolbar != null && params.showToolbar !== undefined) { paramsOptions.showToolbar = parseInt(params.showToolbar); }
  if (params.showSmart != null && params.showSmart !== undefined) { paramsOptions.showSmart = parseInt(params.showSmart); }
  if (params.buttonIDs != null && params.buttonIDs !== undefined) { paramsOptions.buttonIDs = replaceParam(params.buttonIDs); }
  if (params.snapDir != null && params.snapDir !== undefined) { paramsOptions.snapDir = replaceParam(params.snapDir); }
  if (params.videoDir != null && params.videoDir !== undefined) { paramsOptions.videoDir = replaceParam(params.videoDir); }
  if (params.encryptedFields != null && params.encryptedFields !== undefined) { paramsOptions.encryptedFields = replaceParam(params.encryptedFields); }
  return paramsOptions;
};

const getPubKey = (callback) => {
  oWebControl.JS_RequestInterface({
    funcName: 'getRSAPubKey',
    argument: JSON.stringify({
      keyLength: 1024
    })
  }).then(function (oData) {
    if (oData.responseMsg.data) {
      pubKey = oData.responseMsg.data;
      callback();
    }
  });
};

const setEncrypt = (value) => {
  let encrypt = new JSEncrypt();
  encrypt.setPublicKey(pubKey);
  return encrypt.encrypt(value);
};

const replaceParam = (value) => {
  value = value.replace(/(^\s*)/g, '');
  value = value.replace(/(\s*$)/g, '');
  return value;
};

const loadPlugin = (params) => {
  getPubKey(() => {
    params.secret = replaceParam(setEncrypt(params.secret));

    oWebControl.JS_RequestInterface({
      funcName: 'init',
      argument: JSON.stringify(params)
    }).then(function (oData) {
      console.log(JSON.stringify(oData ? oData.responseMsg : ''));
    });
  });
};
