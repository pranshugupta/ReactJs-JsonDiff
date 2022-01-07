const stringConstructor = "".constructor;
const arrayConstructor = [].constructor;
const objectConstructor = {}.constructor;
export default class Utils {
  static jsonValueType(value) {
    if (value === null) return "null";
    if (value === undefined) return "undefined";
    if (value.constructor === Boolean) return "bool";
    if (value.constructor === Number) return "number";
    if (value.constructor === stringConstructor) return "string";
    if (value.constructor === arrayConstructor) return "array";
    if (value.constructor === objectConstructor) return "object";
    if (value.constructor === Function) return "function";
    return "";
  }
  static onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }
}
