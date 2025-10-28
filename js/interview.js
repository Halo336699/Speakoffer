// Interview Page JavaScript

class InterviewManager {
    constructor() {
        this.currentPhase = 'setup'; // setup, session, completed
        this.interviewTimer = null;
        this.startTime = null;
        this.currentQuestion = 0;
        this.totalQuestions = 5;
        this.isRecording = false;
        this.mediaRecorder = null;
        this.userStream = null;
        this.questions = [];
        this.responses = [];

        this.init();
    }

    init() {
        this.bindEvents();
        this.loadQuestions();
    }

    bindEvents() {
        // Setup form
        const setupForm = document.getElementById('setup-form');
        if (setupForm) {
            setupForm.addEventListener('submit', this.handleSetupSubmit.bind(this));
        }

        // Camera controls
        const enableCameraBtn = document.getElementById('enable-camera');
        if (enableCameraBtn) {
            enableCameraBtn.addEventListener('click', this.enableCamera.bind(this));
        }

        // Mic controls
        const micToggle = document.getElementById('mic-toggle');
        if (micToggle) {
            micToggle.addEventListener('click', this.toggleMicrophone.bind(this));
        }

        // Session controls
        const pauseBtn = document.getElementById('pause-btn');
        const endBtn = document.getElementById('end-btn');

        if (pauseBtn) {
            pauseBtn.addEventListener('click', this.pauseInterview.bind(this));
        }

        if (endBtn) {
            endBtn.addEventListener('click', this.endInterview.bind(this));
        }

        // Report button
        const viewReportBtn = document.getElementById('view-report-btn');
        if (viewReportBtn) {
            viewReportBtn.addEventListener('click', this.viewReport.bind(this));
        }
    }

    loadQuestions() {
        // Sample questions - in real app, this would come from API
        this.questions = [
            {
                id: 1,
                text: "Hello! Welcome to your interview. I'm excited to learn more about you. Let's start with a simple question: Can you tell me a bit about yourself and why you're interested in studying business?",
                subtitle: "Take your time and speak naturally. I'm listening."
            },
            {
                id: 2,
                text: "That's interesting! Can you share a specific example of a time when you demonstrated leadership skills?",
                subtitle: "Focus on a concrete situation and the impact you made."
            },
            {
                id: 3,
                text: "What do you see as the biggest challenges facing the business world today, and how do you think your generation can address them?",
                subtitle: "Feel free to draw on your experiences and observations."
            },
            {
                id: 4,
                text: "Why have you chosen our university specifically? What aspects of our program align with your goals?",
                subtitle: "Show us you've done your research."
            },
            {
                id: 5,
                text: "Finally, do you have any questions for me about our program or university?",
                subtitle: "This is your chance to show your genuine interest."
            }
        ];
    }

    async handleSetupSubmit(e) {
        e.preventDefault();

        const formData = new FormData(e.target);
        const setupData = {
            interviewType: formData.get('interviewType'),
            targetCountry: formData.get('targetCountry'),
            targetMajor: formData.get('targetMajor'),
            difficulty: formData.get('difficulty'),
            interviewLanguage: formData.get('interviewLanguage')
        };

        // Validate required fields
        if (!setupData.interviewType || !setupData.targetCountry) {
            window.speakOfferApp.showError('请填写所有必填字段');
            return;
        }

        // Show loading
        const submitBtn = e.target.querySelector('[type="submit"]');
        window.speakOfferApp.showLoading(e.target);

        try {
            // Simulate API call to customize interview
            await this.delay(1000);

            // Customize AI interviewer based on selection
            this.customizeInterviewer(setupData);

            // Start interview session
            this.startInterviewSession(setupData);

        } catch (error) {
            window.speakOfferApp.showError('启动面试失败，请重试');
        } finally {
            window.speakOfferApp.hideLoading(e.target);
        }
    }

    customizeInterviewer(setupData) {
        // Update AI interviewer info based on setup
        const aiName = document.querySelector('.ai-name');
        const aiRole = document.querySelector('.ai-role');
        const sessionType = document.getElementById('session-type');
        const sessionSchool = document.getElementById('session-school');

        if (setupData.targetCountry === '美国') {
            aiName.textContent = 'Dr. Smith';
            aiRole.textContent = 'Harvard Admission Officer';
        } else if (setupData.targetCountry === '英国') {
            aiName.textContent = 'Professor Johnson';
            aiRole.textContent = 'Oxford University Representative';
        } else {
            aiName.textContent = 'Dr. Anderson';
            aiRole.textContent = 'International Admission Officer';
        }

        sessionType.textContent = this.getInterviewTypeText(setupData.interviewType);
        sessionSchool.textContent = `${setupData.targetCountry}${setupData.targetMajor ? ' · ' + setupData.targetMajor : ''}`;
    }

