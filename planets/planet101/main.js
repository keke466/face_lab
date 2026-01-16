/**
 * 阿尔法星 - 2D PCA实验核心代码
 * 所有功能都确保可用
 */

class PCA2DExperiment {
    constructor() {
        // 画布和上下文
        this.canvas = document.getElementById('pcaCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // 数据存储
        this.points = [];          // 原始点：[{x, y, id}]
        this.meanPoint = null;     // 均值点
        this.centeredPoints = [];  // 中心化后的点
        this.eigenvectors = [];    // 特征向量
        this.eigenvalues = [];     // 特征值
        this.projectedPoints = []; // 投影后的点
        
        // 状态变量
        this.currentStep = 1;
        this.currentTool = 'add';
        this.isAnimating = false;
        this.pointSize = 8;
        
        // 画布坐标转换
        this.canvasRect = null;
        this.scaleX = 1;
        this.scaleY = 1;
        this.offsetX = 0;
        this.offsetY = 0;
        
        // 初始化
        this.init();
    }
    
    init() {
        console.log('2D PCA实验初始化...');
        
        // 设置画布大小
        this.updateCanvasSize();
        
        // 设置事件监听器
        this.setupEventListeners();
        
        // 初始绘制
        this.draw();
        
        // 更新UI
        this.updateUI();
        
        // 添加一些初始点（示例）
        this.addExamplePoints();
    }
    
    updateCanvasSize() {
        const container = this.canvas.parentElement;
        this.canvas.width = container.clientWidth;
        this.canvas.height = container.clientHeight;
        
        // 保存转换参数
        this.canvasRect = this.canvas.getBoundingClientRect();
        
        // 计算坐标转换
        this.scaleX = this.canvas.width / 20;  // 画布坐标范围：-10到10
        this.scaleY = this.canvas.height / 20;
        this.offsetX = this.canvas.width / 2;
        this.offsetY = this.canvas.height / 2;
    }
    
    setupEventListeners() {
        // 画布点击事件
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        
        // 画布鼠标移动事件
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        
        // 画布鼠标按下（用于拖拽）
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        
        // 参数控件事件
        document.getElementById('pointSize').addEventListener('input', (e) => {
            this.pointSize = parseInt(e.target.value);
            document.getElementById('pointSizeValue').textContent = this.pointSize;
            this.draw();
        });
        
        // 显示/隐藏控件
        document.getElementById('showMean').addEventListener('change', () => this.draw());
        document.getElementById('showAxes').addEventListener('change', () => this.draw());
        document.getElementById('showEigenvectors').addEventListener('change', () => this.draw());
        
        // 窗口大小变化
        window.addEventListener('resize', () => {
            this.updateCanvasSize();
            this.draw();
        });
    }
    
    // 坐标转换：画布坐标 -> 数学坐标
    canvasToMath(x, y) {
        const mathX = (x - this.offsetX) / this.scaleX;
        const mathY = -(y - this.offsetY) / this.scaleY;
        return { x: mathX, y: mathY };
    }
    
    // 坐标转换：数学坐标 -> 画布坐标
    mathToCanvas(mathX, mathY) {
        const canvasX = mathX * this.scaleX + this.offsetX;
        const canvasY = -mathY * this.scaleY + this.offsetY;
        return { x: canvasX, y: canvasY };
    }
    
    handleCanvasClick(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const mathCoord = this.canvasToMath(x, y);
        
        switch(this.currentTool) {
            case 'add':
                this.addPoint(mathCoord.x, mathCoord.y);
                break;
            case 'delete':
                this.deleteNearestPoint(mathCoord.x, mathCoord.y);
                break;
        }
        
        this.draw();
        this.updateUI();
    }
    
    handleMouseMove(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const mathCoord = this.canvasToMath(x, y);
        
        // 更新坐标显示
        document.getElementById('coordDisplay').textContent = 
            `坐标: (${mathCoord.x.toFixed(2)}, ${mathCoord.y.toFixed(2)})`;
    }
    
    handleMouseDown(e) {
        if (this.currentTool === 'move') {
            const rect = this.canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const mathCoord = this.canvasToMath(x, y);
            
            const nearestPoint = this.findNearestPoint(mathCoord.x, mathCoord.y);
            if (nearestPoint && this.getDistance(mathCoord, nearestPoint) < 0.5) {
                // 开始拖拽
                const onMouseMove = (moveEvent) => {
                    const moveX = moveEvent.clientX - rect.left;
                    const moveY = moveEvent.clientY - rect.top;
                    const moveMathCoord = this.canvasToMath(moveX, moveY);
                    
                    nearestPoint.x = moveMathCoord.x;
                    nearestPoint.y = moveMathCoord.y;
                    
                    this.draw();
                    this.updateUI();
                };
                
                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                };
                
                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            }
        }
    }
    
