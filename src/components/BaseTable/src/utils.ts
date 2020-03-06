class Utils {
  isObject(obj: any): boolean {
    return Object.prototype.toString.call(obj) === "[object Object]"
  };

  clear(arr: any[]) {
    while (arr.length) {
      arr.pop();
    }
    return arr;
  }

  arrOrderBy(arr: any[], delegate: (x: any) => boolean, direction: string) {
    if (arr.length <= 1) {
      return arr;
    }
    var isFunction = typeof delegate == "function";
    var tmp;
    for (var i = 0; i < arr.length - 1; i++) {
      for (var j = i + 1; j < arr.length; j++) {
        var first = arr[i];
        var next = arr[j];
        var result;
        if (direction == "asc") {
          result = isFunction
            ? delegate(first) > delegate(next)
            : first > next;
        } else {
          result = isFunction
            ? delegate(first) < delegate(next)
            : first < next;
        }
        if (result) {
          tmp = arr[i];
          arr[i] = arr[j];
          arr[j] = tmp;
        }
      }
    }
    return arr;
  }

  orderBy(arr: any[], delegate: (x: any) => boolean) {
    return this.arrOrderBy(arr, delegate, 'asc');
  }

}

export default new Utils();