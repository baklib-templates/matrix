import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static values = {
    external: { type: Boolean, default: true } // 是否外部打开
  };

  connect() {
    const anchors = this.element.querySelectorAll("a[href]");
    anchors.forEach(a => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      // 判断是否为绝对地址
      const isAbsolute = /^https?:\/\//i.test(href);
      let isExternal = false;

      if (isAbsolute) {
        try {
          const url = new URL(href, window.location.origin);
          isExternal = url.hostname !== window.location.hostname;
        } catch (e) {
          // 忽略解析错误
        }
      }

      // 如果 externalValue 为 true，且是外部链接，则设置为新窗口打开
      if (this.externalValue && isExternal) {
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener noreferrer");
      }
      // 如果 externalValue 为 false，移除 target
      if (!this.externalValue) {
        a.removeAttribute("target");
        a.removeAttribute("rel");
      }
    });
  }
}
