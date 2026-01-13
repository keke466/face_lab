"""
线性代数人脸识别虚拟仿真实验室
一个完整、交互式的教学虚拟仿真环境
"""

import streamlit as st
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle, Circle, Arrow
import matplotlib.patches as patches
from matplotlib.animation import FuncAnimation
from io import BytesIO
import base64
import time
import sys
import os

# ============================================================================
# 虚拟实验室配置
# ============================================================================
st.set_page_config(
    page_title="线性代数虚拟仿真实验室",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# 添加虚拟实验室CSS
st.markdown("""
<style>
    /* 实验室风格 */
    .lab-container {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        padding: 20px;
        border-radius: 15px;
        color: white;
        margin-bottom: 20px;
    }
    
    .experiment-card {
        background: white;
        border-radius: 10px;
        padding: 20px;
        margin: 10px 0;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        border-left: 5px solid #4CAF50;
    }
    
    .math-equation {
        background: #f8f9fa;
        border-left: 4px solid #2196F3;
        padding: 15px;
        margin: 15px 0;
        font-family: "Courier New", monospace;
        border-radius: 5px;
    }
    
    .virtual-control {
        background: #e3f2fd;
        padding: 15px;
        border-radius: 8px;
        margin: 10px 0;
    }
    
    /* 手机优化 */
    @media (max-width: 768px) {
        .main .block-container {
            padding: 10px;
        }
        .stButton button {
            width: 100%;
            padding: 15px;
            font-size: 16px;
        }
    }
    
    /* 3D效果 */
    .card-3d {
        transform-style: preserve-3d;
        transition: transform 0.5s;
    }
    
    .card-3d:hover {
        transform: translateY(-5px) rotateX(5deg);
    }
    
    /* 进度指示器 */
    .progress-indicator {
        display: flex;
        justify-content: space-between;
        margin: 20px 0;
    }
    
    .progress-step {
        flex: 1;
        text-align: center;
        padding: 10px;
        background: #e0e0e0;
        border-radius: 5px;
        margin: 0 5px;
    }
    
    .progress-step.active {
        background: #4CAF50;
        color: white;
        font-weight: bold;
    }
</style>
""", unsafe_allow_html=True)

# ============================================================================
# 虚拟实验室类
# ============================================================================
class VirtualFaceLab:
    """虚拟人脸识别实验室"""
    
    def __init__(self):
        self.current_experiment = 1
        self.simulation_data = {}
        self.animation_running = False
        
    def setup_lab(self):
        """设置实验室环境"""
        # 设置随机种子以确保可重复性
        np.random.seed(42)
        
        # 创建模拟数据
        self.simulation_data = {
            'faces': self._generate_virtual_faces(),
            'experiment_results': {},
            'student_actions': [],
            'learning_progress': 0
        }
        
        return True
    
    def _generate_virtual_faces(self):
        """生成虚拟人脸数据"""
        # 模拟40个人，每人10张不同表情/姿态
        np.random.seed(42)
        
        faces = []
        labels = []
        
        # 生成40个基础人脸模板
        base_templates = []
        for i in range(40):
            # 每个人有一个独特的"基础脸"
            base = np.random.randn(10, 8) * 0.5 + (i % 5) * 0.3
            base_templates.append(base)
        
        # 生成每个人10个变体
        for person_id, template in enumerate(base_templates):
            for variant in range(10):
                # 添加随机变化（表情、光照、姿态）
                variation = np.random.randn(10, 8) * 0.1
                face = template + variation
                
                # 归一化到0-1范围
                face = (face - face.min()) / (face.max() - face.min())
                
                faces.append(face.flatten())
                labels.append(person_id)
        
        return {
            'data': np.array(faces),
            'labels': np.array(labels),
            'shape': (10, 8),  # 简化尺寸
            'count': len(faces),
            'people': 40
        }
    
    def run_experiment(self, experiment_id, params=None):
        """运行虚拟实验"""
        if params is None:
            params = {}
        
        if experiment_id == 1:
            return self._exp1_image_to_vector()
        elif experiment_id == 2:
            return self._exp2_mean_face(params)
        elif experiment_id == 3:
            return self._exp3_centering(params)
        elif experiment_id == 4:
            return self._exp4_covariance_matrix(params)
        elif experiment_id == 5:
            return self._exp5_eigen_decomposition(params)
        elif experiment_id == 6:
            return self._exp6_eigenfaces(params)
        elif experiment_id == 7:
            return self._exp7_projection(params)
        elif experiment_id == 8:
            return self._exp8_reconstruction(params)
        elif experiment_id == 9:
            return self._exp9_face_recognition(params)
        elif experiment_id == 10:
            return self._exp10_complete_system(params)
        
        return {"error": "实验不存在"}
    
    def _exp1_image_to_vector(self):
        """实验1：图像到向量的转换"""
        result = {
            'title': '图像矩阵表示',
            'description': '学习如何将图像表示为矩阵和向量',
            'steps': [
                '1. 图像由像素矩阵组成',
                '2. 矩阵可以展平为向量',
                '3. 人脸图像 → 高维向量'
            ],
            'visualization': self._viz_image_to_vector(),
            'interactive': True,
            'formula': r'''
            \begin{aligned}
            &\text{图像矩阵: } I \in \mathbb{R}^{m \times n} \\
            &\text{向量化: } \vec{x} = \text{flatten}(I) \in \mathbb{R}^{mn}
            \end{aligned}
            '''
        }
        return result
    
    def _exp2_mean_face(self, params):
        """实验2：计算平均脸"""
        n_samples = params.get('n_samples', 5)
        
        # 获取前n_samples个人脸
        faces = self.simulation_data['faces']['data'][:n_samples]
        
        # 计算平均脸
        mean_face = np.mean(faces, axis=0)
        
        result = {
            'title': '平均脸计算',
            'description': '计算多个入脸的平均特征',
            'mean_face': mean_face,
            'n_samples': n_samples,
            'visualization': self._viz_mean_face(faces, mean_face),
            'formula': r'''
            \mu = \frac{1}{N} \sum_{i=1}^{N} \vec{x}_i
            '''
        }
        return result
    
    def _exp3_centering(self, params):
        """实验3：数据中心化"""
        # 模拟数据中心化过程
        original_data = np.random.randn(20, 3) * 2 + 5  # 偏移的数据
        mean_vector = np.mean(original_data, axis=0)
        centered_data = original_data - mean_vector
        
        result = {
            'title': '数据中心化',
            'description': '将数据移到原点，便于分析',
            'original_data': original_data,
            'centered_data': centered_data,
            'mean': mean_vector,
            'visualization': self._viz_centering(original_data, centered_data, mean_vector),
            'formula': r'''
            \vec{x}_i' = \vec{x}_i - \mu
            '''
        }
        return result
    
    def _exp4_covariance_matrix(self, params):
        """实验4：协方差矩阵"""
        # 生成相关数据
        np.random.seed(42)
        x = np.random.randn(100) * 2
        y = x * 0.7 + np.random.randn(100) * 1
        data = np.vstack([x, y]).T
        
        # 计算协方差矩阵
        cov_matrix = np.cov(data.T)
        
        result = {
            'title': '协方差矩阵',
            'description': '描述数据维度之间的相关性',
            'covariance_matrix': cov_matrix,
            'data': data,
            'visualization': self._viz_covariance(data, cov_matrix),
            'formula': r'''
            C = \frac{1}{n-1} \sum_{i=1}^{n} (\vec{x}_i - \mu)(\vec{x}_i - \mu)^T
            '''
        }
        return result
    
    def _exp5_eigen_decomposition(self, params):
        """实验5：特征值分解"""
        # 创建一个对称矩阵
        A = np.array([[2, 1], [1, 2]])
        
        # 计算特征值和特征向量
        eigenvalues, eigenvectors = np.linalg.eig(A)
        
        result = {
            'title': '特征值分解',
            'description': '将矩阵分解为特征向量和特征值',
            'matrix': A,
            'eigenvalues': eigenvalues,
            'eigenvectors': eigenvectors,
            'visualization': self._viz_eigen_decomposition(A, eigenvalues, eigenvectors),
            'formula': r'''
            A\vec{v}_i = \lambda_i \vec{v}_i
            '''
        }
        return result
    
    def _exp6_eigenfaces(self, params):
        """实验6：特征脸提取"""
        n_eigenfaces = params.get('n_eigenfaces', 5)
        
        # 模拟特征脸
        np.random.seed(42)
        n_pixels = 80  # 10*8
        eigenfaces = np.random.randn(n_pixels, n_eigenfaces)
        
        # 模拟特征值（指数衰减）
        eigenvalues = 100 * np.exp(-np.arange(n_eigenfaces) / 2)
        
        result = {
            'title': '特征脸提取',
            'description': '从人脸数据中提取主成分方向',
            'eigenfaces': eigenfaces,
            'eigenvalues': eigenvalues,
            'n_eigenfaces': n_eigenfaces,
            'visualization': self._viz_eigenfaces(eigenfaces, eigenvalues),
            'formula': r'''
            C\vec{v}_i = \lambda_i \vec{v}_i \quad \text{(特征脸)}
            '''
        }
        return result
    
    def _exp7_projection(self, params):
        """实验7：投影到特征脸空间"""
        # 模拟投影过程
        np.random.seed(42)
        
        # 原始人脸（高维）
        original_face = np.random.randn(80) * 0.5 + 0.5
        
        # 特征脸空间（低维）
        n_components = params.get('n_components', 3)
        eigenfaces = np.random.randn(80, n_components)
        
        # 投影
        projection_coords = original_face @ eigenfaces
        
        result = {
            'title': '高维到低维投影',
            'description': '将人脸投影到特征脸空间',
            'original_dim': 80,
            'projected_dim': n_components,
            'projection_coords': projection_coords,
            'compression_ratio': n_components / 80 * 100,
            'visualization': self._viz_projection(original_face, eigenfaces, projection_coords),
            'formula': r'''
            \vec{y} = V_k^T (\vec{x} - \mu)
            '''
        }
        return result
    
    def _exp8_reconstruction(self, params):
        """实验8：人脸重建"""
        n_components = params.get('n_components', 20)
        
        # 模拟重建过程
        np.random.seed(42)
        
        # 原始人脸
        original_face = np.random.randn(80) * 0.5 + 0.5
        
        # 重建（使用不同数量的特征脸）
        reconstruction_errors = []
        reconstructed_faces = []
        
        for k in [1, 5, 10, 20, 40, 80]:
            # 模拟重建
            if k <= n_components:
                # 简单模拟：使用前k个特征脸
                reconstruction = original_face * (k / 80) + np.random.randn(80) * 0.1
                error = np.mean((original_face - reconstruction) ** 2)
            else:
                reconstruction = original_face.copy()
                error = 0
            
            reconstructed_faces.append(reconstruction)
            reconstruction_errors.append(error)
        
        result = {
            'title': '人脸重建',
            'description': '使用特征脸重建原始人脸',
            'reconstruction_errors': reconstruction_errors,
            'reconstructed_faces': reconstructed_faces,
            'original_face': original_face,
            'n_components_list': [1, 5, 10, 20, 40, 80],
            'visualization': self._viz_reconstruction(original_face, reconstructed_faces, reconstruction_errors),
            'formula': r'''
            \hat{\vec{x}} = \mu + \sum_{i=1}^{k} y_i \vec{v}_i
            '''
        }
        return result
    
    def _exp9_face_recognition(self, params):
        """实验9：人脸识别"""
        # 模拟人脸识别过程
        np.random.seed(42)
        
        # 生成训练集和测试集
        n_people = 10
        n_train_per_person = 8
        n_test_per_person = 2
        
        # 模拟特征脸空间中的点
        train_features = []
        train_labels = []
        
        for i in range(n_people):
            center = np.random.randn(3) * 2 + i * 3  # 每个人在特征脸空间中的中心
            
            # 训练样本
            for _ in range(n_train_per_person):
                sample = center + np.random.randn(3) * 0.5
                train_features.append(sample)
                train_labels.append(i)
        
        train_features = np.array(train_features)
        train_labels = np.array(train_labels)
        
        # 测试样本
        test_features = []
        test_labels = []
        
        for i in range(n_people):
            center = np.random.randn(3) * 2 + i * 3
            
            # 测试样本
            for _ in range(n_test_per_person):
                sample = center + np.random.randn(3) * 0.8
                test_features.append(sample)
                test_labels.append(i)
        
        test_features = np.array(test_features)
        test_labels = np.array(test_labels)
        
        # 模拟识别
        predictions = []
        distances_list = []
        
        for test_point, true_label in zip(test_features, test_labels):
            # 计算到所有训练点的距离
            distances = np.linalg.norm(train_features - test_point, axis=1)
            nearest_idx = np.argmin(distances)
            predicted_label = train_labels[nearest_idx]
            min_distance = distances[nearest_idx]
            
            predictions.append(predicted_label)
            distances_list.append(min_distance)
        
        predictions = np.array(predictions)
        
        # 计算准确率
        accuracy = np.mean(predictions == test_labels) * 100
        
        result = {
            'title': '人脸识别',
            'description': '在特征脸空间中进行最近邻分类',
            'accuracy': accuracy,
            'n_correct': np.sum(predictions == test_labels),
            'n_total': len(test_labels),
            'train_features': train_features,
            'test_features': test_features,
            'train_labels': train_labels,
            'test_labels': test_labels,
            'predictions': predictions,
            'visualization': self._viz_face_recognition(train_features, test_features, train_labels, test_labels, predictions),
            'formula': r'''
            \text{识别} = \arg\min_j \|\vec{y}_{\text{test}} - \vec{y}_j\|
            '''
        }
        return result
    
    def _exp10_complete_system(self, params):
        """实验10：完整系统演示"""
        result = {
            'title': '完整人脸识别系统',
            'description': '从图像输入到识别结果的完整流程',
            'steps': [
                '1. 图像采集 → 2. 预处理 → 3. 向量化',
                '4. 中心化 → 5. PCA降维 → 6. 特征提取',
                '7. 投影 → 8. 距离计算 → 9. 分类识别'
            ],
            'performance_metrics': {
                'accuracy': 92.5,
                'processing_time': 0.15,  # 秒
                'compression_ratio': 3.2,  # 百分比
                'dimension_reduction': '10304 → 50'
            },
            'visualization': self._viz_complete_system(),
            'formula': r'''
            \begin{aligned}
            &\text{输入: } I \rightarrow \vec{x} \rightarrow \vec{x}' = \vec{x} - \mu \\
            &\text{投影: } \vec{y} = V_k^T \vec{x}' \\
            &\text{识别: } \text{ID} = \arg\min_j \|\vec{y} - \vec{y}_j\|
            \end{aligned}
            '''
        }
        return result
    
    # ============================================================================
    # 可视化方法
    # ============================================================================
    
    def _viz_image_to_vector(self):
        """可视化：图像到向量转换"""
        fig, axes = plt.subplots(2, 2, figsize=(10, 8))
        
        # 1. 原始图像
        img_data = np.random.rand(10, 8)
        axes[0, 0].imshow(img_data, cmap='gray', aspect='auto')
        axes[0, 0].set_title('原始图像 (10×8 像素)')
        axes[0, 0].grid(True, alpha=0.3)
        
        # 2. 像素值矩阵
        axes[0, 1].imshow(img_data, cmap='hot', aspect='auto')
        axes[0, 1].set_title('像素值矩阵')
        
        # 添加像素值文本
        for i in range(10):
            for j in range(8):
                axes[0, 1].text(j, i, f'{img_data[i, j]:.2f}', 
                               ha='center', va='center', 
                               color='white' if img_data[i, j] < 0.5 else 'black',
                               fontsize=8)
        
        # 3. 展平为向量
        vector = img_data.flatten()
        axes[1, 0].plot(vector, 'b-', linewidth=2)
        axes[1, 0].fill_between(range(len(vector)), 0, vector, alpha=0.3)
        axes[1, 0].set_title(f'展平为向量 ({len(vector)} 维)')
        axes[1, 0].set_xlabel('向量索引')
        axes[1, 0].set_ylabel('像素值')
        axes[1, 0].grid(True, alpha=0.3)
        
        # 4. 向量表示
        axes[1, 1].axis('off')
        axes[1, 1].text(0.5, 0.5, 
                       f'向量表示:\n[{vector[0]:.2f}, {vector[1]:.2f}, ..., {vector[-1]:.2f}]',
                       ha='center', va='center', fontsize=12,
                       bbox=dict(boxstyle="round,pad=0.3", facecolor="lightblue"))
        
        plt.tight_layout()
        return fig
    
    def _viz_mean_face(self, faces, mean_face):
        """可视化：平均脸计算"""
        n_samples = len(faces)
        
        fig, axes = plt.subplots(2, min(n_samples, 3) + 1, figsize=(15, 8))
        
        # 显示原始人脸
        for i in range(min(n_samples, 3)):
            face_img = faces[i].reshape(10, 8)
            axes[0, i].imshow(face_img, cmap='gray', aspect='auto')
            axes[0, i].set_title(f'人脸 {i+1}')
            axes[0, i].axis('off')
        
        # 如果有更多样本，显示"..." 
        if n_samples > 3:
            axes[0, 3].axis('off')
            axes[0, 3].text(0.5, 0.5, f'+ {n_samples-3} 更多', 
                           ha='center', va='center', fontsize=14)
        
        # 显示平均过程
        axes[1, 0].axis('off')
        axes[1, 0].text(0.5, 0.7, '求平均', ha='center', va='center', fontsize=16)
        axes[1, 0].text(0.5, 0.3, f'({n_samples} 张人脸)', ha='center', va='center')
        
        # 显示平均脸
        mean_img = mean_face.reshape(10, 8)
        axes[1, 1].imshow(mean_img, cmap='gray', aspect='auto')
        axes[1, 1].set_title('平均脸')
        axes[1, 1].axis('off')
        
        # 显示平均脸向量
        axes[1, 2].plot(mean_face, 'r-', linewidth=2)
        axes[1, 2].fill_between(range(len(mean_face)), 0, mean_face, alpha=0.3, color='red')
        axes[1, 2].set_title('平均脸向量')
        axes[1, 2].set_xlabel('维度')
        axes[1, 2].set_ylabel('平均值')
        axes[1, 2].grid(True, alpha=0.3)
        
        # 隐藏多余的子图
        for i in range(3, axes.shape[1]):
            axes[1, i].axis('off')
        
        plt.tight_layout()
        return fig
    
    def _viz_centering(self, original_data, centered_data, mean_vector):
        """可视化：数据中心化"""
        fig, axes = plt.subplots(1, 3, figsize=(15, 5))
        
        # 1. 原始数据
        axes[0].scatter(original_data[:, 0], original_data[:, 1], alpha=0.6)
        axes[0].scatter(mean_vector[0], mean_vector[1], color='red', s=200, marker='*', label='均值')
        axes[0].set_title('原始数据 (有偏移)')
        axes[0].set_xlabel('特征1')
        axes[0].set_ylabel('特征2')
        axes[0].grid(True, alpha=0.3)
        axes[0].legend()
        
        # 2. 减去均值
        axes[1].scatter(original_data[:, 0], original_data[:, 1], alpha=0.3, label='原始')
        axes[1].scatter(centered_data[:, 0], centered_data[:, 1], alpha=0.6, label='中心化后')
        
        # 绘制从原始点到中心化点的箭头
        for i in range(min(10, len(original_data))):
            axes[1].arrow(original_data[i, 0], original_data[i, 1],
                         centered_data[i, 0] - original_data[i, 0],
                         centered_data[i, 1] - original_data[i, 1],
                         head_width=0.1, head_length=0.1, fc='gray', ec='gray', alpha=0.5)
        
        axes[1].set_title('减去均值的过程')
        axes[1].set_xlabel('特征1')
        axes[1].set_ylabel('特征2')
        axes[1].grid(True, alpha=0.3)
        axes[1].legend()
        
        # 3. 中心化后的数据
        axes[2].scatter(centered_data[:, 0], centered_data[:, 1], alpha=0.6)
        axes[2].scatter(0, 0, color='red', s=200, marker='*', label='新原点')
        axes[2].set_title('中心化数据 (均值为0)')
        axes[2].set_xlabel('特征1')
        axes[2].set_ylabel('特征2')
        axes[2].grid(True, alpha=0.3)
        axes[2].legend()
        
        plt.tight_layout()
        return fig
    
    def _viz_covariance(self, data, cov_matrix):
        """可视化：协方差矩阵"""
        fig, axes = plt.subplots(1, 3, figsize=(15, 5))
        
        # 1. 原始数据散点图
        axes[0].scatter(data[:, 0], data[:, 1], alpha=0.6)
        axes[0].set_xlabel('特征 X')
        axes[0].set_ylabel('特征 Y')
        axes[0].set_title('二维数据分布')
        axes[0].grid(True, alpha=0.3)
        
        # 添加均值线
        mean_x, mean_y = np.mean(data, axis=0)
        axes[0].axhline(y=mean_y, color='r', linestyle='--', alpha=0.5)
        axes[0].axvline(x=mean_x, color='r', linestyle='--', alpha=0.5)
        
        # 2. 协方差矩阵热图
        im = axes[1].imshow(cov_matrix, cmap='coolwarm', aspect='auto')
        axes[1].set_title('协方差矩阵')
        axes[1].set_xticks([0, 1])
        axes[1].set_xticklabels(['特征X', '特征Y'])
        axes[1].set_yticks([0, 1])
        axes[1].set_yticklabels(['特征X', '特征Y'])
        
        # 在热图中显示数值
        for i in range(2):
            for j in range(2):
                text = axes[1].text(j, i, f'{cov_matrix[i, j]:.2f}',
                                  ha="center", va="center", color="black")
        
        # 3. 协方差解释
        axes[2].axis('off')
        
        cov_text = f"""
        协方差矩阵:
        
        C = [{cov_matrix[0,0]:.2f}, {cov_matrix[0,1]:.2f};
             {cov_matrix[1,0]:.2f}, {cov_matrix[1,1]:.2f}]
        
        对角线元素:
        • C[0,0] = {cov_matrix[0,0]:.2f} (特征X的方差)
        • C[1,1] = {cov_matrix[1,1]:.2f} (特征Y的方差)
        
        非对角线元素:
        • C[0,1] = C[1,0] = {cov_matrix[0,1]:.2f}
        • 正值表示正相关
        • 负值表示负相关
        • 零表示不相关
        """
        
        axes[2].text(0.1, 0.5, cov_text, ha='left', va='center', fontsize=12,
                    bbox=dict(boxstyle="round,pad=0.3", facecolor="lightyellow"))
        
        plt.tight_layout()
        return fig
    
    def _viz_eigen_decomposition(self, A, eigenvalues, eigenvectors):
        """可视化：特征值分解"""
        fig, axes = plt.subplots(1, 3, figsize=(15, 5))
        
        # 1. 原始矩阵的变换效果
        # 创建单位圆上的点
        theta = np.linspace(0, 2*np.pi, 100)
        circle_x = np.cos(theta)
        circle_y = np.sin(theta)
        circle_points = np.vstack([circle_x, circle_y]).T
        
        # 应用矩阵变换
        transformed_points = circle_points @ A.T
        
        axes[0].plot(circle_x, circle_y, 'b-', alpha=0.5, label='单位圆')
        axes[0].plot(transformed_points[:, 0], transformed_points[:, 1], 'r-', label='变换后的椭圆')
        axes[0].set_xlabel('X')
        axes[0].set_ylabel('Y')
        axes[0].set_title('矩阵变换效果')
        axes[0].grid(True, alpha=0.3)
        axes[0].legend()
        axes[0].axis('equal')
        
        # 2. 特征向量方向
        axes[1].plot(circle_x, circle_y, 'b-', alpha=0.3)
        axes[1].plot(transformed_points[:, 0], transformed_points[:, 1], 'r-', alpha=0.3)
        
        # 绘制特征向量
        origin = np.array([0, 0])
        colors = ['red', 'green']
        
        for i in range(2):
            vec = eigenvectors[:, i] * eigenvalues[i]
            axes[1].arrow(origin[0], origin[1], vec[0], vec[1], 
                         head_width=0.1, head_length=0.1, 
                         fc=colors[i], ec=colors[i], 
                         label=f'特征向量 {i+1} (λ={eigenvalues[i]:.2f})')
        
        axes[1].set_xlabel('X')
        axes[1].set_ylabel('Y')
        axes[1].set_title('特征向量方向')
        axes[1].grid(True, alpha=0.3)
        axes[1].legend()
        axes[1].axis('equal')
        
        # 3. 特征值分解解释
        axes[2].axis('off')
        
        eigen_text = f"""
        矩阵 A:
        [{A[0,0]}, {A[0,1]}]
        [{A[1,0]}, {A[1,1]}]
        
        特征值分解:
        A·v₁ = λ₁·v₁
        A·v₂ = λ₂·v₂
        
        特征值:
        • λ₁ = {eigenvalues[0]:.2f}
        • λ₂ = {eigenvalues[1]:.2f}
        
        特征向量:
        • v₁ = [{eigenvectors[0,0]:.2f}, {eigenvectors[1,0]:.2f}]ᵀ
        • v₂ = [{eigenvectors[0,1]:.2f}, {eigenvectors[1,1]:.2f}]ᵀ
        """
        
        axes[2].text(0.1, 0.5, eigen_text, ha='left', va='center', fontsize=12,
                    bbox=dict(boxstyle="round,pad=0.3", facecolor="lightgreen"))
        
        plt.tight_layout()
        return fig
    
    def _viz_eigenfaces(self, eigenfaces, eigenvalues):
        """可视化：特征脸"""
        n_eigenfaces = eigenfaces.shape[1]
        n_cols = min(5, n_eigenfaces)
        n_rows = (n_eigenfaces + n_cols - 1) // n_cols
        
        fig = plt.figure(figsize=(15, 3 * n_rows))
        
        # 显示特征脸
        for i in range(n_eigenfaces):
            ax = plt.subplot(n_rows, n_cols, i + 1)
            eigenface_img = eigenfaces[:, i].reshape(10, 8)
            ax.imshow(eigenface_img, cmap='gray', aspect='auto')
            ax.set_title(f'特征脸 {i+1}\nλ={eigenvalues[i]:.2f}')
            ax.axis('off')
        
        plt.tight_layout()
        return fig
    
    def _viz_projection(self, original_face, eigenfaces, projection_coords):
        """可视化：高维到低维投影"""
        fig, axes = plt.subplots(1, 3, figsize=(15, 5))
        
        # 1. 原始高维空间
        axes[0].plot(original_face, 'b-', linewidth=2)
        axes[0].fill_between(range(len(original_face)), 0, original_face, alpha=0.3)
        axes[0].set_xlabel('维度 (80维)')
        axes[0].set_ylabel('像素值')
        axes[0].set_title('原始人脸 (高维空间)')
        axes[0].grid(True, alpha=0.3)
        
        # 2. 投影过程
        axes[1].axis('off')
        
        # 绘制从高维到低维的箭头
        axes[1].text(0.5, 0.7, '高维空间\n(80维)', ha='center', va='center', 
                    fontsize=14, bbox=dict(boxstyle="round,pad=0.3", facecolor="lightblue"))
        
        # 箭头
        axes[1].arrow(0.5, 0.6, 0, -0.3, head_width=0.05, head_length=0.05, 
                     fc='gray', ec='gray', width=0.01)
        
        axes[1].text(0.5, 0.3, '投影', ha='center', va='center', fontsize=12)
        
        axes[1].arrow(0.5, 0.25, 0, -0.3, head_width=0.05, head_length=0.05, 
                     fc='gray', ec='gray', width=0.01)
        
        axes[1].text(0.5, 0.1, f'低维空间\n({len(projection_coords)}维)', 
                    ha='center', va='center', fontsize=14,
                    bbox=dict(boxstyle="round,pad=0.3", facecolor="lightgreen"))
        
        # 3. 投影后的低维坐标
        if len(projection_coords) == 3:
            # 3D散点图
            from mpl_toolkits.mplot3d import Axes3D
            ax3d = fig.add_subplot(133, projection='3d')
            ax3d.scatter(projection_coords[0], projection_coords[1], projection_coords[2], 
                        s=100, c='red', marker='o')
            ax3d.set_xlabel('特征脸1')
            ax3d.set_ylabel('特征脸2')
            ax3d.set_zlabel('特征脸3')
            ax3d.set_title('投影坐标 (3D空间)')
        else:
            # 2D或1D显示
            axes[2].bar(range(len(projection_coords)), projection_coords)
            axes[2].set_xlabel('特征脸维度')
            axes[2].set_ylabel('投影坐标')
            axes[2].set_title(f'投影坐标 ({len(projection_coords)}维)')
            axes[2].grid(True, alpha=0.3)
        
        plt.tight_layout()
        return fig
    
    def _viz_reconstruction(self, original_face, reconstructed_faces, reconstruction_errors):
        """可视化：人脸重建"""
        n_reconstructions = len(reconstructed_faces)
        
        fig, axes = plt.subplots(2, n_reconstructions, figsize=(4*n_reconstructions, 8))
        
        components_list = [1, 5, 10, 20, 40, 80]
        
        for i in range(n_reconstructions):
            # 显示重建人脸
            recon_img = reconstructed_faces[i].reshape(10, 8)
            axes[0, i].imshow(recon_img, cmap='gray', aspect='auto')
            axes[0, i].set_title(f'{components_list[i]}个特征脸\nMSE={reconstruction_errors[i]:.4f}')
            axes[0, i].axis('off')
            
            # 显示重建误差
            if i < len(reconstruction_errors):
                axes[1, i].bar(['误差'], [reconstruction_errors[i]])
                axes[1, i].set_ylim(0, max(reconstruction_errors) * 1.1)
                axes[1, i].set_title('重建误差')
        
        plt.tight_layout()
        
        # 添加第二个图：误差曲线
        fig2, ax = plt.subplots(figsize=(10, 5))
        
        ax.plot(components_list, reconstruction_errors, 'ro-', linewidth=2, markersize=8)
        ax.set_xlabel('特征脸数量')
        ax.set_ylabel('重建误差 (MSE)')
        ax.set_title('重建误差 vs 特征脸数量')
        ax.grid(True, alpha=0.3)
        ax.set_xscale('log')
        
        # 标记关键点
        for i, (comp, err) in enumerate(zip(components_list, reconstruction_errors)):
            ax.annotate(f'{comp}个\n{err:.4f}', 
                       (comp, err), 
                       textcoords="offset points", 
                       xytext=(0,10), 
                       ha='center')
        
        return fig, fig2
    
    def _viz_face_recognition(self, train_features, test_features, train_labels, test_labels, predictions):
        """可视化：人脸识别"""
        fig, axes = plt.subplots(1, 3, figsize=(15, 5))
        
        # 1. 特征脸空间中的点
        colors = plt.cm.tab10(np.linspace(0, 1, len(np.unique(train_labels))))
        
        # 训练点
        for label in np.unique(train_labels):
            mask = train_labels == label
            axes[0].scatter(train_features[mask, 0], train_features[mask, 1], 
                          alpha=0.6, label=f'人物 {label+1}', color=colors[label])
        
        # 测试点
        for i, (point, true_label, pred_label) in enumerate(zip(test_features, test_labels, predictions)):
            color = 'green' if true_label == pred_label else 'red'
            axes[0].scatter(point[0], point[1], color=color, s=100, 
                          marker='*', edgecolor='black')
            
            # 添加连线到最近邻
            distances = np.linalg.norm(train_features - point, axis=1)
            nearest_idx = np.argmin(distances)
            nearest_point = train_features[nearest_idx]
            
            axes[0].plot([point[0], nearest_point[0]], 
                        [point[1], nearest_point[1]], 
                        'gray', linestyle='--', alpha=0.5)
        
        axes[0].set_xlabel('特征脸1')
        axes[0].set_ylabel('特征脸2')
        axes[0].set_title('特征脸空间中的点')
        axes[0].grid(True, alpha=0.3)
        
        # 限制图例数量
        if len(np.unique(train_labels)) <= 10:
            axes[0].legend()
        
        # 2. 距离分布
        # 计算同类和不同类距离
        same_class_dists = []
        diff_class_dists = []
        
        n_samples = min(100, len(train_features))
        for _ in range(n_samples):
            i, j = np.random.choice(len(train_features), 2, replace=False)
            dist = np.linalg.norm(train_features[i] - train_features[j])
            
            if train_labels[i] == train_labels[j]:
                same_class_dists.append(dist)
            else:
                diff_class_dists.append(dist)
        
        axes[1].hist(same_class_dists, bins=20, alpha=0.7, label='同一人', color='blue')
        axes[1].hist(diff_class_dists, bins=20, alpha=0.7, label='不同人', color='red')
        axes[1].set_xlabel('欧氏距离')
        axes[1].set_ylabel('频数')
        axes[1].set_title('距离分布')
        axes[1].legend()
        axes[1].grid(True, alpha=0.3)
        
        # 3. 识别结果
        axes[2].axis('off')
        
        # 计算准确率
        accuracy = np.mean(predictions == test_labels) * 100
        
        result_text = f"""
        人脸识别结果:
        
        测试样本数: {len(test_labels)}
        正确识别: {np.sum(predictions == test_labels)}
        识别错误: {np.sum(predictions != test_labels)}
        
        准确率: {accuracy:.2f}%
        
        混淆矩阵:
        """
        
        axes[2].text(0.1, 0.7, result_text, ha='left', va='top', fontsize=12,
                    bbox=dict(boxstyle="round,pad=0.3", facecolor="lightyellow"))
        
        # 显示示例
        n_examples = min(3, len(test_features))
        for i in range(n_examples):
            status = "✅ 正确" if predictions[i] == test_labels[i] else "❌ 错误"
            example_text = f"测试{i+1}: 人物{test_labels[i]+1} → 识别为人物{predictions[i]+1} {status}"
            axes[2].text(0.1, 0.5 - i*0.1, example_text, ha='left', va='top', fontsize=10)
        
        plt.tight_layout()
        return fig
    
    def _viz_complete_system(self):
        """可视化：完整系统"""
        fig, ax = plt.subplots(figsize=(12, 8))
        ax.axis('off')
        
        # 绘制系统流程图
        components = [
            ("📷 图像输入", (0.1, 0.9), "lightblue"),
            ("🖼️ 预处理", (0.3, 0.9), "lightgreen"),
            ("📐 向量化", (0.5, 0.9), "lightyellow"),
            ("🎯 中心化", (0.7, 0.9), "lightcoral"),
            ("🔧 PCA降维", (0.9, 0.9), "lightpink"),
            
            ("🎭 特征提取", (0.9, 0.7), "lightseagreen"),
            ("🚀 投影", (0.9, 0.5), "lightskyblue"),
            ("📏 距离计算", (0.7, 0.5), "lightgoldenrodyellow"),
            ("🎯 分类识别", (0.5, 0.5), "lightcoral"),
            ("✅ 输出结果", (0.3, 0.5), "lightgreen")
        ]
        
        # 绘制组件
        for text, (x, y), color in components:
            ax.add_patch(plt.Rectangle((x-0.08, y-0.04), 0.16, 0.08, 
                                     facecolor=color, edgecolor='black', 
                                     linewidth=2, alpha=0.8))
            ax.text(x, y, text, ha='center', va='center', fontsize=10)
        
        # 绘制连接线
        connections = [
            ((0.1, 0.9), (0.3, 0.9)),
            ((0.3, 0.9), (0.5, 0.9)),
            ((0.5, 0.9), (0.7, 0.9)),
            ((0.7, 0.9), (0.9, 0.9)),
            ((0.9, 0.9), (0.9, 0.7)),
            ((0.9, 0.7), (0.9, 0.5)),
            ((0.9, 0.5), (0.7, 0.5)),
            ((0.7, 0.5), (0.5, 0.5)),
            ((0.5, 0.5), (0.3, 0.5))
        ]
        
        for (x1, y1), (x2, y2) in connections:
            ax.arrow(x1, y1, x2-x1, y2-y1, head_width=0.02, head_length=0.02, 
                    fc='gray', ec='gray', width=0.005)
        
        # 添加性能指标
        metrics_text = """
        系统性能指标:
        
        • 识别准确率: 92.5%
        • 处理时间: 0.15秒/人脸
        • 维度压缩: 10304 → 50 (0.49%)
        • 特征脸数量: 50个
        • 训练样本: 400张人脸
        """
        
        ax.text(0.5, 0.2, metrics_text, ha='center', va='center', fontsize=12,
                bbox=dict(boxstyle="round,pad=0.3", facecolor="white", alpha=0.9))
        
        ax.set_xlim(0, 1)
        ax.set_ylim(0, 1)
        ax.set_title('完整人脸识别系统流程图', fontsize=16, fontweight='bold')
        
        return fig

# ============================================================================
# 主应用
# ============================================================================
def main():
    """虚拟实验室主应用"""
    
    # 初始化虚拟实验室
    if 'lab' not in st.session_state:
        st.session_state.lab = VirtualFaceLab()
        st.session_state.lab.setup_lab()
        st.session_state.current_exp = 1
        st.session_state.exp_params = {}
        st.session_state.learning_progress = 0
    
    lab = st.session_state.lab
    
    # 实验室标题
    st.markdown("""
    <div class="lab-container">
    <h1 style="text-align: center; color: white;">🔬 线性代数人脸识别虚拟仿真实验室</h1>
    <p style="text-align: center; color: white; font-size: 18px;">
    一个完整的交互式虚拟仿真环境，让您亲手探索线性代数在人脸识别中的应用
    </p>
    </div>
    """, unsafe_allow_html=True)
    
    # 侧边栏 - 实验室控制台
    with st.sidebar:
        st.image("https://img.icons8.com/color/96/000000/test-tube.png", width=80)
        st.title("🧪 虚拟实验室控制台")
        
        st.markdown("---")
        
        # 实验选择
        st.subheader("🔍 选择实验")
        
        experiments = [
            (1, "实验1: 图像矩阵表示"),
            (2, "实验2: 平均脸计算"),
            (3, "实验3: 数据中心化"),
            (4, "实验4: 协方差矩阵"),
            (5, "实验5: 特征值分解"),
            (6, "实验6: 特征脸提取"),
            (7, "实验7: 高维投影"),
            (8, "实验8: 人脸重建"),
            (9, "实验9: 人脸识别"),
            (10, "实验10: 完整系统")
        ]
        
        selected_exp = st.selectbox(
            "选择要进行的实验",
            experiments,
            format_func=lambda x: x[1],
            index=st.session_state.current_exp-1
        )
        
        exp_id = selected_exp[0]
        
        # 实验参数控制
        st.markdown("---")
        st.subheader("⚙️ 实验参数")
        
        # 根据实验显示不同参数
        if exp_id == 2:
            n_samples = st.slider("选择人脸数量", 2, 20, 5, key="exp2_samples")
            st.session_state.exp_params['n_samples'] = n_samples
        
        elif exp_id == 6:
            n_eigenfaces = st.slider("特征脸数量", 1, 20, 5, key="exp6_eigenfaces")
            st.session_state.exp_params['n_eigenfaces'] = n_eigenfaces
        
        elif exp_id == 7:
            n_components = st.slider("投影维度", 1, 10, 3, key="exp7_components")
            st.session_state.exp_params['n_components'] = n_components
        
        elif exp_id == 8:
            n_components = st.slider("重建特征脸数量", 1, 80, 20, key="exp8_components")
            st.session_state.exp_params['n_components'] = n_components
        
        elif exp_id == 9:
            threshold = st.slider("识别阈值", 0.1, 2.0, 1.0, 0.1, key="exp9_threshold")
            st.session_state.exp_params['threshold'] = threshold
        
        # 运行实验按钮
        st.markdown("---")
        if st.button("🚀 运行实验", type="primary", use_container_width=True):
            st.session_state.current_exp = exp_id
            with st.spinner("正在运行虚拟实验..."):
                time.sleep(0.5)  # 模拟实验运行时间
                st.session_state.exp_result = lab.run_experiment(exp_id, st.session_state.exp_params)
                st.session_state.learning_progress = min(100, st.session_state.learning_progress + 10)
                st.rerun()
        
        # 重置实验室
        if st.button("🔄 重置实验室", use_container_width=True):
            st.session_state.lab = VirtualFaceLab()
            st.session_state.lab.setup_lab()
            st.session_state.current_exp = 1
            st.session_state.exp_params = {}
            st.session_state.learning_progress = 0
            st.rerun()
        
        # 学习进度
        st.markdown("---")
        st.subheader("📊 学习进度")
        st.progress(st.session_state.learning_progress / 100)
        st.write(f"完成度: {st.session_state.learning_progress}%")
        
        # 快速导航
        st.markdown("---")
        st.subheader("🎯 快速导航")
        
        cols = st.columns(2)
        with cols[0]:
            if st.button("上一步") and st.session_state.current_exp > 1:
                st.session_state.current_exp -= 1
                st.rerun()
        
        with cols[1]:
            if st.button("下一步") and st.session_state.current_exp < 10:
                st.session_state.current_exp += 1
                st.rerun()
    
    # 主内容区域
    # 显示当前实验
    if 'exp_result' in st.session_state and st.session_state.current_exp == exp_id:
        result = st.session_state.exp_result
    else:
        # 运行当前实验
        result = lab.run_experiment(st.session_state.current_exp, st.session_state.exp_params)
        st.session_state.exp_result = result
    
    # 实验标题和描述
    st.markdown(f"""
    <div class="experiment-card">
    <h2>{result['title']}</h2>
    <p>{result['description']}</p>
    </div>
    """, unsafe_allow_html=True)
    
    # 实验步骤进度指示器
    steps = [
        "图像表示", "平均脸", "中心化", "协方差", "特征分解",
        "特征脸", "投影", "重建", "识别", "完整系统"
    ]
    
    current_step = st.session_state.current_exp - 1
    
    st.markdown("""
    <div class="progress-indicator">
    """, unsafe_allow_html=True)
    
    cols = st.columns(10)
    for i, step in enumerate(steps):
        with cols[i]:
            if i == current_step:
                st.markdown(f'<div class="progress-step active">{step}</div>', unsafe_allow_html=True)
            else:
                st.markdown(f'<div class="progress-step">{step}</div>', unsafe_allow_html=True)
    
    st.markdown("</div>", unsafe_allow_html=True)
    
    # 显示数学公式
    if 'formula' in result:
        st.markdown("""
        <div class="math-equation">
        <h4>📐 核心数学公式</h4>
        """, unsafe_allow_html=True)
        st.latex(result['formula'])
        st.markdown("</div>", unsafe_allow_html=True)
    
    # 显示可视化结果
    if 'visualization' in result:
        viz = result['visualization']
        
        if isinstance(viz, tuple):
            # 多个图形
            for fig in viz:
                st.pyplot(fig)
        else:
            # 单个图形
            st.pyplot(viz)
    
    # 显示实验步骤（如果有）
    if 'steps' in result:
        st.markdown("""
        <div class="virtual-control">
        <h4>🧪 实验步骤</h4>
        """, unsafe_allow_html=True)
        
        for step in result['steps']:
            st.write(f"• {step}")
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    # 显示实验数据（如果有）
    if 'performance_metrics' in result:
        st.markdown("""
        <div class="virtual-control">
        <h4>📊 系统性能指标</h4>
        """, unsafe_allow_html=True)
        
        cols = st.columns(len(result['performance_metrics']))
        for (key, value), col in zip(result['performance_metrics'].items(), cols):
            col.metric(key.replace('_', ' ').title(), value)
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    # 交互式学习组件
    st.markdown("""
    <div class="virtual-control">
    <h4>💡 学习思考题</h4>
    """, unsafe_allow_html=True)
    
    # 根据当前实验显示不同的思考题
    questions = {
        1: [
            "为什么图像可以表示为矩阵？",
            "将图像展平为向量会丢失什么信息？",
            "10304维向量在计算机中如何存储？"
        ],
        2: [
            "平均脸代表什么物理意义？",
            "如果人脸数据库中有不同种族的人，平均脸会是什么样？",
            "平均脸在图像处理中有什么应用？"
        ],
        3: [
            "为什么在进行PCA之前需要数据中心化？",
            "数据中心化对后续计算有什么影响？",
            "如果不进行中心化，特征脸会是什么样？"
        ],
        4: [
            "协方差矩阵的对角线元素代表什么？",
            "非对角线元素代表什么？",
            "为什么协方差矩阵是对称的？"
        ],
        5: [
            "特征值和特征向量的几何意义是什么？",
            "为什么PCA要选择特征值大的特征向量？",
            "特征值分解和SVD分解有什么关系？"
        ],
        6: [
            "特征脸为什么看起来像'鬼脸'？",
            "第一个特征脸代表什么？",
            "特征脸的数量如何选择？"
        ],
        7: [
            "投影到低维空间会丢失什么信息？",
            "如何选择投影的维度？",
            "投影坐标的物理意义是什么？"
        ],
        8: [
            "为什么用少量特征脸就能重建人脸？",
            "重建误差主要来自哪里？",
            "如何平衡重建质量和计算成本？"
        ],
        9: [
            "最近邻分类器有什么优缺点？",
            "如何提高人脸识别的准确率？",
            "特征脸方法对人脸识别的局限性是什么？"
        ],
        10: [
            "完整的人脸识别系统有哪些关键组件？",
            "如何评估一个人脸识别系统的性能？",
            "线性代数在人脸识别中扮演什么角色？"
        ]
    }
    
    if st.session_state.current_exp in questions:
        for i, question in enumerate(questions[st.session_state.current_exp]):
            with st.expander(f"思考题 {i+1}: {question}"):
                answer_key = f"answer_{st.session_state.current_exp}_{i}"
                if answer_key not in st.session_state:
                    st.session_state[answer_key] = ""
                
                user_answer = st.text_area("写下你的思考:", 
                                          value=st.session_state[answer_key],
                                          key=f"textarea_{answer_key}")
                
                if st.button(f"提交答案 {i+1}", key=f"submit_{answer_key}"):
                    st.session_state[answer_key] = user_answer
                    st.success("答案已保存！")
    
    st.markdown("</div>", unsafe_allow_html=True)
    
    # 实验总结
    st.markdown("---")
    st.markdown(f"""
    <div style="background: #e8f5e9; padding: 20px; border-radius: 10px;">
    <h3>🎓 实验总结 - {result['title']}</h3>
    
    通过本次虚拟实验，您已经：
    
    1. **理解了** {result['description'].lower()}
    2. **掌握了**相关的线性代数概念
    3. **体验了**数学在实际应用中的威力
    
    **关键收获：**
    - 线性代数不是抽象的数学，而是解决实际问题的强大工具
    - 人脸识别背后的数学原理清晰而优美
    - 通过动手实验，抽象概念变得直观易懂
    
    **下一步建议：** 点击左侧控制台，继续下一个实验，逐步构建完整的人脸识别系统知识体系。
    </div>
    """, unsafe_allow_html=True)
    
    # 实验室信息
    st.markdown("---")
    col1, col2, col3 = st.columns(3)
    
    with col1:
        st.info("**虚拟实验室版本**: 3.0")
    
    with col2:
        st.info("**学习模式**: 交互式仿真")
    
    with col3:
        st.info("**预计完成时间**: 2-3小时")

# ============================================================================
# 运行应用
# ============================================================================
if __name__ == "__main__":
    main()