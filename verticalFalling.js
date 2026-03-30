if (!window.VerticalFalling) {
  class VerticalFalling {
    constructor(options = {}) {
      this.assetsBaseUrl =
        options.assetsBaseUrl || "https://onscorp.github.io/falling-effects/assets/";

      const images = options.images ?? ["snow/snow_1.png"];
      this.images = Array.isArray(images) ? images : [images];

      this.excludeSelector = options.excludeSelector || "#header";
      this.topOffset = this.getTopOffset();

      const container = document.createElement("div");
      container.id = "FallingFlake";
      document.body.appendChild(container);
      this.container = container;

      container.style.position = "fixed";
      container.style.left = "0";
      container.style.top = `${this.topOffset}px`;
      container.style.width = "100%";
      container.style.height = `calc(100vh - ${this.topOffset}px)`;
      container.style.overflow = "hidden";
      container.style.pointerEvents = "none";
      container.style.zIndex = options.zIndex ?? 9999;
      container.style.perspective = "1500px";

      this._onResize = () => {
        this.topOffset = this.getTopOffset();
        this.container.style.top = `${this.topOffset}px`;
        this.container.style.height = `calc(100vh - ${this.topOffset}px)`;
        this.wrapW = this.container.clientWidth || window.innerWidth;
        this.wrapH = this.container.clientHeight || window.innerHeight;
      };
      window.addEventListener("resize", this._onResize);

      this.maxFlakes = options.maxFlakes ?? 60;
      this.minSize = options.minSize ?? 10;
      this.maxSize = options.maxSize ?? 18;
      this.minSpeed = options.minSpeed ?? 7;
      this.maxSpeed = options.maxSpeed ?? 11;
      this.spawnMin = options.spawnMin ?? 260;
      this.spawnMax = options.spawnMax ?? 520;
      this.fallbackImage = options.fallbackImage || null;

      this.active = true;
      this.items = [];
      this.spawnTimer = null;

      this.wrapW = this.container.clientWidth || window.innerWidth;
      this.wrapH = this.container.clientHeight || window.innerHeight;

      this.start();
    }

    random(min, max) {
      return Math.random() * (max - min) + min;
    }

    getTopOffset() {
      const el = document.querySelector(this.excludeSelector);
      if (!el) return 0;
      return Math.max(0, Math.round(el.getBoundingClientRect().height));
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

      if (
        /^(https?:)?\/\//.test(this.fallbackImage) ||
        /^data:/.test(this.fallbackImage)
      ) {
        return this.fallbackImage;
      }

      return (
        this.assetsBaseUrl.replace(/\/$/, "") +
        "/" +
        String(this.fallbackImage).replace(/^\//, "")
      );
    }

    getRandomSwayTransform() {
      const rotateX = 360;
      const rotateY = this.random(-35, 35);
      const rotateZ = this.random(-50, 110);
      const translateX = this.random(-8, 8);
      const translateY = this.random(-12, 2);
      const translateZ = this.random(0, 18);

      return `
        translate3d(${translateX}px, ${translateY}px, ${translateZ}px)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        rotateZ(${rotateZ}deg)
      `;
    }

    applySwayAnim(item) {
      if (!this.active || !item.el.isConnected) return;

      item.el.style.transform = this.getRandomSwayTransform();

      item.swayTimer = setTimeout(() => {
        this.applySwayAnim(item);
      }, this.random(700, 1100));
    }

    createFlake() {
      if (!this.active) return;
      if (this.items.length >= this.maxFlakes) return;

      const flake = document.createElement("img");
      flake.classList.add("falling_item");
      flake.src = this.pickImageSrc();

      const fallbackSrc = this.getFallbackSrc();
      if (fallbackSrc) {
        flake.addEventListener("error", () => {
          if (flake.src !== fallbackSrc) flake.src = fallbackSrc;
        });
      }

      const size = Math.floor(this.random(this.minSize, this.maxSize + 1));
      const startPosLeft = Math.random() * this.wrapW;
      const fallTime = this.random(this.minSpeed, this.maxSpeed);

      flake.style.position = "absolute";
      flake.style.left = `${startPosLeft}px`;
      flake.style.top = `${-size - this.random(10, 60)}px`;
      flake.style.width = `${size}px`;
      flake.style.height = `${size}px`;
      flake.style.opacity = this.random(0.55, 1);
      flake.style.pointerEvents = "none";
      flake.style.userSelect = "none";
      flake.style.willChange = "transform, top, left, opacity";
      flake.style.transformStyle = "preserve-3d";
      flake.style.transition = "transform 900ms linear";

      this.container.appendChild(flake);

      const item = {
        el: flake,
        fallTime,
        swayTimer: null,
        moveRaf: null,
        startTime: performance.now(),
        baseLeft: startPosLeft,
        swayAmplitude: this.random(18, 42),
        swayFrequency: this.random(0.8, 1.8),
        drift: this.random(-8, 8),
        phase: this.random(0, Math.PI * 2)
      };

      const startTop = parseFloat(flake.style.top) || 0;
      const endTop = this.wrapH + size + 40;

      const updatePos = (now) => {
        if (!this.active || !flake.isConnected) return;

        const elapsed = (now - item.startTime) / 1000;
        const progress = Math.min(elapsed / item.fallTime, 1);

        const currentTop = startTop + (endTop - startTop) * progress;
        flake.style.top = `${currentTop}px`;

        const swayX =
          Math.sin(elapsed * item.swayFrequency * Math.PI * 2 + item.phase) *
          item.swayAmplitude;

        const softDrift =
          Math.cos(elapsed * 0.9 + item.phase) * (item.swayAmplitude * 0.35);

        const currentLeft =
          item.baseLeft + swayX + softDrift + item.drift * progress;

        flake.style.left = `${currentLeft}px`;

        if (progress >= 1) {
          if (item.moveRaf) cancelAnimationFrame(item.moveRaf);
          if (item.swayTimer) clearTimeout(item.swayTimer);

          this.items = this.items.filter((v) => v !== item);
          flake.remove();

          if (this.active) this.createFlake();
          return;
        }

        item.moveRaf = requestAnimationFrame(updatePos);
      };

      this.items.push(item);

      item.moveRaf = requestAnimationFrame(updatePos);
      this.applySwayAnim(item);
    }

    loop() {
      if (!this.active) return;

      this.createFlake();

      const delay = this.random(this.spawnMin, this.spawnMax);
      this.spawnTimer = setTimeout(() => {
        this.loop();
      }, delay);
    }

    start() {
      this.loop();
    }

    stop() {
      this.active = false;

      if (this.spawnTimer) clearTimeout(this.spawnTimer);
      if (this._onResize) window.removeEventListener("resize", this._onResize);

      this.items.forEach((item) => {
        if (item.moveRaf) cancelAnimationFrame(item.moveRaf);
        if (item.swayTimer) clearTimeout(item.swayTimer);
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
