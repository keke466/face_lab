// 表情拼图工坊 - 嵌入式界面主逻辑

// 全局变量
let currentLab = 'home';
let userProgress = {
    lab1: { completed: false, score: 0, progress: 0 },
    lab2: { completed: false, score: 0, progress: 0 },
    lab3: { completed: false, score: 0, progress: 0 }
};

// 音效状态
let soundEnabled = true;

// DOM加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('表情拼图工坊（嵌入式版）已加载！');
    
    // 初始化UI
    initUI();
    
    // 加载进度
    loadProgress();
    
    // 显示欢迎消息
    setTimeout(() => {
        showNotification('欢迎来到表情拼图工坊！选择一个实验室开始探索PCA的奥秘。', 'success');
    }, 1000);
});

// 初始化UI
function initUI() {
    // 初始化导航
    initNavigation();
    
    // 初始化预览
    initPreviews();
    
    // 初始化事件监听器
    initEventListeners();
    
    // 加载实验室大厅内容
    loadLab('home');
}

// 初始化导航
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const lab = this.dataset.lab;
            const action = this.dataset.action;
            
            if (lab) {
                loadLab(lab);
            } else if (action) {
                handleAction(action);
            }
            
            // 更新活动状态
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 导航切换按钮
    const navToggle = document.getElementById('nav-toggle');
    if (navToggle) {
        navToggle.addEventListener('click', function() {
            document.querySelector('.sidebar').classList.toggle('active');
        });
    }
}

// 初始化预览
function initPreviews() {
    // 实验室1预览
    const preview1 = document.getElementById('preview-lab1');
    if (preview1) {
        createGridPreview(preview1, SMILEY_DATA.rawFaces.happy);
    }
    
    // 实验室2预览
    const preview2 = document.getElementById('preview-lab2');
    if (preview2) {
        createSliderPreview(preview2);
    }
    
    // 实验室3预览
    const preview3 = document.getElementById('preview-lab3');
    if (preview3) {
        createChartPreview(preview3);
    }
}

// 创建网格预览
function createGridPreview(container, data) {
    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(8, 1fr)';
    container.style.gap = '2px';
    container.style.width = '100%';
    container.style.height = '100%';
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const pixel = document.createElement('div');
            pixel.style.backgroundColor = data[i][j] ? '#333' : '#f0f0f0';
            pixel.style.borderRadius = '2px';
            container.appendChild(pixel);
        }
    }
}

// 创建滑块预览
function createSliderPreview(container) {
    container.innerHTML = `
        <div class="slider-preview-container">
            <div class="slider-track">
                <div class="slider-thumb" style="left: 30%;"></div>
            </div>
            <div class="slider-track">
                <div class="slider-thumb" style="left: 60%;"></div>
            </div>
            <div class="slider-track">
                <div class="slider-thumb" style="left: 40%;"></div>
            </div>
        </div>
    `;
    
    // 添加动画
    const thumbs = container.querySelectorAll('.slider-thumb');
    setInterval(() => {
        thumbs.forEach(thumb => {
            const left = Math.random() * 80 + 10;
            thumb.style.left = left + '%';
        });
    }, 2000);
}

// 创建图表预览
function createChartPreview(container) {
    container.innerHTML = `
        <canvas id="preview-chart" width="200" height="120"></canvas>
    `;
    
    // 绘制预览图表
    setTimeout(() => {
        const canvas = container.querySelector('#preview-chart');
        if (canvas && canvas.getContext) {
            const ctx = canvas.getContext('2d');
            drawPreviewChart(ctx, 200, 120);
        }
    }, 100);
}

