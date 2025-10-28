// Community Page JavaScript

class CommunityManager {
    constructor() {
        this.posts = [];
        this.currentFilter = 'hot';
        this.currentCategory = 'all';
        this.currentSort = 'default';
        this.currentPage = 1;
        this.postsPerPage = 10;
        this.selectedTags = [];

        this.init();
    }

    init() {
        this.loadSamplePosts();
        this.bindEvents();
        this.renderPosts();
    }

    loadSamplePosts() {
        this.posts = [
            {
                id: 1,
                title: "终于拿到哈佛商学院的offer了！分享我的面试经验",
                content: "历经半年的准备，终于收到了哈佛商学院的录取通知！想和大家分享一下我的面试经验，希望能够帮到正在准备的同学们。\n\n首先是关于面试准备的时间安排。我建议至少提前3-4个月开始准备，这样可以有充足的时间来练习和调整。我当时花了大量时间在SpeakOffer上进行模拟练习，这对我的帮助非常大...",
                author: {
                    name: "李小明",
                    avatar: "L"
                },
                category: "success",
                tags: ["哈佛", "MBA", "面试经验", "成功案例"],
                timestamp: new Date('2024-01-15T10:30:00'),
                likes: 156,
                comments: 23,
                bookmarks: 45
            },
            {
                id: 2,
                title: "英国G5申请面试的几个关键要点",
                content: "最近完成了牛津和剑桥的面试，想总结几个关键要点给大家参考：\n\n1. 深度比广度更重要 - 面试官更希望看到你对某个领域的深入思考\n2. 批判性思维 - 不要只是复述观点，要有自己的分析\n3. 保持好奇心 - 主动提问比被动回答更能体现你的思维能力\n\n具体的准备方法我会在评论中详细说明。",
                author: {
                    name: "王佳佳",
                    avatar: "W"
                },
                category: "tips",
                tags: ["英国", "G5", "牛津", "剑桥", "面试技巧"],
                timestamp: new Date('2024-01-14T15:45:00'),
                likes: 89,
                comments: 34,
                bookmarks: 67
            },
            {
                id: 3,
                title: "请教：MIT计算机系面试一般会问哪些技术问题？",
                content: "下周就要面试了，有点紧张😅 想问问有经验的学长学姐，MIT的CS面试一般会涉及哪些技术内容？\n\n我的背景：本科985计算机专业，有两段实习经历，主要做机器学习方向。GRE 325，托福 108。\n\n特别想了解：\n1. 算法题难度如何？\n2. 是否会问系统设计？\n3. 项目经历会深入到什么程度？\n\n谢谢大家！",
                author: {
                    name: "张大伟",
                    avatar: "Z"
                },
                category: "qa",
                tags: ["MIT", "计算机科学", "技术面试", "求助"],
                timestamp: new Date('2024-01-13T09:15:00'),
                likes: 45,
                comments: 18,
                bookmarks: 23
            },
            {
                id: 4,
                title: "分享一个超详细的GMAT备考资料包",
                content: "花了3个月时间整理的GMAT备考资料，包含：\n\n📚 官方指南详解\n📊 数学公式总结\n📝 作文模板和范文\n🎯 逻辑题型分析\n📈 阅读技巧总结\n\n从680到750的提分经验也在里面。需要的同学可以私信我，免费分享给大家！\n\n#留学路上我们一起加油#",
                author: {
                    name: "陈思思",
                    avatar: "C"
                },
                category: "resources",
                tags: ["GMAT", "备考资料", "免费分享", "提分经验"],
                timestamp: new Date('2024-01-12T20:30:00'),
                likes: 234,
                comments: 89,
                bookmarks: 156
            },
            {
                id: 5,
                title: "加拿大签证面试遇到的奇葩问题😂",
                content: "今天刚面完加拿大学签，分享几个让我哭笑不得的问题：\n\n签证官：你知道加拿大的国鸟是什么吗？\n我：？？？（内心OS：这和我的学术能力有什么关系）\n\n签证官：如果让你用一道菜来形容自己，你会选什么？\n我：麻婆豆腐？（现在想想真是太随意了）\n\n最后竟然过了！看来诚实和自然比标准答案更重要。",
                author: {
                    name: "刘小雨",
                    avatar: "L"
                },
                category: "tips",
                tags: ["加拿大", "签证面试", "奇葩问题", "经验分享"],
                timestamp: new Date('2024-01-11T14:20:00'),
                likes: 178,
                comments: 45,
                bookmarks: 32
            }
        ];
    }

