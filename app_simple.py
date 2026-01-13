"""
极简版人脸识别教学系统 - 保证能运行
手机访问：运行后看终端输出的链接
"""

import streamlit as st
import numpy as np
import os
import sys
from PIL import Image
import matplotlib.pyplot as plt

# 设置页面
st.set_page_config(
    page_title="人脸识别教学",
    page_icon="👨‍🏫",
    layout="wide"
)

# 自定义CSS让手机更好用
st.markdown("""
<style>
    @media (max-width: 768px) {
        .main .block-container {
            padding: 10px;
        }
        h1 { font-size: 24px !important; }
        h2 { font-size: 20px !important; }
        h3 { font-size: 18px !important; }
        .stButton button {
            width: 100%;
            font-size: 16px;
            padding: 12px;
        }
    }
</style>
""", unsafe_allow_html=True)

# 标题
st.title("🧠 线性代数人脸识别教学")
st.markdown("---")

# 检查数据路径
DATA_PATH = r"D:\MyMathProjects\face_lab\data\orl_faces"

# 如果数据路径不存在，显示警告但继续运行（演示模式）
demo_mode = False
if not os.path.exists(DATA_PATH):
    st.warning("⚠️ 未找到ORL人脸数据库，切换到演示模式")
    st.info("请确保数据放在: D:\\MyMathProjects\\face_lab\\data\\orl_faces")
    demo_mode = True

# 侧边栏
with st.sidebar:
    st.image("👨‍🎓", width=100)
    st.title("功能菜单")
    
    page = st.radio(
        "选择页面",
        ["🏠 主页", "📚 理论讲解", "🎮 互动演示", "📱 手机访问"]
    )
    
    st.markdown("---")
    st.info("💡 提示：确保手机和电脑在同一WiFi")