// 绘制预览图表
function drawPreviewChart(ctx, width, height) {
    // 清空画布
    ctx.clearRect(0, 0, width, height);
    
    // 绘制背景
    ctx.fillStyle = 'rgba(40, 40, 80, 0.5)';
    ctx.fillRect(0, 0, width, height);
    
    // 绘制坐标轴
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 1;
    
    // X轴
    ctx.beginPath();
    ctx.moveTo(20, height - 20);
    ctx.lineTo(width - 20, height - 20);
    ctx.stroke();
    
    // Y轴
    ctx.beginPath();
    ctx.moveTo(20, 20);
    ctx.lineTo(20, height - 20);
    ctx.stroke();
    
    // 绘制数据
    ctx.strokeStyle = '#ff6b6b';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    const data = [70, 45, 25, 15, 8, 4, 2, 1];
    for (let i = 0; i < data.length; i++) {
        const x = 20 + (i * (width - 40) / (data.length - 1));
        const y = height - 20 - (data[i] * (height - 40) / 100);
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
        
        // 绘制点
        ctx.fillStyle = '#ff6b6b';
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.stroke();
}

// 初始化事件监听器
function initEventListeners() {
    // 全屏按钮
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // 音效按钮
    const soundBtn = document.getElementById('sound-btn');
    if (soundBtn) {
        soundBtn.addEventListener('click', toggleSound);
    }
    
    // 帮助按钮
    const helpBtn = document.getElementById('help-btn');
    if (helpBtn) {
        helpBtn.addEventListener('click', showHelp);
    }
    
    // 点击外部关闭导航
    document.addEventListener('click', function(event) {
        const sidebar = document.querySelector('.sidebar');
        const navToggle = document.getElementById('nav-toggle');
        
        if (window.innerWidth <= 1024 && 
            sidebar.classList.contains('active') &&
            !sidebar.contains(event.target) &&
            !navToggle.contains(event.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// 加载实验室
function loadLab(labId) {
    currentLab = labId;
    
    // 隐藏所有实验室内容
    document.querySelectorAll('.lab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // 显示当前实验室
    const labContent = document.getElementById(labId + '-content');
    if (labContent) {
        labContent.classList.add('active');
        
        // 如果是实验室大厅，不需要额外加载
        if (labId === 'home') {
            updateCurrentLabTitle('实验室大厅');
            updateProgressUI();
            return;
        }
        
        // 加载实验室内容
        if (labContent.innerHTML.trim() === '') {
            fetchLabContent(labId);
        }
        
        // 更新标题
        updateCurrentLabTitle(getLabName(labId));
        
        // 更新导航状态
        updateNavState(labId);
        
        // 关闭移动端导航
        if (window.innerWidth <= 1024) {
            document.querySelector('.sidebar').classList.remove('active');
        }
    }
}

// 获取实验室名称
function getLabName(labId) {
    const names = {
        lab1: '特征侦探实验室',
        lab2: '表情合成实验室',
        lab3: '维度探索实验室'
    };
    return names[labId] || '实验室';
}

// 更新当前实验室标题
function updateCurrentLabTitle(title) {
    const titleElement = document.getElementById('current-lab');
    if (titleElement) {
        titleElement.textContent = title;
    }
}

// 更新导航状态
function updateNavState(labId) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.dataset.lab === labId) {
            item.classList.add('active');
        }
    });
}

// 获取实验室内容
function fetchLabContent(labId) {
    const labContent = document.getElementById(labId + '-content');
    
    // 显示加载状态
    labContent.innerHTML = `
        <div class="loading-container">
            <div class="loading-spinner">
                <i class="fas fa-atom fa-spin"></i>
            </div>
            <p>正在加载实验室内容...</p>
        </div>
    `;
    
    // 模拟加载延迟
    setTimeout(() => {
        switch(labId) {
            case 'lab1':
                loadLab1Content();
                break;
            case 'lab2':
                loadLab2Content();
                break;
            case 'lab3':
                loadLab3Content();
                break;
        }
    }, 500);
}

// 加载实验室1内容
function loadLab1Content() {
    const labContent = document.getElementById('lab1-content');
    
    // 从外部文件加载内容
    fetch('labs/lab1.html')
        .then(response => response.text())
        .then(html => {
            labContent.innerHTML = html;
            initLab1();
        })
        .catch(error => {
            console.error('加载实验室1内容失败:', error);
            labContent.innerHTML = `
                <div class="error-container">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h2>加载失败</h2>
                    <p>无法加载实验室内容，请检查网络连接或刷新页面。</p>
                    <button class="btn btn-primary" onclick="loadLab('lab1')">
                        <i class="fas fa-redo"></i> 重试
                    </button>
                </div>
            `;
        });
}

// 初始化实验室1
function initLab1() {
    console.log('初始化实验室1...');
    
    // 渲染笑脸画廊
    renderSmileyGallery();
    
    // 渲染平均脸选项
    renderMeanFaceOptions();
    
    // 渲染像素选择器
    renderPixelSelector();
    
    // 渲染特征向量可视化
    renderEigenvectorVisualization();
    
    // 绑定事件
    bindLab1Events();
}

// 渲染笑脸画廊
function renderSmileyGallery() {
    const gallery = document.getElementById('smiley-gallery');
    if (!gallery) return;
    
    const smileyTypes = ['happy', 'smile', 'laugh', 'grin', 'sad'];
    const smileyNames = ['高兴', '微笑', '大笑', '坏笑', '悲伤'];
    
    gallery.innerHTML = '';
    
    smileyTypes.forEach((type, index) => {
        const card = document.createElement('div');
        card.className = 'smiley-card';
        card.dataset.id = index + 1;
        
        const grid = document.createElement('div');
        grid.className = 'smiley-grid';
        
        // 渲染8x8网格
        const data = SMILEY_DATA.rawFaces[type];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const pixel = document.createElement('div');
                pixel.className = 'grid-pixel';
                if (data[i][j] === 1) {
                    pixel.style.backgroundColor = '#333';
                }
                grid.appendChild(pixel);
            }
        }
        
        card.innerHTML = `
            <h4>笑脸${index + 1}: ${smileyNames[index]}</h4>
            ${grid.outerHTML}
        `;
        
        gallery.appendChild(card);
    });
}

// 渲染平均脸选项
function renderMeanFaceOptions() {
    const container = document.getElementById('meanface-buttons');
    if (!container) return;
    
    container.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const button = document.createElement('button');
        button.className = 'btn choice-btn';
        button.textContent = `笑脸${i}`;
        button.dataset.choice = i;
        button.onclick = function() {
            selectMeanFace(this);
        };
        container.appendChild(button);
    }
}