    bindEvents() {
        // Filter tabs
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.setFilter(e.target.dataset.filter);
            });
        });

        // Category navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.setCategory(e.target.dataset.category);
            });
        });

        // Character count for post content
        const postContent = document.getElementById('post-content');
        if (postContent) {
            postContent.addEventListener('input', this.updateCharacterCount);
        }

        // Tag input
        const tagInput = document.getElementById('tag-input');
        if (tagInput) {
            tagInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.addTag();
                }
            });
        }
    }

    setFilter(filter) {
        this.currentFilter = filter;

        // Update active tab
        document.querySelectorAll('.filter-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.filter === filter);
        });

        this.renderPosts();
    }

    setCategory(category) {
        this.currentCategory = category;

        // Update active link
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.toggle('active', link.dataset.category === category);
        });

        this.renderPosts();
    }

    sortPosts(sortBy) {
        this.currentSort = sortBy;
        this.renderPosts();
    }

    filterPosts() {
        let filtered = [...this.posts];

        // Filter by category
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(post => post.category === this.currentCategory);
        }

        return filtered;
    }

    sortFilteredPosts(posts) {
        switch (this.currentSort) {
            case 'time':
                return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            case 'likes':
                return posts.sort((a, b) => b.likes - a.likes);
            case 'comments':
                return posts.sort((a, b) => b.comments - a.comments);
            default:
                // Default sorting based on filter
                if (this.currentFilter === 'hot') {
                    return posts.sort((a, b) => (b.likes + b.comments * 2) - (a.likes + a.comments * 2));
                } else if (this.currentFilter === 'latest') {
                    return posts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                }
                return posts;
        }
    }

    renderPosts() {
        const container = document.getElementById('posts-container');
        const filtered = this.filterPosts();
        const sorted = this.sortFilteredPosts(filtered);

        container.innerHTML = sorted.map(post => this.renderPostCard(post)).join('');
    }

    renderPostCard(post) {
        const timeAgo = this.getTimeAgo(post.timestamp);
        const truncatedContent = this.truncateContent(post.content, 200);
        const isLongContent = post.content.length > 200;

        return `
            <article class="post-card" data-post-id="${post.id}">
                <header class="post-header">
                    <div class="post-author-avatar">${post.author.avatar}</div>
                    <div class="post-author-info">
                        <div class="post-author-name">${post.author.name}</div>
                        <div class="post-meta">
                            <span class="post-category">${this.getCategoryLabel(post.category)}</span>
                            <span class="post-time">${timeAgo}</span>
                        </div>
                    </div>
                    <div class="post-actions-menu">
                        <button class="post-menu-btn" onclick="togglePostMenu(${post.id})">⋯</button>
                    </div>
                </header>

                <div class="post-content">
                    <h2 class="post-title">${post.title}</h2>
                    <div class="post-text ${isLongContent ? 'truncated' : ''}" id="post-text-${post.id}">
                        ${truncatedContent}
                    </div>
                    ${isLongContent ? `<span class="post-expand" onclick="expandPost(${post.id})">展开全文</span>` : ''}

                    ${post.tags.length > 0 ? `
                        <div class="post-tags">
                            ${post.tags.map(tag => `<a href="#" class="post-tag"># ${tag}</a>`).join('')}
                        </div>
                    ` : ''}
                </div>

                <footer class="post-footer">
                    <button class="post-action" onclick="toggleLike(${post.id})">
                        <span class="action-icon">👍</span>
                        <span class="action-count">${post.likes}</span>
                    </button>
                    <button class="post-action" onclick="openComments(${post.id})">
                        <span class="action-icon">💬</span>
                        <span class="action-count">${post.comments}</span>
                    </button>
                    <button class="post-action" onclick="toggleBookmark(${post.id})">
                        <span class="action-icon">🔖</span>
                        <span class="action-count">${post.bookmarks}</span>
                    </button>
                    <button class="post-action" onclick="sharePost(${post.id})">
                        <span class="action-icon">📤</span>
                        <span class="action-count">分享</span>
                    </button>
                </footer>
            </article>
        `;
    }

    getCategoryLabel(category) {
        const labels = {
            'success': '成功案例',
            'tips': '面试技巧',
            'qa': '问答求助',
            'resources': '资源分享'
        };
        return labels[category] || category;
    }

    getTimeAgo(timestamp) {
        const now = new Date();
        const diffTime = Math.abs(now - timestamp);
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        if (diffMinutes < 60) {
            return `${diffMinutes} 分钟前`;
        } else if (diffHours < 24) {
            return `${diffHours} 小时前`;
        } else if (diffDays < 7) {
            return `${diffDays} 天前`;
        } else {
            return timestamp.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
        }
    }

    truncateContent(content, maxLength) {
        if (content.length <= maxLength) return content;
        return content.substring(0, maxLength) + '...';
    }

    expandPost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const textElement = document.getElementById(`post-text-${postId}`);
        const expandButton = textElement.nextElementSibling;

        textElement.textContent = post.content;
        textElement.classList.remove('truncated');
        if (expandButton && expandButton.classList.contains('post-expand')) {
            expandButton.remove();
        }
    }

    toggleLike(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const button = document.querySelector(`[data-post-id="${postId}"] .post-action`);
        const isLiked = button.classList.contains('liked');

        if (isLiked) {
            post.likes--;
            button.classList.remove('liked');
        } else {
            post.likes++;
            button.classList.add('liked');
        }

        button.querySelector('.action-count').textContent = post.likes;
    }

    toggleBookmark(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        const buttons = document.querySelectorAll(`[data-post-id="${postId}"] .post-action`);
        const bookmarkButton = Array.from(buttons).find(btn =>
            btn.querySelector('.action-icon').textContent === '🔖'
        );

        const isBookmarked = bookmarkButton.classList.contains('bookmarked');

        if (isBookmarked) {
            post.bookmarks--;
            bookmarkButton.classList.remove('bookmarked');
            window.speakOfferApp?.showSuccess('已取消收藏');
        } else {
            post.bookmarks++;
            bookmarkButton.classList.add('bookmarked');
            window.speakOfferApp?.showSuccess('已添加到收藏');
        }

        bookmarkButton.querySelector('.action-count').textContent = post.bookmarks;
    }

    sharePost(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        if (navigator.share) {
            navigator.share({
                title: post.title,
                text: post.content.substring(0, 100) + '...',
                url: `${window.location.origin}/community.html#post-${postId}`
            });
        } else {
            // Fallback: copy to clipboard
            const url = `${window.location.origin}/community.html#post-${postId}`;
            navigator.clipboard.writeText(url).then(() => {
                window.speakOfferApp?.showSuccess('链接已复制到剪贴板');
            });
        }
    }

    openComments(postId) {
        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        // Populate original post in modal
        document.getElementById('original-post').innerHTML = this.renderPostCard(post);

        // Load comments (sample data)
        this.loadComments(postId);

        // Show modal
        document.getElementById('comment-modal').classList.remove('hidden');
    }

    loadComments(postId) {
        // Sample comments data
        const comments = [
            {
                id: 1,
                author: { name: '小明同学', avatar: 'X' },
                content: '非常感谢分享！我也在准备哈佛的申请，你的经验对我很有帮助。',
                timestamp: new Date('2024-01-15T11:00:00')
            },
            {
                id: 2,
                author: { name: '学霸小王', avatar: 'W' },
                content: '请问你在SpeakOffer上主要练习了哪些类型的题目？',
                timestamp: new Date('2024-01-15T11:30:00')
            }
        ];

        document.getElementById('comment-count').textContent = comments.length;

        const commentsList = document.getElementById('comments-list');
        commentsList.innerHTML = comments.map(comment => `
            <div class="comment-item">
                <div class="comment-avatar">${comment.author.avatar}</div>
                <div class="comment-content">
                    <div class="comment-author">${comment.author.name}</div>
                    <div class="comment-text">${comment.content}</div>
                    <div class="comment-time">${this.getTimeAgo(comment.timestamp)}</div>
                </div>
            </div>
        `).join('');
    }

    closeCommentModal() {
        document.getElementById('comment-modal').classList.add('hidden');
    }

    submitComment(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const comment = formData.get('comment');

        if (!comment.trim()) return;

        // Add comment to list (simulate)
        const commentsList = document.getElementById('comments-list');
        const newComment = document.createElement('div');
        newComment.className = 'comment-item';
        newComment.innerHTML = `
            <div class="comment-avatar">U</div>
            <div class="comment-content">
                <div class="comment-author">我</div>
                <div class="comment-text">${comment}</div>
                <div class="comment-time">刚刚</div>
            </div>
        `;

        commentsList.appendChild(newComment);

        // Update comment count
        const countElement = document.getElementById('comment-count');
        countElement.textContent = parseInt(countElement.textContent) + 1;

        // Clear form
        event.target.reset();

        window.speakOfferApp?.showSuccess('评论发表成功！');
    }

    // Post creation methods
    openPostModal() {
        document.getElementById('post-modal').classList.remove('hidden');
    }

    closePostModal() {
        document.getElementById('post-modal').classList.add('hidden');
        this.selectedTags = [];
        document.getElementById('selected-tags').innerHTML = '';
        document.querySelector('.post-form').reset();
    }

    updateCharacterCount() {
        const content = document.getElementById('post-content').value;
        document.getElementById('content-count').textContent = content.length;
    }

    addTag() {
        const input = document.getElementById('tag-input');
        const tag = input.value.trim();

        if (!tag || this.selectedTags.includes(tag) || this.selectedTags.length >= 5) {
            if (this.selectedTags.length >= 5) {
                window.speakOfferApp?.showWarning('最多只能添加5个标签');
            }
            return;
        }

        this.selectedTags.push(tag);
        input.value = '';

        this.renderSelectedTags();
    }

    removeTag(tag) {
        this.selectedTags = this.selectedTags.filter(t => t !== tag);
        this.renderSelectedTags();
    }

    renderSelectedTags() {
        const container = document.getElementById('selected-tags');
        container.innerHTML = this.selectedTags.map(tag => `
            <span class="selected-tag">
                ${tag}
                <button type="button" class="tag-remove" onclick="communityManager.removeTag('${tag}')">×</button>
            </span>
        `).join('');
    }

    submitPost(event) {
        event.preventDefault();
        const formData = new FormData(event.target);

        const newPost = {
            id: Date.now(),
            title: formData.get('title'),
            content: formData.get('content'),
            category: formData.get('category'),
            tags: [...this.selectedTags],
            author: {
                name: '我',
                avatar: 'U'
            },
            timestamp: new Date(),
            likes: 0,
            comments: 0,
            bookmarks: 0
        };

        this.posts.unshift(newPost);
        this.renderPosts();
        this.closePostModal();

        window.speakOfferApp?.showSuccess('动态发布成功！');
    }

    loadMorePosts() {
        // Simulate loading more posts
        window.speakOfferApp?.showInfo('已加载全部内容');
    }
}