    // ========== 点操作函数 ==========
    
    addPoint(x, y) {
        const id = Date.now() + Math.random();
        this.points.push({ x, y, id });
        
        // 重置计算状态
        this.resetCalculations();
        
        console.log(`添加点: (${x.toFixed(2)}, ${y.toFixed(2)})`);
    }
    
    addRandomPoints(count) {
        for (let i = 0; i < count; i++) {
            const x = (Math.random() - 0.5) * 8;
            const y = (Math.random() - 0.5) * 8;
            this.addPoint(x, y);
        }
        this.draw();
        this.updateUI();
    }
    
    addGridPoints() {
        const grid = [-4, -2, 0, 2, 4];
        for (let x of grid) {
            for (let y of grid) {
                this.addPoint(x + Math.random() * 0.5 - 0.25, 
                             y + Math.random() * 0.5 - 0.25);
            }
        }
        this.draw();
        this.updateUI();
    }
    
    addExamplePoints() {
        // 添加一些示例点（大致在一条线上）
        this.addPoint(-4, -3);
        this.addPoint(-3, -2);
        this.addPoint(-2, -1);
        this.addPoint(-1, 0);
        this.addPoint(0, 1);
        this.addPoint(1, 2);
        this.addPoint(2, 3);
        this.addPoint(3, 4);
        
        // 添加一些噪声点
        this.addPoint(-2, 2);
        this.addPoint(2, -2);
    }
    
    deleteNearestPoint(x, y) {
        const nearestPoint = this.findNearestPoint(x, y);
        if (nearestPoint && this.getDistance({x, y}, nearestPoint) < 0.5) {
            this.points = this.points.filter(p => p.id !== nearestPoint.id);
            this.resetCalculations();
            console.log('删除点');
        }
    }
    
    findNearestPoint(x, y) {
        let nearest = null;
        let minDistance = Infinity;
        
        for (const point of this.points) {
            const distance = this.getDistance({x, y}, point);
            if (distance < minDistance) {
                minDistance = distance;
                nearest = point;
            }
        }
        
        return nearest;
    }
    
    getDistance(p1, p2) {
        return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
    }
    
    clearAllPoints() {
        this.points = [];
        this.resetCalculations();
        this.draw();
        this.updateUI();
        console.log('清空所有点');
    }
    
    undoLastPoint() {
        if (this.points.length > 0) {
            this.points.pop();
            this.resetCalculations();
            this.draw();
            this.updateUI();
            console.log('撤销上一个点');
        }
    }
    
    resetCalculations() {
        this.meanPoint = null;
        this.centeredPoints = [];
        this.eigenvectors = [];
        this.eigenvalues = [];
        this.projectedPoints = [];
        this.currentStep = 1;
        this.updateProgressBar();
    }
    
    // ========== PCA计算函数 ==========
    
    calculateMean() {
        if (this.points.length === 0) {
            alert('请先添加一些点！');
            return;
        }
        
        let sumX = 0, sumY = 0;
        for (const point of this.points) {
            sumX += point.x;
            sumY += point.y;
        }
        
        this.meanPoint = {
            x: sumX / this.points.length,
            y: sumY / this.points.length
        };
        
        this.currentStep = 2;
        this.updateUI();
        this.draw();
        this.updateProgressBar();
    }
    
