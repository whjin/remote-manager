module.exports = {
  root: true,
  'extends': [
    'plugin:vue/essential',
    // '@vue/standard'
  ],
  rules: {
    // allow async-await
    'generator-star-spacing': 'off',
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV == 'production' ? 'error' : 'off',
    // 不检测标签的是否包裹
    'vue/no-parsing-error': [2, {
      'x-invalid-end-tag': false
    }],
    'no-undef': 'off',
    'camelcase': 'off',
    // 'semi': ['error', 'always']
  },
  parserOptions: {
    // parser: 'babel-eslint'
  }
};
