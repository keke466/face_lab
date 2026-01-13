"""
学生实验模板
包含多个有趣的实验，让学生动手实践
"""

import numpy as np
import matplotlib.pyplot as plt
from face_recognition_pca import FaceRecognitionPCA

class StudentExperiments:
    """学生实验集合"""
    
    def __init__(self, data_path):
        """初始化"""
        self.data_path = data_path
        self.face_rec = None
    
    def load_system(self):
        """加载人脸识别系统"""
        print("🔧 加载人脸识别系统...")
        self.face_rec = FaceRecognitionPCA(self.data_path)
        self.face_rec.load_orl_faces()
        self.face_rec.compute_mean_face()
        self.face_rec.center_data()
        print("✅ 系统加载完成")
    
    def experiment1_dimensionality_reduction(self):
        """实验1：维度压缩效果"""
        print("\n" + "="*60)
        print("🧪 实验1：维度压缩对识别率的影响")
        print("="*60)
        
        print("""
实验目的：
    研究不同数量的特征脸对识别准确率的影响
    
实验步骤：
    1. 使用不同数量的特征脸（5, 10, 20, 50, 100）
    2. 测试每种情况的识别率
    3. 分析维度与性能的关系
    
假设：
    1. 特征脸越多，识别率越高
    2. 但存在边际递减效应
        """)
        
        n_components_list = [5, 10, 20, 50, 100, 200]
        accuracies = []
        
        for n_comp in n_components_list:
            print(f"\n🔧 测试 {n_comp} 个特征脸...")
            
            # 计算特征脸
            n_comp_actual = min(n_comp, len(self.face_rec.faces_centered))
            U, S, Vt = np.linalg.svd(self.face_rec.faces_centered, full_matrices=False)
            eigenfaces = Vt.T[:, :n_comp_actual]
            
            # 划分训练测试集
            from sklearn.model_selection import train_test_split
            X_train, X_test, y_train, y_test = train_test_split(
                self.face_rec.faces, self.face_rec.labels, 
                test_size=0.2, random_state=42
            )
            
            # 训练
            train_mean = np.mean(X_train, axis=0)
            X_train_centered = X_train - train_mean
            train_projections = X_train_centered @ eigenfaces
            
            # 测试
            correct = 0
            for test_face, true_label in zip(X_test, y_test):
                test_centered = test_face - train_mean
                test_projection = test_centered @ eigenfaces
                
                distances = np.linalg.norm(train_projections - test_projection, axis=1)
                nearest_idx = np.argmin(distances)
                predicted_label = y_train[nearest_idx]
                
                if predicted_label == true_label:
                    correct += 1
            
            accuracy = correct / len(X_test)
            accuracies.append(accuracy)
            print(f"✅ 准确率: {accuracy:.4f}")
        
        # 可视化结果
        plt.figure(figsize=(10, 6))
        plt.plot(n_components_list, accuracies, 'bo-', linewidth=2, markersize=8)
        plt.xlabel('特征脸数量')
        plt.ylabel('识别准确率')
        plt.title('维度压缩对识别率的影响')
        plt.grid(True, alpha=0.3)
        
        # 添加压缩比例
        for i, (n_comp, acc) in enumerate(zip(n_components_list, accuracies)):
            compression_ratio = n_comp / self.face_rec.faces.shape[1] * 100
            plt.annotate(f'{compression_ratio:.1f}%', 
                        (n_comp, acc), 
                        textcoords="offset points", 
                        xytext=(0,10), 
                        ha='center')
        
        plt.tight_layout()
        plt.savefig('experiment1_dimensionality.png', dpi=150)
        plt.show()
        
        print("\n📊 实验结果总结：")
        for n_comp, acc in zip(n_components_list, accuracies):
            print(f"  特征脸 {n_comp:3d}个 : 准确率 {acc:.4f}")
    
    def experiment2_visualize_eigenfaces(self, n_persons=5):
        """实验2：可视化不同人的特征脸"""
        print("\n" + "="*60)
        print("🧪 实验2：不同人的特征脸对比")
        print("="*60)
        
        print("""
实验目的：
    比较不同人的特征脸，理解个性化特征
    
实验步骤：
    1. 为不同人分别计算特征脸
    2. 可视化比较
    3. 分析个性化特征
        """)
        
        # 选择前n_persons个人
        unique_labels = np.unique(self.face_rec.labels)
        selected_labels = unique_labels[:n_persons]
        
        fig, axes = plt.subplots(n_persons, 5, figsize=(15, 3*n_persons))
        
        for i, label in enumerate(selected_labels):
            # 提取该人的所有人脸
            person_faces = self.face_rec.faces[self.face_rec.labels == label]
            
            if len(person_faces) > 1:
                # 计算该人的特征脸
                person_mean = np.mean(person_faces, axis=0)
                person_centered = person_faces - person_mean
                
                # 计算该人的PCA
                U, S, Vt = np.linalg.svd(person_centered, full_matrices=False)
                person_eigenfaces = Vt.T[:, :5]  # 取前5个
                
                # 显示该人的平均脸
                axes[i, 0].imshow(person_mean.reshape(112, 92), cmap='gray')
                axes[i, 0].set_title(f'人{label+1} 平均脸')
                axes[i, 0].axis('off')
                
                # 显示该人的前4个特征脸
                for j in range(4):
                    eigenface = person_eigenfaces[:, j].reshape(112, 92)
                    axes[i, j+1].imshow(eigenface, cmap='gray')
                    axes[i, j+1].set_title(f'特征脸 {j+1}')
                    axes[i, j+1].axis('off')
        
        plt.suptitle('不同人的特征脸对比', fontsize=16)
        plt.tight_layout()
        plt.savefig('experiment2_personal_eigenfaces.png', dpi=150)
        plt.show()
        
        print("\n📊 实验观察：")
        print("1. 每个人的特征脸都有独特的模式")
        print("2. 特征脸反映了该人的主要变化方向")
        print("3. 可以观察到眼镜、表情等个性化特征")
    
    def experiment3_reconstruction_quality(self):
        """实验3：重建质量分析"""
        print("\n" + "="*60)
        print("🧪 实验3：不同特征脸数量的重建质量")
        print("="*60)
        
        print("""
实验目的：
    研究特征脸数量对重建质量的影响
    
实验步骤：
    1. 使用不同数量的特征脸重建人脸
    2. 计算重建误差
    3. 可视化重建效果
        """)
        
        # 计算所有特征脸
        U, S, Vt = np.linalg.svd(self.face_rec.faces_centered, full_matrices=False)
        all_eigenfaces = Vt.T
        
        # 选择一张测试人脸
        test_idx = 0
        test_face = self.face_rec.faces[test_idx]
        test_label = self.face_rec.labels[test_idx]
        
        # 不同特征脸数量
        n_components_list = [1, 5, 10, 20, 50, 100]
        
        fig, axes = plt.subplots(2, 4, figsize=(16, 8))
        axes = axes.flatten()
        
        # 显示原始人脸
        axes[0].imshow(test_face.reshape(112, 92), cmap='gray')
        axes[0].set_title(f'原始人脸\n人{test_label+1}')
        axes[0].axis('off')
        
        errors = []
        
        for i, n_comp in enumerate(n_components_list):
            # 重建人脸
            eigenfaces = all_eigenfaces[:, :n_comp]
            
            # 中心化
            test_centered = test_face - self.face_rec.mean_face
            
            # 投影
            projection = test_centered @ eigenfaces
            
            # 重建
            reconstructed = self.face_rec.mean_face + eigenfaces @ projection
            
            # 计算误差
            error = np.mean((test_face - reconstructed) ** 2)
            errors.append(error)
            
            # 显示重建结果
            ax_idx = i + 1
            axes[ax_idx].imshow(reconstructed.reshape(112, 92), cmap='gray')
            axes[ax_idx].set_title(f'{n_comp}个特征脸\nMSE: {error:.4f}')
            axes[ax_idx].axis('off')
        
        plt.suptitle('不同特征脸数量的重建效果', fontsize=16)
        plt.tight_layout()
        plt.savefig('experiment3_reconstruction.png', dpi=150)
        plt.show()
        
        # 绘制误差曲线
        plt.figure(figsize=(10, 5))
        plt.plot(n_components_list, errors, 'ro-', linewidth=2, markersize=8)
        plt.xlabel('特征脸数量')
        plt.ylabel('均方误差 (MSE)')
        plt.title('重建误差 vs 特征脸数量')
        plt.grid(True, alpha=0.3)
        plt.yscale('log')
        plt.tight_layout()
        plt.savefig('experiment3_error_curve.png', dpi=150)
        plt.show()
        
        print("\n📊 实验结果：")
        for n_comp, error in zip(n_components_list, errors):
            print(f"  特征脸 {n_comp:3d}个 : MSE = {error:.6f}")
    
    def experiment4_distance_analysis(self):
        """实验4：距离分析"""
        print("\n" + "="*60)
        print("🧪 实验4：特征脸空间中的距离分析")
        print("="*60)
        
        print("""
实验目的：
    分析同一人和不同人之间的距离分布
    
实验步骤：
    1. 计算特征脸空间中的距离
    2. 统计同一人和不同人之间的距离
    3. 寻找最佳分类阈值
        """)
        
        # 计算特征脸空间坐标
        n_components = 50
        U, S, Vt = np.linalg.svd(self.face_rec.faces_centered, full_matrices=False)
        eigenfaces = Vt.T[:, :n_components]
        projections = self.face_rec.faces_centered @ eigenfaces
        
        # 计算距离
        n_samples = len(projections)
        same_person_distances = []
        diff_person_distances = []
        
        print("📊 计算距离矩阵...")
        
        # 抽样计算
        n_pairs = 1000
        for _ in range(n_pairs):
            i, j = np.random.choice(n_samples, 2, replace=False)
            dist = np.linalg.norm(projections[i] - projections[j])
            
            if self.face_rec.labels[i] == self.face_rec.labels[j]:
                same_person_distances.append(dist)
            else:
                diff_person_distances.append(dist)
        
        # 统计
        same_mean = np.mean(same_person_distances)
        same_std = np.std(same_person_distances)
        diff_mean = np.mean(diff_person_distances)
        diff_std = np.std(diff_person_distances)
        
        print(f"\n📊 距离统计：")
        print(f"同一人距离: 均值={same_mean:.4f}, 标准差={same_std:.4f}")
        print(f"不同人距离: 均值={diff_mean:.4f}, 标准差={diff_std:.4f}")
        print(f"距离比值: {diff_mean/same_mean:.4f}")
        
        # 可视化
        plt.figure(figsize=(12, 5))
        
        # 直方图
        plt.subplot(1, 2, 1)
        plt.hist(same_person_distances, bins=30, alpha=0.7, label='同一人', color='blue')
        plt.hist(diff_person_distances, bins=30, alpha=0.7, label='不同人', color='red')
        plt.xlabel('欧氏距离')
        plt.ylabel('频数')
        plt.title('距离分布')
        plt.legend()
        plt.grid(True, alpha=0.3)
        
        # 箱线图
        plt.subplot(1, 2, 2)
        plt.boxplot([same_person_distances, diff_person_distances], 
                   labels=['同一人', '不同人'])
        plt.ylabel('欧氏距离')
        plt.title('距离比较')
        plt.grid(True, alpha=0.3)
        
        plt.suptitle('特征脸空间距离分析', fontsize=14)
        plt.tight_layout()
        plt.savefig('experiment4_distance_analysis.png', dpi=150)
        plt.show()
        
        # 寻找最佳阈值
        print("\n🔍 寻找最佳分类阈值...")
        all_distances = same_person_distances + diff_person_distances
        all_labels = [1] * len(same_person_distances) + [0] * len(diff_person_distances)
        
        thresholds = np.linspace(min(all_distances), max(all_distances), 100)
        accuracies = []
        
        for threshold in thresholds:
            predictions = [1 if d < threshold else 0 for d in all_distances]
            accuracy = np.mean(np.array(predictions) == np.array(all_labels))
            accuracies.append(accuracy)
        
        best_threshold = thresholds[np.argmax(accuracies)]
        best_accuracy = np.max(accuracies)
        
        print(f"最佳阈值: {best_threshold:.4f}")
        print(f"在此阈值下的分类准确率: {best_accuracy:.4f}")
        
        plt.figure(figsize=(8, 5))
        plt.plot(thresholds, accuracies, 'b-', linewidth=2)
        plt.axvline(best_threshold, color='r', linestyle='--', alpha=0.7)
        plt.xlabel('阈值')
        plt.ylabel('分类准确率')
        plt.title('阈值选择对分类准确率的影响')
        plt.grid(True, alpha=0.3)
        plt.tight_layout()
        plt.savefig('experiment4_threshold_selection.png', dpi=150)
        plt.show()
    
    def run_all_experiments(self):
        """运行所有实验"""
        print("🚀 学生实验套件")
        print("="*70)
        
        self.load_system()
        
        experiments = [
            ("维度压缩实验", self.experiment1_dimensionality_reduction),
            ("特征脸对比", self.experiment2_visualize_eigenfaces),
            ("重建质量分析", self.experiment3_reconstruction_quality),
            ("距离分析", self.experiment4_distance_analysis),
        ]
        
        for i, (name, func) in enumerate(experiments, 1):
            print(f"\n{'='*60}")
            print(f"🧪 实验 {i}: {name}")
            print('='*60)
            func()
            input(f"\n按Enter键继续下一个实验...")
        
        print("\n" + "="*70)
        print("🎉 所有实验完成！")
        print("="*70)

# 运行实验
if __name__ == "__main__":
    data_path = r"D:\MyMathProjects\face_lab\data\orl_faces"
    experiments = StudentExperiments(data_path)
    experiments.run_all_experiments()