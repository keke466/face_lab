@echo off
chcp 65001 > nul
echo.
echo ========================================
echo   线性代数人脸识别教学系统 - 手机友好版
echo ========================================
echo.
echo 📱 系统启动中...

REM 检查Python环境
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ 未找到Python，请先安装Anaconda
    pause
    exit /b 1
)

REM 检查依赖
echo 🔧 检查依赖包...
pip install streamlit numpy pillow matplotlib scikit-learn --quiet

REM 检查数据路径
set DATA_PATH=D:\MyMathProjects\face_lab\data\orl_faces
if not exist "%DATA_PATH%" (
    echo ❌ 未找到数据路径：%DATA_PATH%
    echo 💡 请确保ORL人脸数据库已放置在此路径
    pause
    exit /b 1
)

echo ✅ 所有检查通过！
echo.
echo 🌐 正在启动Web应用...
echo 📱 请在手机浏览器访问下面的链接
echo 🔗 本地链接：http://localhost:8501
echo 📍 网络链接：http://<你的IP>:8501
echo.
echo ⚠️  注意：确保手机和电脑在同一网络
echo.

REM 启动Streamlit应用
streamlit run app.py --server.port 8501 --server.address 0.0.0.0

pause