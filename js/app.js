// SpeakOffer Application JavaScript

class SpeakOfferApp {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.checkAuth();
        this.initializeComponents();
    }

    bindEvents() {
        // Mobile menu toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', this.toggleMobileMenu);
        }

        // User dropdown
        const userAvatar = document.querySelector('.user-avatar');
        if (userAvatar) {
            userAvatar.addEventListener('click', this.toggleUserDropdown);
        }

        // Close dropdown when clicking outside
        document.addEventListener('click', this.handleClickOutside);

        // Form submissions
        const forms = document.querySelectorAll('form[data-form]');
        forms.forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });

        // Navigation
        const navLinks = document.querySelectorAll('[data-navigate]');
        navLinks.forEach(link => {
            link.addEventListener('click', this.handleNavigation.bind(this));
        });
    }

    toggleMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        navMenu.classList.toggle('mobile-open');
    }

    toggleUserDropdown(e) {
        e.stopPropagation();
        const dropdown = document.querySelector('.dropdown');
        dropdown.classList.toggle('hidden');
    }

    handleClickOutside(e) {
        const dropdown = document.querySelector('.dropdown');
        const userMenu = document.querySelector('.user-menu');

        if (dropdown && !userMenu.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    }

    checkAuth() {
        const token = localStorage.getItem('speakOffer_token');
        const userData = localStorage.getItem('speakOffer_user');

        if (token && userData) {
            this.currentUser = JSON.parse(userData);
            this.updateAuthState(true);
        } else {
            this.updateAuthState(false);
        }
    }

    updateAuthState(isLoggedIn) {
        const authElements = document.querySelectorAll('[data-auth]');
        const guestElements = document.querySelectorAll('[data-guest]');

        authElements.forEach(el => {
            el.style.display = isLoggedIn ? 'block' : 'none';
        });

        guestElements.forEach(el => {
            el.style.display = isLoggedIn ? 'none' : 'block';
        });

        if (isLoggedIn && this.currentUser) {
            this.updateUserInfo();
        }
    }

    updateUserInfo() {
        const userNameElements = document.querySelectorAll('[data-user-name]');
        const userAvatarElements = document.querySelectorAll('[data-user-avatar]');

        userNameElements.forEach(el => {
            el.textContent = this.currentUser.name || this.currentUser.email;
        });

        userAvatarElements.forEach(el => {
            el.textContent = (this.currentUser.name || this.currentUser.email).charAt(0).toUpperCase();
        });
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formType = form.dataset.form;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());

        this.showLoading(form);

        try {
            switch (formType) {
                case 'login':
                    await this.handleLogin(data);
                    break;
                case 'register':
                    await this.handleRegister(data);
                    break;
                case 'profile':
                    await this.handleProfileUpdate(data);
                    break;
                default:
                    console.warn('Unknown form type:', formType);
            }
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.hideLoading(form);
        }
    }

    async handleLogin(data) {
        // Simulate API call
        await this.delay(1000);

        if (data.email && data.password) {
            const userData = {
                id: '1',
                email: data.email,
                name: data.email.split('@')[0],
                joinDate: new Date().toISOString()
            };

            localStorage.setItem('speakOffer_token', 'mock_token_' + Date.now());
            localStorage.setItem('speakOffer_user', JSON.stringify(userData));

            this.currentUser = userData;
            this.updateAuthState(true);
            this.showSuccess('登录成功！');

            setTimeout(() => {
                this.navigateTo('dashboard.html');
            }, 1000);
        } else {
            throw new Error('请填写邮箱和密码');
        }
    }

    async handleRegister(data) {
        // Simulate API call
        await this.delay(1000);

        if (data.email && data.password && data.confirmPassword) {
            if (data.password !== data.confirmPassword) {
                throw new Error('密码确认不匹配');
            }

            const userData = {
                id: '1',
                email: data.email,
                name: data.name || data.email.split('@')[0],
                targetCountry: data.targetCountry,
                targetMajor: data.targetMajor,
                joinDate: new Date().toISOString()
            };

            localStorage.setItem('speakOffer_token', 'mock_token_' + Date.now());
            localStorage.setItem('speakOffer_user', JSON.stringify(userData));

            this.currentUser = userData;
            this.updateAuthState(true);
            this.showSuccess('注册成功！欢迎加入SpeakOffer');

            setTimeout(() => {
                this.navigateTo('dashboard.html');
            }, 1000);
        } else {
            throw new Error('请填写所有必填字段');
        }
    }

    async handleProfileUpdate(data) {
        await this.delay(500);

        if (this.currentUser) {
            this.currentUser = { ...this.currentUser, ...data };
            localStorage.setItem('speakOffer_user', JSON.stringify(this.currentUser));
            this.updateUserInfo();
            this.showSuccess('个人信息更新成功！');
        }
    }

    handleNavigation(e) {
        e.preventDefault();
        const target = e.target.closest('[data-navigate]');
        const url = target.dataset.navigate;
        this.navigateTo(url);
    }

    navigateTo(url) {
        // In a real app, you'd use a router
        window.location.href = url;
    }

    logout() {
        localStorage.removeItem('speakOffer_token');
        localStorage.removeItem('speakOffer_user');
        this.currentUser = null;
        this.updateAuthState(false);
        this.showSuccess('已安全退出');
        setTimeout(() => {
            this.navigateTo('index.html');
        }, 1000);
    }

    showLoading(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = true;
            const originalText = submitBtn.textContent;
            submitBtn.dataset.originalText = originalText;
            submitBtn.innerHTML = '<span class="loading"></span> 处理中...';
        }
    }

    hideLoading(form) {
        const submitBtn = form.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = submitBtn.dataset.originalText || '提交';
        }
    }

    showAlert(message, type = 'info') {
        const alertContainer = document.getElementById('alert-container') || this.createAlertContainer();

        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <span>${message}</span>
            <button type="button" class="alert-close" onclick="this.parentElement.remove()">×</button>
        `;

        alertContainer.appendChild(alert);

        setTimeout(() => {
            if (alert.parentElement) {
                alert.remove();
            }
        }, 5000);
    }

    showSuccess(message) {
        this.showAlert(message, 'success');
    }

    showError(message) {
        this.showAlert(message, 'error');
    }

    showWarning(message) {
        this.showAlert(message, 'warning');
    }

    createAlertContainer() {
        const container = document.createElement('div');
        container.id = 'alert-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 400px;
        `;
        document.body.appendChild(container);
        return container;
    }

    initializeComponents() {
        // Initialize any page-specific components
        const pageType = document.body.dataset.page;

        switch (pageType) {
            case 'dashboard':
                this.initDashboard();
                break;
            case 'interview':
                this.initInterview();
                break;
            case 'report':
                this.initReport();
                break;
        }
    }

    initDashboard() {
        this.loadDashboardData();
    }

    async loadDashboardData() {
        await this.delay(500);

        // Simulate loading dashboard data
        const stats = {
            totalInterviews: 12,
            averageScore: 8.5,
            improvementRate: 15,
            nextGoal: 'Graduate School Interview'
        };

        this.updateDashboardStats(stats);
    }

    updateDashboardStats(stats) {
        const elements = {
            totalInterviews: document.getElementById('total-interviews'),
            averageScore: document.getElementById('average-score'),
            improvementRate: document.getElementById('improvement-rate'),
            nextGoal: document.getElementById('next-goal')
        };

        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                elements[key].textContent = stats[key];
            }
        });
    }

    initInterview() {
        // Interview page specific initialization
        console.log('Interview page initialized');
    }

    initReport() {
        // Report page specific initialization
        this.loadReportData();
    }

    async loadReportData() {
        await this.delay(800);

        // Simulate report data
        const reportData = {
            overallScore: 8.5,
            dimensions: {
                communication: 9.0,
                knowledge: 8.0,
                confidence: 8.5,
                cultural: 7.5
            },
            feedback: [
                "语言表达流利，词汇量丰富",
                "专业知识掌握扎实，回答准确",
                "建议在跨文化交流方面多加练习",
                "整体表现优秀，继续保持"
            ]
        };

        this.updateReportData(reportData);
    }

    updateReportData(data) {
        const scoreElement = document.getElementById('overall-score');
        if (scoreElement) {
            scoreElement.textContent = data.overallScore;
        }

        // Update dimension scores
        Object.keys(data.dimensions).forEach(key => {
            const element = document.getElementById(`score-${key}`);
            if (element) {
                element.textContent = data.dimensions[key];
            }
        });

        // Update feedback list
        const feedbackList = document.getElementById('feedback-list');
        if (feedbackList) {
            feedbackList.innerHTML = data.feedback.map(item =>
                `<li class="feedback-item">${item}</li>`
            ).join('');
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.speakOfferApp = new SpeakOfferApp();
});

// Global utility functions
function startInterview(type, country, major) {
    console.log('Starting interview:', { type, country, major });
    window.speakOfferApp.navigateTo('interview.html');
}

function viewReport(reportId) {
    console.log('Viewing report:', reportId);
    window.speakOfferApp.navigateTo('report.html');
}

function logout() {
    window.speakOfferApp.logout();
}