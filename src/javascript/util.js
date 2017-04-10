export function _isType(t) {
  return Object.prototype.toString.call(t).slice(8, -1).toLowerCase();
}

export function _saveLocalStorage(key, value) {
  if (_isType(value) === "string") {
    localStorage.setItem(key, value);
  } else {
    let Info = JSON.stringify(value);
    localStorage.setItem(key, Info);
  }
}

export function _getLocalStorage(item) {
  return localStorage.getItem(item);
}

export function _clearStorage() {
  localStorage.clear();
}

export function _getCookie(c_name) {
  let c_start, c_end;
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + "=");
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(";", c_start);
      if (c_end === -1) c_end = document.cookie.length;
      return document.cookie.slice(c_start, c_end)
    }
  }
  return ""
}
