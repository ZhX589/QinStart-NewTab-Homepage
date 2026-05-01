// ==================== DOM 元素 ====================
const clockEl = document.getElementById('clock');
const dateEl = document.getElementById('date');
const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');
const hitokotoText = document.getElementById('hitokoto_text');
const hitokotoAuthor = document.getElementById('hitokoto_author');

const settingsBtn = document.getElementById('settingsBtn');
const settingsOverlay = document.getElementById('settingsOverlay');
const closeSettings = document.getElementById('closeSettings');

const modeLightBtn = document.getElementById('modeLightBtn');
const modeDarkBtn = document.getElementById('modeDarkBtn');
const bgLightInput = document.getElementById('bgLightInput');
const bgDarkInput = document.getElementById('bgDarkInput');
const bgLightName = document.getElementById('bgLightName');
const bgDarkName = document.getElementById('bgDarkName');
const resetLightBg = document.getElementById('resetLightBg');
const resetDarkBg = document.getElementById('resetDarkBg');

// ==================== 常量 ====================
const STORAGE_KEY_MODE = 'lightstart_mode';
const STORAGE_KEY_BG_LIGHT = 'lightstart_bg_light';
const STORAGE_KEY_BG_DARK = 'lightstart_bg_dark';
const STORAGE_KEY_NEW_TAB_SEARCH = 'lightstart_new_tab_search';

// ==================== 状态 ====================
let currentMode = 'light'; // 'light' | 'dark'
let searchInNewTab = false; // false | true

// ==================== 初始化 ====================
function init() {
  loadMode();
  loadBackgrounds();
  loadSearchSettings();
  applyMode();
  updateClock();
  setInterval(updateClock, 1000);
  fetchHitokoto();
  bindEvents();
}

// ==================== 时钟 ====================
function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  clockEl.textContent = `${hours}:${minutes}:${seconds}`;

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const day = now.getDate();
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  const weekday = weekdays[now.getDay()];
  dateEl.textContent = `${year}年${month}月${day}日 星期${weekday}`;
}

// ==================== 一言 API ====================
function fetchHitokoto() {
  hitokotoText.textContent = '『数据加载中...』';
  hitokotoAuthor.textContent = '';

  fetch('https://v1.hitokoto.cn/?c=a&c=b&c=c&c=d&c=h&c=i&c=j&c=k')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      hitokotoText.textContent = `『${data.hitokoto}』`;
      hitokotoAuthor.textContent = data.from ? `—— ${data.from_who ?? '佚名'}` : '';
    })
    .catch(() => {
      hitokotoText.textContent = '『静以修身，俭以养德』';
      hitokotoAuthor.textContent = '—— 诸葛亮';
    });
}

// ==================== 模式切换 ====================
function loadMode() {
  const saved = localStorage.getItem(STORAGE_KEY_MODE);
  currentMode = (saved === 'dark') ? 'dark' : 'light';
}

function saveMode() {
  localStorage.setItem(STORAGE_KEY_MODE, currentMode);
}

