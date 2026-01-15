// Основной объект приложения для избежания глобальных переменных
const App = (function() {
    // Конфигурация
    const CONFIG = {
        SCROLL_THRESHOLD: 200,
        MODAL_TRANSITION_DELAY: 400,
        PASSWORD_MIN: 8,
        PASSWORD_MAX: 14,
        NAME_MAX: 14,
        LOGIN_MAX: 14
    };

    // DOM элементы
    const dom = {
        bgVideo: document.getElementById('bgVideo'),
        scrollToTopButton: document.getElementById('scrollToTopBtn'),
        modalOverlay: document.getElementById('modalOverlay'),
        modalOverlay2: document.getElementById('modalOverlay2'),
        nameInput: document.querySelector('#name'),
        loginInput: document.querySelector('#login'),
        passwordInput: document.querySelector('#password'),
        submitBtn: document.querySelector('#submit'),
        qrButton: document.getElementById('qrButton'),
        regBtn: document.getElementById('regBtn'),
        vhodBtn: document.getElementById('vhodBtn'),
        pigBtn: document.querySelector('.pig'),
        pigRegBtn: document.querySelector('.pig_reg'),
        closeModal: document.querySelector('.close-modal'),
        closeModal2: document.querySelector('.close-modal2')
    };

    // Состояние приложения
    const state = {
        users: {},
        isModalTransitioning: false
    };

    // Валидация
    const Validator = {
        isPasswordValid(password) {
            return password.length >= CONFIG.PASSWORD_MIN && 
                   password.length <= CONFIG.PASSWORD_MAX && 
                   /^[A-Za-z]+$/.test(password);
        },

        isNameAndLoginValid(name, login) {
            return name.length <= CONFIG.NAME_MAX && 
                   login.length <= CONFIG.NAME_MAX;
        }
    };

    // Видео
    function initVideo() {
        if (!dom.bgVideo) return;
        
        dom.bgVideo.playbackRate = 0.6;
        dom.bgVideo.addEventListener('loadedmetadata', () => {
            dom.bgVideo.playbackRate = 0.5;
        });
    }

    // Модальные окна
    function initModals() {
        if (!dom.modalOverlay || !dom.modalOverlay2) return;

        const modals = [
            { btn: dom.regBtn, modal: dom.modalOverlay },
            { btn: dom.vhodBtn, modal: dom.modalOverlay2 },
            { btn: dom.pigBtn, from: dom.modalOverlay, to: dom.modalOverlay2 },
            { btn: dom.pigRegBtn, from: dom.modalOverlay2, to: dom.modalOverlay }
        ];

        modals.forEach(({ btn, modal, from, to }) => {
            if (!btn) return;
            
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                
                if (state.isModalTransitioning) return;
                state.isModalTransitioning = true;
                
                if (from && to) {
                    // Переключение между модалками
                    toggleModal(from, false);
                    setTimeout(() => {
                        toggleModal(to, true);
                        state.isModalTransitioning = false;
                    }, CONFIG.MODAL_TRANSITION_DELAY);
                } else {
                    // Открытие одной модалки
                    toggleModal(modal, true);
                    state.isModalTransitioning = false;
                }
            });
        });

        // Закрытие по крестику
        if (dom.closeModal) {
            dom.closeModal.addEventListener('click', () => toggleModal(dom.modalOverlay, false));
        }
        if (dom.closeModal2) {
            dom.closeModal2.addEventListener('click', () => toggleModal(dom.modalOverlay2, false));
        }

        // Закрытие по клику на оверлей
        dom.modalOverlay?.addEventListener('click', (e) => {
            if (e.target === dom.modalOverlay) toggleModal(dom.modalOverlay, false);
        });
        dom.modalOverlay2?.addEventListener('click', (e) => {
            if (e.target === dom.modalOverlay2) toggleModal(dom.modalOverlay2, false);
        });
    }

    function toggleModal(modal, show) {
        if (!modal) return;
        
        if (show) {
            modal.style.display = 'flex';
            requestAnimationFrame(() => {
                modal.classList.add('active');
            });
        } else {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
            }, CONFIG.MODAL_TRANSITION_DELAY);
        }
    }

    // Скролл вверх
    function initScrollToTop() {
        if (!dom.scrollToTopButton) return;

        let scrollTimeout;
        
        const handleScroll = () => {
            if (scrollTimeout) {
                cancelAnimationFrame(scrollTimeout);
            }
            
            scrollTimeout = requestAnimationFrame(() => {
                const shouldShow = window.scrollY > CONFIG.SCROLL_THRESHOLD;
                dom.scrollToTopButton.classList.toggle('show', shouldShow);
            });
        };

        // Дебаунс скролла для производительности
        window.addEventListener('scroll', handleScroll, { passive: true });
        
        dom.scrollToTopButton.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Регистрация
    function initRegistration() {
        if (!dom.submitBtn) return;

        class User {
            constructor(name, login, password) {
                this.name = name;
                this.login = login;
                this.password = password;
            }
        }

        function createId() {
            return Object.keys(state.users).length;
        }

        dom.submitBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            const nameUser = dom.nameInput?.value?.trim() || '';
            const loginUser = dom.loginInput?.value?.trim() || '';
            const passwordUser = dom.passwordInput?.value?.trim() || '';

            if (!Validator.isNameAndLoginValid(nameUser, loginUser)) {
                alert(`Имя и логин должны содержать не более ${CONFIG.NAME_MAX} символов.`);
                return;
            }

            if (!Validator.isPasswordValid(passwordUser)) {
                alert(`Пароль должен содержать от ${CONFIG.PASSWORD_MIN} до ${CONFIG.PASSWORD_MAX} символов и состоять только из латинских букв.`);
                return;
            }

            // Создание пользователя
            const user = new User(nameUser, loginUser, passwordUser);
            const userId = 'User' + createId();
            state.users[userId] = user;

            // Очистка полей
            if (dom.nameInput) dom.nameInput.value = '';
            if (dom.loginInput) dom.loginInput.value = '';
            if (dom.passwordInput) dom.passwordInput.value = '';

            // Редирект
            window.location.href = 'index.html';
        });
    }

    // QR кнопка
    function initQrButton() {
        dom.qrButton?.addEventListener('click', (e) => {
            e.preventDefault();
            window.open('https://t.me/iubip91', '_blank');
        });
    }

    // Инициализация всех модулей
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initModules();
            });
        } else {
            initModules();
        }
    }

    function initModules() {
        initVideo();
        initModals();
        initScrollToTop();
        initRegistration();
        initQrButton();
    }

    // Публичные методы
    return {
        init,
        getUsers: () => ({ ...state.users }), // Возвращаем копию
        toggleModal
    };
})();

// Запуск приложения
App.init();
