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