function applyMode() {
  const root = document.documentElement;

  if (currentMode === 'dark') {
    root.style.setProperty('--bg', 'var(--bg-dark)');
    root.style.setProperty('--bg-img', 'var(--bg-img-dark)');
    root.style.setProperty('--text-primary', 'var(--text-primary-dark)');
    root.style.setProperty('--text-secondary', 'var(--text-secondary-dark)');
    root.style.setProperty('--clock-color', 'var(--clock-color-dark)');
    root.style.setProperty('--date-color', 'var(--date-color-dark)');
    root.style.setProperty('--search-bg', 'var(--search-bg-dark)');
    root.style.setProperty('--search-text', 'var(--search-text-dark)');
    root.style.setProperty('--search-placeholder', 'var(--search-placeholder-dark)');
    root.style.setProperty('--quote-bg', 'var(--quote-bg-dark)');
    root.style.setProperty('--quote-text', 'var(--quote-text-dark)');
    root.style.setProperty('--quote-author', 'var(--quote-author-dark)');
    root.style.setProperty('--quote-border', 'var(--quote-border-dark)');
    root.style.setProperty('--settings-bg', 'var(--settings-bg-dark)');
    root.style.setProperty('--settings-text', 'var(--settings-text-dark)');
    root.style.setProperty('--settings-shadow', 'var(--settings-shadow-dark)');
    modeLightBtn.classList.remove('active');
    modeDarkBtn.classList.add('active');
    document.body.classList.add('dark-mode');
    document.body.classList.remove('light-mode');
  } else {
    root.style.setProperty('--bg', 'var(--bg-light)');
    root.style.setProperty('--bg-img', 'var(--bg-img-light)');
    root.style.setProperty('--text-primary', 'var(--text-primary-light)');
    root.style.setProperty('--text-secondary', 'var(--text-secondary-light)');
    root.style.setProperty('--clock-color', 'var(--clock-color-light)');
    root.style.setProperty('--date-color', 'var(--date-color-light)');
    root.style.setProperty('--search-bg', 'var(--search-bg-light)');
    root.style.setProperty('--search-text', 'var(--search-text-light)');
    root.style.setProperty('--search-placeholder', 'var(--search-placeholder-light)');
    root.style.setProperty('--quote-bg', 'var(--quote-bg-light)');
    root.style.setProperty('--quote-text', 'var(--quote-text-light)');
    root.style.setProperty('--quote-author', 'var(--quote-author-light)');
    root.style.setProperty('--quote-border', 'var(--quote-border-light)');
    root.style.setProperty('--settings-bg', 'var(--settings-bg-light)');
    root.style.setProperty('--settings-text', 'var(--settings-text-light)');
    root.style.setProperty('--settings-shadow', 'var(--settings-shadow-light)');
    modeLightBtn.classList.add('active');
    modeDarkBtn.classList.remove('active');
    document.body.classList.add('light-mode');
    document.body.classList.remove('dark-mode');
  }
}

function setMode(mode) {
  if (currentMode === mode) return;
  currentMode = mode;
  saveMode();
  applyMode();
}

// ==================== 背景图管理 ====================
function loadBackgrounds() {
  const lightBg = localStorage.getItem(STORAGE_KEY_BG_LIGHT);
  const darkBg = localStorage.getItem(STORAGE_KEY_BG_DARK);

  if (lightBg) {
    document.documentElement.style.setProperty('--bg-img-light', `url(${lightBg})`);
    bgLightName.textContent = '已设置';
  }
  if (darkBg) {
    document.documentElement.style.setProperty('--bg-img-dark', `url(${darkBg})`);
    bgDarkName.textContent = '已设置';
  }
}

function setBackground(mode, base64) {
  const storageKey = mode === 'light' ? STORAGE_KEY_BG_LIGHT : STORAGE_KEY_BG_DARK;
  const cssVar = mode === 'light' ? '--bg-img-light' : '--bg-img-dark';
  const nameEl = mode === 'light' ? bgLightName : bgDarkName;

  localStorage.setItem(storageKey, base64);
  document.documentElement.style.setProperty(cssVar, `url(${base64})`);
  nameEl.textContent = '已设置';

  // 如果当前模式匹配，立即刷新背景
  if (currentMode === mode) {
    document.documentElement.style.setProperty('--bg-img', `url(${base64})`);
  }
}

function resetBackground(mode) {
  const storageKey = mode === 'light' ? STORAGE_KEY_BG_LIGHT : STORAGE_KEY_BG_DARK;
  const cssVar = mode === 'light' ? '--bg-img-light' : '--bg-img-dark';
  const nameEl = mode === 'light' ? bgLightName : bgDarkName;

  localStorage.removeItem(storageKey);
  document.documentElement.style.setProperty(cssVar, '');
  nameEl.textContent = '未设置';

  if (currentMode === mode) {
    document.documentElement.style.setProperty('--bg-img', '');
  }
}

function handleFileSelect(event, mode) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    setBackground(mode, e.target.result);
  };
  reader.readAsDataURL(file);
  event.target.value = ''; // 允许重复选择同一文件
}

