if (!window.VerticalFalling) {
  class VerticalFalling {
    constructor(options = {}) {
      this.assetsBaseUrl =
        options.assetsBaseUrl || "https://onscorp.github.io/falling-effects/assets/";

      const images = options.images ?? ["flower/flower_1.png"];
      this.images = Array.isArray(images) ? images : [images];

      this.excludeSelector = options.excludeSelector || "#header";
      this.topOffset = this.getTopOffset();

      this.speed = options.speed ?? 5;
      this.maxSize = options.maxSize ?? 15;
      this.minSize = options.minSize ?? 10;
      this.newOn = options.newOn ?? 400;
      this.maxItems = options.maxItems ?? 60;
      this.zIndex = options.zIndex ?? 99999;
      this.fallbackImage = options.fallbackImage || null;

      this.active = true;
      this.items = [];
      this.spawnTimeout = null;

      const container = document.createElement("div");
      container.id = "FallingFlake";
      document.body.appendChild(container);
      this.container = container;

      this.applyContainerStyle();

      this.wrapH = this.container.clientHeight;
      this.wrapW = this.container.clientWidth;

      this._onResize = () => {
        this.topOffset = this.getTopOffset();
        this.applyContainerStyle();
        this.wrapH = this.container.clientHeight;
        this.wrapW = this.container.clientWidth;
      };

      window.addEventListener("resize", this._onResize);

      this.start();
    }

    applyContainerStyle() {
      this.container.style.position = "fixed";
      this.container.style.left = "0";
      this.container.style.top = `${this.topOffset}px`;
      this.container.style.width = "100%";
      this.container.style.height = `calc(100vh - ${this.topOffset}px)`;
      this.container.style.overflow = "hidden";
      this.container.style.pointerEvents = "none";
      this.container.style.zIndex = this.zIndex;
      this.container.style.perspective = "1500px";
    }

    getTopOffset() {
      const el = document.querySelector(this.excludeSelector);
      if (!el) return 0;
      return Math.max(0, Math.round(el.getBoundingClientRect().height));
    }

    random(min, max) {
      return Math.random() * (max - min) + min;
    }

    pickImageSrc() {
      const pick = this.images[Math.floor(Math.random() * this.images.length)];

      if (/^(https?:)?\/\//.test(pick) || /^data:/.test(pick)) {
        return pick;
      }

      return (
        this.assetsBaseUrl.replace(/\/$/, "") +
        "/" +
        String(pick).replace(/^\//, "")
      );
    }

    getFallbackSrc() {
      if (!this.fallbackImage) return null;

      if (/^(https?:)?\/\//.test(this.fallbackImage) || /^data:/.test(this.fallbackImage)) {
        return this.fallbackImage;
      }

      return (
        this.assetsBaseUrl.replace(/\/$/, "") +
        "/" +
        String(this.fallbackImage).replace(/^\//, "")
      );
    }

    getSoftTransform(item, elapsed) {
      const rotateX = 360;
      const rotateY = Math.sin(elapsed * item.rotateSpeed + item.phase) * item.rotateYRange;
      const rotateZ = Math.cos(elapsed * (item.rotateSpeed * 0.8) + item.phase) * item.rotateZRange;
      const translateY = Math.sin(elapsed * 1.1 + item.phase) * 2;
      const translateZ = Math.cos(elapsed * 0.9 + item.phase) * 4;

      return `
        translate3d(0, ${translateY}px, ${translateZ}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        rotateZ(${rotateZ}deg)
      `;
    }

    createItem() {
      if (!this.active) return;
      if (this.items.length >= this.maxItems) return;

      const el = document.createElement("img");
      el.className = "falling_item";
      el.src = this.pickImageSrc();

      const fallbackSrc = this.getFallbackSrc();
      if (fallbackSrc) {
        el.addEventListener("error", () => {
          if (el.src !== fallbackSrc) el.src = fallbackSrc;
        });
      }

      const size = Math.floor(this.random(this.minSize, this.maxSize + 1));
      const startLeft = Math.random() * this.wrapW;
      const startTop = -size - this.random(10, 50);
      const fallTime = (this.wrapH * 0.1 + Math.random() * 5) / this.speed;

      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${startLeft}px`;
      el.style.top = `${startTop}px`;
      el.style.position = "absolute";
      el.style.opacity = this.random(0.7, 1);

      this.container.appendChild(el);

      const item = {
        el,
        startLeft,
        startTop,
        fallTime,
        startTime: performance.now(),
        moveRaf: null,

        // 좌우 살랑임
        swayAmplitude: this.random(8, 18),
        swaySpeed: this.random(0.45, 0.9),
        drift: this.random(-6, 6),
        phase: this.random(0, Math.PI * 2),

        // 회전도 너무 과하지 않게
        rotateSpeed: this.random(0.8, 1.3),
        rotateYRange: this.random(6, 14),
        rotateZRange: this.random(8, 18)
      };

      const endTop = this.wrapH + size + 30;

      const updatePos = (now) => {
        if (!this.active || !el.isConnected) return;

        const elapsed = (now - item.startTime) / 1000;
        const progress = Math.min(elapsed / item.fallTime, 1);

        // 아래로 천천히 낙하
        const currentTop = item.startTop + (endTop - item.startTop) * progress;
        el.style.top = `${currentTop}px`;

        // 좌우 살랑살랑
        const swayX =
          Math.sin(elapsed * item.swaySpeed * Math.PI * 2 + item.phase) *
          item.swayAmplitude;

        // 약한 전체 흐름
        const driftX = item.drift * progress;

        el.style.left = `${item.startLeft + swayX + driftX}px`;

        // 회전/기울기
        el.style.transform = this.getSoftTransform(item, elapsed);

        if (progress >= 1) {
          if (item.moveRaf) cancelAnimationFrame(item.moveRaf);
          this.items = this.items.filter((v) => v !== item);
          el.remove();
          return;
        }

        item.moveRaf = requestAnimationFrame(updatePos);
      };

      this.items.push(item);
      item.moveRaf = requestAnimationFrame(updatePos);
    }

    spawnLoop() {
      if (!this.active) return;

      this.createItem();

      this.spawnTimeout = setTimeout(() => {
        this.spawnLoop();
      }, this.newOn);
    }

    start() {
      this.spawnLoop();
    }

    stop() {
      this.active = false;

      if (this.spawnTimeout) clearTimeout(this.spawnTimeout);
      window.removeEventListener("resize", this._onResize);

      this.items.forEach(item => {
        if (item.moveRaf) cancelAnimationFrame(item.moveRaf);
        if (item.el && item.el.isConnected) item.el.remove();
      });

      this.items = [];

      if (this.container && this.container.isConnected) {
        this.container.remove();
      }
    }
  }

  window.VerticalFalling = VerticalFalling;
}