    centerData() {
        if (!this.meanPoint) {
            alert('请先计算均值！');
            return;
        }
        
        this.centeredPoints = this.points.map(point => ({
            x: point.x - this.meanPoint.x,
            y: point.y - this.meanPoint.y,
            id: point.id
        }));
        
        this.currentStep = 3;
        this.updateUI();
        this.draw();
        this.updateProgressBar();
    }
    
    calculateCovariance() {
        if (this.centeredPoints.length === 0) {
            alert('请先中心化数据！');
            return;
        }
        
        const n = this.centeredPoints.length;
        let covXX = 0, covXY = 0, covYY = 0;
        
        for (const point of this.centeredPoints) {
            covXX += point.x * point.x;
            covXY += point.x * point.y;
            covYY += point.y * point.y;
        }
        
        this.covMatrix = [
            [covXX / (n - 1), covXY / (n - 1)],
            [covXY / (n - 1), covYY / (n - 1)]
        ];
        
        this.currentStep = 4;
        this.updateUI();
        this.draw();
        this.updateProgressBar();
    }
    
    calculateEigenvectors() {
        if (!this.covMatrix) {
            alert('请先计算协方差矩阵！');
            return;
        }
        
        // 2x2矩阵的特征值分解
        const [a, b] = this.covMatrix[0];
        const [c, d] = this.covMatrix[1];
        
        // 计算特征值
        const trace = a + d;
        const determinant = a * d - b * c;
        
        const discriminant = Math.sqrt(trace * trace - 4 * determinant);
        this.eigenvalues = [
            (trace + discriminant) / 2,
            (trace - discriminant) / 2
        ];
        
        // 计算特征向量
        this.eigenvectors = [];
        
        // 第一个特征向量
        if (b !== 0) {
            const lambda = this.eigenvalues[0];
            const v1 = 1;
            const v2 = (lambda - a) / b;
            const norm = Math.sqrt(v1 * v1 + v2 * v2);
            this.eigenvectors.push([v1 / norm, v2 / norm]);
        } else {
            this.eigenvectors.push([1, 0]);
        }
        
        // 第二个特征向量（正交）
        this.eigenvectors.push([
            -this.eigenvectors[0][1],
            this.eigenvectors[0][0]
        ]);
        
        this.currentStep = 5;
        this.updateUI();
        this.draw();
        this.updateProgressBar();
    }
    
    projectAndReconstruct() {
        if (this.eigenvectors.length === 0) {
            alert('请先计算特征向量！');
            return;
        }
        
        // 投影到第一个主成分
        const eigenvector = this.eigenvectors[0];
        this.projectedPoints = this.centeredPoints.map(point => {
            // 投影系数
            const coefficient = point.x * eigenvector[0] + point.y * eigenvector[1];
            
            // 重建的点
            const reconstructed = {
                x: coefficient * eigenvector[0],
                y: coefficient * eigenvector[1]
            };
            
            return {
                original: point,
                coefficient: coefficient,
                reconstructed: reconstructed
            };
        });
        
        this.currentStep = 6;
        this.updateUI();
        this.draw();
        this.updateProgressBar();
    }
    
    runFullPCA() {
        if (this.points.length < 2) {
            alert('请至少添加2个点！');
            return;
        }
        
        this.calculateMean();
        setTimeout(() => {
            this.centerData();
            setTimeout(() => {
                this.calculateCovariance();
                setTimeout(() => {
                    this.calculateEigenvectors();
                    setTimeout(() => {
                        this.projectAndReconstruct();
                    }, 800);
                }, 800);
            }, 800);
        }, 800);
    }
    
    // ========== 绘图函数 ==========
    
