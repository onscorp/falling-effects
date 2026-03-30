class VerticalFalling {
    constructor(options = {}) {
        this.assetsBaseUrl =
            options.assetsBaseUrl || "https://onscorp.github.io/falling-effects/assets/";

        const images = options.images ?? ["flower/flower_1.png"];
        this.images = Array.isArray(images) ? images : [images];

        this.excludeSelector = options.excludeSelector || "#header";

        this.speed = options.speed ?? 5;
        this.maxSize = options.maxSize ?? 15;
        this.minSize = options.minSize ?? 10;
        this.newOn = options.newOn ?? 400;
        this.maxItems = options.maxItems ?? 60;
        this.zIndex = options.zIndex ?? 99999;
        this.fallbackImage = options.fallbackImage || null;

        /* 좌우 흔들림 강도 */
        this.driftMin = options.driftMin ?? -0.35;
        this.driftMax = options.driftMax ?? 0.35;

        /* 살랑이는 transform 변경 주기 */
        this.swayInterval = options.swayInterval ?? 1000;

        /* 회전/흔들림 범위 */
        this.rotateYMin = options.rotateYMin ?? -30;
        this.rotateYMax = options.rotateYMax ?? 30;
        this.rotateZMin = options.rotateZMin ?? -35;
        this.rotateZMax = options.rotateZMax ?? 95;
        this.translateXMin = options.translateXMin ?? -4;
        this.translateXMax = options.translateXMax ?? 4;
        this.translateYMin = options.translateYMin ?? -8;
        this.translateYMax = options.translateYMax ?? 0;
        this.translateZMin = options.translateZMin ?? 0;
        this.translateZMax = options.translateZMax ?? 14;

        this.active = true;
        this.items = [];
        this.spawnTimeout = null;

        const oldContainer = document.getElementById("FallingFlake");
        if (oldContainer) oldContainer.remove();

        const container = document.createElement("div");
        container.id = "FallingFlake";
        document.body.appendChild(container);
        this.container = container;

        this.topOffset = this.getTopOffset();
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

    getRandomTransform() {
        const rotateX = 360;
        const rotateY = this.random(this.rotateYMin, this.rotateYMax);
        const rotateZ = this.random(this.rotateZMin, this.rotateZMax);
        const translateX = this.random(this.translateXMin, this.translateXMax);
        const translateY = this.random(this.translateYMin, this.translateYMax);
        const translateZ = this.random(this.translateZMin, this.translateZMax);

        return `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg) translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px)`;
    }

    applySwayAnim(item) {
        if (!this.active || !item.el.isConnected) return;

        item.el.style.transform = this.getRandomTransform();

        item.swayTimer = setTimeout(() => {
            this.applySwayAnim(item);
        }, this.swayInterval);
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
        const fallTime = (this.wrapH * 0.1 + Math.random() * 5) / this.speed;
        const horizontalOffset = this.random(this.driftMin, this.driftMax);

        el.style.width = `${size}px`;
        el.style.height = `${size}px`;
        el.style.left = `${startLeft}px`;
        el.style.position = "absolute";
        el.style.animation = `fallingVertical ${fallTime}s linear forwards`;

        this.container.appendChild(el);

        const item = {
            el,
            horizontalOffset,
            moveRaf: null,
            swayTimer: null
        };

        const updatePos = () => {
            if (!this.active || !el.isConnected) return;

            const currentLeft = parseFloat(el.style.left) || 0;
            el.style.left = `${currentLeft + horizontalOffset}px`;

            item.moveRaf = requestAnimationFrame(updatePos);
        };

        el.addEventListener("animationend", () => {
            if (item.moveRaf) cancelAnimationFrame(item.moveRaf);
            if (item.swayTimer) clearTimeout(item.swayTimer);

            this.items = this.items.filter(v => v !== item);
            el.remove();
        });

        this.items.push(item);

        updatePos();
        this.applySwayAnim(item);
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
