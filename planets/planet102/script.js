// PCA实验室核心逻辑
document.addEventListener('DOMContentLoaded', function() {
    console.log('PCA实验室已加载');
    
    // 初始化数据
    initData();
    
    // 设置事件监听器
    setupEventListeners();
    
    // 初始化实验室1
    initLab1();
    
    // 更新进度显示
    updateProgress();
});

// 实验数据
let pcaData = {
    // 笑脸数据
    smileys: [
        { id: 1, name: '高兴', data: null },
        { id: 2, name: '微笑', data: null },
        { id: 3, name: '大笑', data: null },
        { id: 4, name: '坏笑', data: null },
        { id: 5, name: '悲伤', data: null }
    ],
    
    // PCA结果
    meanFace: null,
    eigenvectors: [],
    eigenvalues: [],
    
    // 实验状态
    lab1Completed: false,
    lab2Completed: false,
    lab3Completed: false,
    
    // 当前选择
    selectedMeanFace: null,
    selectedPixels: []
};

// 初始化数据
function initData() {
    // 预定义笑脸数据（8x8像素）
    const smileyPatterns = [
        // 高兴
        [
            [0,0,1,1,1,1,0,0],
            [0,1,0,0,0,0,1,0],
            [1,0,1,0,0,1,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,1,0,0,1,0,1],
            [1,0,0,1,1,0,0,1],
            [0,1,0,0,0,0,1,0],
            [0,0,1,1,1,1,0,0]
        ],
        // 微笑
        [
            [0,0,1,1,1,1,0,0],
            [0,1,0,0,0,0,1,0],
            [1,0,1,0,0,1,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1],
            [0,1,0,0,0,0,1,0],
            [0,0,1,1,1,1,0,0]
        ],
        // 大笑
        [
            [0,0,1,1,1,1,0,0],
            [0,1,0,0,0,0,1,0],
            [1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,1,0,0,1,0,1],
            [1,0,0,1,1,0,0,1],
            [0,1,0,0,0,0,1,0],
            [0,0,1,1,1,1,0,0]
        ],
        // 坏笑
        [
            [0,0,1,1,1,1,0,0],
            [0,1,0,0,0,0,1,0],
            [1,0,1,0,0,1,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,1,0,0,1,0,1],
            [0,1,0,1,1,0,1,0],
            [0,0,1,1,1,1,0,0]
        ],
        // 悲伤
        [
            [0,0,1,1,1,1,0,0],
            [0,1,0,0,0,0,1,0],
            [1,0,1,0,0,1,0,1],
            [1,0,0,0,0,0,0,1],
            [1,0,1,0,0,1,0,1],
            [1,0,0,1,1,0,0,1],
            [0,1,0,0,0,0,1,0],
            [0,0,1,0,0,1,0,0]
        ]
    ];
    
    // 计算平均脸（简化）
    pcaData.meanFace = calculateMeanFace(smileyPatterns);
    
    // 计算特征向量（简化）
    pcaData.eigenvectors = [
        // 第一主成分：嘴角变化
        [
            [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00],
            [0.00,0.00,0.05,0.10,0.10,0.05,0.00,0.00],
            [0.00,0.10,0.15,0.20,0.20,0.15,0.10,0.00],
            [0.00,0.15,0.25,0.40,0.40,0.25,0.15,0.00],
            [0.00,0.15,0.25,0.40,0.40,0.25,0.15,0.00],
            [0.00,0.10,0.15,0.20,0.20,0.15,0.10,0.00],
            [0.00,0.00,0.05,0.10,0.10,0.05,0.00,0.00],
            [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00]
        ],
        // 第二主成分：眼睛变化
        [
            [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00],
            [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00],
            [0.00,0.20,0.40,0.10,0.10,0.40,0.20,0.00],
            [0.00,0.10,0.30,0.00,0.00,0.30,0.10,0.00],
            [0.00,0.10,0.30,0.00,0.00,0.30,0.10,0.00],
            [0.00,0.20,0.40,0.10,0.10,0.40,0.20,0.00],
            [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00],
            [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00]
        ],
        // 第三主成分：眉毛变化
        [
            [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00],
            [0.00,0.15,0.10,0.05,0.05,0.10,0.15,0.00],
            [0.00,0.30,0.20,0.10,0.10,0.20,0.30,0.00],
            [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00],
            [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00],
            [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00],
            [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00],
            [0.00,0.00,0.00,0.00,0.00,0.00,0.00,0.00]
        ]
    ];
    
    // 特征值（方差解释比例）
    pcaData.eigenvalues = [0.45, 0.25, 0.15, 0.08, 0.04, 0.02, 0.01, 0.00];
    
    // 存储笑脸数据
    smileyPatterns.forEach((pattern, index) => {
        pcaData.smileys[index].data = pattern;
    });
}

