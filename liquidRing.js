class LiquidProgressRing {
    constructor(canvasId, size = 260) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");

        this.size = size;
        this.progress = 0;
        this.targetProgress = 100;

        this.config = {
            radius: size / 2 - 15,
            lineWidth: 12,
            waveHeight: 14,
            waveSpeed: 0.06,
            waveLength: 55,
            gradientTop: "#00eaff",
            gradientBottom: "#0077ff",
            strokeColor: "#1ecbff"
        };

        this.canvas.width = size;
        this.canvas.height = size;

        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    drawRing() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(
            this.size / 2,
            this.size / 2,
            this.config.radius,
            0,
            Math.PI * 2
        );
        ctx.lineWidth = this.config.lineWidth;
        ctx.strokeStyle = this.config.strokeColor;
        ctx.stroke();
    }

    drawLiquid() {
        const ctx = this.ctx;

        const center = this.size / 2;
        const waveOffset = this.progress * 8;

        let gradient = ctx.createLinearGradient(0, 0, 0, this.size);
        gradient.addColorStop(0, this.config.gradientTop);
        gradient.addColorStop(1, this.config.gradientBottom);

        const waterLevel = this.size - (this.progress * 2.05);

        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, this.config.radius, 0, Math.PI * 2);
        ctx.clip();

        ctx.beginPath();
        ctx.moveTo(0, waterLevel);

        for (let x = 0; x <= this.size; x++) {
            ctx.lineTo(
                x,
                waterLevel +
                Math.sin((x + waveOffset) / this.config.waveLength) *
                this.config.waveHeight
            );
        }

        ctx.lineTo(this.size, this.size);
        ctx.lineTo(0, this.size);
        ctx.closePath();

        ctx.fillStyle = gradient;
        ctx.fill();

        // Reflection line
        ctx.beginPath();
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, waterLevel - 8, this.size, 4);
        ctx.globalAlpha = 1;

        ctx.restore();
    }

    drawText() {
        const ctx = this.ctx;

        ctx.fillStyle = "white";
        ctx.font = "700 48px Poppins";
        ctx.textAlign = "center";

        ctx.fillText(
            Math.floor(this.progress) + "%",
            this.size / 2,
            this.size / 2 + 18
        );
    }

    animate() {
        this.ctx.clearRect(0, 0, this.size, this.size);

        if (this.progress < this.targetProgress) {
            this.progress += (this.targetProgress - this.progress) * 0.035;
        }

        this.drawRing();
        this.drawLiquid();
        this.drawText();

        requestAnimationFrame(this.animate);
    }
}

// Dışarıdan çağrılabilen fonksiyon
function initLiquidRing() {
    new LiquidProgressRing("progressCanvas", 260);
}