    draw() {
        // 清空画布
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 绘制网格
        this.drawGrid();
        
        // 绘制坐标轴
        if (document.getElementById('showAxes').checked) {
            this.drawAxes();
        }
        
        // 绘制点
        this.drawPoints();
        
        // 绘制均值点
        if (this.meanPoint && document.getElementById('showMean').checked) {
            this.drawMeanPoint();
        }
        
        // 绘制特征向量
        if (this.eigenvectors.length > 0 && document.getElementById('showEigenvectors').checked) {
            this.drawEigenvectors();
        }
        
        // 绘制投影线
        if (this.projectedPoints.length > 0) {
            this.drawProjections();
        }
    }
    
    drawGrid() {
        this.ctx.strokeStyle = 'rgba(100, 180, 255, 0.1)';
        this.ctx.lineWidth = 1;
        
        // 垂直线
        for (let x = -10; x <= 10; x += 2) {
            const canvasX = this.mathToCanvas(x, 0).x;
            this.ctx.beginPath();
            this.ctx.moveTo(canvasX, 0);
            this.ctx.lineTo(canvasX, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 水平线
        for (let y = -10; y <= 10; y += 2) {
            const canvasY = this.mathToCanvas(0, y).y;
            this.ctx.beginPath();
            this.ctx.moveTo(0, canvasY);
            this.ctx.lineTo(this.canvas.width, canvasY);
            this.ctx.stroke();
        }
    }
    
    drawAxes() {
        this.ctx.strokeStyle = '#26a269';
        this.ctx.lineWidth = 2;
        
        // X轴
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.offsetY);
        this.ctx.lineTo(this.canvas.width, this.offsetY);
        this.ctx.stroke();
        
        // Y轴
        this.ctx.beginPath();
        this.ctx.moveTo(this.offsetX, 0);
        this.ctx.lineTo(this.offsetX, this.canvas.height);
        this.ctx.stroke();
    }
    
    drawPoints() {
        const pointsToDraw = this.centeredPoints.length > 0 ? 
                           this.centeredPoints : this.points;
        
        for (const point of pointsToDraw) {
            const canvasCoord = this.mathToCanvas(point.x, point.y);
            
            // 绘制点
            this.ctx.beginPath();
            this.ctx.arc(canvasCoord.x, canvasCoord.y, this.pointSize, 0, Math.PI * 2);
            this.ctx.fillStyle = '#ff6b9d';
            this.ctx.fill();
            
            // 点边框
            this.ctx.strokeStyle = '#ffffff';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
        }
    }
    
    drawMeanPoint() {
        const canvasCoord = this.mathToCanvas(this.meanPoint.x, this.meanPoint.y);
        
        // 绘制均值点（黄色）
        this.ctx.beginPath();
        this.ctx.arc(canvasCoord.x, canvasCoord.y, this.pointSize + 4, 0, Math.PI * 2);
        this.ctx.fillStyle = '#ffd166';
        this.ctx.fill();
        
        this.ctx.strokeStyle = '#ffffff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    drawEigenvectors() {
        // 从均值点开始绘制特征向量
        const startX = this.meanPoint ? this.meanPoint.x : 0;
        const startY = this.meanPoint ? this.meanPoint.y : 0;
        
        for (let i = 0; i < Math.min(2, this.eigenvectors.length); i++) {
            const eigenvector = this.eigenvectors[i];
            const eigenvalue = this.eigenvalues[i];
            
            // 向量长度与特征值大小相关
            const scale = Math.sqrt(Math.abs(eigenvalue)) * 3;
            const endX = startX + eigenvector[0] * scale;
            const endY = startY + eigenvector[1] * scale;
            
            const startCanvas = this.mathToCanvas(startX, startY);
            const endCanvas = this.mathToCanvas(endX, endY);
            
            // 绘制向量线
            this.ctx.beginPath();
            this.ctx.moveTo(startCanvas.x, startCanvas.y);
            this.ctx.lineTo(endCanvas.x, endCanvas.y);
            this.ctx.strokeStyle = i === 0 ? '#ff6b6b' : '#ffd166';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
            
            // 绘制箭头
            this.drawArrow(startCanvas, endCanvas, i === 0 ? '#ff6b6b' : '#ffd166');
        }
    }
    
    drawArrow(start, end, color) {
        const headLength = 15;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const angle = Math.atan2(dy, dx);
        
        // 箭头线1
        this.ctx.beginPath();
        this.ctx.moveTo(end.x, end.y);
        this.ctx.lineTo(
            end.x - headLength * Math.cos(angle - Math.PI / 6),
            end.y - headLength * Math.sin(angle - Math.PI / 6)
        );
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
        
        // 箭头线2
        this.ctx.beginPath();
        this.ctx.moveTo(end.x, end.y);
        this.ctx.lineTo(
            end.x - headLength * Math.cos(angle + Math.PI / 6),
            end.y - headLength * Math.sin(angle + Math.PI / 6)
        );
        this.ctx.stroke();
    }
    
    drawProjections() {
        for (const proj of this.projectedPoints) {
            const originalCanvas = this.mathToCanvas(
                proj.original.x + (this.meanPoint?.x || 0),
                proj.original.y + (this.meanPoint?.y || 0)
            );
            
            const reconstructedCanvas = this.mathToCanvas(
                proj.reconstructed.x + (this.meanPoint?.x || 0),
                proj.reconstructed.y + (this.meanPoint?.y || 0)
            );
            
            // 绘制原始点到重建点的连线
            this.ctx.beginPath();
            this.ctx.moveTo(originalCanvas.x, originalCanvas.y);
            this.ctx.lineTo(reconstructedCanvas.x, reconstructedCanvas.y);
            this.ctx.strokeStyle = 'rgba(76, 201, 240, 0.6)';
            this.ctx.lineWidth = 1;
            this.ctx.stroke();
            
            // 绘制重建点（蓝色）
            this.ctx.beginPath();
            this.ctx.arc(reconstructedCanvas.x, reconstructedCanvas.y, this.pointSize - 2, 0, Math.PI * 2);
            this.ctx.fillStyle = 'rgba(76, 201, 240, 0.8)';
            this.ctx.fill();
        }
    }
    
    // ========== UI更新函数 ==========
    
    updateUI() {
        // 更新点数量
        document.getElementById('pointCount').textContent = this.points.length;
        
        // 更新步骤
        document.getElementById('stepCount').textContent = this.currentStep;
        
        // 更新解释方差
        if (this.eigenvalues.length > 0) {
            const totalVariance = this.eigenvalues[0] + this.eigenvalues[1];
            const explainedVariance = totalVariance > 0 ? 
                (this.eigenvalues[0] / totalVariance) * 100 : 0;
            
            document.getElementById('varianceValue').textContent = 
                `${explainedVariance.toFixed(1)}%`;
        }
        
        // 更新变量显示
        this.updateVariableTable();
        
        // 更新公式显示
        this.updateFormulaDisplay();
        
        // 更新步骤高亮
        this.updateStepHighlight();
        
        // 更新撤销按钮状态
        document.getElementById('undoBtn').disabled = this.points.length === 0;
    }
    
    updateVariableTable() {
        document.getElementById('varN').textContent = this.points.length;
        
        if (this.meanPoint) {
            document.getElementById('varMean').textContent = 
                `(${this.meanPoint.x.toFixed(2)}, ${this.meanPoint.y.toFixed(2)})`;
        }
        
        if (this.covMatrix) {
            document.getElementById('varCov').innerHTML = 
                `[${this.covMatrix[0][0].toFixed(2)}, ${this.covMatrix[0][1].toFixed(2)};<br>` +
                `${this.covMatrix[1][0].toFixed(2)}, ${this.covMatrix[1][1].toFixed(2)}]`;
        }
        
        if (this.eigenvalues.length > 0) {
            document.getElementById('varEigenvalues').textContent = 
                `[${this.eigenvalues[0].toFixed(2)}, ${this.eigenvalues[1].toFixed(2)}]`;
            
            document.getElementById('varEigenvectors').innerHTML = 
                `[(${this.eigenvectors[0][0].toFixed(2)}, ${this.eigenvectors[0][1].toFixed(2)}),<br>` +
                `(${this.eigenvectors[1][0].toFixed(2)}, ${this.eigenvectors[1][1].toFixed(2)})]`;
            
            const totalVariance = this.eigenvalues[0] + this.eigenvalues[1];
            const explainedVariance = totalVariance > 0 ? 
                (this.eigenvalues[0] / totalVariance) * 100 : 0;
            
            document.getElementById('varVariance').textContent = 
                `${explainedVariance.toFixed(2)}%`;
        }
    }
    
    updateFormulaDisplay() {
        const formulaDisplay = document.getElementById('formulaDisplay');
        const detailContent = document.getElementById('detailContent');
        
        switch(this.currentStep) {
            case 1:
                formulaDisplay.innerHTML = `
                    <div class="formula-title">数据点表示</div>
                    <div class="formula-math">
                        <span class="math-var">x<sub>i</sub></span> = 
                        <span class="math-bracket">(</span>
                        <span class="math-var">x<sub>i1</sub></span>, 
                        <span class="math-var">x<sub>i2</sub></span>
                        <span class="math-bracket">)</span>
                    </div>
                    <div class="formula-explain">
                        每个数据点用二维向量表示，第一维是横坐标，第二维是纵坐标。
                        您可以在画布上点击添加点。
                    </div>
                `;
                detailContent.innerHTML = `
                    <p><strong>第一步：收集数据</strong></p>
                    <p>PCA的第一步是收集数据。在这个实验中，每个数据点是一个二维向量。</p>
                    <p>尝试添加一些点，观察它们在二维平面上的分布。</p>
                    <p>建议：</p>
                    <ol>
                        <li>点击画布添加单个点</li>
                        <li>使用"随机添加5个点"快速生成数据</li>
                        <li>添加大约8-12个点效果最佳</li>
                    </ol>
                `;
                break;
                
            case 2:
                formulaDisplay.innerHTML = `
                    <div class="formula-title">均值公式</div>
                    <div class="formula-math">
                        μ = <span class="frac"><span>1</span><span>n</span></span> 
                        ∑<span class="sum-limits"><sub>i=1</sub><sup>n</sup></span> 
                        <span class="math-var">x<sub>i</sub></span>
                    </div>
                    <div class="formula-explain">
                        计算所有数据点的平均值。均值点μ（黄色大点）表示数据的中心位置。
                    </div>
                `;
                detailContent.innerHTML = `
                    <p><strong>第二步：计算均值</strong></p>
                    <p>均值是所有数据点的平均位置，表示数据的"中心"。在PCA中，我们首先需要将数据中心化。</p>
                    <p>数学公式：</p>
                    <p>μ = (1/n) Σ x_i</p>
                    <p>其中n是点的数量，x_i是每个点的坐标。</p>
                    <p>观察：</p>
                    <ul>
                        <li>均值点（黄色）出现在所有点的中心位置</li>
                        <li>如果移动点，均值点会相应变化</li>
                    </ul>
                `;
                break;
                
            case 3:
                formulaDisplay.innerHTML = `
                    <div class="formula-title">数据中心化</div>
                    <div class="formula-math">
                        <span class="math-var">x̃<sub>i</sub></span> = 
                        <span class="math-var">x<sub>i</sub></span> - μ
                    </div>
                    <div class="formula-explain">
                        每个点减去均值，得到中心化的数据。现在数据的中心在坐标原点(0,0)。
                    </div>
                `;
                detailContent.innerHTML = `
                    <p><strong>第三步：数据中心化</strong></p>
                    <p>中心化是将每个点减去均值，使数据的中心移动到坐标原点。</p>
                    <p>数学公式：</p>
                    <p>x̃_i = x_i - μ</p>
                    <p>几何意义：</p>
                    <ul>
                        <li>所有点整体平移到以原点为中心</li>
                        <li>中心化后，数据的平均位置在(0,0)</li>
                        <li>这是PCA的重要预处理步骤</li>
                    </ul>
                    <p>观察画布：所有点都移动了，但它们的相对位置保持不变。</p>
                `;
                break;
                
            case 4:
                formulaDisplay.innerHTML = `
                    <div class="formula-title">协方差矩阵</div>
                    <div class="formula-math">
                        C = <span class="frac"><span>1</span><span>n-1</span></span> 
                        ∑ (<span class="math-var">x̃<sub>i</sub></span>)(<span class="math-var">x̃<sub>i</sub></span>)<sup>T</sup>
                    </div>
                    <div class="formula-explain">
                        协方差矩阵描述了数据在各个方向上的变化程度。对角线元素是方差，非对角线元素是协方差。
                    </div>
                `;
                detailContent.innerHTML = `
                    <p><strong>第四步：计算协方差矩阵</strong></p>
                    <p>协方差矩阵描述了数据的分布形状：</p>
                    <ul>
                        <li>C[0][0]: x方向的方差（数据在x方向的分散程度）</li>
                        <li>C[1][1]: y方向的方差（数据在y方向的分散程度）</li>
                        <li>C[0][1] = C[1][0]: x和y的协方差（两个方向的相关性）</li>
                    </ul>
                    <p>观察：</p>
                    <ul>
                        <li>如果数据主要沿某个方向分布，那个方向的方差会较大</li>
                        <li>如果数据是圆形的，两个方差接近相等</li>
                        <li>查看右侧表格中的协方差矩阵数值</li>
                    </ul>
                `;
                break;
                
            case 5:
                const totalVariance = this.eigenvalues[0] + this.eigenvalues[1];
                const explainedVariance = totalVariance > 0 ? 
                    (this.eigenvalues[0] / totalVariance) * 100 : 0;
                    
                formulaDisplay.innerHTML = `
                    <div class="formula-title">特征值分解</div>
                    <div class="formula-math">
                        C<span class="math-var">v<sub>i</sub></span> = 
                        <span class="math-var">λ<sub>i</sub></span>
                        <span class="math-var">v<sub>i</sub></span>
                    </div>
                    <div class="formula-explain">
                        协方差矩阵的特征向量v_i表示数据的主要变化方向，
                        特征值λ_i表示在该方向上的方差大小。
                        第一个特征向量（红色箭头）解释了${explainedVariance.toFixed(1)}%的方差。
                    </div>
                `;
                detailContent.innerHTML = `
                    <p><strong>第五步：找到主成分方向</strong></p>
                    <p>特征向量是数据的主要变化方向：</p>
                    <ul>
                        <li>v₁（红色箭头）：第一主成分，方差最大的方向</li>
                        <li>v₂（黄色箭头）：第二主成分，与v₁正交的方向</li>
                    </ul>
                    <p>特征值表示在该方向上的方差大小：</p>
                    <ul>
                        <li>λ₁ = ${this.eigenvalues[0]?.toFixed(2) || 0}: v₁方向的方差</li>
                        <li>λ₂ = ${this.eigenvalues[1]?.toFixed(2) || 0}: v₂方向的方差</li>
                    </ul>
                    <p>第一主成分解释了${explainedVariance.toFixed(1)}%的总方差！</p>
                `;
                break;
                
            case 6:
                formulaDisplay.innerHTML = `
                    <div class="formula-title">投影与重建</div>
                    <div class="formula-math">
                        <span class="math-var">w<sub>i</sub></span> = 
                        <span class="math-var">x̃<sub>i</sub></span>·<span class="math-var">v<sub>1</sub></span><br>
                        <span class="math-var">x̂<sub>i</sub></span> = 
                        <span class="math-var">w<sub>i</sub></span><span class="math-var">v<sub>1</sub></span>
                    </div>
                    <div class="formula-explain">
                        将每个点投影到第一主成分上得到系数w_i，然后用w_i乘以v₁重建数据。
                        蓝色点是重建的点，灰线是原始点到重建点的距离（重建误差）。
                    </div>
                `;
                detailContent.innerHTML = `
                    <p><strong>第六步：投影与重建</strong></p>
                    <p>PCA的核心思想：用主要成分近似表示所有数据。</p>
                    <p>过程：</p>
                    <ol>
                        <li>将每个点投影到第一主成分上，得到一个系数w_i</li>
                        <li>用这个系数重建点：x̂_i = w_i × v₁</li>
                        <li>重建点都在第一主成分这条直线上</li>
                    </ol>
                    <p>观察：</p>
                    <ul>
                        <li>蓝色点是重建的点，都在红色箭头的方向上</li>
                        <li>灰线表示重建误差（信息损失）</li>
                        <li>如果数据原本就近似在一条线上，重建误差会很小</li>
                    </ul>
                    <p>这就是PCA降维：将二维数据降为一维（只有一个系数w_i）！</p>
                `;
                break;
        }
    }
    
    updateStepHighlight() {
        document.querySelectorAll('.step').forEach(step => {
            step.classList.remove('active');
        });
        
        const currentStepElement = document.querySelector(`.step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
        }
    }
    
    updateProgressBar() {
        const progress = (this.currentStep / 6) * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
    }
    
    // ========== 工具切换 ==========
    
    switchTool(tool) {
        this.currentTool = tool;
        
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        event.target.classList.add('active');
        
        switch(tool) {
            case 'add':
                this.canvas.style.cursor = 'crosshair';
                break;
            case 'move':
                this.canvas.style.cursor = 'move';
                break;
            case 'delete':
                this.canvas.style.cursor = 'not-allowed';
                break;
        }
    }
    
    // ========== 动画控制 ==========
    
    toggleAnimation() {
        this.isAnimating = !this.isAnimating;
        const playBtn = document.getElementById('playBtn');
        
        if (this.isAnimating) {
            playBtn.innerHTML = '⏸️ 暂停动画';
        } else {
            playBtn.innerHTML = '▶️ 播放动画';
        }
    }
    
    nextStep() {
        if (this.currentStep < 6) {
            this.currentStep++;
            
            switch(this.currentStep) {
                case 2:
                    this.calculateMean();
                    break;
                case 3:
                    this.centerData();
                    break;
                case 4:
                    this.calculateCovariance();
                    break;
                case 5:
                    this.calculateEigenvectors();
                    break;
                case 6:
                    this.projectAndReconstruct();
                    break;
            }
        }
    }
    
    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateUI();
            this.draw();
            this.updateProgressBar();
        }
    }
    
    resetExperiment() {
        this.points = [];
        this.resetCalculations();
        this.draw();
        this.updateUI();
        
        setTimeout(() => {
            this.addExamplePoints();
        }, 100);
    }
}

// ========== 全局函数 ==========

let pcaExperiment;

function initPCAExperiment() {
    pcaExperiment = new PCA2DExperiment();
}

// 工具函数导出到全局
function switchTool(tool) { if (pcaExperiment) pcaExperiment.switchTool(tool); }
function clearAllPoints() { if (pcaExperiment) pcaExperiment.clearAllPoints(); }
function addRandomPoints(count) { if (pcaExperiment) pcaExperiment.addRandomPoints(count); }
function addGridPoints() { if (pcaExperiment) pcaExperiment.addGridPoints(); }
function undoLastPoint() { if (pcaExperiment) pcaExperiment.undoLastPoint(); }
function calculateMean() { if (pcaExperiment) pcaExperiment.calculateMean(); }
function centerData() { if (pcaExperiment) pcaExperiment.centerData(); }
function calculateCovariance() { if (pcaExperiment) pcaExperiment.calculateCovariance(); }
function calculateEigenvectors() { if (pcaExperiment) pcaExperiment.calculateEigenvectors(); }
function projectAndReconstruct() { if (pcaExperiment) pcaExperiment.projectAndReconstruct(); }
function runFullPCA() { if (pcaExperiment) pcaExperiment.runFullPCA(); }
function resetExperiment() { if (pcaExperiment) pcaExperiment.resetExperiment(); }
function toggleAnimation() { if (pcaExperiment) pcaExperiment.toggleAnimation(); }
function prevStep() { if (pcaExperiment) pcaExperiment.prevStep(); }
function nextStep() { if (pcaExperiment) pcaExperiment.nextStep(); }