// 计算平均脸
function calculateMeanFace(patterns) {
    const mean = Array(8).fill().map(() => Array(8).fill(0));
    
    // 对每个像素位置计算平均值
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let sum = 0;
            patterns.forEach(pattern => {
                sum += pattern[i][j];
            });
            mean[i][j] = sum / patterns.length;
        }
    }
    
    return mean;
}

// 设置事件监听器
function setupEventListeners() {
    // 标签切换
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchTab(tabId);
        });
    });
    
    // 进度点点击
    document.querySelectorAll('.dot').forEach(dot => {
        dot.addEventListener('click', function() {
            const labId = this.dataset.lab;
            switchTab(labId);
        });
    });
    
    // 重置所有
    document.getElementById('reset-all').addEventListener('click', resetAll);
}

// 切换标签
function switchTab(tabId) {
    // 更新标签按钮
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        }
    });
    
    // 更新内容显示
    document.querySelectorAll('.lab-content').forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) {
            content.classList.add('active');
            // 初始化对应实验室
            if (tabId === 'lab1' && !pcaData.lab1Initialized) {
                initLab1();
            } else if (tabId === 'lab2' && !pcaData.lab2Initialized) {
                initLab2();
            } else if (tabId === 'lab3' && !pcaData.lab3Initialized) {
                initLab3();
            }
        }
    });
    
    // 更新进度点
    document.querySelectorAll('.dot').forEach(dot => {
        dot.classList.remove('active');
        if (dot.dataset.lab === tabId) {
            dot.classList.add('active');
        }
    });
    
    // 更新提示
    updateHint(tabId);
}

// 更新提示
function updateHint(labId) {
    const hints = {
        lab1: '点击笑脸像素，标记你认为变化最大的区域',
        lab2: '拖动滑块调整特征，合成目标表情',
        lab3: '调整主成分数量，观察重建效果'
    };
    
    document.getElementById('current-hint').textContent = hints[labId] || '选择实验开始探索';
}

// 更新进度显示
function updateProgress() {
    let completed = 0;
    if (pcaData.lab1Completed) completed++;
    if (pcaData.lab2Completed) completed++;
    if (pcaData.lab3Completed) completed++;
    
    document.getElementById('progress').textContent = `进度: ${completed}/3`;
    
    // 更新徽章
    updateBadges();
}

// 更新徽章
function updateBadges() {
    const lab1Badge = document.getElementById('lab1-badge');
    const lab2Badge = document.getElementById('lab2-badge');
    const lab3Badge = document.getElementById('lab3-badge');
    
    if (lab1Badge) {
        if (pcaData.lab1Completed) {
            lab1Badge.innerHTML = '<i class="fas fa-check-circle"></i> 已完成';
            lab1Badge.className = 'completion-badge completed';
        }
    }
    
    if (lab2Badge) {
        if (pcaData.lab2Completed) {
            lab2Badge.innerHTML = '<i class="fas fa-check-circle"></i> 已完成';
            lab2Badge.className = 'completion-badge completed';
        }
    }
    
    if (lab3Badge) {
        if (pcaData.lab3Completed) {
            lab3Badge.innerHTML = '<i class="fas fa-check-circle"></i> 已完成';
            lab3Badge.className = 'completion-badge completed';
        }
    }
}

// 重置所有
function resetAll() {
    if (confirm('确定要重置所有实验进度吗？')) {
        pcaData.lab1Completed = false;
        pcaData.lab2Completed = false;
        pcaData.lab3Completed = false;
        pcaData.selectedMeanFace = null;
        pcaData.selectedPixels = [];
        
        // 重置实验室1
        if (pcaData.lab1Initialized) {
            resetLab1();
        }
        
        // 重置实验室2
        if (pcaData.lab2Initialized) {
            resetLab2();
        }
        
        // 重置实验室3
        if (pcaData.lab3Initialized) {
            resetLab3();
        }
        
        updateProgress();
        showNotification('所有实验已重置', 'info');
    }
}

