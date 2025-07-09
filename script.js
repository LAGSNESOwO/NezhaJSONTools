// 全局状态管理
const state = {
    theme: 'light',
    language: 'zh',
    config: {
        enableBilling: true,
        enablePlan: true,
        billingDataMod: {
            startDate: '',
            endDate: '',
            autoRenewal: '1',
            cycle: 'Year',
            amount: '200EUR'
        },
        planDataMod: {
            bandwidth: '30Mbps',
            trafficVol: '1TB/Month',
            trafficType: '2',
            IPv4: '1',
            IPv6: '1',
            networkRoute: '4837',
            extra: 'Einstein'
        }
    },
    tags: ['Einstein'],
    isManualRefresh: false
};

// 国际化字典
const i18n = {
    zh: {
        billingConfig: '账单配置',
        planConfig: '套餐配置',
        startDate: '起始日期',
        endDate: '结束日期',
        autoCalc: '自动计算',
        autoRenewal: '自动续费',
        billingCycle: '计费周期',
        english: '英文',
        amount: '金额',
        billing: '计费',
        free: '免费',
        payAsGo: '按量收费',
        bandwidth: '带宽',
        trafficVolume: '流量配额',
        trafficType: '流量类型',
        inbound: '入站',
        bidirectional: '双向',
        networkRoute: '网络路由',
        extraTags: '额外标签',
        jsonConfig: 'JSON 配置',
        refresh: '刷新',
        copy: '复制',
        warning: '警告',
        understand: '我知道了',
        copySuccess: '复制成功！',
        refreshSuccess: '从代码刷新成功！',
        unlimited: '无限制',
        day: '天',
        month: '月',
        quarter: '季',
        year: '年',
        cycles: {
            Day: '天',
            Week: '周',
            Month: '月',
            Quarter: '季',
            HalfYear: '半年',
            Year: '年',
            '2Year': '2年',
            '3Year': '3年',
            '4Year': '4年',
            '5Year': '5年',
            Permanent: '永久'
        },
        cyclesEn: {
            Day: 'Day',
            Week: 'Week',
            Month: 'Month',
            Quarter: 'Quarter',
            HalfYear: 'HalfYear',
            Year: 'Year',
            '2Year': '2Year',
            '3Year': '3Year',
            '4Year': '4Year',
            '5Year': '5Year',
            Permanent: 'Permanent'
        },
        trafficPeriods: {
            Day: '天',
            Month: '月',
            Quarter: '季',
            Year: '年',
            Unlimited: '无限'
        },
        trafficPeriodsEn: {
            Day: 'Day',
            Month: 'Month',
            Quarter: 'Quarter',
            Year: 'Year',
            Unlimited: 'Unlimited'
        },
        warningMessages: {
            unofficial: '您使用的{cycle}的计费周期，并不是官方支持的参数，无法自动刷新及计算规划中的账单统计报表，并禁用autoRenewal及cycle字段'
        }
    },
    en: {
        billingConfig: 'Billing Configuration',
        planConfig: 'Plan Configuration',
        startDate: 'Start Date',
        endDate: 'End Date',
        autoCalc: 'Auto Calculate',
        autoRenewal: 'Auto Renewal',
        billingCycle: 'Billing Cycle',
        english: 'English',
        amount: 'Amount',
        billing: 'Billing',
        free: 'Free',
        payAsGo: 'Pay as Go',
        bandwidth: 'Bandwidth',
        trafficVolume: 'Traffic Volume',
        trafficType: 'Traffic Type',
        inbound: 'Inbound',
        bidirectional: 'Bidirectional',
        networkRoute: 'Network Route',
        extraTags: 'Extra Tags',
        jsonConfig: 'JSON Configuration',
        refresh: 'Refresh',
        copy: 'Copy',
        warning: 'Warning',
        understand: 'I Understand',
        copySuccess: 'Copied Successfully!',
        refreshSuccess: 'Refreshed from code successfully!',
        unlimited: 'Unlimited',
        day: 'Day',
        month: 'Month',
        quarter: 'Quarter',
        year: 'Year',
        cycles: {
            Day: 'Day',
            Week: 'Week',
            Month: 'Month',
            Quarter: 'Quarter',
            HalfYear: 'HalfYear',
            Year: 'Year',
            '2Year': '2Year',
            '3Year': '3Year',
            '4Year': '4Year',
            '5Year': '5Year',
            Permanent: 'Permanent'
        },
        cyclesEn: {
            Day: 'Day',
            Week: 'Week',
            Month: 'Month',
            Quarter: 'Quarter',
            HalfYear: 'HalfYear',
            Year: 'Year',
            '2Year': '2Year',
            '3Year': '3Year',
            '4Year': '4Year',
            '5Year': '5Year',
            Permanent: 'Permanent'
        },
        trafficPeriods: {
            Day: 'Day',
            Month: 'Month',
            Quarter: 'Quarter',
            Year: 'Year',
            Unlimited: 'Unlimited'
        },
        trafficPeriodsEn: {
            Day: 'Day',
            Month: 'Month',
            Quarter: 'Quarter',
            Year: 'Year',
            Unlimited: 'Unlimited'
        },
        warningMessages: {
            unofficial: 'You are using {cycle} billing cycle, which is not officially supported and cannot auto-refresh or calculate planned billing statistics. AutoRenewal and cycle fields are disabled.'
        }
    }
};

// 货币符号映射
const currencySymbols = {
    CNY: '¥',
    USD: '$',
    EUR: '€',
    GBP: '£'
};

// 非官方周期列表
const unofficialCycles = ['Day', 'Week', '2Year', '3Year', '4Year', '5Year', 'Permanent'];

// 初始化应用
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // 设置初始日期
    const now = new Date();
    document.getElementById('startDate').value = formatDateTimeLocal(now);
    
    // 初始化主题
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // 初始化语言
    const savedLanguage = localStorage.getItem('language') || 'zh';
    setLanguage(savedLanguage);
    
    // 初始化配置
    updateBilling();
    updatePlan();
    
    // 更新JSON代码
    updateJsonCode();
}

