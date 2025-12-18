class VerticalFalling {
    constructor(options = {}) {
        this.assetsBaseUrl = options.assetsBaseUrl || "https://onscorp.github.io/falling-effects/assets/";

        const images = options.images ?? ["snow/snow_1.png"];
        this.images = Array.isArray(images) ? images : [images];

        const container = document.createElement("div");
        container.id = "FallingFlake";
        document.body.appendChild(container);
        this.container = container;

        this.maxFlakes = options.maxFlakes || 50;
        this.minSize = options.minSize || 12;
        this.maxSize = options.maxSize || 26;
        this.minSpeed = options.minSpeed || 6;
        this.maxSpeed = options.maxSpeed || 14;

        this.fallbackImage = options.fallbackImage || null; 

        this.active = true;

        this.injectKeyframes();
        this.loop();
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    pickImageSrc() {
        const pick = this.images[Math.floor(Math.random() * this.images.length)];

        if (/^(https?:)?\/\//.test(pick) || /^data:/.test(pick)) return pick;

        return this.assetsBaseUrl.replace(/\/$/, "") + "/" + String(pick).replace(/^\//, "");
    }

    createFlake() {
        if (!this.active) return;

        const flake = document.createElement("img");
        flake.classList.add("falling_item");

        flake.src = this.pickImageSrc();

        if (this.fallbackImage) {
            const fallbackSrc = (/^(https?:)?\/\//.test(this.fallbackImage) || /^data:/.test(this.fallbackImage))
                ? this.fallbackImage
                : this.assetsBaseUrl.replace(/\/$/, "") + "/" + String(this.fallbackImage).replace(/^\//, "");

            flake.addEventListener("error", () => {
                if (flake.src !== fallbackSrc) flake.src = fallbackSrc;
            });
        }

        const size = this.random(this.minSize, this.maxSize);
        const xStart = this.random(0, window.innerWidth);
        const swing = this.random(20, 60) * (25 / size);
        const yEnd = window.innerHeight + 200;
        const duration = this.random(this.minSpeed, this.maxSpeed);
        const rotate = this.random(-180, 180);

        flake.style.position = "absolute";
        flake.style.left = `${xStart}px`;
        flake.style.top = "-40px";
        flake.style.width = `${size}px`;
        flake.style.height = `${size}px`;
        flake.style.opacity = this.random(0.5, 1);
        flake.style.pointerEvents = "none";
        flake.style.userSelect = "none";
        flake.style.willChange = "transform";

        flake.style.setProperty("--xStart", `${xStart}px`);
        flake.style.setProperty("--swing", `${swing}px`);
        flake.style.setProperty("--yEnd", `${yEnd}px`);
        flake.style.setProperty("--rotate", `${rotate}deg`);
        flake.style.setProperty("--duration", `${duration}s`);

        flake.style.animation = `fallMove var(--duration) linear forwards`;

        this.container.appendChild(flake);

        flake.addEventListener("animationend", () => {
            flake.remove();
            if (this.active) this.createFlake();
        });
    }

    loop() {
        let count = 0;
        const interval = setInterval(() => {
            if (!this.active) {
                clearInterval(interval);
                return;
            }

            this.createFlake();
            count++;

            if (count >= this.maxFlakes) {
                clearInterval(interval);
            }
        }, 400 + this.random(0, 400));
    }

    injectKeyframes() {
        const style = document.createElement("style");

        style.innerHTML = `
            @keyframes fallMove {
                0% {
                    transform: translate(0, 0) rotate(0deg);
                }
                50% {
                    transform: translate(
                        calc(var(--swing) * 0.8),
                        calc(var(--yEnd) * 0.5)
                    ) rotate(calc(var(--rotate) / 2));
                }
                100% {
                    transform: translate(
                        var(--swing),
                        var(--yEnd)
                    ) rotate(var(--rotate));
                }
            }
        `;

        document.head.appendChild(style);
    }

    stop() {
        this.active = false;
        if (this.container) this.container.innerHTML = "";
    }
}