// ==================== 搜索框聚焦毛玻璃效果 ====================
function initSearchFocusEffect() {
  let blurTimeout = null;

  // 搜索框获得焦点
  searchInput.addEventListener('focus', () => {
    if (blurTimeout) clearTimeout(blurTimeout);

    // 添加聚焦类
    document.body.classList.add('search-focused');

    // 同步主题类
    if (currentMode === 'dark') {
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
    } else {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    }
  });

  // 搜索框失去焦点
  searchInput.addEventListener('blur', () => {
    blurTimeout = setTimeout(() => {
      document.body.classList.remove('search-focused');
      // 移除临时添加的内联样式
      document.querySelector('.search-section')?.removeAttribute('style');
      document.querySelector('.search-box')?.removeAttribute('style');
    }, 150);
  });

  // 点击毛玻璃层关闭聚焦
  document.body.addEventListener('click', (e) => {
    if (document.body.classList.contains('search-focused')) {
      const isClickOnSearch = searchInput.contains(e.target) ||
        searchForm.contains(e.target) ||
        document.querySelector('.search-box')?.contains(e.target);

      if (!isClickOnSearch) {
        searchInput.blur();
      }
    }
  });

  // ESC 键退出聚焦
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('search-focused')) {
      searchInput.blur();
    }
  });
}

// ==================== 是否新标签页打开 ============
function loadSearchSettings() {
  const saved = localStorage.getItem(STORAGE_KEY_NEW_TAB_SEARCH);
  searchInNewTab = (saved === 'true');

  // 更新开关状态
  const toggle = document.getElementById('newTabSearchToggle');
  if (toggle) {
    toggle.checked = searchInNewTab;
  }

  // 更新搜索表单的 target
  updateSearchTarget();
}

// 保存搜索设置
function saveSearchSettings(value) {
  localStorage.setItem(STORAGE_KEY_NEW_TAB_SEARCH, value);
  searchInNewTab = value;
  updateSearchTarget();
}

// 更新搜索表单的 target 属性
function updateSearchTarget() {
  if (searchForm) {
    searchForm.target = searchInNewTab ? '_blank' : '_self';
  }
}

// ==================== 事件绑定 ====================
function bindEvents() {
  // 搜索框：回车提交
  searchForm.addEventListener('submit', function(e) {
    if (!searchInput.value.trim()) {
      e.preventDefault();
    }
  });

  // 设置面板开关
  settingsBtn.addEventListener('click', () => {
    settingsOverlay.classList.add('active');
  });
  closeSettings.addEventListener('click', () => {
    settingsOverlay.classList.remove('active');
  });
  settingsOverlay.addEventListener('click', function(e) {
    if (e.target === settingsOverlay) {
      settingsOverlay.classList.remove('active');
    }
  });

  // ESC 关闭设置
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && settingsOverlay.classList.contains('active')) {
      settingsOverlay.classList.remove('active');
    }
  });

  // 模式切换按钮
  modeLightBtn.addEventListener('click', () => setMode('light'));
  modeDarkBtn.addEventListener('click', () => setMode('dark'));

  // 背景图上传
  bgLightInput.addEventListener('change', (e) => handleFileSelect(e, 'light'));
  bgDarkInput.addEventListener('change', (e) => handleFileSelect(e, 'dark'));

  // 背景图重置
  resetLightBg.addEventListener('click', () => resetBackground('light'));
  resetDarkBg.addEventListener('click', () => resetBackground('dark'));

  // 点击搜索框毛玻璃
  initSearchFocusEffect();

  // 新标签页搜索开关
  const newTabToggle = document.getElementById('newTabSearchToggle');
  if (newTabToggle) {
    newTabToggle.addEventListener('change', function(e) {
      saveSearchSettings(e.target.checked);
    });
  }

  // 点击开关标签也能切换
  const toggleLabel = document.getElementById('newTabSearchLabel');
  if (toggleLabel) {
    toggleLabel.addEventListener('click', function() {
      if (newTabToggle) {
        newTabToggle.checked = !newTabToggle.checked;
        saveSearchSettings(newTabToggle.checked);
      }
    });
  }
}

// ==================== 启动 ====================
init();
