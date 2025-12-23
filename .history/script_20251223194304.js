/**
 * 图片字幕生成器核心功能
 * @author 代码助手
 * @version 1.0.0
 */

// 全局变量
let originalImage = null;
let generatedImage = null;

// DOM元素
const imageUpload = document.getElementById('imageUpload');
const uploadBtn = document.getElementById('uploadBtn');
const fileName = document.getElementById('fileName');
const previewImage = document.getElementById('previewImage');
const previewContainer = document.getElementById('previewContainer');
const subtitleOverlay = document.getElementById('subtitleOverlay');
const subtitleHeight = document.getElementById('subtitleHeight');
const fontSize = document.getElementById('fontSize');
const fontColor = document.getElementById('fontColor');
const fontColorHex = document.getElementById('fontColorHex');
const outlineColor = document.getElementById('outlineColor');
const outlineColorHex = document.getElementById('outlineColorHex');
const fontFamily = document.getElementById('fontFamily');
const fontWeight = document.getElementById('fontWeight');
const subtitleContent = document.getElementById('subtitleContent');
const generateBtn = document.getElementById('generateBtn');
const saveBtn = document.getElementById('saveBtn');
const statusMessage = document.getElementById('statusMessage');

/**
 * 初始化事件监听
 */
function initEventListeners() {
    // 上传按钮点击事件
    uploadBtn.addEventListener('click', () => {
        imageUpload.click();
    });

    // 图片上传事件
    imageUpload.addEventListener('change', handleImageUpload);

    // 颜色选择器事件
    fontColor.addEventListener('input', () => {
        fontColorHex.value = fontColor.value;
        updatePreview();
    });

    outlineColor.addEventListener('input', () => {
        outlineColorHex.value = outlineColor.value;
        updatePreview();
    });

    // 字幕设置变化事件
    subtitleHeight.addEventListener('input', updatePreview);
    fontSize.addEventListener('input', updatePreview);
    fontFamily.addEventListener('change', updatePreview);
    fontWeight.addEventListener('change', updatePreview);
    subtitleContent.addEventListener('input', updatePreview);

    // 生成按钮点击事件
    generateBtn.addEventListener('click', generateImage);

    // 保存按钮点击事件
    saveBtn.addEventListener('click', saveImage);
}

/**
 * 计算最大可显示行数
 * @returns {number} 最大行数
 */
function calculateMaxLines() {
    const subtitleHeightValue = parseInt(subtitleHeight.value);
    const fontSizeValue = parseInt(fontSize.value);
    const lineHeight = fontSizeValue * 1.6;
    return Math.floor(subtitleHeightValue / lineHeight);
}

/**
 * 检查文本是否溢出
 * @param {string} text - 文本内容
 * @param {number} maxWidth - 最大宽度
 * @returns {boolean} 是否溢出
 */
function isTextOverflow(text, maxWidth) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    ctx.font = `${fontWeight.value} ${fontSize.value}px ${fontFamily.value}`;
    const textWidth = ctx.measureText(text).width;
    return textWidth > maxWidth;
}

/**
 * 处理图片上传
 * @param {Event} e - 上传事件
 */
function handleImageUpload(e) {
    const file = e.target.files[0];
    if (!file) return;

    // 检查文件类型
    if (!file.type.startsWith('image/')) {
        showStatus('请选择图片文件', 'error');
        return;
    }

    // 显示文件名
    fileName.textContent = file.name;

    // 读取图片文件
    const reader = new FileReader();
    reader.onload = function(event) {
        originalImage = new Image();
        originalImage.onload = function() {
            previewImage.src = originalImage.src;
            previewImage.style.display = 'block';
            updatePreview();
        };
        originalImage.src = event.target.result;
    };
    reader.readAsDataURL(file);
}

/**
 * 更新预览效果
 */
function updatePreview() {
    if (!originalImage) return;

    // 清空现有字幕
    subtitleOverlay.innerHTML = '';
    
    // 获取字幕设置
    const subtitleHeightValue = parseInt(subtitleHeight.value);
    const fontSizeValue = parseInt(fontSize.value);
    const fontColorValue = fontColor.value;
    const outlineColorValue = outlineColor.value;
    const fontFamilyValue = fontFamily.value;
    const fontWeightValue = fontWeight.value;
    const lines = subtitleContent.value.split('\n').filter(line => line.trim() !== '');
    
    // 计算每行高度
    const lineHeight = fontSizeValue * 1.6;
    const totalLines = lines.length;
    const availableHeight = subtitleHeightValue;
    const lineBackgroundHeight = lineHeight * 0.9;
    const lineBackgroundYOffset = (lineHeight - lineBackgroundHeight) / 2;
    
    // 计算起始位置
    const startY = (availableHeight - totalLines * lineHeight) / 2;
    
    // 创建每行字幕元素（正序排列）
    lines.forEach((line, index) => {
        const lineElement = document.createElement('div');
        lineElement.className = 'subtitle-line';
        lineElement.textContent = line;
        lineElement.style.position = 'relative';
        lineElement.style.textAlign = 'center';
        lineElement.style.fontSize = `${fontSizeValue}px`;
        lineElement.style.color = fontColorValue;
        lineElement.style.textShadow = `0 0 2px ${outlineColorValue}, 0 0 2px ${outlineColorValue}, 0 0 2px ${outlineColorValue}, 0 0 2px ${outlineColorValue}`;
        lineElement.style.fontFamily = fontFamilyValue;
        lineElement.style.fontWeight = fontWeightValue;
        lineElement.style.padding = '8px 20px';
        lineElement.style.backgroundImage = `url(${originalImage.src})`;
        lineElement.style.backgroundPosition = 'center';
        lineElement.style.backgroundSize = 'cover';
        lineElement.style.filter = 'brightness(0.5)';
        lineElement.style.marginBottom = '8px';
        lineElement.style.maxWidth = '100%';
        lineElement.style.boxSizing = 'border-box';
        
        subtitleOverlay.appendChild(lineElement);
    });
    
    subtitleOverlay.style.display = 'block';
    subtitleOverlay.style.height = `${subtitleHeightValue}px`;
}

