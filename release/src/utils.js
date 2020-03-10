export function deepClone(obj) {
  if (typeof obj !== "object") return obj;
  if (obj === null) return null;
  if (obj instanceof Date) return new Date(obj);
  if (obj instanceof RegExp) return new RegExp(obj);
  if (obj instanceof Array) {
    let arr = [];
    for (let i in obj) {
      arr[i] = deepClone(obj[i]);
    }
    return arr;
  }
  var o = {};
  for (var attr in obj) {
    o[attr] = deepClone(obj[attr]);
  }
  return o;
}