// 选择平均脸
function selectMeanFace(button) {
    // 清除其他按钮的选择状态
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // 标记当前按钮为选中
    button.classList.add('selected');
    
    // 存储选择
    window.lab1Data = window.lab1Data || {};
    window.lab1Data.meanFaceChoice = parseInt(button.dataset.choice);
}

// 渲染像素选择器
function renderPixelSelector() {
    const grid = document.getElementById('pixel-selector-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const pixel = document.createElement('div');
            pixel.className = 'grid-pixel selectable';
            pixel.dataset.row = i;
            pixel.dataset.col = j;
            pixel.title = `位置 (${i}, ${j})`;
            
            // 添加点击事件
            pixel.addEventListener('click', function() {
                togglePixelSelection(this);
            });
            
            grid.appendChild(pixel);
        }
    }
    
    // 初始化选择数据
    window.lab1Data = window.lab1Data || {};
    window.lab1Data.selectedPixels = [];
}

// 切换像素选择
function togglePixelSelection(pixel) {
    if (!window.lab1Data) return;
    
    const row = parseInt(pixel.dataset.row);
    const col = parseInt(pixel.dataset.col);
    const index = window.lab1Data.selectedPixels.findIndex(p => p.row === row && p.col === col);
    
    if (index >= 0) {
        // 如果已选择，取消选择
        window.lab1Data.selectedPixels.splice(index, 1);
        pixel.classList.remove('selected');
    } else {
        // 如果未选择且未达到上限，添加选择
        if (window.lab1Data.selectedPixels.length < 3) {
            window.lab1Data.selectedPixels.push({row, col});
            pixel.classList.add('selected');
        } else {
            showNotification('最多只能选择3个像素！', 'warning');
        }
    }
    
    // 更新计数显示
    updateSelectionCount();
}

// 更新选择计数
function updateSelectionCount() {
    const countElement = document.getElementById('selected-count');
    if (countElement && window.lab1Data) {
        countElement.textContent = window.lab1Data.selectedPixels.length;
    }
}

// 清空选择
function clearSelection() {
    if (!window.lab1Data) return;
    
    window.lab1Data.selectedPixels = [];
    
    // 清除所有像素的选择状态
    document.querySelectorAll('.selectable').forEach(pixel => {
        pixel.classList.remove('selected');
    });
    
    // 更新计数
    updateSelectionCount();
    
    showNotification('已清空所有选择', 'info');
}

