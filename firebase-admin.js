// firebase-admin.js
// Система управления всем контентом через Firebase

const FIREBASE_CONFIG = {
    apiKey: "AIzaSyDG7SJfMbSiIbTkBxV6BBoPAsTAKQsLPv8",
    authDomain: "flowie-vpn.firebaseapp.com",
    databaseURL: "https://flowie-vpn-default-rtdb.firebaseio.com",
    projectId: "flowie-vpn",
    storageBucket: "flowie-vpn.firebasestorage.app",
    messagingSenderId: "55860525820",
    appId: "1:55860525820:web:75bd65ad5e04064b313579",
    measurementId: "G-P8YJD4HCJ2"
};

class FirebaseAdmin {
    constructor() {
        if (typeof firebase === 'undefined') {
            console.error('Firebase не загружен!');
            return;
        }

        try {
            if (!firebase.apps.length) {
                this.app = firebase.initializeApp(FIREBASE_CONFIG);
            } else {
                this.app = firebase.app();
            }
            this.db = firebase.database();
            this.loadedData = {};
            this.listeners = {};
            
            console.log('FirebaseAdmin инициализирован');
        } catch (error) {
            console.error('Ошибка инициализации Firebase:', error);
        }
    }

    // ========== ОСНОВНЫЕ МЕТОДЫ ==========

    // Загрузка всех данных с сайта
    async loadWebsiteData() {
        try {
            const data = {};
            
            // Загрузка тарифов
            data.tariffs = await this.loadData('tariffs');
            
            // Загрузка преимуществ
            data.benefits = await this.loadData('benefits');
            
            // Загрузка текстов на странице
            data.texts = await this.loadData('texts');
            
            // Загрузка настроек
            data.settings = await this.loadData('settings');
            
            // Загрузка платежных реквизитов
            data.payment = await this.loadData('payment');
            
            // Загрузка ссылок VPN
            data.vpn_links = await this.loadData('vpn_links');
            
            this.loadedData = data;
            console.log('Все данные загружены:', data);
            return data;
            
        } catch (error) {
            console.error('Ошибка загрузки данных:', error);
            return this.loadDemoData();
        }
    }

    // Загрузка данных из конкретного пути
    async loadData(path) {
        try {
            const snapshot = await this.db.ref(path).once('value');
            return snapshot.exists() ? snapshot.val() : null;
        } catch (error) {
            console.error(`Ошибка загрузки ${path}:`, error);
            return null;
        }
    }

    // Сохранение данных
    async saveData(path, data) {
        try {
            await this.db.ref(path).set(data);
            console.log(`Данные сохранены в ${path}:`, data);
            return true;
        } catch (error) {
            console.error(`Ошибка сохранения в ${path}:`, error);
            return false;
        }
    }

    // Обновление части данных
    async updateData(path, updates) {
        try {
            await this.db.ref(path).update(updates);
            console.log(`Данные обновлены в ${path}:`, updates);
            return true;
        } catch (error) {
            console.error(`Ошибка обновления ${path}:`, error);
            return false;
        }
    }

    // Подписка на изменения в реальном времени
    subscribe(path, callback) {
        if (!this.listeners[path]) {
            this.listeners[path] = [];
        }
        
        const ref = this.db.ref(path);
        const listener = ref.on('value', (snapshot) => {
            callback(snapshot.exists() ? snapshot.val() : null);
        });
        
        this.listeners[path].push({ ref, listener });
        return () => this.unsubscribe(path, listener);
    }

    // Отписка от изменений
    unsubscribe(path, listenerToRemove) {
        if (this.listeners[path]) {
            this.listeners[path] = this.listeners[path].filter(({ listener }) => 
                listener !== listenerToRemove
            );
        }
    }

    // ========== СПЕЦИФИЧЕСКИЕ МЕТОДЫ ==========

    // Управление тарифами
    async saveTariff(tariffId, tariffData) {
        return this.saveData(`tariffs/${tariffId}`, {
            ...tariffData,
            updated: new Date().toISOString()
        });
    }

    // Управление преимуществами
    async saveBenefit(benefitId, benefitData) {
        return this.saveData(`benefits/${benefitId}`, {
            ...benefitData,
            updated: new Date().toISOString()
        });
    }

    // Управление текстами
    async saveText(textId, textData) {
        return this.saveData(`texts/${textId}`, {
            ...textData,
            updated: new Date().toISOString()
        });
    }

    // Управление платежными реквизитами
    async savePaymentDetails(details) {
        return this.saveData('payment/details', {
            ...details,
            updated: new Date().toISOString()
        });
    }

    // Управление настройками сайта
    async saveSettings(settings) {
        return this.saveData('settings', {
            ...settings,
            updated: new Date().toISOString()
        });
    }

    // ========== ДЕМО ДАННЫЕ ==========

