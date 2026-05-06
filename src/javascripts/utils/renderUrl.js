import qs from "qs";

export function renderUrl(urlTemplate, params, cleanEmpty = false) {
  let tmpParams = Object.assign({}, params);
  const keys = Object.keys(tmpParams);
  const isAbsolute = /^http/.test(urlTemplate);
  let url = null;
  if (isAbsolute) {
    url = new URL(urlTemplate);
    urlTemplate = urlTemplate.pathname;
  } else {
    urlTemplate = urlTemplate.replace("//", "/");
    url = new URL(urlTemplate, window.location.origin);
  }

  // 处理 pathName中的 :id,中值的替换
  urlTemplate = decodeURIComponent(urlTemplate).replace(/:(\w+)/g, (_, key) => {
    if (keys.includes(key)) {
      const value = tmpParams[key];
      delete tmpParams[key];
      return value;
    } else {
      console.warn(`url template(${urlTemplate}) key ${key} not found in params`, params);
      return key;
    }
  });

  const queryParams = qs.parse(url.search, { ignoreQueryPrefix: true });
  const mergedParams = Object.assign(queryParams, tmpParams);

  // 新增：清理空参数
  if (cleanEmpty) {
    Object.keys(mergedParams).forEach(key => {
      if (
        mergedParams[key] === null ||
        mergedParams[key] === undefined ||
        mergedParams[key] === ''
      ) {
        delete mergedParams[key];
      }
    });
  }

  url.search = qs.stringify(mergedParams, { arrayFormat: "brackets" });

  return url.toString()
}