// 渲染特征向量可视化
function renderEigenvectorVisualization() {
    const container = document.getElementById('eigenvector-vis');
    if (!container) return;
    
    container.innerHTML = '';
    container.className = 'smiley-grid eigen-grid';
    
    const eigenvector = SMILEY_DATA.eigenvectors[0]; // 第一主成分
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const pixel = document.createElement('div');
            pixel.className = 'grid-pixel eigen-pixel';
            
            const value = eigenvector[i][j];
            if (value > 0) {
                // 正向变化，红色系
                const intensity = Math.min(255, Math.floor(value * 300));
                pixel.style.backgroundColor = `rgb(255, ${255 - intensity}, ${255 - intensity})`;
                pixel.title = `正向变化强度: ${value.toFixed(2)}`;
            } else if (value < 0) {
                // 负向变化，蓝色系
                const intensity = Math.min(255, Math.floor(-value * 300));
                pixel.style.backgroundColor = `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
                pixel.title = `负向变化强度: ${value.toFixed(2)}`;
            } else {
                // 无变化
                pixel.style.backgroundColor = '#f8f9fa';
                pixel.title = '变化很小或无变化';
            }
            
            container.appendChild(pixel);
        }
    }
}

// 绑定实验室1事件
function bindLab1Events() {
    // 提交按钮
    const submitBtn = document.querySelector('.btn-primary[onclick="submitLab1()"]');
    if (submitBtn) {
        submitBtn.onclick = submitLab1;
    }
    
    // 重置按钮
    const resetBtn = document.querySelector('.btn-secondary[onclick="resetLab1()"]');
    if (resetBtn) {
        resetBtn.onclick = resetLab1;
    }
}

// 提交实验室1答案
function submitLab1() {
    if (!window.lab1Data) {
        showNotification('请先完成实验任务！', 'warning');
        return;
    }
    
    const meanFaceChoice = window.lab1Data.meanFaceChoice;
    const selectedPixels = window.lab1Data.selectedPixels || [];
    
    if (!meanFaceChoice) {
        showNotification('请先选择你认为的平均脸！', 'warning');
        return;
    }
    
    if (selectedPixels.length === 0) {
        showNotification('请至少选择一个变化像素！', 'warning');
        return;
    }
    
    // 计算得分
    let score = 0;
    let feedback = '';
    
    // 检查平均脸选择
    const correctMeanFace = SMILEY_DATA.lab1Answers.meanFaceIndex;
    if (meanFaceChoice === correctMeanFace) {
        score += 50;
        feedback += '<p>✅ <strong>平均脸选择正确！</strong> 你找到了最接近数学平均的表情。</p>';
    } else {
        feedback += `<p>❌ <strong>平均脸选择有误。</strong> 正确答案是笑脸${correctMeanFace}。</p>`;
    }
    
    // 检查像素选择
    const correctPixels = SMILEY_DATA.lab1Answers.importantPixels;
    let matchedPixels = 0;
    
    selectedPixels.forEach(userPixel => {
        const isCorrect = correctPixels.some(correctPixel => 
            correctPixel.row === userPixel.row && correctPixel.col === userPixel.col
        );
        
        if (isCorrect) {
            matchedPixels++;
        }
    });
    
    const pixelScore = Math.floor(matchedPixels / 3 * 50);
    score += pixelScore;
    
    feedback += `<p>📊 <strong>变化像素匹配：</strong> 你的选择与数学计算匹配了 ${matchedPixels}/3 个重要像素。</p>`;
    
    // 显示PCA计算结果
    feedback += `<p>🔍 <strong>数学发现：</strong> PCA计算显示，最重要的变化区域是嘴角和眼睛周围。</p>`;
    
    // 显示结果面板
    showLab1Results(score, feedback);
    
    // 更新进度
    userProgress.lab1.score = score;
    userProgress.lab1.completed = true;
    userProgress.lab1.progress = 100;
    saveProgress();
    updateProgressUI();
}

// 显示实验室1结果
function showLab1Results(score, feedback) {
    const resultPanel = document.getElementById('result-panel');
    if (!resultPanel) return;
    
    // 更新分数显示
    const scoreDisplay = document.getElementById('score-display');
    if (scoreDisplay) {
        scoreDisplay.innerHTML = `
            <div class="score-value">得分: ${score}/100</div>
            <div class="score-bar">
                <div class="score-fill" style="width: ${score}%"></div>
            </div>
        `;
    }
    
    // 更新学习要点
    const learningPoints = document.getElementById('learning-points');
    if (learningPoints) {
        learningPoints.innerHTML = `
            <div class="learning-content">
                ${feedback}
                <div class="key-concepts">
                    <h5>🎯 核心概念：</h5>
                    <ul>
                        <li><strong>平均脸</strong>：所有表情的数学平均</li>
                        <li><strong>特征向量</strong>：数据变化最大的方向</li>
                        <li><strong>主成分分析</strong>：找到数据主要变化模式的方法</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    // 显示结果面板
    resultPanel.style.display = 'block';
    
    // 滚动到结果面板
    resultPanel.scrollIntoView({ behavior: 'smooth' });
    
    // 显示通知
    showNotification('实验结果已生成！', 'success');
}

// 重置实验室1
function resetLab1() {
    // 重置数据
    window.lab1Data = {
        meanFaceChoice: null,
        selectedPixels: []
    };
    
    // 重置UI
    document.querySelectorAll('.choice-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    document.querySelectorAll('.selectable').forEach(pixel => {
        pixel.classList.remove('selected');
    });
    
    updateSelectionCount();
    
    // 隐藏结果面板
    const resultPanel = document.getElementById('result-panel');
    if (resultPanel) {
        resultPanel.style.display = 'none';
    }
    
    showNotification('实验已重置，可以重新开始', 'info');
}