// 显示通知
function showNotification(message, type = 'info') {
    // 创建通知元素
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                              type === 'error' ? 'exclamation-circle' : 
                              'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // 添加到页面
    document.body.appendChild(notification);
    
    // 添加样式
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                border-left: 4px solid #4facfe;
                z-index: 1000;
                animation: slideIn 0.3s ease;
            }
            
            .notification-success {
                border-left-color: #48bb78;
            }
            
            .notification-error {
                border-left-color: #f56565;
            }
            
            .notification-content {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 自动移除
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ==================== 实验室1：特征发现 ====================
function initLab1() {
    pcaData.lab1Initialized = true;
    
    // 渲染笑脸网格
    renderSmileys();
    
    // 渲染平均脸选项
    renderMeanFaceOptions();
    
    // 渲染像素选择器
    renderPixelSelector();
    
    // 渲染平均脸可视化
    renderMeanFaceVisual();
    
    // 渲染特征向量可视化
    renderEigenvectorVisual();
    
    // 设置事件监听器
    setupLab1Events();
}

function renderSmileys() {
    for (let i = 1; i <= 5; i++) {
        const grid = document.getElementById(`smiley-${i}`);
        if (grid) {
            renderGrid(grid, pcaData.smileys[i-1].data, false);
        }
    }
}

function renderGrid(container, data, interactive = false) {
    container.innerHTML = '';
    container.style.display = 'grid';
    container.style.gridTemplateColumns = 'repeat(8, 1fr)';
    container.style.gridTemplateRows = 'repeat(8, 1fr)';
    container.style.gap = '1px';
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const pixel = document.createElement('div');
            pixel.className = 'pixel';
            pixel.style.backgroundColor = data[i][j] ? '#2d3748' : '#f0f0f0';
            
            if (interactive) {
                pixel.classList.add('selectable-pixel');
                pixel.dataset.row = i;
                pixel.dataset.col = j;
            }
            
            container.appendChild(pixel);
        }
    }
}

function renderMeanFaceOptions() {
    const optionsContainer = document.querySelector('.meanface-options');
    if (!optionsContainer) return;
    
    optionsContainer.innerHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = `笑脸${i}`;
        btn.dataset.answer = i;
        optionsContainer.appendChild(btn);
    }
}

function renderPixelSelector() {
    const selector = document.getElementById('pixel-selector');
    if (!selector) return;
    
    // 创建一个空网格用于选择
    const emptyGrid = Array(8).fill().map(() => Array(8).fill(0));
    renderGrid(selector, emptyGrid, true);
}

function renderMeanFaceVisual() {
    const visual = document.getElementById('meanface-visual');
    if (!visual) return;
    
    renderGrid(visual, pcaData.meanFace, false);
}

function renderEigenvectorVisual() {
    const visual = document.getElementById('eigenvector-visual');
    if (!visual) return;
    
    visual.innerHTML = '';
    visual.style.display = 'grid';
    visual.style.gridTemplateColumns = 'repeat(8, 1fr)';
    visual.style.gridTemplateRows = 'repeat(8, 1fr)';
    visual.style.gap = '1px';
    
    const eigenvector = pcaData.eigenvectors[0];
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const pixel = document.createElement('div');
            const value = eigenvector[i][j];
            
            if (value > 0) {
                // 正向变化，红色系
                const intensity = Math.min(255, Math.floor(value * 300));
                pixel.style.backgroundColor = `rgb(255, ${255 - intensity}, ${255 - intensity})`;
            } else if (value < 0) {
                // 负向变化，蓝色系
                const intensity = Math.min(255, Math.floor(-value * 300));
                pixel.style.backgroundColor = `rgb(${255 - intensity}, ${255 - intensity}, 255)`;
            } else {
                // 无变化
                pixel.style.backgroundColor = '#f8fafc';
            }
            
            visual.appendChild(pixel);
        }
    }
}

function setupLab1Events() {
    // 平均脸选择
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // 移除其他按钮的选择状态
            document.querySelectorAll('.option-btn').forEach(b => {
                b.classList.remove('selected');
            });
            
            // 标记当前选择
            this.classList.add('selected');
            pcaData.selectedMeanFace = parseInt(this.dataset.answer);
            
            // 显示反馈
            showMeanFaceFeedback();
        });
    });
    
    // 像素选择
    document.querySelectorAll('.selectable-pixel').forEach(pixel => {
        pixel.addEventListener('click', function() {
            const row = parseInt(this.dataset.row);
            const col = parseInt(this.dataset.col);
            
            // 检查是否已选择
            const index = pcaData.selectedPixels.findIndex(p => 
                p.row === row && p.col === col
            );
            
            if (index >= 0) {
                // 已选择，取消选择
                pcaData.selectedPixels.splice(index, 1);
                this.classList.remove('selected');
            } else {
                // 未选择，添加选择（最多3个）
                if (pcaData.selectedPixels.length < 3) {
                    pcaData.selectedPixels.push({ row, col });
                    this.classList.add('selected');
                } else {
                    showNotification('最多只能选择3个像素！', 'error');
                }
            }
            
            // 更新计数
            updateSelectionCount();
            showPixelFeedback();
        });
    });
    
    // 清空选择
    document.getElementById('clear-selection').addEventListener('click', function() {
        pcaData.selectedPixels = [];
        document.querySelectorAll('.selectable-pixel').forEach(pixel => {
            pixel.classList.remove('selected');
        });
        updateSelectionCount();
        document.getElementById('pixel-feedback').innerHTML = '';
    });
    
    // 提交答案
    document.getElementById('submit-lab1').addEventListener('click', submitLab1Answers);
    
    // 重置实验室1
    document.getElementById('reset-lab1').addEventListener('click', resetLab1);
    
    // 下一步按钮
    document.querySelector('[data-next="lab2"]').addEventListener('click', function() {
        if (!pcaData.lab1Completed) {
            showNotification('请先完成当前实验', 'error');
            return;
        }
        switchTab('lab2');
    });
}

