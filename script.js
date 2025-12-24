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
const randomImageBtn = document.getElementById('randomImageBtn');
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
const generateQuotesBtn = document.getElementById('generateQuotesBtn');
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
        generateImage();
    });

    outlineColor.addEventListener('input', () => {
        outlineColorHex.value = outlineColor.value;
        updatePreview();
        generateImage();
    });

    // 字幕设置变化事件
    subtitleHeight.addEventListener('input', () => {
        updatePreview();
        generateImage();
    });
    fontSize.addEventListener('input', () => {
        updatePreview();
        generateImage();
    });
    fontFamily.addEventListener('change', () => {
        updatePreview();
        generateImage();
    });
    fontWeight.addEventListener('change', () => {
        updatePreview();
        generateImage();
    });
    subtitleContent.addEventListener('input', () => {
        updatePreview();
        generateImage();
    });

    // 保存按钮点击事件
    saveBtn.addEventListener('click', saveImage);
    
    // 生成金句按钮点击事件
    generateQuotesBtn.addEventListener('click', generateQuotes);
    
    // 随机图片按钮点击事件
    randomImageBtn.addEventListener('click', generateRandomImage);
}

/**
 * 计算最大可显示行数
 * @returns {number} 最大行数
 */
function calculateMaxLines() {
    // 移除行数限制，允许显示所有输入的文字
    return Infinity;
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
            generateImage();
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
    const lineHeight = fontSizeValue * 1.2; // 使用与calculateMaxLines相同的行高比例
    const totalLines = lines.length;
    const availableHeight = subtitleHeightValue;
    const lineBackgroundHeight = lineHeight * 0.9;
    const lineBackgroundYOffset = (lineHeight - lineBackgroundHeight) / 2;
    
    // 计算起始位置
    const startY = (availableHeight - totalLines * lineHeight) / 2;
    
    // 设置字幕容器样式
    subtitleOverlay.style.display = 'flex';
    subtitleOverlay.style.flexDirection = 'column';
    subtitleOverlay.style.justifyContent = 'center';
    subtitleOverlay.style.alignItems = 'center';
    subtitleOverlay.style.padding = '20px 0';
    
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
        lineElement.style.padding = '8px 0'; // 移除左右内边距
        lineElement.style.backgroundImage = `url(${originalImage.src})`;
        lineElement.style.backgroundPosition = `center ${100 - (subtitleHeightValue / originalImage.height * 100)}%`; // 使用图片底部区域
        lineElement.style.backgroundSize = 'cover';
        lineElement.style.filter = 'brightness(0.5)';
        lineElement.style.marginBottom = '8px';
        lineElement.style.maxWidth = '100%';
        lineElement.style.width = '100%'; // 使用100%宽度
        lineElement.style.boxSizing = 'border-box';
        lineElement.style.left = '0';
        lineElement.style.right = '0';
        
        subtitleOverlay.appendChild(lineElement);
    });
    
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
    const lineHeight = fontSizeValue * 1.2; // 使用与calculateMaxLines相同的行高比例
    const subtitleY = canvas.height - subtitleHeightValue;
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
        
        // 计算背景位置和尺寸
        const backgroundWidth = canvas.width; // 使用图片宽度
        const backgroundX = 0; // 从左侧开始
        const backgroundY = y + lineBackgroundYOffset;
        
        // 绘制文字背景（使用图片底部区域）
        // 1. 从原始图片底部截取对应区域作为背景
        const sourceX = 0;
        const sourceY = subtitleY; // 使用字幕区域的Y坐标作为源Y坐标
        ctx.drawImage(
            originalImage, 
            sourceX, sourceY, 
            backgroundWidth, lineBackgroundHeight, 
            backgroundX, backgroundY, 
            backgroundWidth, lineBackgroundHeight
        );
        
        // 2. 添加半透明黑色遮罩，让文字更清晰
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
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
 * 生成金句
 */