// 完成实验室1
function completeLab1() {
    showNotification('恭喜完成特征侦探实验！', 'success');
    
    // 延迟后返回实验室大厅
    setTimeout(() => {
        loadLab('home');
    }, 1500);
}

// 加载实验室2内容
function loadLab2Content() {
    const labContent = document.getElementById('lab2-content');
    
    // 简化的实验室2内容
    labContent.innerHTML = `
        <div class="lab-header">
            <h1><i class="fas fa-puzzle-piece"></i> 表情合成实验室</h1>
            <p class="lab-subtitle">任务：用数学组合创建新表情</p>
            <div class="lab-meta">
                <span class="meta-item"><i class="fas fa-clock"></i> 预计时间：20分钟</span>
                <span class="meta-item"><i class="fas fa-graduation-cap"></i> 学习目标：掌握线性组合</span>
                <span class="meta-item"><i class="fas fa-star"></i> 难度：中级</span>
            </div>
        </div>
        
        <div class="coming-soon">
            <div class="coming-soon-icon">
                <i class="fas fa-tools"></i>
            </div>
            <h2>实验室正在建设中...</h2>
            <p>表情合成实验室即将上线，敬请期待！</p>
            <button class="btn btn-primary" onclick="loadLab('home')">
                <i class="fas fa-arrow-left"></i> 返回实验室大厅
            </button>
        </div>
    `;
}

// 加载实验室3内容
function loadLab3Content() {
    const labContent = document.getElementById('lab3-content');
    
    // 简化的实验室3内容
    labContent.innerHTML = `
        <div class="lab-header">
            <h1><i class="fas fa-chart-line"></i> 维度探索实验室</h1>
            <p class="lab-subtitle">任务：探索降维的奥秘与取舍</p>
            <div class="lab-meta">
                <span class="meta-item"><i class="fas fa-clock"></i> 预计时间：25分钟</span>
                <span class="meta-item"><i class="fas fa-graduation-cap"></i> 学习目标：理解降维原理</span>
                <span class="meta-item"><i class="fas fa-star"></i> 难度：高级</span>
            </div>
        </div>
        
        <div class="coming-soon">
            <div class="coming-soon-icon">
                <i class="fas fa-tools"></i>
            </div>
            <h2>实验室正在建设中...</h2>
            <p>维度探索实验室即将上线，敬请期待！</p>
            <button class="btn btn-primary" onclick="loadLab('home')">
                <i class="fas fa-arrow-left"></i> 返回实验室大厅
            </button>
        </div>
    `;
}

// 处理操作
function handleAction(action) {
    switch(action) {
        case 'theory':
            showMathTheory();
            break;
        case 'tutorial':
            showTutorial();
            break;
        case 'about':
            showAbout();
            break;
    }
}