function updateSelectionCount() {
    const countElement = document.getElementById('selected-count');
    if (countElement) {
        countElement.textContent = pcaData.selectedPixels.length;
    }
}

function showMeanFaceFeedback() {
    const feedback = document.getElementById('meanface-feedback');
    if (!feedback) return;
    
    // 正确答案是笑脸3（大笑）
    const correctAnswer = 3;
    
    if (pcaData.selectedMeanFace === correctAnswer) {
        feedback.innerHTML = '<i class="fas fa-check"></i> 正确！大笑表情最接近平均脸';
        feedback.className = 'feedback correct';
    } else if (pcaData.selectedMeanFace) {
        feedback.innerHTML = `<i class="fas fa-times"></i> 再想想，正确答案是笑脸${correctAnswer}`;
        feedback.className = 'feedback incorrect';
    }
}

function showPixelFeedback() {
    const feedback = document.getElementById('pixel-feedback');
    if (!feedback) return;
    
    if (pcaData.selectedPixels.length === 0) {
        feedback.innerHTML = '';
        feedback.className = 'feedback';
    } else if (pcaData.selectedPixels.length < 3) {
        feedback.innerHTML = `已选择${pcaData.selectedPixels.length}个像素，还需要选择${3 - pcaData.selectedPixels.length}个`;
        feedback.className = 'feedback';
    } else {
        feedback.innerHTML = '已选择3个像素，可以提交答案了';
        feedback.className = 'feedback correct';
    }
}

function submitLab1Answers() {
    // 检查是否选择了平均脸
    if (!pcaData.selectedMeanFace) {
        showNotification('请先选择平均脸', 'error');
        return;
    }
    
    // 检查是否选择了3个像素
    if (pcaData.selectedPixels.length !== 3) {
        showNotification('请选择3个变化最大的像素', 'error');
        return;
    }
    
    // 计算得分
    const correctMeanFace = 3; // 正确答案
    const correctPixels = [
        {row: 3, col: 3}, // 嘴角左上
        {row: 3, col: 4}, // 嘴角右上
        {row: 2, col: 2}  // 左眼
    ];
    
    let score = 0;
    let feedback = '';
    
    // 平均脸得分
    if (pcaData.selectedMeanFace === correctMeanFace) {
        score += 50;
        feedback += '<p>✅ <strong>平均脸选择正确！</strong></p>';
    } else {
        feedback += `<p>❌ 平均脸选择错误，正确答案是笑脸${correctMeanFace}</p>`;
    }
    
    // 像素选择得分
    let matchedPixels = 0;
    pcaData.selectedPixels.forEach(userPixel => {
        const isMatch = correctPixels.some(correctPixel => 
            correctPixel.row === userPixel.row && correctPixel.col === userPixel.col
        );
        if (isMatch) matchedPixels++;
    });
    
    const pixelScore = Math.floor(matchedPixels / 3 * 50);
    score += pixelScore;
    
    feedback += `<p>📊 像素匹配：${matchedPixels}/3 正确</p>`;
    feedback += `<p>🎯 实验得分：${score}/100</p>`;
    
    // 显示比较结果
    showComparison(matchedPixels);
    
    // 标记完成
    pcaData.lab1Completed = true;
    updateProgress();
    
    showNotification('实验1完成！得分：' + score, 'success');
}