function generateQuotes() {
    const quotes = [
        "每一次努力都是在为自己的未来铺路",
        "坚持就是胜利，成功属于永不放弃的人",
        "梦想不会逃跑，会逃跑的永远都是自己",
        "今天的付出，明天的收获",
        "机会总是留给有准备的人",
        "相信自己，你比想象中更强大",
        "努力到无能为力，拼搏到感动自己",
        "每一个不曾起舞的日子，都是对生命的辜负",
        "生活原本沉闷，但跑起来就会有风",
        "心有山海，静而无边",
        "成功不是终点，失败不是终结，勇气才是永恒",
        "人生没有彩排，每天都是现场直播",
        "你若盛开，蝴蝶自来；你若精彩，天自安排",
        "所有的失去，都会以另一种方式归来",
        "人生最精彩的不是实现梦想的瞬间，而是坚持梦想的过程",
        "种一棵树最好的时间是十年前，其次是现在",
        "不要等待机会，而要创造机会",
        "命运负责洗牌，但是玩牌的是我们自己",
        "当你觉得为时已晚的时候，恰恰是最早的时候",
        "生活不是林黛玉，不会因为忧伤而风情万种",
        "成功的人总是找方法，失败的人总是找借口",
        "与其羡慕别人，不如提升自己",
        "心若向阳，无畏悲伤",
        "每一个优秀的人，都有一段沉默的时光",
        "你的负担将变成礼物，你受的苦将照亮你的路",
        "人生如逆旅，我亦是行人",
        "宝剑锋从磨砺出，梅花香自苦寒来",
        "长风破浪会有时，直挂云帆济沧海",
        "天生我材必有用，千金散尽还复来",
        "山重水复疑无路，柳暗花明又一村",
        "会当凌绝顶，一览众山小",
        "纸上得来终觉浅，绝知此事要躬行",
        "问渠那得清如许？为有源头活水来",
        "业精于勤，荒于嬉；行成于思，毁于随",
        "学而不思则罔，思而不学则殆",
        "三人行，必有我师焉；择其善者而从之，其不善者而改之",
        "己所不欲，勿施于人",
        "天将降大任于斯人也，必先苦其心志，劳其筋骨",
        "不积跬步，无以至千里；不积小流，无以成江海",
        "知之者不如好之者，好之者不如乐之者",
        "吾生也有涯，而知也无涯",
        "敏而好学，不耻下问",
        "学而时习之，不亦说乎？有朋自远方来，不亦乐乎？",
        "言必信，行必果",
        "人而无信，不知其可也",
        "老吾老，以及人之老；幼吾幼，以及人之幼",
        "穷则独善其身，达则兼济天下",
        "见贤思齐焉，见不贤而内自省也",
        "勿以恶小而为之，勿以善小而不为",
        "一年之计在于春，一日之计在于晨",
        "一寸光阴一寸金，寸金难买寸光阴",
        "少壮不努力，老大徒伤悲",
        "黑发不知勤学早，白首方悔读书迟",
        "莫等闲，白了少年头，空悲切",
        "盛年不重来，一日难再晨。及时当勉励，岁月不待人",
        "明日复明日，明日何其多。我生待明日，万事成蹉跎",
        "三更灯火五更鸡，正是男儿读书时",
        "读书破万卷，下笔如有神",
        "书读百遍，其义自见",
        "书山有路勤为径，学海无涯苦作舟",
        "读万卷书，行万里路",
        "书到用时方恨少，事非经过不知难",
        "旧书不厌百回读，熟读深思子自知",
        "鸟欲高飞先振翅，人求上进先读书",
        "问君能有几多愁？恰似一江春水向东流",
        "人生自是有情痴，此恨不关风与月",
        "两情若是久长时，又岂在朝朝暮暮",
        "曾经沧海难为水，除却巫山不是云",
        "身无彩凤双飞翼，心有灵犀一点通",
        "春蚕到死丝方尽，蜡炬成灰泪始干",
        "东边日出西边雨，道是无晴却有晴",
        "同是天涯沦落人，相逢何必曾相识",
        "出师未捷身先死，长使英雄泪满襟",
        "人生自古谁无死？留取丹心照汗青",
        "王师北定中原日，家祭无忘告乃翁",
        "但使龙城飞将在，不教胡马度阴山",
        "醉卧沙场君莫笑，古来征战几人回？",
        "黄沙百战穿金甲，不破楼兰终不还",
        "三十功名尘与土，八千里路云和月",
        "了却君王天下事，赢得生前身后名",
        "我自横刀向天笑，去留肝胆两昆仑",
        "拼将十万头颅血，须把乾坤力挽回",
        "寄意寒星荃不察，我以我血荐轩辕",
        "为有牺牲多壮志，敢教日月换新天",
        "一万年太久，只争朝夕",
        "数风流人物，还看今朝",
        "星星之火，可以燎原",
        "雄关漫道真如铁，而今迈步从头越",
        "不到长城非好汉，屈指行程二万",
        "天若有情天亦老，人间正道是沧桑",
        "牢骚太盛防肠断，风物长宜放眼量",
        "宜将剩勇追穷寇，不可沽名学霸王",
        "生的伟大，死的光荣",
        "为人民服务",
        "实践是检验真理的唯一标准",
        "发展才是硬道理",
        "科学技术是第一生产力",
        "时间就是金钱，效率就是生命",
        "让一部分人先富起来",
        "绿水青山就是金山银山",
        "幸福都是奋斗出来的",
        "撸起袖子加油干",
        "不忘初心，方得始终",
        "只争朝夕，不负韶华"
    ];
    
    // 随机选择一条金句
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];
    
    // 将金句填充到字幕文本框
    subtitleContent.value = randomQuote;
    
    // 更新预览
    updatePreview();
    generateImage();
    
    // 显示成功提示
    showStatus('金句生成成功！', 'success');
}

/**
 * 生成随机图片
 */
function generateRandomImage() {
    // 随机图片API（使用picsum.photos）
    const width = 800;
    const height = 600;
    const randomSeed = Math.floor(Math.random() * 1000);
    const randomImageUrl = `https://picsum.photos/${width}/${height}?seed=${randomSeed}`;
    
    // 显示加载状态
    showStatus('正在加载随机图片...', 'success');
    
    // 创建图片对象
    originalImage = new Image();
    originalImage.crossOrigin = 'anonymous'; // 解决跨域问题
    originalImage.onload = function() {
        // 使用Canvas绘制图片，避免跨域问题
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = originalImage.width;
        canvas.height = originalImage.height;
        ctx.drawImage(originalImage, 0, 0);
        
        // 将Canvas转换为DataURL
        const dataUrl = canvas.toDataURL('image/png');
        
        // 更新预览图片
        previewImage.src = dataUrl;
        previewImage.style.display = 'block';
        fileName.textContent = '随机图片';
        
        // 更新originalImage为DataURL版本
        originalImage = new Image();
        originalImage.onload = function() {
            updatePreview();
            generateImage();
            showStatus('随机图片加载成功！', 'success');
        };
        originalImage.src = dataUrl;
    };
    originalImage.onerror = function() {
        showStatus('随机图片加载失败，请重试', 'error');
    };
    originalImage.src = randomImageUrl;
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