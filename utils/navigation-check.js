/**
 * 导航检查工具
 * 确保所有页面连接正常工作
 */

class NavigationChecker {
    constructor() {
        this.pages = [
            '../../index.html',
            '../planet101/index.html',
            '../planet102/index.html',
            '../planet103/index.html',
            '../planet104/index.html'
        ];
        
        this.init();
    }
    
    init() {
        console.log('导航检查器启动');
        this.checkCurrentPage();
        this.setupErrorHandling();
    }
    
    checkCurrentPage() {
        const currentPath = window.location.pathname;
        console.log(`当前页面: ${currentPath}`);
        
        // 检查必要的资源
        this.checkResources();
    }
    
    checkResources() {
        const resources = [
            'style.css',
            'script.js',
            'starfield.js'
        ];
        
        resources.forEach(resource => {
            this.testResource(resource);
        });
    }
    
    testResource(url) {
        fetch(url, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    console.log(`✅ ${url} 可访问`);
                } else {
                    console.warn(`⚠️ ${url} 访问失败: ${response.status}`);
                }
            })
            .catch(error => {
                console.error(`❌ ${url} 加载错误:`, error);
            });
    }
    
    setupErrorHandling() {
        // 全局错误处理
        window.addEventListener('error', (event) => {
            console.error('页面错误:', event.error);
            
            // 显示友好的错误信息
            this.showErrorMessage('页面加载出现错误，请刷新重试');
        });
        
        // 404处理
        window.addEventListener('load', () => {
            if (document.title.includes('404')) {
                this.redirectToHome();
            }
        });
    }
    
    showErrorMessage(message) {
        // 创建错误提示
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(231, 76, 60, 0.9);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            z-index: 10000;
            max-width: 400px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            animation: slideIn 0.3s ease;
        `;
        
        errorDiv.innerHTML = `
            <strong>⚠️ 错误提示</strong>
            <p style="margin: 10px 0 0; font-size: 0.9rem;">${message}</p>
            <button onclick="this.parentElement.remove()" 
                    style="background: none; border: none; color: white; 
                           float: right; cursor: pointer; margin-top: 10px;">
                关闭
            </button>
        `;
        
        document.body.appendChild(errorDiv);
        
        // 10秒后自动移除
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 10000);
    }
    
    redirectToHome() {
        // 如果页面不存在，重定向到主页
        setTimeout(() => {
            window.location.href = '../../index.html';
        }, 3000);
    }
    
    // 测试所有链接
    testAllLinks() {
        const links = document.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('#') && !href.startsWith('javascript:')) {
                    console.log(`点击链接: ${href}`);
                    
                    // 检查链接是否有效
                    fetch(href, { method: 'HEAD' })
                        .catch(() => {
                            e.preventDefault();
                            this.showErrorMessage(`链接 ${href} 不可用`);
                        });
                }
            });
        });
    }
}

// 初始化导航检查
document.addEventListener('DOMContentLoaded', () => {
    window.navigationChecker = new NavigationChecker();
    window.navigationChecker.testAllLinks();
});