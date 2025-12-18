class SnowFall {
    constructor(options = {}) {
        this.imageSrc = "./img/cSnow-icon.png";

        const container = document.createElement("div");
        container.id = "ccSnowFlake";
        document.body.appendChild(container);

        this.container = container;

        this.maxFlakes = options.maxFlakes || 50;
        this.minSize   = options.minSize   || 12;
        this.maxSize   = options.maxSize   || 26;
        this.minSpeed  = options.minSpeed  || 6;
        this.maxSpeed  = options.maxSpeed  || 14;

        this.active = true;

        this.injectKeyframes();
        this.loop();
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    createFlake() {
        if (!this.active) return;

        const flake = document.createElement("img");
        flake.classList.add("snowflake");
        flake.src = this.imageSrc;

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

        flake.style.animation = `snowfallMove var(--duration) linear forwards`;

        this.container.appendChild(flake);

        flake.addEventListener("animationend", () => {
            flake.remove();
            if (this.active) this.createFlake();
        });
    }

    /* ⭐ 초기 눈 확- 방지: 천천히 한 개씩 생성 */
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
        }, 400 + this.random(0, 400)); // 0.4~0.8초 간격
    }

    injectKeyframes() {
        const style = document.createElement("style");

        style.innerHTML = `
            #ccSnowFlake {
                position: fixed;
                inset: 0;
                pointer-events: none;
                overflow: hidden;
                z-index: 99999;
            }

            #ccSnowFlake .snowflake {
                will-change: transform;
                pointer-events: none;
                user-select: none;
            }

            @keyframes snowfallMove {
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
}
