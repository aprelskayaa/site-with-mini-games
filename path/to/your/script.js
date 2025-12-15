document.addEventListener('DOMContentLoaded', function() {
            const bgVideo = document.getElementById('bgVideo');
            bgVideo.playbackRate = 0.6; 

            bgVideo.addEventListener('loadedmetadata', function() {
                this.playbackRate = 0.5;
            });
        });
        
/*МОДАЛЬНЫЕ ОКНА РЕГИСТРАЦИИ*/
const regBtn = document.getElementById('regBtn');
const vhodBtn = document.getElementById('vhodBtn');
const modalOverlay = document.getElementById('modalOverlay');
const modalOverlay2 = document.getElementById('modalOverlay2');
const closeModal = document.querySelector('.close-modal');
const closeModal2 = document.querySelector('.close-modal2');
const pigBtn = document.querySelector('.pig');
const pigRegBtn = document.querySelector('.pig_reg');

// Плавное открытие/закрытие модалок
function toggleModal(modal, show) {
    if (show) {
        modal.style.display = 'flex';
        setTimeout(() => {
            modal.classList.add('active');
        }, 10);
    } else {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 400);
    }
}

regBtn.addEventListener('click', function(e) {
    e.preventDefault();
    toggleModal(modalOverlay, true);
});

vhodBtn.addEventListener('click', function(e) {
    e.preventDefault();
    toggleModal(modalOverlay2, true);
});

pigBtn.addEventListener('click', function(e) {
    e.preventDefault();
    toggleModal(modalOverlay, false);
    setTimeout(() => {
        toggleModal(modalOverlay2, true);
    }, 400);
});

pigRegBtn.addEventListener('click', function(e) {
    e.preventDefault();
    toggleModal(modalOverlay2, false);
    setTimeout(() => {
        toggleModal(modalOverlay, true);
    }, 400);
});

closeModal.addEventListener('click', function() {
    toggleModal(modalOverlay, false);
});

closeModal2.addEventListener('click', function() {
    toggleModal(modalOverlay2, false);
});

modalOverlay.addEventListener('click', function(e) {
    if (e.target === modalOverlay) {
        toggleModal(modalOverlay, false);
    }
});

modalOverlay2.addEventListener('click', function(e) {
    if (e.target === modalOverlay2) {
        toggleModal(modalOverlay2, false);
    }
});
/*КОНЕЦ МОДАЛЬНЫХ ОКОН РЕГИСТРАЦИИ*/

/*зона игр*/
let scrollToTopButton = document.getElementById('scrollToTopBtn');

window.onscroll = function() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        scrollToTopButton.classList.add('show');
    } else {
        scrollToTopButton.classList.remove('show');
    }
};

scrollToTopButton.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});
/*зона игр конец*/

let nameInput = document.querySelector('#name');
let loginInput = document.querySelector('#login');
let passwordInput = document.querySelector('#password');
let submit = document.querySelector('#submit');
let users = {};

function redirectToSite() {
    window.location.href = 'file:///C:/Users/yurki/Desktop/index.html';
}

function User(name, login, password) {
    this.name = name;
    this.login = login;
    this.password = password;
}

function createId(users) {
    return Object.keys(users).length;
}

function isPasswordValid(password) {
    const regex = /^[A-Za-z]+$/;
    return password.length >= 8 && password.length <= 14 && regex.test(password);
}

function isNameAndLoginValid(name, login) {
    return name.length <= 14 && login.length <= 14;
}

document.getElementById('qrButton').onclick = function() {
    window.open('https://t.me/iubip91', '_blank');
};

submit.addEventListener('click', () => {
    const nameUser = nameInput.value;
    const loginUser = loginInput.value;
    const passwordUser = passwordInput.value;

    if (!isNameAndLoginValid(nameUser, loginUser)) {
        alert('Имя и логин должны содержать не более 14 символов.');
        return;
    }

    if (!isPasswordValid(passwordUser)) {
        alert('Пароль должен содержать от 8 до 14 символов и состоять только из латинских букв.');
        return;
    }
    window.location.href = 'file:index.html';
    const user = new User(nameUser, loginUser, passwordUser);
    const userId = 'User' + createId(users);
    users[userId] = user;

    console.log(users);
    
    nameInput.value = '';
    loginInput.value = '';
    passwordInput.value = '';
});
