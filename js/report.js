// Report Page JavaScript

class ReportManager {
    constructor() {
        this.reportData = null;
        this.init();
    }

    init() {
        this.loadReportData();
        this.bindEvents();
        this.animateScores();
    }

    loadReportData() {
        // Try to load from localStorage first (from interview session)
        const storedData = localStorage.getItem('latest_interview');

        if (storedData) {
            this.reportData = JSON.parse(storedData);
            this.populateReportData();
        } else {
            // Load sample data for demonstration
            this.loadSampleData();
        }
    }

    loadSampleData() {
        this.reportData = {
            id: 'sample_interview',
            timestamp: new Date().toISOString(),
            duration: 754000, // 12:34 in milliseconds
            type: '大学申请面试',
            school: '哈佛大学 · 商科',
            questionsAnswered: 5,
            totalQuestions: 5,
            overallScore: 8.5,
            scores: {
                communication: 9.0,
                knowledge: 8.0,
                confidence: 8.5,
                cultural: 7.5
            },
            detailScores: {
                communication: {
                    fluency: 9.2,
                    accuracy: 8.8,
                    vocabulary: 9.1
                },
                knowledge: {
                    structure: 8.3,
                    argumentation: 7.6,
                    depth: 8.1
                },
                confidence: {
                    tone: 8.7,
                    eyeContact: 8.2,
                    posture: 8.6
                },
                cultural: {
                    understanding: 7.8,
                    expression: 7.2,
                    interaction: 7.5
                }
            },
            questionAnalysis: [
                {
                    id: 1,
                    question: "Can you tell me a bit about yourself and why you're interested in studying business?",
                    score: 8.8,
                    strengths: [
                        "结构清晰，从个人背景到专业兴趣层次递进",
                        "举例具体，提到了具体的商业案例和学习经历",
                        "展现了对商业的深度理解和长远规划"
                    ],
                    improvements: [
                        "可以更多地结合目标学校的特色课程或项目",
                        "建议增加个人独特经历或观点的阐述"
                    ]
                },
                {
                    id: 2,
                    question: "Can you share a specific example of a time when you demonstrated leadership skills?",
                    score: 9.1,
                    strengths: [
                        "使用STAR方法，情况-任务-行动-结果结构完整",
                        "具体数据支撑，量化了领导成果",
                        "展现了团队协作和冲突解决能力"
                    ],
                    improvements: []
                },
                {
                    id: 3,
                    question: "What do you see as the biggest challenges facing the business world today?",
                    score: 7.6,
                    strengths: [
                        "识别了多个重要的商业挑战",
                        "展现了对当前商业环境的关注和理解"
                    ],
                    improvements: [
                        "可以更深入地分析某一个具体挑战",
                        "建议提供更具体的解决思路或个人见解",
                        "加强与个人经验或学术背景的联系"
                    ]
                }
            ],
            feedback: {
                immediate: [
                    "增强文化适应性：建议了解更多目标国家的商业文化和教育特色，在回答中体现出对当地文化的理解和适应能力。",
                    "丰富举例内容：在回答问题时，可以准备更多具体、生动的个人经历作为例证，增加说服力。",
                    "优化表达节奏：适当控制语速，在关键信息处稍作停顿，帮助听众更好地理解和记忆。"
                ],
                longterm: [
                    "深化专业知识：继续关注商业领域的最新发展和理论，建立更深层的专业理解。",
                    "扩展国际视野：多关注国际商业案例和跨文化管理实践，提升全球化思维。",
                    "练习即兴表达：定期进行即兴演讲练习，提升在压力环境下的表达能力。"
                ]
            }
        };

        this.populateReportData();
    }

    populateReportData() {
        if (!this.reportData) return;

        // Update header information
        document.getElementById('report-date').textContent = this.formatDate(this.reportData.timestamp);
        document.getElementById('report-school').textContent = this.reportData.school || '面试练习';
        document.getElementById('report-duration').textContent = this.formatDuration(this.reportData.duration);
        document.getElementById('overall-score').textContent = this.reportData.overallScore;

        // Update star rating
        this.updateStarRating(this.reportData.overallScore);

        // Update detailed scores
        if (this.reportData.scores) {
            Object.keys(this.reportData.scores).forEach(key => {
                const element = document.getElementById(`score-${key}`);
                if (element) {
                    element.textContent = this.reportData.scores[key];
                }
            });
        }

        // Update feedback
        this.updateFeedback();

        // Update question analysis
        this.updateQuestionAnalysis();
    }

    formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    formatDuration(ms) {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }

    updateStarRating(score) {
        const stars = document.querySelectorAll('.star');
        const fullStars = Math.floor(score / 2);
        const hasHalfStar = (score % 2) >= 1;

        stars.forEach((star, index) => {
            star.className = 'star';
            if (index < fullStars) {
                star.classList.add('filled');
            } else if (index === fullStars && hasHalfStar) {
                star.classList.add('half');
            }
        });

        // Update rating text
        const ratingText = document.querySelector('.rating-text');
        if (score >= 9) {
            ratingText.textContent = '卓越表现';
        } else if (score >= 8) {
            ratingText.textContent = '优秀表现';
        } else if (score >= 7) {
            ratingText.textContent = '良好表现';
        } else if (score >= 6) {
            ratingText.textContent = '一般表现';
        } else {
            ratingText.textContent = '需要改进';
        }
    }

    updateFeedback() {
        if (!this.reportData.feedback) return;

        const feedbackList = document.getElementById('feedback-list');
        if (feedbackList && this.reportData.feedback.immediate) {
            feedbackList.innerHTML = this.reportData.feedback.immediate.map(item => `
                <li class="feedback-item">
                    <strong>${item.split('：')[0]}：</strong>
                    ${item.split('：')[1] || item}
                </li>
            `).join('');
        }

        // Update long-term feedback
        const longtermList = document.querySelector('.feedback-category:last-child .feedback-list');
        if (longtermList && this.reportData.feedback.longterm) {
            longtermList.innerHTML = this.reportData.feedback.longterm.map(item => `
                <li class="feedback-item">
                    <strong>${item.split('：')[0]}：</strong>
                    ${item.split('：')[1] || item}
                </li>
            `).join('');
        }
    }

    updateQuestionAnalysis() {
        if (!this.reportData.questionAnalysis) return;

        const questionsList = document.querySelector('.questions-list');
        if (!questionsList) return;

        // Clear existing content except first 3 questions (which are in HTML)
        const existingCards = questionsList.querySelectorAll('.question-card');

        // Only show the first 3 questions for demo
        const questionsToShow = this.reportData.questionAnalysis.slice(0, 3);

        // Update existing cards with actual data
        existingCards.forEach((card, index) => {
            if (index < questionsToShow.length) {
                const question = questionsToShow[index];
                this.updateQuestionCard(card, question, index + 1);
            }
        });
    }

    updateQuestionCard(card, questionData, questionNumber) {
        const title = card.querySelector('.question-title');
        const score = card.querySelector('.score');
        const questionText = card.querySelector('.question-text');
        const strengths = card.querySelector('.analysis-list.positive');
        const improvements = card.querySelector('.analysis-list.improvement');

        if (title) {
            title.textContent = `Q${questionNumber}: ${this.getQuestionTitle(questionData.question)}`;
        }

        if (score) {
            score.textContent = questionData.score;
        }

        if (questionText) {
            questionText.textContent = `"${questionData.question}"`;
        }

        if (strengths && questionData.strengths) {
            strengths.innerHTML = questionData.strengths.map(item => `<li>${item}</li>`).join('');
        }

        if (improvements && questionData.improvements && questionData.improvements.length > 0) {
            const improvementSection = improvements.closest('.analysis-section');
            if (improvementSection) {
                improvementSection.style.display = 'block';
                improvements.innerHTML = questionData.improvements.map(item => `<li>${item}</li>`).join('');
            }
        } else {
            const improvementSection = card.querySelector('.analysis-list.improvement')?.closest('.analysis-section');
            if (improvementSection) {
                improvementSection.style.display = 'none';
            }
        }
    }

    getQuestionTitle(questionText) {
        if (questionText.includes('about yourself')) {
            return '自我介绍';
        } else if (questionText.includes('leadership')) {
            return '领导力经验';
        } else if (questionText.includes('challenges')) {
            return '商业挑战分析';
        } else if (questionText.includes('university')) {
            return '选校原因';
        } else if (questionText.includes('questions for me')) {
            return '反向提问';
        } else {
            return '面试问题';
        }
    }

