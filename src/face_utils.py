"""
人脸处理工具函数 - 简化版
"""

import numpy as np
from PIL import Image
import os

def load_single_face(image_path):
    """加载单张人脸图片"""
    try:
        img = Image.open(image_path)
        img_array = np.array(img, dtype=np.float32)
        img_array = img_array / 255.0  # 归一化
        return img_array.flatten()
    except Exception as e:
        print(f"加载图片失败: {e}")
        return None

def resize_image(img_array, target_size=(112, 92)):
    """调整图片大小"""
    from PIL import Image
    img = Image.fromarray((img_array * 255).astype(np.uint8))
    img = img.resize(target_size[::-1])  # (width, height)
    return np.array(img, dtype=np.float32) / 255.0

def show_image_grid(images, titles=None, cols=5):
    """显示图片网格"""
    import matplotlib.pyplot as plt
    
    n = len(images)
    rows = (n + cols - 1) // cols
    
    fig, axes = plt.subplots(rows, cols, figsize=(cols*3, rows*3))
    axes = axes.flatten() if rows > 1 else [axes]
    
    for i in range(len(axes)):
        axes[i].axis('off')
        
    for i, img in enumerate(images):
        axes[i].imshow(img, cmap='gray')
        if titles and i < len(titles):
            axes[i].set_title(titles[i])
    
    plt.tight_layout()
    return fig