const path = require("path");
// const address = require("address");

const resolve = (dir) => {
  return path.join(__dirname, dir);
};

// 项目部署基础
// 如果应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/   默认：'/'
// 如果应用部署在子路径中，则需要指定子路径
// 例如：https://www.foobar.com/my-app/  需要将它改为'/my-app/'
const BASE_URL = process.env.NODE_ENV == "production" ? "/" : "/";
const webpack = require("webpack");
module.exports = {
  baseUrl: BASE_URL,
  // 如果不需要使用eslint，把lintOnSave设为false即可
  lintOnSave: false,
  // 警告 webpack 的性能提示
  configureWebpack: {
    performance: {
      hints: "warning",
      // 入口起点的最大体积 整数类型（以字节为单位）
      maxEntrypointSize: 50000000,
      // 生成文件的最大体积 整数类型（以字节为单位 300k）
      maxAssetSize: 30000000,
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith(".css") || assetFilename.endsWith(".js");
      },
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "windows.jQuery": "jquery",
      }),
    ],
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set("@", resolve("src")) // key,value自行定义，比如.set('@@', resolve('src/components'))
      .set("_c", resolve("src/components"));
    // 配置iview-loader 统一标签书写规范
    config.module
      .rule("vue")
      .test(/\.vue$/)
      .use("iview-loader")
      .loader("iview-loader")
      .options({
        prefix: true,
      });
  },
  // 打包时不生成.map文件
  productionSourceMap: false,
  // 这里写你调用接口的基础路径，来解决跨域，
  // 如果设置了代理，那你本地开发环境的axios的baseUrl要写为 '' ，即空字符串
  devServer: {
    proxy: "http://192.168.1.54:8085/",
  },
};

/** * 标签名
 'i-affix': 'Affix',
 'i-alert': 'Alert',
 'i-anchor': 'Anchor',
 'i-anchor-link': 'AnchorLink',
 'i-auto-complete': 'AutoComplete',
 'i-avatar': 'Avatar',
 'i-back-top': 'BackTop',
 'i-badge': 'Badge',
 'i-breadcrumb': 'Breadcrumb',
 'i-breadcrumb-item': 'BreadcrumbItem',
 'i-button': 'Button',
 'i-button-group': 'ButtonGroup',
 'i-card': 'Card',
 'i-carousel': 'Carousel',
 'i-carousel-item': 'CarouselItem',
 'i-cascader': 'Cascader',
 'i-cell': 'Cell',
 'i-cell-group': 'CellGroup',
 'i-checkbox': 'Checkbox',
 'i-checkbox-group': 'CheckboxGroup',
 'i-circle': 'i-circle',
 'i-col': 'Col',
 'i-collapse': 'Collapse',
 'i-color-picker': 'ColorPicker',
 'i-content': 'Content',
 'i-divider': 'Divider',
 'i-date-picker': 'DatePicker',
 'i-drawer': 'Drawer',
 'i-dropdown': 'Dropdown',
 'i-dropdown-item': 'DropdownItem',
 'i-dropdown-menu': 'DropdownMenu',
 'i-footer': 'Footer',
 'i-form': 'Form',
 'i-form-item': 'FormItem',
 'i-header': 'Header',
 'i-icon': 'Icon',
 'i-input': 'Input',
 'i-input-number': 'InputNumber',
 'i-layout': 'Layout',
 'i-menu': 'Menu',
 'i-menu-group': 'MenuGroup',
 'i-menu-item': 'MenuItem',
 'i-sider': 'Sider',
 'i-submenu': 'Submenu',
 'i-modal': 'Modal',
 'i-option': 'Option',
 'i-option-group': 'OptionGroup',
 'i-page': 'Page',
 'i-panel': 'Panel',
 'i-poptip': 'Poptip',
 'i-progress': 'Progress',
 'i-radio': 'Radio',
 'i-radio-group': 'RadioGroup',
 'i-rate': 'Rate',
 'i-row': 'Row',
 'i-select': 'Select',
 'i-slider': 'Slider',
 'i-spin': 'Spin',
 'i-split': 'Split',
 'i-step': 'Step',
 'i-steps': 'Steps',
 'i-switch': 'i-switch',
 'i-table': 'Table',
 'i-tabs': 'Tabs',
 'i-tab-pane': 'TabPane',
 'i-tag': 'Tag',
 'i-time': 'Time',
 'i-timeline': 'Timeline',
 'i-timeline-item': 'TimelineItem',
 'i-time-picker': 'TimePicker',
 'i-tooltip': 'Tooltip',
 'i-transfer': 'Transfer',
 'i-tree': 'Tree',
 'i-upload': 'Upload'
 */