// Global functions for UI interactions
function sortPosts(sortBy) {
    if (window.communityManager) {
        window.communityManager.sortPosts(sortBy);
    }
}

function expandPost(postId) {
    if (window.communityManager) {
        window.communityManager.expandPost(postId);
    }
}

function toggleLike(postId) {
    if (window.communityManager) {
        window.communityManager.toggleLike(postId);
    }
}

function toggleBookmark(postId) {
    if (window.communityManager) {
        window.communityManager.toggleBookmark(postId);
    }
}

function sharePost(postId) {
    if (window.communityManager) {
        window.communityManager.sharePost(postId);
    }
}

function openComments(postId) {
    if (window.communityManager) {
        window.communityManager.openComments(postId);
    }
}

function closeCommentModal() {
    if (window.communityManager) {
        window.communityManager.closeCommentModal();
    }
}

function submitComment(event) {
    if (window.communityManager) {
        window.communityManager.submitComment(event);
    }
}

function openPostModal() {
    if (window.communityManager) {
        window.communityManager.openPostModal();
    }
}

function closePostModal() {
    if (window.communityManager) {
        window.communityManager.closePostModal();
    }
}

function addTag() {
    if (window.communityManager) {
        window.communityManager.addTag();
    }
}

function handleTagInput(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        addTag();
    }
}

function submitPost(event) {
    if (window.communityManager) {
        window.communityManager.submitPost(event);
    }
}

function loadMorePosts() {
    if (window.communityManager) {
        window.communityManager.loadMorePosts();
    }
}

function togglePostMenu(postId) {
    // Placeholder for post menu functionality
    console.log('Post menu for post', postId);
}

// Initialize community manager when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.body.dataset.page === 'community') {
        window.communityManager = new CommunityManager();

        // Update character count function reference
        const postContent = document.getElementById('post-content');
        if (postContent) {
            postContent.addEventListener('input', window.communityManager.updateCharacterCount);
        }
    }
});