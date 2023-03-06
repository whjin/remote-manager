// 普通验证
export const validateNormal = (rule, value, callback) => {
  if (value == '' || value == null || value == undefined || value == false) {
    return callback(new Error('此项不能为空'));
  } else if (String(value).length >= 32) {
    return callback(new Error('此项必须小于32位'));
  } else {
    callback();
  }
};

// 去除空格验证
export const validateSpace = (rule, value, callback) => {
  let reg = (/\s/g).test(value);
  if (reg) {
    callback(new Error('输入的字符不能含有空格'));
  } else {
    callback();
  }
};

// 工号验证
export const validateUserCode = (rule, value, callback) => {
  if (value == null || value == undefined || value == false) {
    return callback(new Error('工号不能为空'));
  } else if (!(/(^[0-9]\d*$)/.test(value)) || String(value).length >= 11) {
    return callback(new Error('请输入小于11位的数字'));
  }
  callback();
};

// 性别验证
export const validateGender = (rule, value, callback) => {
  if (value == null || value == undefined || value == false) {
    return callback(new Error('性别不能为空'));
  }
  if (!Number.isInteger(value)) {
    callback(new Error('请选择正确的性别'));
  } else {
    callback();
  }
};

// 岗位验证
export const validatePosition = (rule, value, callback) => {
  if (value == undefined || value.length == 0 || value == false) {
    callback(new Error('岗位不能为空'));
  } else {
    callback();
  }
};

// 序号验证
export const validateIndex = (rule, value, callback) => {
  if (value == '' || value == undefined) {
    callback(new Error('序号不能为空'));
  } else if (!(/(^[0-9]\d*$)/.test(value))) {
    callback(new Error('序号为正整数'));
  } else if (value.length >= 5) {
    callback(new Error('序号不能超过4位数'));
  } else {
    callback();
  }
};

// 权限验证
export const validateDataAuth = (rule, value, callback) => {
  if (value == null || value == undefined ) {
    return callback(new Error('权限不能为空'));
  }
  if (!Number.isInteger(value)) {
    callback(new Error('请选择正确的权限'));
  } else {
    callback();
  }
};
// 手机号验证
export const validatePhone = (rule, value, callback) => {
  if (value == null || value == undefined || value == false) {
    return callback(new Error('手机号不能为空'));
  }
  if (!(/^1(3|4|5|6|7|8|9)\d{9}$/.test(value))) {
    callback(new Error('手机号格式错误'));
  } else {
    callback();
  }
};

// 身份证验证
export const validateIdCard = (rule, value, callback) => {
  if (value == null || value == undefined || value == false) {
    return callback(new Error('身份证不能为空'));
  }
  const vcity = {
    11: '北京',
    12: '天津',
    13: '河北',
    14: '山西',
    15: '内蒙古',
    21: '辽宁',
    22: '吉林',
    23: '黑龙江',
    31: '上海',
    32: '江苏',
    33: '浙江',
    34: '安徽',
    35: '福建',
    36: '江西',
    37: '山东',
    41: '河南',
    42: '湖北',
    43: '湖南',
    44: '广东',
    45: '广西',
    46: '海南',
    50: '重庆',
    51: '四川',
    52: '贵州',
    53: '云南',
    54: '西藏',
    61: '陕西',
    62: '甘肃',
    63: '青海',
    64: '宁夏',
    65: '新疆',
    71: '台湾',
    81: '香港',
    82: '澳门',
    91: '国外'
  };
  // 校验长度，类型
  const reg = /(^\d{15}$)|(^\d{17}(\d|X|x)$)/;
  if (!reg.test(value)) {
    return callback(new Error('身份证长度错误'));
  }
  // 检查省份
  const province = value.substr(0, 2);
  if (vcity[province] == undefined) {
    return callback(new Error('身份证省份代码错误'));
  }
  // 校验生日
  if (!checkBirthday(value)) {
    return callback(new Error('身份证生日信息错误'));
  }
  // 检验位的检测
  if (!checkParity(value)) {
    return callback(new Error('身份证格式错误'));
  }
  callback();
};

export const checkBirthday = (card) => {
  const len = card.length;
  // 身份证15位时，次序为省（3位）市（3位）年（2位）月（2位）日（2位）校验位（3位），皆为数字
  if (len == 15) {
    const re_fifteen = /^(\d{6})(\d{2})(\d{2})(\d{2})(\d{3})$/;
    const arr_data = card.match(re_fifteen);
    const year = arr_data[2];
    const month = arr_data[3];
    const day = arr_data[4];
    const birthday = new Date('19' + year + '/' + month + '/' + day);
    return verifyBirthday('19' + year, month, day, birthday);
  }
  // 身份证18位时，次序为省（3位）市（3位）年（4位）月（2位）日（2位）校验位（4位），校验位末尾可能为X
  if (len == 18) {
    const re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X|x)$/;
    const arr_data = card.match(re_eighteen);
    const year = parseInt(arr_data[2]);
    const month = parseInt(arr_data[3]);
    const day = parseInt(arr_data[4]);
    const birthday = new Date(year + '/' + month + '/' + day);
    return verifyBirthday(year, month, day, birthday);
  }
  return false;
};

function verifyBirthday (year, month, day, birthday) {
  const now = new Date();
  const now_year = now.getFullYear();
  // 年月日是否合理
  if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
    // 判断年份的范围（0岁到100岁之间)
    const time = now_year - year;
    return time >= 0 && time <= 100;
  }
  return false;
}

export const checkParity = (card) => {
  // 15位转18位
  card = changeFifteenToEighteen(card);
  const len = card.length;
  if (len == 18) {
    const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let cardTemp = 0;
    for (let i = 0; i < 17; i++) {
      cardTemp += card.substr(i, 1) * arrInt[i];
    }
    let valnum = arrCh[cardTemp % 11];
    return valnum == card.substr(17, 1).toLocaleUpperCase();
  }
  return false;
};

export const changeFifteenToEighteen = (card) => {
  if (card.length == 15) {
    const arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
    const arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
    let cardTemp = 0;
    card = card.substr(0, 6) + '19' + card.substr(6, card.length - 6);
    for (let i = 0; i < 17; i++) {
      cardTemp += card.substr(i, 1) * arrInt[i];
    }
    card += arrCh[cardTemp % 11];
    return card;
  }
  return card;
};

// 判断ip地址
export const validateIp = (rule, value, callback) => {
  let regIp = /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)/; // Ip格式正则
  if (value === '' || value === null || value === undefined || value === false) {
    return callback(new Error('此项不能为空'));
  } else if (regIp.test(value)) {
    let ipStr = value.split('.');
    let oneIp = ipStr[ipStr.length - 1];
    let ipNum = parseInt(oneIp);
    if (ipNum > 255) {
      return callback(new Error('ip格式错误'));
    } else {
      callback();
    }
  } else {
    return callback(new Error('ip格式错误'));
  }
};

//进入案件管理页面，新增修改案件，案件编号输入为空格时校验
export const validateCaseNo = (rule, value, callback) => {
  const math=/\s/;
  if (value == '' || value == undefined) {
    callback(new Error('案件编号不能为空'));
  } else if (math.test(value)) {
    callback(new Error('案件编号不能包含空格'));
  } else {
    callback();
  }
};
//进入案件管理页面，新增修改案件，案件编号输入为空格时校验
export const validateoCaseName = (rule, value, callback) => {
  const math=/\s/;
  if (value == '' || value == undefined) {
    callback(new Error('案件名称不能为空'));
  } else if (math.test(value)) {
    callback(new Error('案件名称不能包含空格'));
  } else {
    callback();
  }
};
