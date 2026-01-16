/**
 * 星空背景 - 优化版
 * 轻量级，移动端友好的星空效果
 */
class Starfield {
    constructor() {
        this.canvas = document.getElementById('stars');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.resizeTimeout = null;
        
        this.init();
    }
    
    init() {
        // 设置画布大小
        this.resize();
        
        // 创建星星
        this.createStars();
        
        // 开始动画
        this.animate();
        
        // 窗口大小改变时重新调整
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                this.resize();
                this.createStars();
            }, 200);
        });
    }
    
    resize() {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // 设置画布实际大小
        this.canvas.width = width * dpr;
        this.canvas.height = height * dpr;
        
        // 设置画布显示大小
        this.canvas.style.width = width + 'px';
        this.canvas.style.height = height + 'px';
        
        // 缩放上下文
        this.ctx.scale(dpr, dpr);
    }
    
    createStars() {
        const width = window.innerWidth;
        const height = window.innerHeight;
        const starCount = Math.min(200, Math.floor((width * height) / 5000));
        
        this.stars = [];
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                size: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.3 + 0.1,
                brightness: Math.random() * 0.5 + 0.5,
                pulseSpeed: Math.random() * 0.02 + 0.01
            });
        }
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const width = window.innerWidth;
        const height = window.innerHeight;
        
        // 绘制星星
        for (const star of this.stars) {
            // 更新位置（轻微移动，模拟太空感）
            star.y += star.speed * 0.1;
            if (star.y > height) {
                star.y = 0;
                star.x = Math.random() * width;
            }
            
            // 脉冲效果
            star.brightness += star.pulseSpeed;
            if (star.brightness > 1 || star.brightness < 0.3) {
                star.pulseSpeed = -star.pulseSpeed;
            }
            
            // 绘制星星
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        
        // 少量流星
        if (Math.random() < 0.002) {
            this.createMeteor();
        }
        
        // 绘制流星
        this.drawMeteors();
        
        requestAnimationFrame(() => this.animate());
    }
    
    createMeteor() {
        const width = window.innerWidth;
        
        if (!this.meteors) this.meteors = [];
        
        this.meteors.push({
            x: Math.random() * width,
            y: -20,
            length: Math.random() * 30 + 20,
            speed: Math.random() * 5 + 3,
            life: 100
        });
    }
    
    drawMeteors() {
        if (!this.meteors) return;
        
        for (let i = this.meteors.length - 1; i >= 0; i--) {
            const meteor = this.meteors[i];
            
            // 更新位置
            meteor.x += meteor.speed * 0.7;
            meteor.y += meteor.speed;
            meteor.life -= 2;
            
            if (meteor.life <= 0 || 
                meteor.y > window.innerHeight + 50 || 
                meteor.x > window.innerWidth + 50) {
                this.meteors.splice(i, 1);
                continue;
            }
            
            // 绘制流星
            const gradient = this.ctx.createLinearGradient(
                meteor.x, meteor.y,
                meteor.x - meteor.length * 0.3, 
                meteor.y - meteor.length
            );
            
            gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
            gradient.addColorStop(0.5, 'rgba(100, 180, 255, 0.6)');
            gradient.addColorStop(1, 'rgba(100, 180, 255, 0)');
            
            this.ctx.strokeStyle = gradient;
            this.ctx.lineWidth = 2;
            this.ctx.lineCap = 'round';
            
            this.ctx.beginPath();
            this.ctx.moveTo(meteor.x, meteor.y);
            this.ctx.lineTo(
                meteor.x - meteor.length * 0.3,
                meteor.y - meteor.length
            );
            this.ctx.stroke();
        }
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
    window.starfield = new Starfield();
});