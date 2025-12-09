// admin-fixes.js
// Исправления для админ-панели

// 1. Исправляем двойную загрузку
let isLoading = false;

async function loadAllOrdersFixed() {
    if (isLoading) return;
    
    isLoading = true;
    try {
        await loadAllOrders();
    } finally {
        isLoading = false;
    }
}

// 2. Исправляем ошибки с преимуществами
function initBenefitsForm() {
    const benefitsContainer = document.getElementById('benefitsContainer');
    if (!benefitsContainer) return;
    
    // Создаем недостающие элементы если их нет
    if (!document.getElementById('benefitId')) {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'benefitId';
        benefitsContainer.querySelector('.links-form').prepend(hiddenInput);
    }
    
    // Добавляем обработчики
    const saveBtn = benefitsContainer.querySelector('.save-btn[onclick="saveBenefit()"]');
    if (saveBtn) {
        saveBtn.onclick = saveBenefitFixed;
    }
}

// Исправленная функция сохранения преимуществ
async function saveBenefitFixed() {
    try {
        // Получаем или создаем элементы
        let benefitId = document.getElementById('benefitId');
        let benefitTitle = document.getElementById('benefitTitle');
        let benefitDescription = document.getElementById('benefitDescription');
        let benefitIcon = document.getElementById('benefitIcon');
        let benefitOrder = document.getElementById('benefitOrder');
        let benefitActive = document.getElementById('benefitActive');
        
        // Создаем если не существуют
        if (!benefitId) {
            benefitId = document.createElement('input');
            benefitId.type = 'hidden';
            benefitId.id = 'benefitId';
            document.querySelector('#benefitsContainer .links-form').prepend(benefitId);
        }
        
        if (!benefitTitle) {
            console.error('Поле benefitTitle не найдено');
            return;
        }
        
        if (!benefitDescription) {
            benefitDescription = document.createElement('input');
            benefitDescription.type = 'text';
            benefitDescription.id = 'benefitDescription';
            benefitDescription.className = 'form-input';
            benefitDescription.placeholder = 'Описание преимущества';
            document.querySelector('#benefitsContainer .links-form').appendChild(benefitDescription);
        }
        
        if (!benefitIcon) {
            benefitIcon = document.createElement('input');
            benefitIcon.type = 'text';
            benefitIcon.id = 'benefitIcon';
            benefitIcon.className = 'form-input';
            benefitIcon.placeholder = 'shield-alt';
            document.querySelector('#benefitsContainer .links-form').appendChild(benefitIcon);
        }
        
        if (!benefitOrder) {
            benefitOrder = document.createElement('input');
            benefitOrder.type = 'number';
            benefitOrder.id = 'benefitOrder';
            benefitOrder.className = 'form-input';
            benefitOrder.value = '1';
            document.querySelector('#benefitsContainer .links-form').appendChild(benefitOrder);
        }
        
        if (!benefitActive) {
            benefitActive = document.createElement('input');
            benefitActive.type = 'checkbox';
            benefitActive.id = 'benefitActive';
            benefitActive.checked = true;
            document.querySelector('#benefitsContainer .links-form').appendChild(benefitActive);
        }
        
        // Получаем значения
        const benefitData = {
            id: benefitId.value || `benefit_${Date.now()}`,
            title: benefitTitle.value.trim(),
            description: benefitDescription.value.trim(),
            icon: benefitIcon.value.trim(),
            order: parseInt(benefitOrder.value) || 1,
            active: benefitActive.checked,
            updated: new Date().toISOString()
        };
        
        // Валидация
        if (!benefitData.title) {
            alert('Введите заголовок');
            return;
        }
        
        if (!benefitData.description) {
            alert('Введите описание');
            return;
        }
        
        if (!benefitData.icon) {
            alert('Введите иконку (например: shield-alt)');
            return;
        }
        
        // Сохраняем
        await database.ref(`benefits/${benefitData.id}`).set(benefitData);
        
        alert('Преимущество сохранено!');
        
        // Очищаем форму
        benefitId.value = '';
        benefitTitle.value = '';
        benefitDescription.value = '';
        benefitIcon.value = 'shield-alt';
        benefitOrder.value = '1';
        benefitActive.checked = true;
        
    } catch (error) {
        console.error('Ошибка:', error);
        alert('Ошибка: ' + error.message);
    }
}

// 3. Инициализация при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Заменяем оригинальные функции
    window.loadAllOrders = loadAllOrdersFixed;
    
    // Инициализируем форму преимуществ
    initBenefitsForm();
    
    // Загружаем заказы один раз
    setTimeout(loadAllOrdersFixed, 1000);
});