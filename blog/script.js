document.addEventListener('DOMContentLoaded', function() {
    // Get current blog from URL
    function getBlogSlugFromURL() {
        // const path = window.location.pathname;
        // const match = path.match(/blog\/([^/]+)/);
        // return match ? match[1] : null;
        if (window.location.hash) {
            return window.location.hash.substring(1); // Remove #
        }
        return null;
    }

    // Show blog listing or single post based on URL
    function routePage() {
        const slug = getBlogSlugFromURL();
        
        if (slug && slug !== 'index.html') {
            showSinglePost(slug);
        } else {
            showBlogListing();
        }
    }

    // Show blog listing
    function showBlogListing() {
        document.getElementById('blogListing').style.display = 'block';
        document.getElementById('singlePost').style.display = 'none';
        initializeCarousel();
        renderCategoryFilters();
        renderBlogGrid(blogData);
    }

    // Show single post
    function showSinglePost(slug) {
        const post = blogData.find(blog => blog.slug === slug);
        
        if (!post) {
            showBlogListing();
            return;
        }
        
        document.getElementById('blogListing').style.display = 'none';
        document.getElementById('singlePost').style.display = 'block';
        
        // Populate post data
        document.getElementById('postCategory').textContent = post.category;
        document.getElementById('postDate').textContent = formatDate(post.date);
        document.getElementById('postReadTime').textContent = post.readTime + ' de leitura';
        document.getElementById('postTitle').textContent = post.title;
        document.getElementById('postAuthor').textContent = post.author;
        document.getElementById('postImage').src = post.image;
        document.getElementById('postImage').alt = post.title;
        document.getElementById('postContent').innerHTML = post.content;
        
        // Render related posts
        renderRelatedPosts(post);
        
        // Setup share buttons
        setupShareButtons(post);
        
        // Scroll to top
        window.scrollTo(0, 0);
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    }

    // Initialize carousel
    let currentSlide = 0;
    let carouselInterval;

    function initializeCarousel() {
        const featuredBlogs = blogData.filter(blog => blog.featured);
        const track = document.getElementById('carouselTrack');
        
        track.innerHTML = featuredBlogs.map(blog => `
            <div class="carousel-slide" data-slug="${blog.slug}">
                <img src="${blog.image}" alt="${blog.title}">
                <div class="carousel-content">
                    <span class="carousel-category">${blog.category}</span>
                    <h3>${blog.title}</h3>
                    <p>${blog.excerpt}</p>
                </div>
            </div>
        `).join('');

        track.querySelectorAll('.carousel-slide').forEach(slide => {
            slide.addEventListener('click', () => {
                const slug = slide.dataset.slug;
                if(slug) navigateToBlog(slug);
            });
        });
        
        // Auto-rotate carousel
        startCarousel();
        
        // Manual controls
        document.getElementById('prevBtn').onclick = () => {
            stopCarousel();
            previousSlide();
            startCarousel();
        };
        
        document.getElementById('nextBtn').onclick = () => {
            stopCarousel();
            nextSlide();
            startCarousel();
        };
    }

    function startCarousel() {
        carouselInterval = setInterval(nextSlide, 7000); // 7 seconds
    }

    function stopCarousel() {
        clearInterval(carouselInterval);
    }

    function nextSlide() {
        const featuredBlogs = blogData.filter(blog => blog.featured);
        currentSlide = (currentSlide + 1) % featuredBlogs.length;
        updateCarousel();
    }

    function previousSlide() {
        const featuredBlogs = blogData.filter(blog => blog.featured);
        currentSlide = (currentSlide - 1 + featuredBlogs.length) % featuredBlogs.length;
        updateCarousel();
    }

    function updateCarousel() {
        const track = document.getElementById('carouselTrack');
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    // Navigate to blog post
    function navigateToBlog(slug) {
        window.location.hash = slug;
    }

    // Render category filters
    function renderCategoryFilters() {
        const container = document.getElementById('categoryFilters');
        
        container.innerHTML = categories.map((category, index) => `
            <button class="category-btn ${index === 0 ? 'active' : ''}" data-category="${category}">
                ${category}
            </button>
        `).join('');

        container.querySelectorAll('.category-btn').forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                filterByCategory(category, button);
            });
        });
    }

    // Filter by category
    let currentCategory = 'Todas';

    function filterByCategory(category, button) {
        currentCategory = category;
        
        // Update active button
        document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        
        // Filter blogs
        const filtered = category === 'Todas' 
            ? blogData 
            : blogData.filter(blog => blog.category === category);
        
        renderBlogGrid(filtered);
    }

    // Render blog grid
    function renderBlogGrid(blogs) {
        const grid = document.getElementById('blogGrid');
        
        grid.innerHTML = blogs.map(blog => `
            <a href="#${blog.slug}" class="blog-card" data-slug="${blog.slug}">
                <img src="${blog.image}" alt="${blog.title}" class="blog-card-image">
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span class="blog-card-category">${blog.category}</span>
                        <span class="blog-card-date">${formatDate(blog.date)}</span>
                    </div>
                    <h3>${blog.title}</h3>
                    <p class="blog-card-excerpt">${blog.excerpt}</p>
                    <div class="blog-card-footer">
                        <span class="blog-card-author">${blog.author}</span>
                        <span class="blog-card-read-time">${blog.readTime}</span>
                    </div>
                </div>
            </a>
        `).join('');

        grid.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', (event) => {
                event.preventDefault();
                const slug = card.dataset.slug;
                if (slug) navigateToBlog(slug);
            });
        });
    }

    // Toggle view
    document.getElementById('cardViewBtn')?.addEventListener('click', function() {
        document.getElementById('blogGrid').classList.remove('list-view');
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });

    document.getElementById('listViewBtn')?.addEventListener('click', function() {
        document.getElementById('blogGrid').classList.add('list-view');
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
    });

    // Render related posts
    function renderRelatedPosts(currentPost) {
        const related = blogData
            .filter(blog => blog.id !== currentPost.id && blog.category === currentPost.category)
            .slice(0, 3);
        
        const container = document.getElementById('relatedPosts');
        
        if (related.length === 0) {
            container.innerHTML = '<p>Nenhum post relacionado encontrado.</p>';
            return;
        }
        
        container.innerHTML = related.map(blog => `
            <a href="#${blog.slug}" class="blog-card" data-slug="${blog.slug}">
                <img src="${blog.image}" alt="${blog.title}" class="blog-card-image">
                <div class="blog-card-content">
                    <div class="blog-card-meta">
                        <span class="blog-card-category">${blog.category}</span>
                    </div>
                    <h3>${blog.title}</h3>
                </div>
            </a>
        `).join('');

        container.querySelectorAll('.blog-card').forEach(card => {
            card.addEventListener('click', (event) => {
                event.preventDefault();
                const slug = card.dataset.slug;
                if (slug) navigateToBlog(slug);
            });
        });
    }

    // Setup share buttons
    function setupShareButtons(post) {
        const url = encodeURIComponent(window.location.href);
        const title = encodeURIComponent(post.title);
        
        document.querySelector('.share-btn.facebook').onclick = () => {
            window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        };
        
        document.querySelector('.share-btn.twitter').onclick = () => {
            window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        };
        
        document.querySelector('.share-btn.linkedin').onclick = () => {
            window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        };
        
        document.querySelector('.share-btn.whatsapp').onclick = () => {
            window.open(`https://wa.me/?text=${title}%20${url}`, '_blank');
        };
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    mobileMenuToggle?.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuToggle.classList.toggle('active');
    });

    // Handle browser back/forward buttons
    window.addEventListener('hashchange', routePage);

    // Initialize page
    routePage();
});