    animateScores() {
        // Animate progress bars
        setTimeout(() => {
            const progressBars = document.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const targetWidth = bar.style.width;
                bar.style.width = '0%';
                setTimeout(() => {
                    bar.style.width = targetWidth;
                }, 100);
            });
        }, 500);

        // Animate score numbers
        this.animateNumbers();
    }

    animateNumbers() {
        const scoreElements = document.querySelectorAll('.score-number, .score-value');

        scoreElements.forEach(element => {
            const targetValue = parseFloat(element.textContent);
            if (isNaN(targetValue)) return;

            let currentValue = 0;
            const increment = targetValue / 30; // Animation duration
            const timer = setInterval(() => {
                currentValue += increment;
                if (currentValue >= targetValue) {
                    currentValue = targetValue;
                    clearInterval(timer);
                }
                element.textContent = currentValue.toFixed(1);
            }, 50);
        });
    }

    bindEvents() {
        // Share report functionality
        window.shareReport = () => {
            if (navigator.share) {
                navigator.share({
                    title: 'SpeakOffer 面试报告',
                    text: `我在SpeakOffer获得了${this.reportData.overallScore}分的面试成绩！`,
                    url: window.location.href
                }).catch(console.error);
            } else {
                // Fallback: copy to clipboard
                this.copyReportSummary();
            }
        };

        // Print functionality is handled by browser
        // Additional print styling is in CSS @media print rules
    }

    copyReportSummary() {
        const summary = `SpeakOffer 面试报告

总分: ${this.reportData.overallScore}/10
面试类型: ${this.reportData.type || '面试练习'}
日期: ${this.formatDate(this.reportData.timestamp)}

主要表现:
- 语言表达: ${this.reportData.scores?.communication || 'N/A'}/10
- 逻辑思维: ${this.reportData.scores?.knowledge || 'N/A'}/10
- 自信表现: ${this.reportData.scores?.confidence || 'N/A'}/10
- 文化适应: ${this.reportData.scores?.cultural || 'N/A'}/10

通过SpeakOffer提升你的面试技能！`;

        navigator.clipboard.writeText(summary).then(() => {
            window.speakOfferApp?.showSuccess('报告摘要已复制到剪贴板');
        }).catch(() => {
            window.speakOfferApp?.showError('复制失败，请手动选择内容');
        });
    }

    // Export report data for further analysis
    exportData() {
        return {
            reportId: this.reportData.id,
            timestamp: this.reportData.timestamp,
            overallScore: this.reportData.overallScore,
            scores: this.reportData.scores,
            summary: this.generateSummary()
        };
    }

    generateSummary() {
        const strengths = [];
        const improvements = [];

        if (this.reportData.scores) {
            Object.entries(this.reportData.scores).forEach(([key, score]) => {
                if (score >= 8.5) {
                    strengths.push(this.getScoreLabel(key));
                } else if (score < 7.5) {
                    improvements.push(this.getScoreLabel(key));
                }
            });
        }

        return {
            strengths,
            improvements,
            recommendation: this.getOverallRecommendation()
        };
    }

    getScoreLabel(key) {
        const labels = {
            communication: '语言表达',
            knowledge: '逻辑思维',
            confidence: '自信表现',
            cultural: '文化适应'
        };
        return labels[key] || key;
    }

    getOverallRecommendation() {
        const score = this.reportData.overallScore;

        if (score >= 9) {
            return '表现卓越！继续保持高水准，可以尝试挑战更高难度的面试场景。';
        } else if (score >= 8) {
            return '表现优秀！继续加强薄弱环节，有望达到顶尖水平。';
        } else if (score >= 7) {
            return '表现良好，建议针对性练习评分较低的维度。';
        } else if (score >= 6) {
            return '还有较大提升空间，建议系统性地进行面试技巧训练。';
        } else {
            return '建议从基础开始，多进行面试练习并寻求专业指导。';
        }
    }
}

// Initialize report manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'report') {
        window.reportManager = new ReportManager();
    }
});

// Additional utility functions for report interactions
function regenerateReport() {
    if (window.reportManager && window.reportManager.reportData) {
        window.reportManager.animateScores();
        window.speakOfferApp?.showSuccess('报告已刷新');
    }
}

function downloadReport() {
    // This would trigger a PDF download in a real application
    window.print();
}

function scheduleFollowUp() {
    // This would integrate with calendar API in a real application
    window.speakOfferApp?.showInfo('提醒功能即将上线，敬请期待！');
}