function showComparison(matchedPixels) {
    const userViz = document.getElementById('user-selection-viz');
    const mathViz = document.getElementById('math-result-viz');
    
    if (!userViz || !mathViz) return;
    
    // 用户选择可视化
    userViz.innerHTML = '';
    userViz.style.display = 'grid';
    userViz.style.gridTemplateColumns = 'repeat(8, 1fr)';
    userViz.style.gridTemplateRows = 'repeat(8, 1fr)';
    userViz.style.gap = '1px';
    userViz.style.width = '80px';
    userViz.style.height = '80px';
    userViz.style.margin = '0 auto';
    
    // 数学结果可视化
    mathViz.innerHTML = '';
    mathViz.style.display = 'grid';
    mathViz.style.gridTemplateColumns = 'repeat(8, 1fr)';
    mathViz.style.gridTemplateRows = 'repeat(8, 1fr)';
    mathViz.style.gap = '1px';
    mathViz.style.width = '80px';
    mathViz.style.height = '80px';
    mathViz.style.margin = '0 auto';
    
    // 渲染用户选择
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const userPixel = document.createElement('div');
            const mathPixel = document.createElement('div');
            
            // 检查是否为用户选择的像素
            const isSelected = pcaData.selectedPixels.some(p => 
                p.row === i && p.col === j
            );
            
            // 检查是否为数学上重要的像素
            const eigenValue = pcaData.eigenvectors[0][i][j];
            const isImportant = eigenValue > 0.1;
            
            userPixel.style.backgroundColor = isSelected ? '#fc8181' : '#f8fafc';
            mathPixel.style.backgroundColor = isImportant ? '#4facfe' : '#f8fafc';
            
            userViz.appendChild(userPixel);
            mathViz.appendChild(mathPixel);
        }
    }
}

function resetLab1() {
    pcaData.selectedMeanFace = null;
    pcaData.selectedPixels = [];
    
    // 重置UI
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    document.querySelectorAll('.selectable-pixel').forEach(pixel => {
        pixel.classList.remove('selected');
    });
    
    document.getElementById('meanface-feedback').innerHTML = '';
    document.getElementById('pixel-feedback').innerHTML = '';
    updateSelectionCount();
    
    pcaData.lab1Completed = false;
    updateProgress();
    
    showNotification('实验1已重置', 'info');
}

// ==================== 实验室2：表情合成 ====================
function initLab2() {
    pcaData.lab2Initialized = true;
    
    // 初始化滑块
    initSliders();
    
    // 设置事件监听器
    setupLab2Events();
    
    // 更新合成结果
    updateSynthesis();
}

function initSliders() {
    const sliders = ['slider1', 'slider2', 'slider3'];
    sliders.forEach((sliderId, index) => {
        const slider = document.getElementById(sliderId);
        const valueDisplay = document.getElementById(`val${index + 1}`);
        const coefDisplay = document.querySelectorAll('.coef')[index];
        
        if (slider) {
            slider.addEventListener('input', function() {
                const value = parseFloat(this.value);
                if (valueDisplay) valueDisplay.textContent = value.toFixed(1);
                if (coefDisplay) coefDisplay.textContent = value.toFixed(1);
                
                // 更新合成结果
                updateSynthesis();
            });
        }
    });
}

function setupLab2Events() {
    // 目标选择
    document.querySelectorAll('.target-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.target-btn').forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            const target = this.dataset.target;
            updateTarget(target);
        });
    });
    
    // 显示目标
    document.getElementById('reveal-target').addEventListener('click', function() {
        showNotification('显示目标会扣除10分', 'warning');
        // 这里可以实现显示目标的逻辑
    });
    
    // 提交合成
    document.getElementById('submit-synthesis').addEventListener('click', submitSynthesis);
    
    // 自动调整
    document.getElementById('auto-adjust').addEventListener('click', autoAdjust);
    
    // 下一步按钮
    document.querySelector('[data-next="lab3"]').addEventListener('click', function() {
        if (!pcaData.lab2Completed) {
            showNotification('请先完成当前实验', 'error');
            return;
        }
        switchTab('lab3');
    });
}

function updateTarget(target) {
    const descriptions = {
        slightly_happy: '目标：合成一个微微高兴的表情',
        slightly_sad: '目标：合成一个有点悲伤的表情',
        surprised: '目标：合成一个惊讶的表情'
    };
    
    const descElement = document.getElementById('target-desc');
    if (descElement) {
        descElement.textContent = descriptions[target] || '选择目标';
    }
    
    // 更新目标网格
    updateTargetGrid(target);
}

function updateTargetGrid(target) {
    const grid = document.getElementById('target-grid');
    if (!grid) return;
    
    // 根据目标生成不同的笑脸
    let targetData;
    switch(target) {
        case 'slightly_happy':
            targetData = generateTargetFace(0.3, -0.1, 0.05);
            break;
        case 'slightly_sad':
            targetData = generateTargetFace(-0.2, 0.1, 0.2);
            break;
        case 'surprised':
            targetData = generateTargetFace(0.1, 0.4, -0.1);
            break;
        default:
            targetData = pcaData.meanFace;
    }
    
    renderGrid(grid, targetData, false);
}