// 主题切换
function toggleTheme() {
    const newTheme = state.theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    
    const themeIcon = document.querySelector('.theme-toggle i');
    themeIcon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    
    localStorage.setItem('theme', theme);
}

// 语言切换
function toggleLanguage() {
    const newLanguage = state.language === 'zh' ? 'en' : 'zh';
    setLanguage(newLanguage);
}

function setLanguage(language) {
    state.language = language;
    // 显示相反的语言名称作为切换提示
    document.getElementById('lang-indicator').textContent = language === 'zh' ? 'English' : '中文';
    
    // 更新所有文本
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (i18n[language][key]) {
            element.textContent = i18n[language][key];
        }
    });
    
    // 更新周期选项
    updateCycleOptions();
    updateTrafficPeriodOptions();
    updateCurrencyFormatOptions();
    
    localStorage.setItem('language', language);
    updateJsonCode();
}

function __(key, params = {}) {
    let text = i18n[state.language][key] || key;
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });
    return text;
}

// 节的开关
function toggleSection(section) {
    const checkbox = document.getElementById(`enable${section.charAt(0).toUpperCase() + section.slice(1)}`);
    const form = document.getElementById(`${section}Form`);
    
    if (section === 'billing') {
        state.config.enableBilling = checkbox.checked;
    } else if (section === 'plan') {
        state.config.enablePlan = checkbox.checked;
    }
    
    if (checkbox.checked) {
        form.classList.remove('hidden');
    } else {
        form.classList.add('hidden');
    }
    
    updateJsonCode();
}

// 自动结束日期切换
function triggerAutoCalculation() {
    calculateEndDate();
}

// 计算结束日期
function calculateEndDate() {
    const startDate = new Date(document.getElementById('startDate').value);
    const cycle = document.getElementById('cycle').value;
    let endDate = new Date(startDate);

    if (cycle === 'Permanent') {
        // "Permanent" has no end date to calculate, its state is handled in updateBilling
        return;
    }
    
    switch (cycle) {
        case 'Day':
            endDate.setDate(startDate.getDate() + 1);
            break;
        case 'Week':
            endDate.setDate(startDate.getDate() + 7);
            break;
        case 'Month':
            endDate.setMonth(startDate.getMonth() + 1);
            break;
        case 'Quarter':
            endDate.setMonth(startDate.getMonth() + 3);
            break;
        case 'HalfYear':
            endDate.setMonth(startDate.getMonth() + 6);
            break;
        case 'Year':
            endDate.setFullYear(startDate.getFullYear() + 1);
            break;
        case '2Year':
            endDate.setFullYear(startDate.getFullYear() + 2);
            break;
        case '3Year':
            endDate.setFullYear(startDate.getFullYear() + 3);
            break;
        case '4Year':
            endDate.setFullYear(startDate.getFullYear() + 4);
            break;
        case '5Year':
            endDate.setFullYear(startDate.getFullYear() + 5);
            break;
    }
    
    document.getElementById('endDate').value = formatDateTimeLocal(endDate);
    updateBilling(); // Sync state after calculation
}

