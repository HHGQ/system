/**
 * 检测字符串是否首字母大写，第2-4位为数字
 * @param {string} str
 * @returns {Boolean}
 */
 export function validCode(str) {
  return /^[A-Z][0-9]{3}/.test(str)
}