// 显示数学原理
function showMathTheory() {
    const modal = createModal('PCA数学原理', `
        <div class="modal-content">
            <h3>主成分分析（PCA）数学原理</h3>
            <div class="theory-section">
                <h4>1. 中心化数据</h4>
                <p>首先计算平均脸，然后将所有数据减去平均脸：</p>
                <div class="math-formula">X_centered = X - μ</div>
                <p>其中 μ 是平均脸向量。</p>
            </div>
            
            <div class="theory-section">
                <h4>2. 计算协方差矩阵</h4>
                <p>计算数据变化的相关性：</p>
                <div class="math-formula">Σ = (1/n) × X_centeredᵀ × X_centered</div>
                <p>Σ 是一个 d×d 的对称矩阵（d=64）。</p>
            </div>
            
            <div class="theory-section">
                <h4>3. 特征值分解</h4>
                <p>找到协方差矩阵的特征向量和特征值：</p>
                <div class="math-formula">Σv_i = λ_i v_i</div>
                <p>其中：
                <ul>
                    <li>v_i 是第 i 个特征向量（主成分）</li>
                    <li>λ_i 是对应的特征值（方差大小）</li>
                </ul>
                </p>
            </div>
            
            <div class="theory-section">
                <h4>4. 选择主成分</h4>
                <p>按特征值从大到小排序，选择前 k 个特征向量：</p>
                <div class="math-formula">V_k = [v_1, v_2, ..., v_k]</div>
                <p>k 的选择基于累计解释方差比例。</p>
            </div>
            
            <div class="theory-section">
                <h4>5. 投影与重建</h4>
                <p>将数据投影到主成分空间：</p>
                <div class="math-formula">Z = X_centered × V_k</div>
                <p>重建数据：</p>
                <div class="math-formula">X_reconstructed = Z × V_kᵀ + μ</div>
            </div>
        </div>
    `);
    
    modal.querySelector('.modal-actions').innerHTML = `
        <button class="btn btn-primary" onclick="closeModal()">
            <i class="fas fa-check"></i> 我明白了
        </button>
    `;
}

// 显示教程
function showTutorial() {
    showNotification('教学视频功能正在开发中...', 'info');
}

// 显示关于信息
function showAbout() {
    const modal = createModal('关于表情拼图工坊', `
        <div class="modal-content">
            <div class="about-header">
                <div class="about-icon">
                    <i class="fas fa-smile"></i>
                </div>
                <h3>表情拼图工坊</h3>
                <p class="about-version">版本 1.0.0</p>
            </div>
            
            <div class="about-section">
                <h4>项目简介</h4>
                <p>表情拼图工坊是一个交互式数学学习平台，通过有趣的笑脸实验帮助学生理解主成分分析(PCA)的核心概念。</p>
            </div>
            
            <div class="about-section">
                <h4>学习目标</h4>
                <ul>
                    <li>理解特征向量和主成分的概念</li>
                    <li>掌握线性组合重建数据的方法</li>
                    <li>体验降维与信息保留的权衡</li>
                    <li>培养数据分析和数学建模思维</li>
                </ul>
            </div>
            
            <div class="about-section">
                <h4>技术特点</h4>
                <ul>
                    <li>嵌入式交互界面，无需页面跳转</li>
                    <li>实时反馈和可视化结果</li>
                    <li>渐进式学习路径</li>
                    <li>响应式设计，支持多种设备</li>
                </ul>
            </div>
            
            <div class="about-section">
                <h4>适用对象</h4>
                <p>高中数学、大学线性代数、数据科学入门课程的学生</p>
            </div>
            
            <div class="about-footer">
                <p>© 2023 数学宇宙项目组 · 创新教育实验室</p>
            </div>
        </div>
    `);
    
    modal.querySelector('.modal-actions').innerHTML = `
        <button class="btn btn-primary" onclick="closeModal()">
            <i class="fas fa-check"></i> 关闭
        </button>
    `;
}