// 格式化日期时间为本地输入格式
function formatDateTimeLocal(date) {
    if (date.getFullYear() === 0) {
        return '0000-01-01T00:00';
    }
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// 更新账单配置
function updateBilling() {
    const startDate = document.getElementById('startDate').value;
    const endDateInput = document.getElementById('endDate');
    const autoRenewal = document.getElementById('autoRenewal').checked;
    const cycle = document.getElementById('cycle').value;
    const wasCycleChanged = document.activeElement.id === 'cycle';

    if (cycle === 'Permanent') {
        endDateInput.disabled = true;
    } else {
        endDateInput.disabled = false;
        if (wasCycleChanged) {
            calculateEndDate();
            return; // calculateEndDate calls updateBilling, so we exit to prevent double processing
        }
    }
    
    // 检查是否为非官方周期
    if (unofficialCycles.includes(cycle)) {
        showWarning('unofficial', { cycle: getCycleDisplayName(cycle) });
        
        // 禁用autoRenewal
        document.getElementById('autoRenewal').disabled = true;
        document.getElementById('autoRenewal').checked = false;
        
        state.config.billingDataMod.autoRenewal = '0';
    } else {
        document.getElementById('autoRenewal').disabled = false;
        state.config.billingDataMod.autoRenewal = autoRenewal ? '1' : '0';
    }
    
    // 更新配置
    state.config.billingDataMod.startDate = new Date(startDate).toISOString();
    
    if (cycle === 'Permanent') {
        state.config.billingDataMod.endDate = '0000-00-00T23:59:59+08:00';
    } else {
        state.config.billingDataMod.endDate = new Date(endDateInput.value).toISOString();
    }
    
    state.config.billingDataMod.cycle = getCycleValue();
    state.config.billingDataMod.amount = getAmountValue();
    
    // 更新货币格式选项
    updateCurrencyFormatOptions();
    
    updateJsonCode();
}

// 获取周期显示名称
function getCycleDisplayName(cycle) {
    const isEnglish = document.getElementById('cycleLanguage').checked;
    
    // 添加安全检查
    if (!i18n[state.language]) {
        return cycle;
    }
    
    const dict = isEnglish ? i18n[state.language].cyclesEn : i18n[state.language].cycles;
    return dict ? (dict[cycle] || cycle) : cycle;
}

// 获取周期值
function getCycleValue() {
    const cycle = document.getElementById('cycle').value;
    const isEnglish = document.getElementById('cycleLanguage').checked;
    
    if (isEnglish) {
        return cycle;
    } else {
        // 添加安全检查
        if (i18n[state.language] && i18n[state.language].cycles) {
            return i18n[state.language].cycles[cycle] || cycle;
        }
        return cycle;
    }
}

// 更新周期选项
function updateCycleOptions() {
    const select = document.getElementById('cycle');
    const isEnglish = document.getElementById('cycleLanguage').checked;
    
    // 添加安全检查
    if (!i18n[state.language]) {
        return;
    }
    
    const dict = isEnglish ? i18n[state.language].cyclesEn : i18n[state.language].cycles;
    
    if (!dict) {
        return;
    }
    
    Array.from(select.options).forEach(option => {
        const key = option.value;
        const baseText = dict[key] || key;
        
        if (unofficialCycles.includes(key) && !isEnglish) {
            option.textContent = baseText + '（非官方）';
        } else if (unofficialCycles.includes(key) && isEnglish) {
            option.textContent = baseText + ' (Unofficial)';
        } else {
            option.textContent = baseText;
        }
    });
    
    updateBilling();
}

// 更新周期语言
function updateCycleLanguage() {
    updateCycleOptions();
}

// 金额类型更新
function updateAmountType() {
    const amountType = document.getElementById('amountType').value;
    const amountInputs = document.getElementById('amountInputs');
    
    if (amountType === 'free') {
        amountInputs.style.display = 'none';
        state.config.billingDataMod.amount = '0';
    } else if (amountType === 'payAsGo') {
        amountInputs.style.display = 'none';
        state.config.billingDataMod.amount = '-1';
    } else {
        amountInputs.style.display = 'flex';
        updateBilling();
        return;
    }
    
    updateJsonCode();
}

// 获取金额值
function getAmountValue() {
    const amountType = document.getElementById('amountType').value;
    
    if (amountType === 'free') return '0';
    if (amountType === 'payAsGo') return '-1';
    
    const value = document.getElementById('amountValue').value;
    const currency = document.getElementById('currency').value;
    const format = document.getElementById('currencyFormat').value;
    
    switch (format) {
        case 'before':
            return `${value}${currency}`;
        case 'symbol_before':
            return `${currencySymbols[currency]}${value}`;
        case 'after':
            return `${value}${currencySymbols[currency]}`;
        default:
            return `${value}${currency}`;
    }
}

// 更新套餐配置
function updatePlan() {
    const bandwidthValue = document.getElementById('bandwidthValue').value;
    const bandwidthUnit = document.getElementById('bandwidthUnit').value;
    const trafficValue = document.getElementById('trafficValue').value;
    const trafficUnit = document.getElementById('trafficUnit').value;
    const trafficPeriod = document.getElementById('trafficPeriod').value;
    const trafficType = document.getElementById('trafficType').value;
    const ipv4 = document.getElementById('ipv4').value;
    const ipv6 = document.getElementById('ipv6').value;
    const networkRoute = document.getElementById('networkRoute').value;
    
    // 更新配置
    state.config.planDataMod.bandwidth = getBandwidthValue();
    state.config.planDataMod.trafficVol = getTrafficVolValue();
    state.config.planDataMod.trafficType = trafficType;
    state.config.planDataMod.IPv4 = ipv4;
    state.config.planDataMod.IPv6 = ipv6;
    state.config.planDataMod.networkRoute = networkRoute;
    state.config.planDataMod.extra = state.tags.join(', ');
    
    updateJsonCode();
}

// 获取带宽值
function getBandwidthValue() {
    const bandwidthValue = document.getElementById('bandwidthValue').value;
    const bandwidthUnit = document.getElementById('bandwidthUnit').value;
    
    if (bandwidthUnit === 'Unlimited') {
        return __('unlimited');
    }
    
    return `${bandwidthValue}${bandwidthUnit}`;
}

// 更新带宽单位
function updateBandwidthUnit() {
    const bandwidthUnit = document.getElementById('bandwidthUnit').value;
    const bandwidthValueInput = document.getElementById('bandwidthValue');
    
    if (bandwidthUnit === 'Unlimited') {
        bandwidthValueInput.disabled = true;
        bandwidthValueInput.value = '';
    } else {
        bandwidthValueInput.disabled = false;
        if (!bandwidthValueInput.value) {
            bandwidthValueInput.value = '30';
        }
    }
    
    updatePlan();
}

// 更新流量单位
function updateTrafficUnit() {
    const trafficUnit = document.getElementById('trafficUnit').value;
    const trafficPeriod = document.getElementById('trafficPeriod');
    const trafficValueInput = document.getElementById('trafficValue');
    
    if (trafficUnit === 'Unlimited') {
        trafficPeriod.value = 'Unlimited';
        trafficPeriod.disabled = true;
        trafficValueInput.disabled = true;
        trafficValueInput.value = '';
    } else {
        trafficPeriod.disabled = false;
        trafficValueInput.disabled = false;
        if (!trafficValueInput.value) {
            trafficValueInput.value = '1';
        }
    }
    
    updatePlan();
}

// 获取流量配额值
function getTrafficVolValue() {
    const trafficValue = document.getElementById('trafficValue').value;
    const trafficUnit = document.getElementById('trafficUnit').value;
    const trafficPeriod = document.getElementById('trafficPeriod').value;
    const isEnglish = document.getElementById('trafficLanguage').checked;
    
    if (trafficUnit === 'Unlimited') {
        return __('unlimited');
    }
    
    const unitDisplay = trafficUnit === 'Unlimited' ? __('unlimited') : trafficUnit;
    const periodDisplay = getPeriodDisplay(trafficPeriod, isEnglish);
    
    return `${trafficValue}${unitDisplay}/${periodDisplay}`;
}

// 获取周期显示
function getPeriodDisplay(period, isEnglish) {
    if (period === 'Unlimited') {
        return __('unlimited');
    }
    
    const dict = isEnglish ? i18n[state.language].trafficPeriodsEn : i18n[state.language].trafficPeriods;
    return dict[period] || period;
}

// 更新流量周期选项
function updateTrafficPeriodOptions() {
    const select = document.getElementById('trafficPeriod');
    const isEnglish = document.getElementById('trafficLanguage').checked;
    const dict = isEnglish ? i18n[state.language].trafficPeriodsEn : i18n[state.language].trafficPeriods;
    
    Array.from(select.options).forEach(option => {
        const key = option.value;
        option.textContent = dict[key] || key;
    });
    
    updatePlan();
}

// 更新流量语言
function updateTrafficLanguage() {
    updateTrafficPeriodOptions();
}

// 更新货币格式选项
function updateCurrencyFormatOptions() {
    const amountValue = document.getElementById('amountValue').value || '12';
    const currency = document.getElementById('currency').value;
    const select = document.getElementById('currencyFormat');
    
    const symbol = currencySymbols[currency];
    
    Array.from(select.options).forEach(option => {
        switch (option.value) {
            case 'before':
                option.textContent = `${amountValue}${currency}`;
                break;
            case 'symbol_before':
                option.textContent = `${symbol}${amountValue}`;
                break;
            case 'after':
                option.textContent = `${amountValue}${symbol}`;
                break;
        }
    });
}

// 标签管理
function addTag() {
    const input = document.getElementById('newTag');
    const tagText = input.value.trim();
    
    if (tagText && !state.tags.includes(tagText)) {
        state.tags.push(tagText);
        renderTags();
        input.value = '';
        updatePlan();
    }
}

function removeTag(button) {
    const tagElement = button.parentElement;
    const tagText = tagElement.querySelector('span').textContent;
    
    state.tags = state.tags.filter(tag => tag !== tagText);
    renderTags();
    updatePlan();
}

function renderTags() {
    const container = document.getElementById('tagsContainer');
    container.innerHTML = '';
    
    state.tags.forEach(tag => {
        const tagElement = document.createElement('div');
        tagElement.className = 'tag';
        tagElement.innerHTML = `
            <span>${tag}</span>
            <button onclick="removeTag(this)"><i class="fas fa-times"></i></button>
        `;
        container.appendChild(tagElement);
    });
}

function handleTagInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTag();
    }
}

