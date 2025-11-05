document.addEventListener('DOMContentLoaded', function() {
    
    // --- LÓGICA DE CARREGAMENTO DINÂMICO DOS CARDS ---
    
    function createCardHTML(cardData) {
        let noteHTML = cardData.note ? `<p class="cost-note ${cardData.note_class || ''}">${cardData.note}</p>` : '';
        return `
            <div class="proposal-card">
                <div class="card-header">
                    <div class="icon"><i class="${cardData.icon}"></i></div>
                    <h4 class="title">${cardData.title}</h4>
                </div>
                <p class="card-cost">${cardData.cost}</p>
                <p class="card-description">${cardData.description}</p>
                ${noteHTML}
            </div>
        `;
    }

    function loadProposalData() {
        const proposalId = window.location.hash.substring(1); // Pega o valor da URL após o '#'

        if (proposalId && typeof propostas !== 'undefined' && propostas[proposalId]) {
            const proposalData = propostas[proposalId];
            
            for (const category in proposalData) {
                if (proposalData.hasOwnProperty(category)) {
                    // Converte o nome da categoria para um ID de grid válido (ex: "Infraestrutura e Desenvolvimento" -> "grid-infraestrutura-e-desenvolvimento")
                    const gridId = `grid-${category.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')}`;
                    const gridElement = document.getElementById(gridId);
                    
                    if (gridElement) {
                        const cards = proposalData[category];
                        let cardsHTML = '';
                        cards.forEach(card => {
                            cardsHTML += createCardHTML(card);
                        });
                        gridElement.innerHTML = cardsHTML;
                    }
                }
            }
        } else {
            console.warn("Nenhuma proposta encontrada para o ID:", proposalId);
            // O HTML já está vazio, então não precisa fazer nada para não mostrar os cards.
        }
    }

    // --- LÓGICA ORIGINAL DO SLIDER ---

    const sliderContainer = document.querySelector('.slider-container');
    const sliderWrapper = document.querySelector('.slider-wrapper');
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const paginationContainer = document.querySelector('.slider-pagination');

    let currentSlide = 0;
    let dots = [];
    let isScrolling = false;

    function goToSlide(slideIndex) {
        currentSlide = slideIndex;
        // A largura do wrapper é 300% para 3 slides, então o offset é um terço disso por slide.
        const offset = -currentSlide * (100 / totalSlides);
        sliderWrapper.style.transform = `translateX(${offset}%)`;
        updateNavigation();
    }

    function updateNavigation() {
        if (paginationContainer) {
            dots.forEach((dot, index) => dot.classList.toggle('active', index === currentSlide));
        }
        if (prevBtn && nextBtn) {
            prevBtn.disabled = currentSlide === 0;
            nextBtn.disabled = currentSlide === totalSlides - 1;
        }
    }
    
    function changeSlide(direction) {
        const newSlide = currentSlide + direction;
        if (newSlide >= 0 && newSlide < totalSlides) {
            goToSlide(newSlide);
        }
    }

    // Criar dots da paginação (se o container existir)
    if (paginationContainer) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            dot.addEventListener('click', () => goToSlide(i));
            paginationContainer.appendChild(dot);
            dots.push(dot);
        }
    }

    // Event Listeners para botões (se existirem)
    if (nextBtn) nextBtn.addEventListener('click', () => changeSlide(1));
    if (prevBtn) prevBtn.addEventListener('click', () => changeSlide(-1));

    // Event Listener para scroll do mouse (Desktop)
    sliderContainer.addEventListener('wheel', (event) => {
        if (window.innerWidth > 992.1) { // Apenas em modo desktop
            event.preventDefault();
            if (isScrolling) return;
            isScrolling = true;
            
            if (event.deltaY > 0) { // Scroll para baixo
                changeSlide(1);
            } else { // Scroll para cima
                changeSlide(-1);
            }
            
            setTimeout(() => { isScrolling = false; }, 800); // Debounce para evitar scroll rápido
        }
    }, { passive: false });
    
    // --- INICIALIZAÇÃO ---

    loadProposalData(); // Carrega os dados da proposta primeiro
    goToSlide(0);       // Depois, inicializa o slider na primeira página
});