/**
 * 生成带字幕的图片
 */
function generateImage() {
    if (!originalImage) {
        showStatus('请先上传图片', 'error');
        return;
    }

    // 创建Canvas元素
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 设置Canvas尺寸
    canvas.width = originalImage.width;
    canvas.height = originalImage.height;

    // 绘制原始图片
    ctx.drawImage(originalImage, 0, 0);

    // 获取字幕设置
    const subtitleHeightValue = parseInt(subtitleHeight.value);
    const fontSizeValue = parseInt(fontSize.value);
    const fontColorValue = fontColor.value;
    const outlineColorValue = outlineColor.value;
    const fontFamilyValue = fontFamily.value;
    const fontWeightValue = fontWeight.value;
    const lines = subtitleContent.value.split('\n');

    // 计算字幕区域位置
    const subtitleY = canvas.height - subtitleHeightValue;
    const lineHeight = fontSizeValue * 1.6;
    const totalTextHeight = lines.length * lineHeight;
    const startY = subtitleY + (subtitleHeightValue - totalTextHeight) / 2;

    // 设置文字样式
    ctx.font = `${fontWeightValue} ${fontSizeValue}px ${fontFamilyValue}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    // 计算每行文字的背景高度
    const lineBackgroundHeight = lineHeight * 0.9;
    const lineBackgroundYOffset = (lineHeight - lineBackgroundHeight) / 2;
    
    // 计算最大可显示宽度
    const maxTextWidth = canvas.width * 0.9;
    
    // 检查并处理文本溢出
    const validLines = lines.filter(line => line.trim() !== '');
    const maxLines = calculateMaxLines();
    
    if (validLines.length > maxLines) {
        showStatus(`警告：字幕行数过多，最多可显示${maxLines}行`, 'error');
        return;
    }
    
    // 检查每行文字是否溢出
    const overflowLines = validLines.filter(line => {
        const textWidth = ctx.measureText(line).width;
        return textWidth > maxTextWidth;
    });
    
    if (overflowLines.length > 0) {
        showStatus('警告：部分文字过长，请调整字体大小或内容', 'error');
        return;
    }
    
    // 绘制字幕背景和文字
    validLines.forEach((line, index) => {
        const y = startY + index * lineHeight;
        
        // 计算文字宽度
        const textWidth = ctx.measureText(line).width;
        const padding = 20;
        const backgroundWidth = textWidth + padding * 2;
        const backgroundX = (canvas.width - backgroundWidth) / 2;
        const backgroundY = y + lineBackgroundYOffset;
        
        // 绘制文字背景
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(backgroundX, backgroundY, backgroundWidth, lineBackgroundHeight);
        
        // 绘制文字轮廓
        ctx.strokeStyle = outlineColorValue;
        ctx.lineWidth = 2;
        ctx.strokeText(line, canvas.width / 2, y);
        
        // 绘制文字填充
        ctx.fillStyle = fontColorValue;
        ctx.fillText(line, canvas.width / 2, y);
    });

    // 保存生成的图片
    generatedImage = canvas.toDataURL('image/png');
    showStatus('字幕图片生成成功！', 'success');
}

/**
 * 保存生成的图片
 */
function saveImage() {
    if (!generatedImage) {
        showStatus('请先生成图片', 'error');
        return;
    }

    // 创建下载链接
    const link = document.createElement('a');
    link.download = `带字幕图片_${new Date().getTime()}.png`;
    link.href = generatedImage;
    link.click();
}

/**
 * 显示状态消息
 * @param {string} message - 消息内容
 * @param {string} type - 消息类型（success/error）
 */
function showStatus(message, type) {
    statusMessage.textContent = message;
    statusMessage.className = `status-message ${type}`;
    
    // 3秒后自动隐藏
    setTimeout(() => {
        statusMessage.className = 'status-message';
    }, 3000);
}

/**
 * 初始化应用
 */
function init() {
    initEventListeners();
    updatePreview();
}

// 页面加载完成后初始化
window.addEventListener('load', init);