function generateTargetFace(coef1, coef2, coef3) {
    const result = Array(8).fill().map(() => Array(8).fill(0));
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            let value = pcaData.meanFace[i][j];
            
            // 加上特征向量的贡献
            if (pcaData.eigenvectors[0]) {
                value += coef1 * pcaData.eigenvectors[0][i][j];
            }
            if (pcaData.eigenvectors[1]) {
                value += coef2 * pcaData.eigenvectors[1][i][j];
            }
            if (pcaData.eigenvectors[2]) {
                value += coef3 * pcaData.eigenvectors[2][i][j];
            }
            
            // 限制在0-1之间
            result[i][j] = Math.max(0, Math.min(1, value));
        }
    }
    
    return result;
}

function updateSynthesis() {
    // 获取当前系数
    const coef1 = parseFloat(document.getElementById('slider1').value);
    const coef2 = parseFloat(document.getElementById('slider2').value);
    const coef3 = parseFloat(document.getElementById('slider3').value;
    
    // 生成合成表情
    const synthesized = generateTargetFace(coef1, coef2, coef3);
    
    // 更新合成网格
    const grid = document.getElementById('synthesis-grid');
    if (grid) {
        renderGrid(grid, synthesized, false);
    }
    
    // 更新相似度
    updateSimilarity(coef1, coef2, coef3);
}

function updateSimilarity(coef1, coef2, coef3) {
    // 获取当前目标
    const activeTarget = document.querySelector('.target-btn.active');
    if (!activeTarget) return;
    
    const target = activeTarget.dataset.target;
    
    // 目标系数
    let targetCoefs;
    switch(target) {
        case 'slightly_happy':
            targetCoefs = [0.3, -0.1, 0.05];
            break;
        case 'slightly_sad':
            targetCoefs = [-0.2, 0.1, 0.2];
            break;
        case 'surprised':
            targetCoefs = [0.1, 0.4, -0.1];
            break;
        default:
            targetCoefs = [0, 0, 0];
    }
    
    // 计算相似度
    let diff = 0;
    for (let i = 0; i < 3; i++) {
        diff += Math.abs(targetCoefs[i] - [coef1, coef2, coef3][i]);
    }
    
    // 相似度在0-1之间，1表示完全相似
    const similarity = Math.max(0, 1 - diff / 3);
    const similarityPercent = Math.round(similarity * 100);
    const error = 1 - similarity;
    
    // 更新显示
    const similarityElement = document.getElementById('similarity');
    const errorElement = document.getElementById('error');
    const similarityBar = document.getElementById('similarity-bar');
    const errorBar = document.getElementById('error-bar');
    
    if (similarityElement) similarityElement.textContent = similarityPercent + '%';
    if (errorElement) errorElement.textContent = error.toFixed(2);
    if (similarityBar) similarityBar.style.width = similarityPercent + '%';
    if (errorBar) errorBar.style.width = (error * 100) + '%';
}

function submitSynthesis() {
    // 获取当前相似度
    const similarityElement = document.getElementById('similarity');
    const similarity = parseInt(similarityElement.textContent);
    
    if (similarity >= 80) {
        showNotification(`合成成功！相似度：${similarity}%`, 'success');
        pcaData.lab2Completed = true;
        updateProgress();
    } else {
        showNotification(`相似度不足，请继续调整（当前：${similarity}%）`, 'error');
    }
}

function autoAdjust() {
    // 获取当前目标
    const activeTarget = document.querySelector('.target-btn.active');
    if (!activeTarget) return;
    
    const target = activeTarget.dataset.target;
    
    // 目标系数
    let targetCoefs;
    switch(target) {
        case 'slightly_happy':
            targetCoefs = [0.3, -0.1, 0.05];
            break;
        case 'slightly_sad':
            targetCoefs = [-0.2, 0.1, 0.2];
            break;
        case 'surprised':
            targetCoefs = [0.1, 0.4, -0.1];
            break;
        default:
            targetCoefs = [0, 0, 0];
    }
    
    // 逐步调整滑块
    const sliders = [
        { element: document.getElementById('slider1'), target: targetCoefs[0] },
        { element: document.getElementById('slider2'), target: targetCoefs[1] },
        { element: document.getElementById('slider3'), target: targetCoefs[2] }
    ];
    
    let adjusted = 0;
    sliders.forEach((slider, index) => {
        setTimeout(() => {
            const current = parseFloat(slider.element.value);
            const step = (slider.target - current) / 10;
            let count = 0;
            
            const interval = setInterval(() => {
                const newValue = parseFloat(slider.element.value) + step;
                slider.element.value = newValue;
                
                // 触发input事件
                slider.element.dispatchEvent(new Event('input'));
                
                count++;
                if (count >= 10) {
                    clearInterval(interval);
                    adjusted++;
                    
                    if (adjusted === 3) {
                        showNotification('自动调整完成！', 'success');
                    }
                }
            }, 100);
        }, index * 300);
    });
}

function resetLab2() {
    // 重置滑块
    document.getElementById('slider1').value = 0;
    document.getElementById('slider2').value = 0;
    document.getElementById('slider3').value = 0;
    
    // 触发input事件更新显示
    document.getElementById('slider1').dispatchEvent(new Event('input'));
    document.getElementById('slider2').dispatchEvent(new Event('input'));
    document.getElementById('slider3').dispatchEvent(new Event('input'));
    
    pcaData.lab2Completed = false;
    updateProgress();
    
    showNotification('实验2已重置', 'info');
}

// ==================== 实验室3：降维探索 ====================
function initLab3() {
    pcaData.lab3Initialized = true;
    
    // 初始化图表
    initCharts();
    
    // 设置事件监听器
    setupLab3Events();
    
    // 初始更新
    updateReconstruction();
}

function initCharts() {
    // 这里需要实现图表初始化
    // 由于代码长度限制，暂时省略详细实现
    console.log('图表初始化');
}

function setupLab3Events() {
    // 表情选择
    document.getElementById('face-selector').addEventListener('change', function() {
        updateOriginalFace(this.value);
        updateReconstruction();
    });
    
    // 维度滑块
    document.getElementById('k-slider').addEventListener('input', function() {
        const k = this.value;
        document.getElementById('k-value-display').textContent = k;
        updateReconstruction();
    });
    
    // 寻找最佳k值
    document.getElementById('find-optimal-k').addEventListener('click', findOptimalK);
    
    // 比较不同表情
    document.getElementById('compare-faces').addEventListener('click', compareFaces);
    
    // 初始更新
    updateOriginalFace('happy');
}

function updateOriginalFace(faceType) {
    const grid = document.getElementById('original-grid');
    if (!grid) return;
    
    let faceData;
    switch(faceType) {
        case 'happy':
            faceData = pcaData.smileys[0].data;
            break;
        case 'sad':
            faceData = pcaData.smileys[4].data;
            break;
        case 'surprised':
            // 惊讶表情数据
            faceData = [
                [0,0,1,1,1,1,0,0],
                [0,1,0,0,0,0,1,0],
                [1,0,0,0,0,0,0,1],
                [1,0,1,0,0,1,0,1],
                [1,0,0,0,0,0,0,1],
                [1,0,1,1,1,1,0,1],
                [0,1,0,0,0,0,1,0],
                [0,0,1,1,1,1,0,0]
            ];
            break;
        case 'angry':
            // 生气表情数据
            faceData = [
                [0,0,1,1,1,1,0,0],
                [0,1,0,0,0,0,1,0],
                [1,0,1,0,0,1,0,1],
                [1,0,0,0,0,0,0,1],
                [1,0,1,0,0,1,0,1],
                [1,0,0,1,1,0,0,1],
                [0,1,1,0,0,1,1,0],
                [0,0,1,1,1,1,0,0]
            ];
            break;
        default:
            faceData = pcaData.smileys[0].data;
    }
    
    renderGrid(grid, faceData, false);
}

function updateReconstruction() {
    const k = parseInt(document.getElementById('k-slider').value);
    const faceType = document.getElementById('face-selector').value;
    
    // 获取原始数据
    let originalData;
    switch(faceType) {
        case 'happy':
            originalData = pcaData.smileys[0].data;
            break;
        case 'sad':
            originalData = pcaData.smileys[4].data;
            break;
        case 'surprised':
            originalData = [
                [0,0,1,1,1,1,0,0],
                [0,1,0,0,0,0,1,0],
                [1,0,0,0,0,0,0,1],
                [1,0,1,0,0,1,0,1],
                [1,0,0,0,0,0,0,1],
                [1,0,1,1,1,1,0,1],
                [0,1,0,0,0,0,1,0],
                [0,0,1,1,1,1,0,0]
            ];
            break;
        case 'angry':
            originalData = [
                [0,0,1,1,1,1,0,0],
                [0,1,0,0,0,0,1,0],
                [1,0,1,0,0,1,0,1],
                [1,0,0,0,0,0,0,1],
                [1,0,1,0,0,1,0,1],
                [1,0,0,1,1,0,0,1],
                [0,1,1,0,0,1,1,0],
                [0,0,1,1,1,1,0,0]
            ];
            break;
        default:
            originalData = pcaData.smileys[0].data;
    }
    
    // 重建数据（简化）
    const reconstructed = reconstructFace(originalData, k);
    
    // 更新重建网格
    const reconGrid = document.getElementById('reconstructed-grid');
    if (reconGrid) {
        renderGrid(reconGrid, reconstructed, false);
    }
    
    // 更新差异图
    updateDifference(originalData, reconstructed);
    
    // 更新统计信息
    updateStats(k);
}

function reconstructFace(originalData, k) {
    // 简化的重建：只使用前k个特征向量
    const reconstructed = Array(8).fill().map(() => Array(8).fill(0));
    
    // 从平均脸开始
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            reconstructed[i][j] = pcaData.meanFace[i][j];
        }
    }
    
    // 加上特征向量的贡献（简化）
    for (let n = 0; n < k; n++) {
        if (pcaData.eigenvectors[n]) {
            const coef = Math.random() * 0.5 - 0.25; // 随机系数
            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    reconstructed[i][j] += coef * pcaData.eigenvectors[n][i][j];
                }
            }
        }
    }
    
    // 限制在0-1之间
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            reconstructed[i][j] = Math.max(0, Math.min(1, reconstructed[i][j]));
        }
    }
    
    return reconstructed;
}

