let util = {}

util.toStone = function (num, fixed) {
  if (typeof fixed !== 'number')
    fixed = 1;
  var str = num;
  if (Math.abs(num) >= 100000000) {
    if (Math.abs(num) % 100000000 * Math.pow(10, fixed) <= 0)
      fixed = 0;
    if (fixed === 0) {
      str = Math.floor((num / 100000000)) + '亿';

    } else {
      let val = (num / 100000000).toFixed(fixed)
      let arr = (val + '').split('.')
      let res = arr[1] === '0' ? arr[0] : val
      str = res + '亿';
    }
  } else if (Math.abs(num) >= 10000) {
    if (Math.abs(num) % 10000 * Math.pow(10, fixed) <= 0)
      fixed = 0;
    if (fixed === 0) {
      str = Math.floor((num / 10000)) + '万';
    } else {
      str = (num / 10000).toFixed(fixed) + '万';
    }
  }
  return str;
};
util.offical = {
  normal: ['一直一直浇水，我就会长大~',
    '快给我浇水吧，我快渴死了',
    '辣妹说，累计签到第3/5/8天有额外惊喜哦~',
    '每天只能摘取一次果实，再多我就受不了啦~',
    '哇，排行榜大佬们真厉害！',
    '我这么可爱，你难道不想给我浇水吗？',
    '你怎么这么无聊啊？一直调戏一棵树。',
    '点[领水滴]可以获得更多水滴哦！',
    '只有100g水滴肿么办？当然是抽奖呀！',
    '哇喔，有iphone13诶，要加把劲了！'],
  watering: ['土壤里养分充足，我吸收得很快，感觉在飞速生长！',
    '辣妹说，累计签到第3/5/8天有额外惊喜哦~',
    '每天只能摘取一次果实，再多我就受不了啦~',
    '再浇点、再浇点，我猛得在生长！']
}

util.timeToNow = function (time) {
  var dt = new Date().getTime() - time;
  if (dt >= 24 * 60 * 60 * 1000) { return Math.floor(dt / (24 * 60 * 60 * 1000)) + '天前'; } else if (dt >= 60 * 60 * 1000) { return Math.floor(dt / (60 * 60 * 1000)) + '小时前'; } else if (dt >= 60 * 1000) { return Math.floor(dt / (60 * 1000)) + '分钟前'; } else if (dt >= 0) { return '刚刚'; }
}
/**
 * 获得cookie
 * @param key
 * @returns {null}
 */
util.getCookie = function (key) {
  var arr, reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)');
  if (arr = document.cookie.match(reg)) { return unescape(arr[2]); } else { return null; }
};
/**
 * 获得地址参数列表
 * @param name
 * @returns {null}
 */
util.getQueryString = function (name, defval) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r, idx = location.search.indexOf('/');
  if (idx === -1) {
    r = location.search.substr(1).match(reg);
  } else {
    r = location.search.substring(1, idx).match(reg);
  }
  if (r != null) { return unescape(r[2]); }
  if (typeof defval !== 'undefined') {
    return defval;
  } else {
    return null;
  }
};
/**
 * 获取lxt串号
 */
util.getLxt = function () {
  var result = this.getQueryString('lxt');
  if (!result) {
    var cookie = this.getCookie('lexun.com');
    var regex = new RegExp('(lxt)=([^&]*)');
    if (regex.test(cookie)) {
      result = decodeURIComponent(regex.exec(cookie)[2]);
    }
  }
  return result ? result.toString() : '';
};






export default util;