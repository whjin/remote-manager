import axios from "axios";
import { Message, Spin } from "iview";
import { setToken } from "./util";

class HttpRequest {
  constructor(baseUrl = baseURL) {
    this.baseUrl = baseUrl;
    this.queue = {};
  }
  // 获取请求的配置项 详见axios的配置文档
  getInsideConfig() {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        //
      },
    };
    return config;
  }
  // 请求存在缓存时 会导致请求返回时数据不刷新
  // 此类情况常见于GET请求未携带可变参数时 服务端返回304的情况
  destroy(url) {
    Spin.hide();
    delete this.queue[url];
  }
  interceptors(instance, url) {
    // 加载中的提示
    Spin.show({
      render: (h) => {
        return h("div", [
          h("Icon", {
            style: {
              "margin-bottom": "10px",
            },
            props: {
              type: "ios-loading",
              size: 25,
            },
          }),
          h("div", "正在加载中"),
        ]);
      },
    });
    // axios的请求拦截
    instance.interceptors.request.use(
      (config) => {
        this.queue[url] = true;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    // axios的响应拦截
    instance.interceptors.response.use(
      (res) => {
        if (res.data.state.code === 200) {
          // 刷新token
          if (Reflect.has(res.headers, "token")) {
            setToken(res.headers.token);
          }
        } else {
          Message.error({
            content: `${res.data.state.msg}`,
            duration: 2,
          });
        }
        this.destroy(url);
        const { data, status } = res;
        return { data, status };
      },
      (error) => {
        // 返回错误时 将返回的状态码之类的内容包装成对象返回给客户端处理 可在控制台看见错误相关信息
        this.destroy(url);
        return Promise.reject(error);
      }
    );
  }
  request(options) {
    // 创建 axios的实例对象
    const instance = axios.create();
    // clone and merge
    options = Object.assign(this.getInsideConfig(), options);
    this.interceptors(instance, options.url);
    return instance(options);
  }
}
export default HttpRequest;