function updateDifference(originalData, reconstructedData) {
    const diffGrid = document.getElementById('difference-grid');
    if (!diffGrid) return;
    
    diffGrid.innerHTML = '';
    diffGrid.style.display = 'grid';
    diffGrid.style.gridTemplateColumns = 'repeat(8, 1fr)';
    diffGrid.style.gridTemplateRows = 'repeat(8, 1fr)';
    diffGrid.style.gap = '1px';
    
    let totalError = 0;
    
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const pixel = document.createElement('div');
            const error = Math.abs(originalData[i][j] - reconstructedData[i][j]);
            totalError += error;
            
            // 误差越大，红色越深
            const intensity = Math.min(255, Math.floor(error * 255));
            pixel.style.backgroundColor = `rgb(255, ${255 - intensity}, ${255 - intensity})`;
            
            diffGrid.appendChild(pixel);
        }
    }
    
    // 更新误差显示
    const avgError = totalError / 64;
    document.getElementById('reconstruction-error').textContent = avgError.toFixed(2);
}

function updateStats(k) {
    // 计算解释方差
    let totalVariance = 0;
    let explainedVariance = 0;
    
    for (let i = 0; i < pcaData.eigenvalues.length; i++) {
        totalVariance += pcaData.eigenvalues[i];
        if (i < k) {
            explainedVariance += pcaData.eigenvalues[i];
        }
    }
    
    const varianceRatio = totalVariance > 0 ? explainedVariance / totalVariance : 0;
    const variancePercent = Math.round(varianceRatio * 100);
    
    // 计算压缩比
    const originalSize = 64; // 64个像素
    const compressedSize = k + 64; // k个系数 + 平均脸
    const compressionRatio = (1 - compressedSize / (originalSize * 5)) * 100; // 假设有5个原始表情
    
    // 更新显示
    document.getElementById('variance-explained').textContent = variancePercent + '%';
    document.getElementById('compression-ratio').textContent = compressionRatio.toFixed(1) + '%';
}

function findOptimalK() {
    // 寻找最佳k值（方差解释>85%的最小k）
    let optimalK = 3;
    for (let k = 1; k <= 8; k++) {
        let explained = 0;
        let total = 0;
        
        for (let i = 0; i < pcaData.eigenvalues.length; i++) {
            total += pcaData.eigenvalues[i];
            if (i < k) {
                explained += pcaData.eigenvalues[i];
            }
        }
        
        if (explained / total >= 0.85) {
            optimalK = k;
            break;
        }
    }
    
    // 设置滑块到最佳值
    document.getElementById('k-slider').value = optimalK;
    document.getElementById('k-slider').dispatchEvent(new Event('input'));
    
    showNotification(`找到最佳k值：${optimalK}（解释方差>85%）`, 'success');
    
    // 标记完成
    pcaData.lab3Completed = true;
    updateProgress();
}

function compareFaces() {
    showNotification('比较功能开发中...', 'info');
}

function resetLab3() {
    document.getElementById('k-slider').value = 3;
    document.getElementById('k-slider').dispatchEvent(new Event('input'));
    
    pcaData.lab3Completed = false;
    updateProgress();
    
    showNotification('实验3已重置', 'info');
}