// JSON代码更新
function updateJsonCode() {
    const config = {};
    
    if (state.config.enableBilling) {
        config.billingDataMod = { ...state.config.billingDataMod };
    }
    
    if (state.config.enablePlan) {
        config.planDataMod = { ...state.config.planDataMod };
    }
    
    const jsonString = JSON.stringify(config, null, 2);
    document.getElementById('jsonCode').value = jsonString;
}

// 从代码刷新配置
function refreshFromCode(event) {
    event.stopPropagation();
    const refreshIcon = document.querySelector('.refresh-btn i');
    refreshIcon.classList.add('spinning');
    
    try {
        const jsonCode = document.getElementById('jsonCode').value;
        const parsedConfig = JSON.parse(jsonCode);
        
        // 更新状态
        if (parsedConfig.billingDataMod) {
            state.config.enableBilling = true;
            state.config.billingDataMod = { ...parsedConfig.billingDataMod };
            document.getElementById('enableBilling').checked = true;
            document.getElementById('billingForm').classList.remove('hidden');
            
            // 更新表单字段
            if (parsedConfig.billingDataMod.startDate) {
                document.getElementById('startDate').value = formatDateTimeLocal(new Date(parsedConfig.billingDataMod.startDate));
            }
            if (parsedConfig.billingDataMod.endDate) {
                document.getElementById('endDate').value = formatDateTimeLocal(new Date(parsedConfig.billingDataMod.endDate));
            }
            if (parsedConfig.billingDataMod.autoRenewal !== undefined) {
                document.getElementById('autoRenewal').checked = parsedConfig.billingDataMod.autoRenewal === '1';
            }
            
            // 解析周期
            if (parsedConfig.billingDataMod.cycle) {
                parseAndSetCycle(parsedConfig.billingDataMod.cycle);
            }
            
            // 解析金额
            if (parsedConfig.billingDataMod.amount) {
                parseAndSetAmount(parsedConfig.billingDataMod.amount);
            }
        } else {
            state.config.enableBilling = false;
            document.getElementById('enableBilling').checked = false;
            document.getElementById('billingForm').classList.add('hidden');
        }
        
        if (parsedConfig.planDataMod) {
            state.config.enablePlan = true;
            state.config.planDataMod = { ...parsedConfig.planDataMod };
            document.getElementById('enablePlan').checked = true;
            document.getElementById('planForm').classList.remove('hidden');
            
            // 解析带宽
            if (parsedConfig.planDataMod.bandwidth) {
                parseAndSetBandwidth(parsedConfig.planDataMod.bandwidth);
            }
            
            // 解析流量
            if (parsedConfig.planDataMod.trafficVol) {
                parseAndSetTrafficVol(parsedConfig.planDataMod.trafficVol);
            }
            
            // 更新其他字段
            if (parsedConfig.planDataMod.trafficType) {
                document.getElementById('trafficType').value = parsedConfig.planDataMod.trafficType;
            }
            if (parsedConfig.planDataMod.IPv4) {
                document.getElementById('ipv4').value = parsedConfig.planDataMod.IPv4;
            }
            if (parsedConfig.planDataMod.IPv6) {
                document.getElementById('ipv6').value = parsedConfig.planDataMod.IPv6;
            }
            if (parsedConfig.planDataMod.networkRoute) {
                document.getElementById('networkRoute').value = parsedConfig.planDataMod.networkRoute;
            }
            
            // 更新标签
            if (parsedConfig.planDataMod.extra) {
                state.tags = parsedConfig.planDataMod.extra.split(', ').filter(tag => tag.trim());
                renderTags();
            }
        } else {
            state.config.enablePlan = false;
            document.getElementById('enablePlan').checked = false;
            document.getElementById('planForm').classList.add('hidden');
        }
        
        showToast(__('refreshSuccess', { 'fallback': '刷新成功！' }));
    } catch (error) {
        console.error('JSON解析错误:', error);
        showWarning('jsonError', { error: error.message });
    }
    
    setTimeout(() => {
        refreshIcon.classList.remove('spinning');
    }, 1000);
}

// 解析并设置周期
function parseAndSetCycle(cycleValue) {
    const cycleSelect = document.getElementById('cycle');
    const cycleLanguageToggle = document.getElementById('cycleLanguage');
    
    // 检查是否为英文周期
    const isEnglishCycle = ['Day', 'Week', 'Quarter', 'HalfYear', 'Year', '2Year', '3Year', '4Year', '5Year', 'Permanent'].includes(cycleValue);
    
    if (isEnglishCycle) {
        cycleLanguageToggle.checked = true;
        cycleSelect.value = cycleValue;
    } else {
        cycleLanguageToggle.checked = false;
        // 查找对应的中文周期
        for (const [key, value] of Object.entries(i18n[state.language].cycles)) {
            if (value === cycleValue) {
                cycleSelect.value = key;
                break;
            }
        }
    }
    updateCycleOptions();
}