    getInterviewTypeText(type) {
        const types = {
            'university': '大学申请面试',
            'scholarship': '奖学金面试',
            'visa': '签证面试',
            'graduate': '研究生面试'
        };
        return types[type] || '面试';
    }

    startInterviewSession(setupData) {
        // Hide setup, show session
        document.getElementById('interview-setup').classList.add('hidden');
        document.getElementById('interview-session').classList.remove('hidden');

        this.currentPhase = 'session';
        this.startTime = Date.now();
        this.currentQuestion = 0;

        // Start timer
        this.startTimer();

        // Show first question
        this.showCurrentQuestion();

        // Initialize media if permissions allow
        this.initializeMedia();

        // Show initial feedback
        setTimeout(() => {
            this.showRealtimeFeedback();
        }, 3000);
    }

    startTimer() {
        this.interviewTimer = setInterval(() => {
            const elapsed = Date.now() - this.startTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);

            const display = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            document.getElementById('timer-display').textContent = display;
        }, 1000);
    }

    showCurrentQuestion() {
        const question = this.questions[this.currentQuestion];
        if (!question) return;

        document.getElementById('current-question').textContent = question.text;
        document.getElementById('question-subtitle').textContent = question.subtitle;
        document.querySelector('.question-number').textContent = `Question ${this.currentQuestion + 1}`;

        // Update progress
        const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = `${this.currentQuestion + 1} / ${this.totalQuestions} questions`;

        // Show speaking indicator
        this.showAISpeaking();
    }

    showAISpeaking() {
        const indicator = document.getElementById('speaking-indicator');
        indicator.classList.remove('hidden');

        // Hide after simulated speaking time
        setTimeout(() => {
            indicator.classList.add('hidden');
        }, 3000);
    }

    async initializeMedia() {
        try {
            // Request camera permission
            this.userStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            const video = document.getElementById('user-video');
            const placeholder = document.getElementById('video-placeholder');

            video.srcObject = this.userStream;
            placeholder.style.display = 'none';

            // Initialize audio level monitoring
            this.initializeAudioLevel();

        } catch (error) {
            console.log('Media access denied or unavailable');
        }
    }

    async enableCamera() {
        await this.initializeMedia();
    }

    initializeAudioLevel() {
        if (!this.userStream) return;

        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyzer = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(this.userStream);
        const dataArray = new Uint8Array(analyzer.frequencyBinCount);

        microphone.connect(analyzer);
        analyzer.fftSize = 256;

        const updateLevel = () => {
            analyzer.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
            const percentage = (average / 255) * 100;

            document.querySelector('.level-bar').style.width = `${percentage}%`;

            if (this.isRecording) {
                requestAnimationFrame(updateLevel);
            }
        };

        updateLevel();
    }

    toggleMicrophone() {
        const micBtn = document.getElementById('mic-toggle');
        const micStatus = document.getElementById('mic-status');

        if (!this.isRecording) {
            // Start recording
            this.startRecording();
            micBtn.classList.add('recording');
            micStatus.textContent = '正在录音...';
        } else {
            // Stop recording
            this.stopRecording();
            micBtn.classList.remove('recording');
            micStatus.textContent = '准备就绪';
        }
    }

    async startRecording() {
        if (!this.userStream) {
            await this.initializeMedia();
        }

        if (this.userStream) {
            this.mediaRecorder = new MediaRecorder(this.userStream);
            this.mediaRecorder.start();
            this.isRecording = true;

            // Simulate speech recognition
            this.simulateSpeechRecognition();
        }
    }

    stopRecording() {
        if (this.mediaRecorder && this.isRecording) {
            this.mediaRecorder.stop();
            this.isRecording = false;

            // Process response and move to next question
            setTimeout(() => {
                this.processResponse();
            }, 1000);
        }
    }

    simulateSpeechRecognition() {
        const transcript = document.getElementById('transcript');
        const sampleTexts = [
            "Well, I'm really passionate about business because...",
            "I believe that my experience in leading the student council...",
            "One specific example I can share is when I organized...",
            "I think the biggest challenge in business today is...",
            "I chose this university because of its excellent reputation..."
        ];

        const text = sampleTexts[this.currentQuestion] || "Thank you for that question...";
        let index = 0;

        // Clear placeholder
        transcript.innerHTML = '';

        const typeInterval = setInterval(() => {
            if (index < text.length && this.isRecording) {
                transcript.textContent = text.substring(0, index + 1);
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 50);
    }

    processResponse() {
        // Simulate processing the response
        const responses = [
            "Excellent answer! I can see your passion for business.",
            "Great example of leadership. Very impressive.",
            "Thoughtful analysis of current business challenges.",
            "I can tell you've researched our program thoroughly.",
            "Thank you for those insightful questions."
        ];

        // Record response
        this.responses.push({
            questionId: this.currentQuestion + 1,
            response: document.getElementById('transcript').textContent,
            timestamp: Date.now() - this.startTime
        });

        // Move to next question or end interview
        if (this.currentQuestion < this.totalQuestions - 1) {
            this.currentQuestion++;
            setTimeout(() => {
                this.showCurrentQuestion();
            }, 2000);
        } else {
            setTimeout(() => {
                this.completeInterview();
            }, 2000);
        }
    }

    showRealtimeFeedback() {
        const feedback = document.getElementById('realtime-feedback');
        feedback.classList.remove('hidden');

        // Simulate different feedback based on progress
        const feedbacks = [
            [
                { type: 'positive', icon: '👍', text: '语音清晰度很好' },
                { type: 'neutral', icon: '💡', text: '建议保持眼神接触' }
            ],
            [
                { type: 'positive', icon: '⭐', text: '回答结构清晰' },
                { type: 'positive', icon: '🎯', text: '举例恰当具体' }
            ],
            [
                { type: 'neutral', icon: '💡', text: '可以放慢语速' },
                { type: 'positive', icon: '👏', text: '思维逻辑性强' }
            ]
        ];

        const currentFeedback = feedbacks[Math.min(this.currentQuestion, feedbacks.length - 1)];
        this.updateFeedbackDisplay(currentFeedback);
    }

    updateFeedbackDisplay(feedbackItems) {
        const container = document.querySelector('.feedback-items');
        container.innerHTML = feedbackItems.map(item => `
            <div class="feedback-item ${item.type}">
                <span class="feedback-icon">${item.icon}</span>
                <span class="feedback-text">${item.text}</span>
            </div>
        `).join('');
    }

    pauseInterview() {
        if (this.interviewTimer) {
            clearInterval(this.interviewTimer);
            this.interviewTimer = null;
        }

        // Pause recording if active
        if (this.isRecording) {
            this.stopRecording();
        }

        window.speakOfferApp.showWarning('面试已暂停');
    }

    endInterview() {
        if (confirm('确定要结束面试吗？你可以稍后查看报告。')) {
            this.completeInterview();
        }
    }

    completeInterview() {
        // Stop timer
        if (this.interviewTimer) {
            clearInterval(this.interviewTimer);
        }

        // Stop media
        if (this.userStream) {
            this.userStream.getTracks().forEach(track => track.stop());
        }

        // Calculate final stats
        const finalDuration = this.formatDuration(Date.now() - this.startTime);
        const questionsAnswered = this.responses.length;
        const preliminaryScore = (8 + Math.random() * 1.5).toFixed(1); // Simulate score

        // Update completion stats
        document.getElementById('final-duration').textContent = finalDuration;
        document.getElementById('final-questions').textContent = `${questionsAnswered} 题`;
        document.getElementById('preliminary-score').textContent = preliminaryScore;

        // Show completion screen
        document.getElementById('interview-session').classList.add('hidden');
        document.getElementById('interview-completed').classList.remove('hidden');

        this.currentPhase = 'completed';

        // Simulate report generation
        this.generateReport();
    }

    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    async generateReport() {
        const generationText = document.getElementById('generation-text');
        const viewReportBtn = document.getElementById('view-report-btn');

        const steps = [
            '分析语音表现...',
            '评估回答质量...',
            '生成改进建议...',
            '编制详细报告...',
            '报告生成完成！'
        ];

        for (let i = 0; i < steps.length; i++) {
            generationText.textContent = steps[i];
            await this.delay(600);
        }

        // Enable report button
        viewReportBtn.disabled = false;
        viewReportBtn.textContent = '查看详细报告';

        // Store interview data for report
        this.storeInterviewData();
    }

    storeInterviewData() {
        const interviewData = {
            id: 'interview_' + Date.now(),
            timestamp: new Date().toISOString(),
            duration: Date.now() - this.startTime,
            questionsAnswered: this.responses.length,
            totalQuestions: this.totalQuestions,
            responses: this.responses,
            preliminaryScore: document.getElementById('preliminary-score').textContent
        };

        // Store in localStorage for report page
        localStorage.setItem('latest_interview', JSON.stringify(interviewData));
    }

    viewReport() {
        window.location.href = 'report.html';
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize interview manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'interview') {
        window.interviewManager = new InterviewManager();
    }
});