// 创建模态框
function createModal(title, content) {
    const modalContainer = document.getElementById('modal-container');
    
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        <div class="modal-dialog">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body">
                ${content}
            </div>
            <div class="modal-actions">
                <!-- 操作按钮 -->
            </div>
        </div>
    `;
    
    modalContainer.appendChild(modal);
    
    // 添加模态框样式
    if (!document.querySelector('#modal-style')) {
        const style = document.createElement('style');
        style.id = 'modal-style';
        style.textContent = `
            .modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                z-index: 2000;
                display: flex;
                align-items: center;
                justify-content: center;
                animation: fadeIn 0.3s ease;
            }
            
            .modal-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
            }
            
            .modal-dialog {
                background: rgba(30, 30, 60, 0.95);
                border-radius: 15px;
                width: 90%;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                z-index: 2001;
                position: relative;
                border: 1px solid rgba(100, 100, 255, 0.3);
                box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
            }
            
            .modal-header {
                padding: 20px;
                border-bottom: 1px solid rgba(100, 100, 255, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                color: #4ecdc4;
                font-size: 1.3rem;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: #a0a0ff;
                font-size: 1.2rem;
                cursor: pointer;
                padding: 5px;
            }
            
            .modal-close:hover {
                color: #fff;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .modal-actions {
                padding: 20px;
                border-top: 1px solid rgba(100, 100, 255, 0.2);
                text-align: right;
            }
        `;
        document.head.appendChild(style);
    }
    
    return modal;
}

// 关闭模态框
function closeModal() {
    const modalContainer = document.getElementById('modal-container');
    modalContainer.innerHTML = '';
}

// 切换全屏
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(err => {
            showNotification('无法进入全屏模式: ' + err.message, 'error');
        });
    } else {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        }
    }
}

// 切换音效
function toggleSound() {
    soundEnabled = !soundEnabled;
    const soundBtn = document.getElementById('sound-btn');
    if (soundBtn) {
        soundBtn.innerHTML = soundEnabled ? 
            '<i class="fas fa-volume-up"></i>' : 
            '<i class="fas fa-volume-mute"></i>';
        soundBtn.title = soundEnabled ? '关闭音效' : '开启音效';
    }
    showNotification(soundEnabled ? '音效已开启' : '音效已关闭', 'info');
}

// 显示帮助
function showHelp() {
    showNotification('帮助文档正在建设中...', 'info');
}

// 显示通知
function showNotification(message, type = 'info') {
    const container = document.getElementById('notification-container');
    if (!container) return;
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // 设置图标
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'warning') icon = 'exclamation-triangle';
    if (type === 'error') icon = 'times-circle';
    
    notification.innerHTML = `
        <i class="fas fa-${icon}"></i>
        <span>${message}</span>
        <button class="close-btn" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(notification);
    
    // 自动消失
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// 更新进度UI
function updateProgressUI() {
    // 更新进度条
    const progressElements = {
        'lab1': document.getElementById('progress-lab1'),
        'lab2': document.getElementById('progress-lab2'),
        'lab3': document.getElementById('progress-lab3')
    };
    
    Object.keys(progressElements).forEach(lab => {
        const element = progressElements[lab];
        if (element) {
            element.style.width = userProgress[lab].progress + '%';
        }
    });
    
    // 更新统计
    const statsElements = {
        'lab1': document.getElementById('stats-lab1'),
        'lab2': document.getElementById('stats-lab2'),
        'lab3': document.getElementById('stats-lab3')
    };
    
    Object.keys(statsElements).forEach(lab => {
        const element = statsElements[lab];
        if (element) {
            element.textContent = userProgress[lab].progress + '%';
        }
    });
    
    // 更新导航徽章
    const badgeElements = {
        'lab1': document.getElementById('lab1-badge'),
        'lab2': document.getElementById('lab2-badge'),
        'lab3': document.getElementById('lab3-badge')
    };
    
    Object.keys(badgeElements).forEach(lab => {
        const element = badgeElements[lab];
        if (element) {
            if (userProgress[lab].completed) {
                element.textContent = '✓';
                element.style.background = '#4ecdc4';
            } else if (userProgress[lab].progress > 0) {
                element.textContent = userProgress[lab].progress + '%';
                element.style.background = '#4facfe';
            } else {
                element.textContent = '';
            }
        }
    });
}

// 加载进度
function loadProgress() {
    const savedProgress = localStorage.getItem('pcaLabProgress');
    if (savedProgress) {
        try {
            userProgress = JSON.parse(savedProgress);
            updateProgressUI();
            showNotification('已加载之前的实验进度', 'success');
        } catch (e) {
            console.error('加载进度失败:', e);
        }
    }
}

// 保存进度
function saveProgress() {
    try {
        localStorage.setItem('pcaLabProgress', JSON.stringify(userProgress));
    } catch (e) {
        console.error('保存进度失败:', e);
    }
}

// 返回数学宇宙
function returnToUniverse() {
    showNotification('即将返回数学宇宙...', 'info');
    // 在实际项目中，这里应该跳转到宇宙主页面
    setTimeout(() => {
        alert('在实际部署中，这里会跳转到数学宇宙主界面');
    }, 1000);
}

// 下一个实验室
function nextLab(labId) {
    loadLab(labId);
}

// 重试实验室1
function retryLab1() {
    resetLab1();
}

// 显示数据矩阵
function showDataMatrix() {
    showNotification('数据矩阵查看功能正在开发中...', 'info');
}

// 页面卸载前保存进度
window.addEventListener('beforeunload', function() {
    saveProgress();
});