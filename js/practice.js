// Practice Page JavaScript

class PracticeManager {
    constructor() {
        this.questions = [];
        this.filteredQuestions = [];
        this.currentPage = 1;
        this.questionsPerPage = 12;
        this.totalPages = 1;
        this.currentView = 'grid';
        this.currentQuestion = 0;
        this.practiceQuestions = [];
        this.sessionTimer = null;
        this.sessionStartTime = null;
        this.isRecording = false;

        this.init();
    }

    init() {
        this.loadQuestions();
        this.bindEvents();
        this.applyFilters();
    }

    loadQuestions() {
        // Sample question data - in real app would come from API
        this.questions = [
            {
                id: 1,
                text: "Tell me about yourself and why you're interested in studying at our university.",
                category: "self-introduction",
                type: "university",
                country: "美国",
                major: "商科",
                difficulty: 2,
                popularity: 95,
                lastUpdated: new Date('2024-01-15'),
                tips: [
                    "简洁明了地介绍个人背景",
                    "突出与目标专业相关的经历",
                    "表达对学校的具体了解和兴趣"
                ]
            },
            {
                id: 2,
                text: "Why did you choose this particular field of study?",
                category: "motivation",
                type: "university",
                country: "美国",
                major: "工程",
                difficulty: 2,
                popularity: 88,
                lastUpdated: new Date('2024-01-12'),
                tips: [
                    "描述对专业的兴趣来源",
                    "结合个人经历和职业规划",
                    "展现对专业前景的理解"
                ]
            },
            {
                id: 3,
                text: "Describe a time when you demonstrated leadership skills.",
                category: "leadership",
                type: "university",
                country: "美国",
                major: "商科",
                difficulty: 3,
                popularity: 92,
                lastUpdated: new Date('2024-01-14'),
                tips: [
                    "使用STAR法则组织回答",
                    "突出具体行动和结果",
                    "体现团队协作能力"
                ]
            },
            {
                id: 4,
                text: "What are your research interests and how do they align with our program?",
                category: "academic",
                type: "graduate",
                country: "英国",
                major: "计算机科学",
                difficulty: 4,
                popularity: 76,
                lastUpdated: new Date('2024-01-10'),
                tips: [
                    "详细阐述研究兴趣",
                    "说明与目标项目的匹配度",
                    "展现研究潜力"
                ]
            },
            {
                id: 5,
                text: "Tell me about a challenge you faced and how you overcame it.",
                category: "challenges",
                type: "university",
                country: "加拿大",
                major: "医学",
                difficulty: 3,
                popularity: 89,
                lastUpdated: new Date('2024-01-11'),
                tips: [
                    "选择有意义的挑战",
                    "强调解决问题的过程",
                    "体现个人成长"
                ]
            },
            {
                id: 6,
                text: "How would you contribute to the diversity of our student body?",
                category: "cultural",
                type: "university",
                country: "澳大利亚",
                major: "商科",
                difficulty: 3,
                popularity: 84,
                lastUpdated: new Date('2024-01-13'),
                tips: [
                    "突出个人独特背景",
                    "说明可以带来的价值",
                    "展现包容性思维"
                ]
            },
            {
                id: 7,
                text: "What are your career goals and how will this program help you achieve them?",
                category: "motivation",
                type: "graduate",
                country: "美国",
                major: "商科",
                difficulty: 2,
                popularity: 91,
                lastUpdated: new Date('2024-01-08'),
                tips: [
                    "明确短期和长期目标",
                    "说明项目的价值",
                    "展现规划能力"
                ]
            },
            {
                id: 8,
                text: "Describe your most significant academic achievement.",
                category: "academic",
                type: "university",
                country: "英国",
                major: "工程",
                difficulty: 2,
                popularity: 87,
                lastUpdated: new Date('2024-01-09'),
                tips: [
                    "选择真正有意义的成就",
                    "说明努力过程",
                    "体现学术潜力"
                ]
            },
            {
                id: 9,
                text: "Why are you applying for a scholarship?",
                category: "motivation",
                type: "scholarship",
                country: "美国",
                major: "医学",
                difficulty: 3,
                popularity: 79,
                lastUpdated: new Date('2024-01-07'),
                tips: [
                    "说明经济需要",
                    "强调学术价值",
                    "展现回馈社会的决心"
                ]
            },
            {
                id: 10,
                text: "How do you handle stress and pressure?",
                category: "challenges",
                type: "visa",
                country: "英国",
                major: "",
                difficulty: 2,
                popularity: 85,
                lastUpdated: new Date('2024-01-06'),
                tips: [
                    "给出具体的应对方法",
                    "举例说明",
                    "展现心理素质"
                ]
            }
        ];
    }

