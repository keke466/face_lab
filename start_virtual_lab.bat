@echo off
chcp 65001 > nul
echo.
echo ===================================================================
echo           线性代数人脸识别虚拟仿真实验室
echo                   一键启动脚本
echo ===================================================================
echo.
echo 🔬 启动虚拟仿真实验室...
echo.

REM 检查Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到Python！
    echo 请先安装Anaconda（推荐）或Python 3.8+
    echo 下载地址: https://www.anaconda.com/download
    pause
    exit /b 1
)

echo ✅ Python环境正常

REM 检查并安装依赖
echo.
echo 📦 检查依赖包...
echo.

REM 安装必要的包
python -m pip install streamlit numpy matplotlib --quiet
python -m pip install pillow scikit-learn --quiet

echo.
echo ✅ 依赖包安装完成！

echo.
echo 🌐 启动虚拟仿真实验室...
echo.
echo 📱 手机访问信息:
echo    1. 确保手机和电脑在同一网络
echo    2. 手机浏览器输入下面显示的链接
echo    3. 推荐使用Chrome或Safari浏览器
echo.
echo ⚠️  注意：首次启动可能需要1-2分钟
echo.
echo ===================================================================
echo.

REM 启动虚拟实验室
streamlit run virtual_lab.py --server.port 8501 --server.address 0.0.0.0

pause