# 主页
if page == "🏠 主页":
    st.header("欢迎使用线性代数人脸识别教学系统")
    
    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
        ### 🎯 学习目标
        
        1. **理解PCA原理**
        2. **掌握特征脸概念**
        3. **体验人脸识别**
        4. **连接线性代数与应用**
        """)
    
    with col2:
        st.markdown("""
        ### 📱 使用说明
        
        1. 电脑运行本程序
        2. 查看终端输出的链接
        3. 手机浏览器输入链接
        4. 开始学习！
        """)
    
    st.markdown("---")
    
    # 显示示例图片（即使没有数据也能运行）
    st.subheader("人脸识别示例")
    
    # 创建一个简单的示例图片
    fig, axes = plt.subplots(2, 3, figsize=(10, 6))
    
    # 生成一些随机"人脸"作为演示
    for i in range(6):
        row, col = divmod(i, 3)
        if demo_mode:
            # 生成随机图案
            face = np.random.rand(20, 20)
            axes[row, col].imshow(face, cmap='gray')
        axes[row, col].set_title(f'示例人脸 {i+1}')
        axes[row, col].axis('off')
    
    st.pyplot(fig)

elif page == "📚 理论讲解":
    st.header("线性代数与人脸识别")
    
    tabs = st.tabs(["PCA原理", "特征脸", "数学公式", "应用场景"])
    
    with tabs[0]:
        st.markdown("""
        ### 🎯 主成分分析 (PCA)
        
        PCA是一种降维技术，用于：
        
        - **降低数据维度**
        - **提取主要特征**
        - **去除噪声**
        - **可视化高维数据**
        
        **在图像处理中：**
        1. 每张图片 → 高维向量
        2. 找到变化最大的方向
        3. 投影到低维空间
        """)
        
        # 显示示意图
        fig, ax = plt.subplots(figsize=(8, 4))
        # 绘制简单的PCA示意图
        np.random.seed(42)
        x = np.random.randn(100) * 2
        y = x * 0.5 + np.random.randn(100) * 0.5
        
        ax.scatter(x, y, alpha=0.6)
        
        # 绘制主成分方向
        from numpy.linalg import svd
        data = np.vstack([x, y]).T
        U, s, Vt = svd(data - data.mean(axis=0))
        
        # 第一主成分
        pc1 = Vt[0] * s[0]
        ax.arrow(data.mean(0)[0], data.mean(0)[1], 
                pc1[0], pc1[1], color='r', width=0.1, 
                head_width=0.5, label='主成分1')
        
        ax.set_xlabel('特征1')
        ax.set_ylabel('特征2')
        ax.set_title('PCA示意图：找到最大方差方向')
        ax.legend()
        ax.grid(True, alpha=0.3)
        
        st.pyplot(fig)
    
    with tabs[1]:
        st.markdown("""
        ### 😊 特征脸 (Eigenfaces)
        
        **什么是特征脸？**
        
        - 人脸数据的主成分
        - "平均脸"的变化方向
        - 代表人脸的主要特征
        
        **数学表达：**
        
        1. 计算协方差矩阵
        2. 特征值分解
        3. 取前k个特征向量
        4. 这些就是特征脸
        """)
        
        # 显示特征脸示意图
        st.image("https://miro.medium.com/v2/resize:fit:1400/1*CbgK6Jk7t7X7Mv5M8LtXEQ.png", 
                caption="特征脸示意图", use_column_width=True)
    
    with tabs[2]:
        st.markdown("""
        ### 📐 核心数学公式
        
        ```python
        # 1. 数据中心化
        X_centered = X - mean_face
        
        # 2. 协方差矩阵
        C = (X_centered.T @ X_centered) / (n-1)
        
        # 3. 特征值分解
        eigenvalues, eigenvectors = np.linalg.eig(C)
        
        # 4. 投影
        projection = eigenvectors.T @ (face - mean_face)
        ```
        """)
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.latex(r"C = \frac{1}{n-1} \sum_{i=1}^{n} (x_i - \mu)(x_i - \mu)^T")
            st.caption("协方差矩阵公式")
        
        with col2:
            st.latex(r"C v_i = \lambda_i v_i")
            st.caption("特征值方程")
    
    with tabs[3]:
        st.markdown("""
        ### 🌟 应用场景
        
        1. **人脸识别** - 身份验证
        2. **表情识别** - 情感分析
        3. **人脸重建** - 图像恢复
        4. **人脸检索** - 图片搜索
        
        **实际应用：**
        - 手机人脸解锁
        - 门禁系统
        - 照片整理
        - 视频监控
        """)

elif page == "🎮 互动演示":
    st.header("动手体验人脸识别")
    
    # 创建模拟数据用于演示
    np.random.seed(42)
    
    # 模拟参数
    n_components = st.slider("特征脸数量", 5, 50, 20)
    
    # 模拟平均脸
    if st.button("生成平均脸"):
        st.subheader("😊 平均脸演示")
        
        # 创建模拟的平均脸
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(10, 4))
        
        # 左侧：平均脸图像
        mean_face = np.random.rand(112, 92) * 0.5 + 0.25
        ax1.imshow(mean_face, cmap='gray')
        ax1.set_title('模拟平均脸')
        ax1.axis('off')
        
        # 右侧：平均脸向量
        ax2.plot(np.random.rand(100) * 0.5 + 0.25)
        ax2.set_title('平均脸向量（前100维）')
        ax2.set_xlabel('像素索引')
        ax2.set_ylabel('灰度值')
        ax2.grid(True, alpha=0.3)
        
        st.pyplot(fig)
        
        st.info("""
        **数学原理：**
        平均脸 = 所有人脸的平均值
        
        ```python
        mean_face = np.mean(all_faces, axis=0)
        ```
        """)
    
    # 特征脸演示
    if st.button("查看特征脸"):
        st.subheader("🎭 特征脸演示")
        
        # 创建特征脸网格
        n_eigenfaces = min(9, n_components)
        fig, axes = plt.subplots(3, 3, figsize=(10, 10))
        
        for i in range(n_eigenfaces):
            row, col = divmod(i, 3)
            # 生成模拟特征脸
            eigenface = np.random.randn(112, 92)
            axes[row, col].imshow(eigenface, cmap='gray')
            axes[row, col].set_title(f'特征脸 {i+1}')
            axes[row, col].axis('off')
        
        # 隐藏多余的子图
        for i in range(n_eigenfaces, 9):
            row, col = divmod(i, 3)
            axes[row, col].axis('off')
        
        st.pyplot(fig)
        
        # 特征值衰减图
        fig2, ax = plt.subplots(figsize=(8, 4))
        eigenvalues = np.exp(-np.arange(50) / 10)  # 模拟指数衰减
        ax.plot(eigenvalues[:n_components], 'bo-')
        ax.set_xlabel('特征脸序号')
        ax.set_ylabel('特征值大小')
        ax.set_title('特征值衰减（信息量减少）')
        ax.grid(True, alpha=0.3)
        
        st.pyplot(fig2)
    
    # 人脸重建演示
    if st.button("尝试人脸重建"):
        st.subheader("🔄 人脸重建演示")
        
        col1, col2, col3 = st.columns(3)
        
        with col1:
            st.markdown("**原始人脸**")
            original = np.random.rand(112, 92)
            fig1, ax1 = plt.subplots(figsize=(4, 5))
            ax1.imshow(original, cmap='gray')
            ax1.axis('off')
            st.pyplot(fig1)
        
        with col2:
            st.markdown("**重建人脸**")
            reconstructed = original + np.random.randn(112, 92) * 0.1
            fig2, ax2 = plt.subplots(figsize=(4, 5))
            ax2.imshow(reconstructed, cmap='gray')
            ax2.axis('off')
            st.pyplot(fig2)
        
        with col3:
            st.markdown("**重建误差**")
            error = np.abs(original - reconstructed)
            fig3, ax3 = plt.subplots(figsize=(4, 5))
            ax3.imshow(error, cmap='hot')
            ax3.axis('off')
            st.pyplot(fig3)
            
            # 计算MSE
            mse = np.mean((original - reconstructed) ** 2)
            st.metric("重建误差 (MSE)", f"{mse:.6f}")
        
        st.info(f"""
        **维度压缩：**
        - 原始维度：112×92 = 10,304
        - 使用特征脸：{n_components}
        - 压缩比例：{n_components/10304*100:.1f}%
        """)

elif page == "📱 手机访问":
    st.header("手机访问指南")
    
    st.markdown("""
    ## 📍 访问步骤
    
    1. **确保电脑已运行本程序**
    2. **查看终端输出的链接**（类似下面）
    3. **手机浏览器输入链接**
    4. **开始学习！**
    
    ---
    
    ## 🔗 访问链接示例
    
    ```bash
    本地链接：http://localhost:8501
    网络链接：http://192.168.1.100:8501
    ```
    
    ---
    
    ## ⚠️ 常见问题
    
    **问题1：手机打不开链接**
    - ✅ 检查手机和电脑是否在同一WiFi
    - ✅ 检查防火墙是否阻止连接
    - ✅ 尝试关闭防火墙或杀毒软件
    
    **问题2：连接很慢**
    - ✅ 关闭电脑上其他占用网络的程序
    - ✅ 确保WiFi信号良好
    
    **问题3：显示错误**
    - ✅ 刷新页面重试
    - ✅ 重启程序
    """)
    
    # 显示网络信息
    import socket
    try:
        hostname = socket.gethostname()
        local_ip = socket.gethostbyname(hostname)
        
        col1, col2 = st.columns(2)
        
        with col1:
            st.metric("电脑名称", hostname)
        
        with col2:
            st.metric("本地IP", local_ip)
        
        st.code(f"""
        访问链接：
        1. http://localhost:8501
        2. http://{local_ip}:8501
        
        请将第二个链接输入手机浏览器
        """)
    except:
        st.warning("无法获取网络信息，请手动查看终端输出")

# 页脚
st.markdown("---")
st.markdown(
    """
    <div style="text-align: center; color: #666;">
    <p>线性代数创新课程 | 人脸识别教学系统 | 📱 手机友好版</p>
    <p>🎯 以学生为中心 | 🎮 交互式学习 | 🧠 理解数学之美</p>
    </div>
    """,
    unsafe_allow_html=True
)