    bindEvents() {
        // Filter change events
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.applyFilters());
        });

        const difficultySlider = document.getElementById('difficulty');
        if (difficultySlider) {
            difficultySlider.addEventListener('input', () => this.applyFilters());
        }

        // Sort change event
        const sortSelect = document.getElementById('sort-by');
        if (sortSelect) {
            sortSelect.addEventListener('change', () => this.sortQuestions());
        }
    }

    applyFilters() {
        const selectedTypes = Array.from(document.querySelectorAll('input[name="type"]:checked'))
            .map(input => input.value);

        const selectedCountries = Array.from(document.querySelectorAll('input[name="country"]:checked'))
            .map(input => input.value);

        const selectedMajors = Array.from(document.querySelectorAll('input[name="major"]:checked'))
            .map(input => input.value);

        const maxDifficulty = parseInt(document.getElementById('difficulty').value);

        this.filteredQuestions = this.questions.filter(q => {
            const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(q.type);
            const countryMatch = selectedCountries.length === 0 || selectedCountries.includes(q.country);
            const majorMatch = selectedMajors.length === 0 || selectedMajors.includes(q.major);
            const difficultyMatch = q.difficulty <= maxDifficulty;

            return typeMatch && countryMatch && majorMatch && difficultyMatch;
        });

        this.currentPage = 1;
        this.updatePagination();
        this.renderQuestions();
    }

    sortQuestions() {
        const sortBy = document.getElementById('sort-by').value;

        switch (sortBy) {
            case 'difficulty':
                this.filteredQuestions.sort((a, b) => a.difficulty - b.difficulty);
                break;
            case 'popularity':
                this.filteredQuestions.sort((a, b) => b.popularity - a.popularity);
                break;
            case 'recent':
                this.filteredQuestions.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
                break;
            default:
                // Default sort by id
                this.filteredQuestions.sort((a, b) => a.id - b.id);
        }

        this.renderQuestions();
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.filteredQuestions.length / this.questionsPerPage);
        document.getElementById('pagination-text').textContent =
            `第 ${this.currentPage} 页，共 ${this.totalPages} 页`;

        // Update pagination buttons
        const prevBtn = document.querySelector('.pagination-btn:first-child');
        const nextBtn = document.querySelector('.pagination-btn:last-child');

        prevBtn.disabled = this.currentPage === 1;
        nextBtn.disabled = this.currentPage === this.totalPages;
    }

    renderQuestions() {
        const container = document.getElementById('questions-container');
        const startIndex = (this.currentPage - 1) * this.questionsPerPage;
        const endIndex = startIndex + this.questionsPerPage;
        const pageQuestions = this.filteredQuestions.slice(startIndex, endIndex);

        container.innerHTML = pageQuestions.map(q => this.renderQuestionCard(q)).join('');
    }

    renderQuestionCard(question) {
        const difficultyClass = question.difficulty <= 2 ? 'easy' :
                              question.difficulty <= 3 ? 'medium' : 'hard';

        const difficultyText = question.difficulty <= 2 ? '基础' :
                              question.difficulty <= 3 ? '中等' : '困难';

        return `
            <div class="question-card" onclick="openPracticeModal(${question.id})">
                <div class="question-header">
                    <div class="question-meta">
                        <div class="question-type">${this.getTypeText(question.type)}</div>
                        <div class="question-tags">
                            <span class="question-tag">${question.country}</span>
                            ${question.major ? `<span class="question-tag">${question.major}</span>` : ''}
                        </div>
                    </div>
                    <div class="question-difficulty difficulty-tag ${difficultyClass}">
                        ${difficultyText}
                    </div>
                </div>
                <div class="question-content">
                    <div class="question-text">${question.text}</div>
                </div>
                <div class="question-actions">
                    <div class="question-stats">
                        <span>热度 ${question.popularity}%</span>
                        <span>更新 ${this.formatDate(question.lastUpdated)}</span>
                    </div>
                    <button class="practice-btn" onclick="event.stopPropagation(); startQuickPractice(${question.id})">
                        练习
                    </button>
                </div>
            </div>
        `;
    }

    getTypeText(type) {
        const types = {
            'university': '大学申请',
            'scholarship': '奖学金',
            'visa': '签证',
            'graduate': '研究生'
        };
        return types[type] || type;
    }

    getCategoryText(category) {
        const categories = {
            'self-introduction': '自我介绍',
            'motivation': '动机意愿',
            'leadership': '领导力',
            'academic': '学术背景',
            'challenges': '挑战困难',
            'cultural': '文化适应'
        };
        return categories[category] || category;
    }

    formatDate(date) {
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) return '今天';
        if (diffDays === 2) return '昨天';
        if (diffDays <= 7) return `${diffDays}天前`;
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
    }

    changeView(view) {
        this.currentView = view;

        // Update view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.view === view);
        });

        // Update container class
        const container = document.getElementById('questions-container');
        container.classList.toggle('list-view', view === 'list');
    }

    openPracticeModal(questionId) {
        const question = this.questions.find(q => q.id === questionId);
        if (!question) return;

        // Populate modal content
        document.getElementById('preview-category').textContent = this.getCategoryText(question.category);
        document.getElementById('preview-difficulty').textContent =
            question.difficulty <= 2 ? '基础' : question.difficulty <= 3 ? '中等' : '困难';
        document.getElementById('preview-question').textContent = question.text;

        const tipsList = document.getElementById('preview-tips');
        tipsList.innerHTML = question.tips.map(tip => `<li>${tip}</li>`).join('');

        // Store current question for practice
        this.selectedQuestion = question;

        // Show modal
        document.getElementById('practice-modal').classList.remove('hidden');
    }

    closePracticeModal() {
        document.getElementById('practice-modal').classList.add('hidden');
        this.selectedQuestion = null;
    }

    startQuestionPractice() {
        if (!this.selectedQuestion) return;

        this.practiceQuestions = [this.selectedQuestion];
        this.currentQuestion = 0;
        this.startPracticeSession();
    }

    startRandomPractice() {
        // Generate random set of questions based on current filters
        const shuffled = [...this.filteredQuestions].sort(() => 0.5 - Math.random());
        this.practiceQuestions = shuffled.slice(0, 5); // Practice 5 random questions
        this.currentQuestion = 0;
        this.startPracticeSession();
    }

    startCategoryPractice(category) {
        // Get questions from specific category
        const categoryQuestions = this.questions.filter(q => q.category === category);
        const shuffled = categoryQuestions.sort(() => 0.5 - Math.random());
        this.practiceQuestions = shuffled.slice(0, Math.min(5, shuffled.length));
        this.currentQuestion = 0;
        this.startPracticeSession();
    }

    startPracticeSession() {
        if (this.practiceQuestions.length === 0) return;

        // Close practice modal if open
        this.closePracticeModal();

        // Setup session
        const question = this.practiceQuestions[this.currentQuestion];
        document.getElementById('session-category').textContent = this.getCategoryText(question.category);
        document.getElementById('session-question').textContent = question.text;
        document.getElementById('current-question-number').textContent = this.currentQuestion + 1;
        document.getElementById('total-questions').textContent = this.practiceQuestions.length;

        // Update progress
        const progress = ((this.currentQuestion + 1) / this.practiceQuestions.length) * 100;
        document.getElementById('session-progress').style.width = `${progress}%`;

        // Reset session state
        this.isRecording = false;
        document.getElementById('session-transcript').textContent = '';
        document.getElementById('record-btn').classList.remove('recording');
        document.querySelector('.record-text').textContent = '点击开始录音';

        // Start timer
        this.sessionStartTime = Date.now();
        this.startSessionTimer();

        // Show session modal
        document.getElementById('session-modal').classList.remove('hidden');
    }

    startSessionTimer() {
        this.sessionTimer = setInterval(() => {
            const elapsed = Date.now() - this.sessionStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);

            document.getElementById('session-timer').textContent =
                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }

    toggleRecording() {
        const recordBtn = document.getElementById('record-btn');
        const recordText = document.querySelector('.record-text');
        const transcript = document.getElementById('session-transcript');

        if (!this.isRecording) {
            // Start recording
            this.isRecording = true;
            recordBtn.classList.add('recording');
            recordText.textContent = '正在录音...';

            // Simulate speech recognition
            this.simulateTranscription();
        } else {
            // Stop recording
            this.isRecording = false;
            recordBtn.classList.remove('recording');
            recordText.textContent = '点击开始录音';
        }
    }

    simulateTranscription() {
        const transcript = document.getElementById('session-transcript');
        const sampleTexts = [
            "Well, I'm passionate about this field because...",
            "I believe my background in... makes me a good fit...",
            "During my time at university, I learned that...",
            "One of my key strengths is my ability to...",
            "I'm particularly interested in this program because..."
        ];

        const text = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
        let index = 0;

        transcript.textContent = '';

        const typeInterval = setInterval(() => {
            if (index < text.length && this.isRecording) {
                transcript.textContent = text.substring(0, index + 1);
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }

    skipQuestion() {
        this.nextQuestion();
    }

    nextQuestion() {
        if (this.currentQuestion < this.practiceQuestions.length - 1) {
            this.currentQuestion++;
            this.startPracticeSession();
        } else {
            this.endPracticeSession();
        }
    }

    endPracticeSession() {
        // Stop timer
        if (this.sessionTimer) {
            clearInterval(this.sessionTimer);
            this.sessionTimer = null;
        }

        // Hide session modal
        document.getElementById('session-modal').classList.add('hidden');

        // Show completion message
        const totalTime = Date.now() - this.sessionStartTime;
        const minutes = Math.floor(totalTime / 60000);
        const seconds = Math.floor((totalTime % 60000) / 1000);

        window.speakOfferApp?.showSuccess(
            `练习完成！总用时 ${minutes}:${seconds.toString().padStart(2, '0')}`
        );

        // Reset state
        this.practiceQuestions = [];
        this.currentQuestion = 0;
        this.isRecording = false;
    }
}

// Global functions for UI interactions
function resetFilters() {
    // Reset all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = cb.name === 'type' && cb.value === 'university' ||
                      cb.name === 'country' && cb.value === '美国' ||
                      cb.name === 'major' && cb.value === '商科';
    });

    // Reset difficulty slider
    document.getElementById('difficulty').value = 3;

    // Apply filters
    if (window.practiceManager) {
        window.practiceManager.applyFilters();
    }
}

function applyFilters() {
    if (window.practiceManager) {
        window.practiceManager.applyFilters();
    }
}

function randomPractice() {
    if (window.practiceManager) {
        window.practiceManager.startRandomPractice();
    }
}

function sortQuestions() {
    if (window.practiceManager) {
        window.practiceManager.sortQuestions();
    }
}

function changeView(view) {
    if (window.practiceManager) {
        window.practiceManager.changeView(view);
    }
}

function previousPage() {
    if (window.practiceManager && window.practiceManager.currentPage > 1) {
        window.practiceManager.currentPage--;
        window.practiceManager.updatePagination();
        window.practiceManager.renderQuestions();
    }
}

function nextPage() {
    if (window.practiceManager && window.practiceManager.currentPage < window.practiceManager.totalPages) {
        window.practiceManager.currentPage++;
        window.practiceManager.updatePagination();
        window.practiceManager.renderQuestions();
    }
}

function selectCategory(category) {
    if (window.practiceManager) {
        window.practiceManager.startCategoryPractice(category);
    }
}

function openPracticeModal(questionId) {
    if (window.practiceManager) {
        window.practiceManager.openPracticeModal(questionId);
    }
}

function closePracticeModal() {
    if (window.practiceManager) {
        window.practiceManager.closePracticeModal();
    }
}

function startQuestionPractice() {
    if (window.practiceManager) {
        window.practiceManager.startQuestionPractice();
    }
}

function startQuickPractice(questionId) {
    if (window.practiceManager) {
        window.practiceManager.openPracticeModal(questionId);
    }
}

function toggleRecording() {
    if (window.practiceManager) {
        window.practiceManager.toggleRecording();
    }
}

function skipQuestion() {
    if (window.practiceManager) {
        window.practiceManager.skipQuestion();
    }
}

function nextQuestion() {
    if (window.practiceManager) {
        window.practiceManager.nextQuestion();
    }
}

function endPracticeSession() {
    if (window.practiceManager) {
        window.practiceManager.endPracticeSession();
    }
}

// Initialize practice manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'practice') {
        window.practiceManager = new PracticeManager();
    }
});