// 解析并设置金额
function parseAndSetAmount(amountValue) {
    const amountTypeSelect = document.getElementById('amountType');
    const amountValueInput = document.getElementById('amountValue');
    const currencySelect = document.getElementById('currency');
    const currencyFormatSelect = document.getElementById('currencyFormat');
    
    if (amountValue === '0') {
        amountTypeSelect.value = 'free';
        updateAmountType();
        return;
    }
    
    if (amountValue === '-1') {
        amountTypeSelect.value = 'payAsGo';
        updateAmountType();
        return;
    }
    
    amountTypeSelect.value = 'billing';
    updateAmountType();
    
    // 解析金额格式
    const currencyRegex = /([¥$€£])(\d+)|(\d+)(CNY|USD|EUR|GBP|¥|$|€|£)/;
    const match = amountValue.match(currencyRegex);
    
    if (match) {
        if (match[1] && match[2]) {
            // 符号在前 ¥12
            const symbol = match[1];
            const value = match[2];
            amountValueInput.value = value;
            
            // 找到对应的货币
            for (const [curr, sym] of Object.entries(currencySymbols)) {
                if (sym === symbol) {
                    currencySelect.value = curr;
                    break;
                }
            }
            currencyFormatSelect.value = 'symbol_before';
        } else if (match[3] && match[4]) {
            const value = match[3];
            const currencyOrSymbol = match[4];
            amountValueInput.value = value;
            
            if (['CNY', 'USD', 'EUR', 'GBP'].includes(currencyOrSymbol)) {
                // 货币代码
                currencySelect.value = currencyOrSymbol;
                currencyFormatSelect.value = 'before';
            } else {
                // 货币符号在后
                for (const [curr, sym] of Object.entries(currencySymbols)) {
                    if (sym === currencyOrSymbol) {
                        currencySelect.value = curr;
                        break;
                    }
                }
                currencyFormatSelect.value = 'after';
            }
        }
    }
    
    updateCurrencyFormatOptions();
}

// 解析并设置带宽
function parseAndSetBandwidth(bandwidthValue) {
    const bandwidthValueInput = document.getElementById('bandwidthValue');
    const bandwidthUnitSelect = document.getElementById('bandwidthUnit');
    
    if (bandwidthValue === __('unlimited') || bandwidthValue === 'Unlimited') {
        bandwidthUnitSelect.value = 'Unlimited';
        bandwidthValueInput.value = '';
        bandwidthValueInput.disabled = true;
        return;
    }
    
    const bandwidthRegex = /(\d+)(Mbps|Gbps)/;
    const match = bandwidthValue.match(bandwidthRegex);
    
    if (match) {
        bandwidthValueInput.value = match[1];
        bandwidthUnitSelect.value = match[2];
        bandwidthValueInput.disabled = false;
    }
}

// 解析并设置流量配额
function parseAndSetTrafficVol(trafficVolValue) {
    const trafficValueInput = document.getElementById('trafficValue');
    const trafficUnitSelect = document.getElementById('trafficUnit');
    const trafficPeriodSelect = document.getElementById('trafficPeriod');
    const trafficLanguageToggle = document.getElementById('trafficLanguage');
    
    if (trafficVolValue === __('unlimited') || trafficVolValue === 'Unlimited') {
        trafficUnitSelect.value = 'Unlimited';
        trafficPeriodSelect.value = 'Unlimited';
        trafficValueInput.value = '';
        trafficValueInput.disabled = true;
        trafficPeriodSelect.disabled = true;
        return;
    }
    
    // 解析流量格式 1TB/Month
    const trafficRegex = /(\d+)(MB|GB|TB|PB)\/(.+)/;
    const match = trafficVolValue.match(trafficRegex);
    
    if (match) {
        trafficValueInput.value = match[1];
        trafficUnitSelect.value = match[2];
        trafficValueInput.disabled = false;
        trafficPeriodSelect.disabled = false;
        
        const periodValue = match[3];
        
        // 检查是否为英文周期
        const isEnglishPeriod = ['Day', 'Month', 'Quarter', 'Year', 'Unlimited'].includes(periodValue);
        
        if (isEnglishPeriod) {
            trafficLanguageToggle.checked = true;
            trafficPeriodSelect.value = periodValue;
        } else {
            trafficLanguageToggle.checked = false;
            // 查找对应的英文周期
            for (const [key, value] of Object.entries(i18n[state.language].trafficPeriods)) {
                if (value === periodValue) {
                    trafficPeriodSelect.value = key;
                    break;
                }
            }
        }
        
        updateTrafficPeriodOptions();
    }
}

// 代码变化处理
function handleCodeChange() {
    if (!state.isManualRefresh) {
        // 实时更新逻辑可以在这里添加
    }
}

// 折叠卡片
function toggleCardCollapse(headerElement) {
    const card = headerElement.closest('.form-section, .code-panel');
    const content = card.querySelector('.form-content, .code-container');
    const icon = headerElement.querySelector('.collapse-btn i');

    content.classList.toggle('collapsed');
    icon.classList.toggle('rotated');
}

// 复制代码
function copyCode(event) {
    event.stopPropagation();
    const jsonCode = document.getElementById('jsonCode');
    jsonCode.select();
    document.execCommand('copy');
    showToast();
}

// 显示警告模态框
function showWarning(type, params = {}) {
    const modal = document.getElementById('warningModal');
    const message = document.getElementById('warningMessage');
    
    const warningKey = `warningMessages.${type}`;
    message.textContent = i18n[state.language].warningMessages[type] ? 
        i18n[state.language].warningMessages[type].replace(/\{(\w+)\}/g, (match, key) => params[key] || match) :
        `Warning: ${type}`;
    modal.style.display = 'block';
}

// 关闭模态框
function closeModal() {
    document.getElementById('warningModal').style.display = 'none';
}