    loadDemoData() {
        return {
            tariffs: {
                light: {
                    id: 'light',
                    name: 'Лайт VPN',
                    price: '299',
                    monthly_price: '299',
                    description: 'Оптимизировано для PUBG Mobile',
                    features: [
                        'Пинг: -30-50мс',
                        'Лучшая регистрация урона',
                        'Серверы в РФ и Европе'
                    ],
                    download_url: '',
                    download_name: 'flowi-vpn-light.conf',
                    color: '#00ff88',
                    icon: 'bolt',
                    active: true,
                    duration_days: 30,
                    created_at: new Date().toISOString()
                },
                pro: {
                    id: 'pro',
                    name: 'Про VPN',
                    price: '599',
                    monthly_price: '599',
                    description: 'Для профессиональных игроков',
                    features: [
                        'Высокая скорость',
                        'Больше хедшотов',
                        'Приоритет на серверах',
                        'Безлимитный трафик'
                    ],
                    download_url: '',
                    download_name: 'flowi-vpn-pro.conf',
                    color: '#00ccff',
                    icon: 'rocket',
                    active: true,
                    duration_days: 30,
                    created_at: new Date().toISOString()
                },
                flowi: {
                    id: 'flowi',
                    name: 'Флоуи VPN',
                    price: '999',
                    monthly_price: '999',
                    description: 'Эксклюзивный тариф',
                    features: [
                        'Максимальный пинг',
                        'Эксклюзивные серверы',
                        'Приоритетная поддержка',
                        'Персональный менеджер'
                    ],
                    download_url: '',
                    download_name: 'flowi-vpn-premium.conf',
                    color: '#9d4edd',
                    icon: 'gem',
                    active: true,
                    duration_days: 30,
                    created_at: new Date().toISOString()
                }
            },
            benefits: {
                benefit1: {
                    id: 'benefit1',
                    title: 'Защита от DDoS',
                    description: 'Полная защита от атак',
                    icon: 'shield-alt',
                    order: 1,
                    active: true
                },
                benefit2: {
                    id: 'benefit2',
                    title: 'Стабильность 99.9%',
                    description: 'Минимальные потери пакетов',
                    icon: 'tachometer-alt',
                    order: 2,
                    active: true
                },
                benefit3: {
                    id: 'benefit3',
                    title: 'Поддержка 24/7',
                    description: 'Круглосуточная помощь',
                    icon: 'headset',
                    order: 3,
                    active: true
                },
                benefit4: {
                    id: 'benefit4',
                    title: 'Оптимизация',
                    description: 'Настроено для PUBG Mobile',
                    icon: 'gamepad',
                    order: 4,
                    active: true
                }
            },
            texts: {
                pingCheck: 'Проверка пинга',
                currentPing: 'Текущая задержка в PUBG Mobile',
                checkNow: 'Проверить сейчас',
                excellentConnection: 'Идеальное соединение',
                chooseVPN: 'Выберите VPN',
                optimizedForPUBG: 'Оптимизировано для PUBG Mobile',
                choosePlan: 'Выбрать тариф',
                advantages: 'Преимущества',
                whyChooseUs: 'Почему выбирают нас',
                vpn: 'VPN',
                profile: 'Профиль',
                settings: 'Настройки',
                checkout: 'Оформление заказа',
                paymentMethod: 'Способ оплаты',
                proceedToPayment: 'Перейти к оплате',
                payment: 'Оплата тарифа',
                paymentDetails: 'Реквизиты для перевода',
                cardNumber: 'Номер карты',
                recipient: 'Получатель',
                bank: 'Банк',
                instructions: 'Инструкция',
                copyDetails: 'Скопируйте реквизиты карты',
                makeTransfer: 'Совершите перевод на указанную карту',
                saveScreenshot: 'Сохраните скриншот или фото чека',
                uploadReceiptForm: 'Загрузите чек в форму ниже',
                uploadReceipt: 'Загрузите чек об оплате',
                yourNameOptional: 'Ваше имя (необязательно)',
                emailOptional: 'Email для связи (необязательно)',
                uploadClick: 'Нажмите для загрузки чека',
                uploadFormats: 'JPG, PNG, GIF (макс. 5MB)',
                submitReceipt: 'Отправить чек на проверку',
                paymentSuccess: 'Оплата успешно завершена!',
                vpnActivated: 'Ваш VPN активирован!',
                downloadConfig: 'Скачайте конфигурацию VPN',
                externalLinkWarning: 'Вы будете перенаправлены на страницу загрузки',
                installInstructions: 'Инструкция по установке в WireGuard',
                installWireGuard: 'Установите WireGuard',
                installWireGuardDesc: 'Скачайте и установите WireGuard с официального сайта или из магазина приложений вашего устройства',
                importConfig: 'Импортируйте конфигурацию',
                importConfigDesc: 'В приложении WireGuard нажмите "Добавить туннель" → "Импорт из файла" и выберите скачанный файл flowi-vpn.conf',
                activateConnection: 'Активируйте подключение',
                activateConnectionDesc: 'Нажмите на переключатель рядом с вашим туннелем в списке для активации VPN подключения',
                checkConnection: 'Проверьте подключение',
                checkConnectionDesc: 'Убедитесь, что статус подключения изменился на "Active" и появился значок VPN в статус-баре',
                confirmation: 'Я сохранил файл конфигурации и прочитал инструкцию',
                confirmationDesc: 'Я понимаю, что без файла конфигурации я не смогу подключиться к VPN',
                continue: 'Продолжить'
            },
            payment: {
                details: {
                    card_number: '2200 7013 3827 9851',
                    recipient: 'Исбагиев И.',
                    recipient_full: 'Исбагиев Имам Ахмедович',
                    bank: 'Т-Банк',
                    updated: new Date().toISOString()
                }
            },
            settings: {
                site_title: 'ФЛОУИ VPN - PUBG Mobile',
                theme_color: '#00ff88',
                ping_enabled: true,
                auto_ping_check: true,
                default_ping: 15,
                show_live_badge: true,
                maintenance_mode: false,
                maintenance_message: 'Сайт на техническом обслуживании',
                updated: new Date().toISOString()
            }
        };
    }
}

// Создаем глобальный экземпляр
window.firebaseAdmin = new FirebaseAdmin();

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FirebaseAdmin;
}