// 显示提示消息
function showToast(message) {
    const toast = document.getElementById('copyToast');
    const toastMessage = toast.querySelector('span');

    const defaultCopySuccess = __('copySuccess', { fallback: '复制成功！' });
    toastMessage.textContent = message || defaultCopySuccess;

    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// 独立的 AI Toast 函数
function showAiToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 3000);
    }, 100);
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('warningModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}

// =======================================================================
// AI Chat Functionality
// =======================================================================
document.addEventListener('DOMContentLoaded', function() {
    // 防止重复初始化
    if (document.body.classList.contains('ai-chat-initialized')) return;
    document.body.classList.add('ai-chat-initialized');

    const aiState = {
        isAIModeOn: false,
        apiKey: 'sk-hxO4jnsBV3py5867GGfbmCqsFqNp97oHiC0zfyIycoJAcZrn',
        apiBaseUrl: 'https://api.breathai.top/v1/chat/completions',
        model: 'qwen3-14b',
        messages: [
            {
                role: 'system',
                content: `你是 NezhaJsonTools 的AI助手，专门帮助用户生成和配置 Nezha 监控系统的 JSON 配置文件。

## 核心原则
当用户的需求不够明确时，你需要主动询问所需的具体信息，而不是猜测或提供通用示例。

## 配置结构说明

### 账单配置 (billingDataMod)
- **startDate**: 计费起始日期 (ISO 8601格式)
- **endDate**: 计费结束日期 (ISO 8601格式) 
- **autoRenewal**: 自动续费 ("1"=开启, "0"=关闭)
- **cycle**: 计费周期 (Day/Week/Month/Quarter/HalfYear/Year/2Year/3Year/4Year/5Year/Permanent)
- **amount**: 金额 (格式: "200EUR", "50USD", 免费用"0", 按量收费用"-1")

### 套餐配置 (planDataMod)
- **bandwidth**: 带宽 ("30Mbps", "1Gbps", "Unlimited")
- **trafficVol**: 流量配额 ("1TB/Month", "500GB/Day", "Unlimited")
- **trafficType**: 流量类型 ("1"=入站, "2"=双向)
- **IPv4**: IPv4地址数量 (数字)
- **IPv6**: IPv6地址数量 (数字)
- **networkRoute**: AS号码 (如 "4837")
- **extra**: 额外标签/备注信息

### 流量监控规则 (trafficRules)
- **type**: transfer_in_cycle / transfer_out_cycle / transfer_all_cycle
- **cycle_start**: 周期开始时间 (RFC3339)
- **cycle_interval**: 周期数量
- **cycle_unit**: hour/day/week/month/year
- **min** / **max**: 流量阈值
- **cover**: 1 覆盖, 0 追加
- **ignore**: 忽略的服务器ID列表

示例:
\`\`\`json
[
  {
    "type": "transfer_out_cycle",
    "max": 1099511627776,
    "cycle_start": "2022-01-01T00:00:00+08:00",
    "cycle_interval": 1,
    "cycle_unit": "month",
    "cover": 1,
    "ignore": {"3": true, "4": true}
  }
]
\`\`\`

### 警报规则 (alertRules)
- **type**: cpu/gpu/memory/swap/disk/net_in_speed/net_out_speed/net_all_speed/transfer_in/transfer_out/transfer_all/offline/load1/load5/load15/process_count/tcp_conn_count/udp_conn_count/temperature_max
- **duration**: 持续时间(秒)，30% 以上时间触发阈值才会通知
- **min** / **max**: 数值阈值，流量和网速单位为字节，其余使用百分比
- **cover**: 1 忽略所有服务器，0 监控所有服务器
- **ignore**: {服务器ID: true/false}

示例:
\`\`\`json
[{"type": "offline", "duration": 10}]
\`\`\`


## 交互指南
**当用户请求不明确时，你应该这样询问：**

🔍 **如果用户只说"帮我生成配置"：**
请告诉我：
1. 计费信息：价格多少？什么货币？什么周期？
2. 套餐信息：带宽多少？流量配额多少？
3. 其他需求：需要几个IP？有特殊标签吗？

🔍 **如果用户只说"我要一个VPS配置"：**
请提供以下信息：
- 价格和计费周期（如：年付200欧元）
- 带宽要求（如：30Mbps）
- 流量配额（如：每月1TB）
- 是否需要自动续费？

🔍 **如果用户说"便宜的配置"：**
请具体说明：
- 你的预算范围？
- 需要什么规格（带宽、流量）？
- 偏好什么计费周期？

## 输出格式
确认所有信息后，使用以下格式输出：

\`\`\`json
{
  "billingDataMod": {
    "startDate": "2024-12-08T12:58:17.636Z",
    "endDate": "2025-12-08T12:58:17.636Z",
    "autoRenewal": "1",
    "cycle": "Year", 
    "amount": "200EUR"
  },
  "planDataMod": {
    "bandwidth": "30Mbps",
    "trafficVol": "1TB/Month",
    "trafficType": "2",
    "IPv4": "1", 
    "IPv6": "1",
    "networkRoute": "4837",
    "extra": "LAGSNES"
  }
}
\`\`\`

## 重要提醒
- 非官方周期 (Day/Week/2Year-5Year/Permanent) 可能影响报表统计
- 支持货币: CNY/USD/EUR/GBP，格式如 "200EUR" 或 "50USD"
- 日期必须是 ISO 8601 格式
- 流量单位: MB/GB/TB/PB
- 始终确保JSON格式完整有效
- 如果服务器是永久的（cycle为Permanent），endDate应设置为0000-00-00T23:59:59+08:00

记住：**宁可多问一句，也不要猜测用户需求！**`
            }
        ], // 存储对话历史
        currentStreamController: null,
        timerInterval: null,
        // 高级参数
        temperature: 0.6,
        top_p: 0.95,
        top_k: 20,
        min_p: 0.00,
        frequency_penalty: 0.0
    };

    const aiModeBtn = document.getElementById('aiModeBtn');
    const sendMessageBtn = document.getElementById('sendMessageBtn');
    const chatInput = document.getElementById('chatInput');
    const clearContextBtn = document.getElementById('clearContextBtn');
    const chatBox = document.getElementById('chatBox');
    const aiCloseBtn = document.getElementById('aiCloseBtn');
    const mobileCloseBtn = document.getElementById('mobileCloseBtn');

    const aiChatHeader = document.getElementById('aiChatHeader');
    
    // Main view containers
    const settingsView = document.getElementById('settings-view');
    const aiChatView = document.getElementById('ai-chat-view');
    const aiChatPanel = aiChatView.querySelector('.ai-chat-panel');
    
    // 窗口状态
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    // 切换AI模式
    function toggleAIMode(force = null) {
        if (force !== null) {
            aiState.isAIModeOn = force;
        } else {
            aiState.isAIModeOn = !aiState.isAIModeOn;
        }
        
        aiModeBtn.classList.toggle('ai-mode-on', aiState.isAIModeOn);
        const btnText = aiModeBtn.querySelector('span');
        const btnIcon = aiModeBtn.querySelector('i');

        if (aiState.isAIModeOn) {
            btnText.textContent = '退出 AI';
            btnIcon.className = 'fas fa-power-off';
            
            // 只在移动端隐藏设置界面
            if (window.innerWidth <= 768) {
                settingsView.style.display = 'none';
            }
            aiChatView.style.display = 'flex';
        } else {
            btnText.textContent = '使用 AI 生成 JSON';
            btnIcon.className = 'fas fa-flask';
            settingsView.style.display = 'grid';
            aiChatView.style.display = 'none';
        }
    }

    aiModeBtn.addEventListener('click', () => toggleAIMode());
    aiCloseBtn.addEventListener('click', () => toggleAIMode(false));
    mobileCloseBtn.addEventListener('click', () => toggleAIMode(false));
    

    
    // 拖拽功能 (仅桌面端)
    if (window.innerWidth > 768) {
        aiChatHeader.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return; // 点击按钮时不拖拽
            if (e.target.closest('.mobile-controls')) return; // 点击移动端按钮时不拖拽
            
            isDragging = true;
            const rect = aiChatPanel.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;
            
            aiChatHeader.style.cursor = 'grabbing';
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            
            const newX = e.clientX - dragOffset.x;
            const newY = e.clientY - dragOffset.y;
            
            // 限制窗口在视窗内
            const maxX = window.innerWidth - aiChatPanel.offsetWidth;
            const maxY = window.innerHeight - aiChatPanel.offsetHeight;
            
            const clampedX = Math.max(0, Math.min(newX, maxX));
            const clampedY = Math.max(0, Math.min(newY, maxY));
            
            aiChatPanel.style.left = clampedX + 'px';
            aiChatPanel.style.top = clampedY + 'px';
            aiChatPanel.style.transform = 'none';
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                aiChatHeader.style.cursor = 'move';
            }
        });
    }

    // 发送消息
    sendMessageBtn.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // 清除上下文
    clearContextBtn.addEventListener('click', clearChat);

    function clearChat() {
        chatBox.innerHTML = '';
        // 保留系统提示词，只清除用户对话
        aiState.messages = aiState.messages.filter(msg => msg.role === 'system');
        showAiToast('上下文已清除');
    }

    function addMessageToChatBox(sender, message) {
        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble', sender === 'user' ? 'user-bubble' : 'ai-bubble');

        const avatar = document.createElement('div');
        avatar.classList.add('avatar');
        avatar.innerHTML = `<i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>`;

        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        
        if (sender === 'ai') {
            // AI消息需要解析代码块
            if (message === 'AI 正在思考...') {
                // 对于思考状态，直接添加文本
                const textElement = document.createElement('p');
                textElement.innerText = message;
                messageContent.appendChild(textElement);
            } else {
                // 对于正常AI回复，解析代码块
                const processedContent = parseCodeBlocks(message);
                messageContent.innerHTML = processedContent;
            }
        } else {
            // 用户消息直接显示
            const textElement = document.createElement('p');
            textElement.innerText = message;
            messageContent.appendChild(textElement);
        }
        
        bubble.appendChild(avatar);
        bubble.appendChild(messageContent);
        
        if (sender === 'ai') {
            const timerElement = document.createElement('div');
            timerElement.classList.add('timer');
            timerElement.textContent = '0.0s';
            messageContent.appendChild(timerElement);
            bubble.dataset.startTime = Date.now(); // 记录开始时间
            bubble.timerElement = timerElement; // 方便后面更新
        }
        
        chatBox.appendChild(bubble);
        chatBox.scrollTop = chatBox.scrollHeight;
        return bubble;
    }

    function parseCodeBlocks(text) {
        // 匹配完整代码块的正则表达式
        const codeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
        
        let result = text;
        let match;
        
        while ((match = codeBlockRegex.exec(text)) !== null) {
            const language = match[1] || '';
            const code = match[2].trim();
            const fullMatch = match[0];
            
            // 创建代码块HTML
            const codeBlockId = 'code-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            const codeBlockHTML = `
                <div class="ai-code-block">
                    <pre class="code-content" id="${codeBlockId}" data-language="${language}"><code>${escapeHtml(code)}</code></pre>
                </div>
            `;
            
            result = result.replace(fullMatch, codeBlockHTML);
        }
        
        // 将普通文本的换行转换为<br>
        result = result.replace(/\n/g, '<br>');
        
        return result;
    }

    function parseCodeBlocksRealtime(text) {
        let result = text;
        
        // 处理完整的代码块
        const completeBlockRegex = /```(\w+)?\n?([\s\S]*?)```/g;
        let match;
        
        while ((match = completeBlockRegex.exec(text)) !== null) {
            const language = match[1] || '';
            const code = match[2].trim();
            const fullMatch = match[0];
            
            const codeBlockId = 'code-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            const codeBlockHTML = `
                <div class="ai-code-block">
                    <pre class="code-content" id="${codeBlockId}" data-language="${language}"><code>${escapeHtml(code)}</code></pre>
                </div>
            `;
            
            result = result.replace(fullMatch, codeBlockHTML);
        }
        
        // 处理未完成的代码块（只有开始标记```）
        const incompleteBlockRegex = /```(\w+)?\n?([\s\S]*)$/;
        const incompleteMatch = result.match(incompleteBlockRegex);
        
        if (incompleteMatch && !result.includes('```', incompleteMatch.index + 3)) {
            const language = incompleteMatch[1] || '';
            const code = incompleteMatch[2];
            const fullMatch = incompleteMatch[0];
            
            const codeBlockId = 'code-incomplete-' + Date.now();
            const codeBlockHTML = `
                <div class="ai-code-block incomplete">
                    <pre class="code-content" id="${codeBlockId}" data-language="${language}"><code>${escapeHtml(code)}</code></pre>
                </div>
            `;
            
            result = result.replace(fullMatch, codeBlockHTML);
        }
        
        // 将普通文本的换行转换为<br>
        result = result.replace(/\n/g, '<br>');
        
        return result;
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 全局函数：复制代码块
    window.copyCodeBlock = function(codeBlockId) {
        const codeElement = document.getElementById(codeBlockId);
        if (codeElement) {
            const code = codeElement.textContent;
            navigator.clipboard.writeText(code).then(() => {
                showAiToast('代码已复制到剪贴板');
            }).catch(() => {
                showAiToast('复制失败，请手动复制');
            });
        }
    };

    // 处理代码块复制按钮点击事件
    document.addEventListener('click', function(e) {
        const codeContent = e.target.closest('.code-content');
        if (codeContent) {
            const rect = codeContent.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // 检查是否点击在右上角复制按钮区域（40x40 像素区域）
            if (x > rect.width - 40 && y < 40) {
                e.preventDefault();
                e.stopPropagation();
                
                const code = codeContent.querySelector('code').textContent;
                navigator.clipboard.writeText(code).then(() => {
                    showAiToast('代码已复制到剪贴板');
                }).catch(() => {
                    showAiToast('复制失败，请手动复制');
                });
            }
        }
    });

    async function sendMessage() {
        const userInput = chatInput.value.trim();
        if (!userInput) return;

        if (!aiState.isAIModeOn) {
            showAiToast('请先点击 "使用 AI 生成 JSON" 按钮开启 AI 模式');
            return;
        }

        addMessageToChatBox('user', userInput);
        aiState.messages.push({ role: 'user', content: userInput + '/no_think' });
        chatInput.value = '';
        chatInput.focus();

        // 显示 "AI 正在思考..."
        const thinkingBubble = addMessageToChatBox('ai', 'AI 正在思考...');
        const thinkingText = thinkingBubble.querySelector('p');
        thinkingText.classList.add('thinking-indicator');
        
        // 立即开始计时
        startTimer(thinkingBubble);

        try {
            const response = await fetch(aiState.apiBaseUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${aiState.apiKey}`
                },
                body: JSON.stringify({
                    model: aiState.model,
                    messages: aiState.messages,
                    stream: true,
                    temperature: aiState.temperature,
                    top_p: aiState.top_p,
                    top_k: aiState.top_k,
                    min_p: aiState.min_p,
                    frequency_penalty: aiState.frequency_penalty
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error.message || `HTTP error! status: ${response.status}`);
            }

            // 处理流式响应
            const reader = response.body.getReader();
            const decoder = new TextDecoder('utf-8');
            let aiResponseText = '';
            let isFirstChunk = true;

            // 计时器已经在发送消息时启动了

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    stopTimer();
                    break;
                }

                const chunk = decoder.decode(value);
                const lines = chunk.split('\n');

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const dataStr = line.substring(6).trim();
                        if (dataStr === '[DONE]') {
                            stopTimer();
                            if (aiResponseText) {
                                const finalCleanedText = aiResponseText.replace(/^\s*\n+/, '').replace(/\n{3,}/g, '\n\n');
                                aiState.messages.push({ role: 'assistant', content: finalCleanedText });
                            }
                            return;
                        }
                        try {
                            const data = JSON.parse(dataStr);
                            if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                                const content = data.choices[0].delta.content;
                                if (isFirstChunk) {
                                    // 移除 "正在思考"
                                    const messageContentDiv = thinkingBubble.querySelector('.message-content');
                                    // 清空内容但保留计时器
                                    const timer = messageContentDiv.querySelector('.timer');
                                    messageContentDiv.innerHTML = '';
                                    if (timer) messageContentDiv.appendChild(timer);
                                    isFirstChunk = false;
                                }
                                aiResponseText += content;
                                // 移除开头的空行和多余的换行符
                                const cleanedText = aiResponseText.replace(/^\s*\n+/, '').replace(/\n{3,}/g, '\n\n');
                                
                                // 更新消息内容，实时解析代码块
                                const messageContentDiv = thinkingBubble.querySelector('.message-content');
                                const timer = messageContentDiv.querySelector('.timer');
                                const processedContent = parseCodeBlocksRealtime(cleanedText);
                                messageContentDiv.innerHTML = processedContent;
                                if (timer) messageContentDiv.appendChild(timer);
                                
                                chatBox.scrollTop = chatBox.scrollHeight;
                            }
                        } catch (e) {
                            // 忽略JSON解析错误，因为流式传输可能包含不完整的JSON对象
                            console.log('JSON parse error (expected):', e);
                        }
                    }
                }
            }

        } catch (error) {
            console.error('Error fetching AI response:', error);
            const messageContentDiv = thinkingBubble.querySelector('.message-content');
            const timer = messageContentDiv.querySelector('.timer');
            messageContentDiv.innerHTML = `<p style="color: var(--danger-color);">出错了: ${error.message}</p>`;
            if (timer) messageContentDiv.appendChild(timer);
            stopTimer();
        }
    }
    
    function startTimer(bubble) {
        const startTime = bubble.dataset.startTime;
        const timerElement = bubble.timerElement;
        
        if (aiState.timerInterval) {
            clearInterval(aiState.timerInterval);
        }

        aiState.timerInterval = setInterval(() => {
            const elapsed = (Date.now() - startTime) / 1000;
            timerElement.textContent = `${elapsed.toFixed(1)}s`;
        }, 100);
    }

    function stopTimer() {
        if (aiState.timerInterval) {
            clearInterval(aiState.timerInterval);
            aiState.timerInterval = null;
        }
    }
}); 