const SHEET_URL = "https://opensheet.elk.sh/1vF0D_WJXH5RUC7liF3fbcZCrLvre_xEGFGTD3FDYq1U/Page1";

// Seleção dinâmica do número do WhatsApp conforme dia/horário
// Regra:
// Sábado: 09:00 <= h < 14:00 -> 5584996775340, caso contrário -> 5584996775282
// Domingo: sempre -> 5584996775282
// Segunda-Sexta: 09:00 <= h < 18:00 -> 5584996775340, caso contrário -> 5584996775282

function getWhatsappNumber(date = new Date()) {
    const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const totalMinutes = date.getHours() * 60 + date.getMinutes();
    const startBusiness = 9 * 60;      // 09:00
    const endBusinessWeek = 18 * 60;   // 18:00
    const endBusinessSat = 14 * 60;    // 14:00

    if (day === 6) { // Saturday
        if (totalMinutes >= startBusiness && totalMinutes < endBusinessSat) {
            return '5584996775340';
        }
        return '5584996775282';
    }

    if (day === 0) { // Sunday
        return '5584996775282';
    }

    // Monday - Friday
    if (totalMinutes >= startBusiness && totalMinutes < endBusinessWeek) {
        return '5584996775340';
    }
    return '5584996775282';
}

let allProducts = [];

// Tema escuro
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

function applyTheme(theme) {
    const html = document.documentElement;
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    
    if (theme === 'dark') {
        body.classList.add('dark-theme');
        html.setAttribute('data-bs-theme', 'dark');
        themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
    } else {
        body.classList.remove('dark-theme');
        html.setAttribute('data-bs-theme', 'light');
        themeToggle.innerHTML = '<i class="bi bi-moon-stars"></i>';
    }
    
    localStorage.setItem('theme', theme);
}

function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}

// Normalização dos dados
function normalizeProducts(data) {
    return data.map(product => ({
        id: product.id?.trim() || "",
        nome_produto: product.aparelhoDescricao?.trim() || "Sem nome",
        fotos: product.foto?.trim() || "",
        descricao: product.descricao?.trim() || "",
        preco: parseFloat(product.valorVenda) || parseFloat(product.valorCusto) || 0,
        disponivel: product.disponibilidade?.toLowerCase().includes("disponível"),
        categoria: product.tipoProdutoDescricao?.trim() || "Sem categoria",
        marca: product.marcaId?.trim() || "Sem marca",
        cor: product.corDescricao?.trim() || "",
        memoria: product.gbDescricao?.trim() || "",
        imei: product.imei?.trim() || "",
        estado: product.estadoProdutoDescricao?.trim() || "",
        // armazenar o id do estado (ex: 8505 = Novo, 8507 = Semi novo)
        estadoId: product.estadoProdutoId ? String(product.estadoProdutoId).trim() : "",
        sku: product.sku?.trim() || "",
        quantidade: parseInt(product.quantidade) || 0,
        fornecedor: product.fornecedorNome?.trim() || ""
    })).filter(p => p.disponivel && p.quantidade > 0);
}

function truncate(text, max) {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '...' : text;
}

// Renderizar produtos com Bootstrap
function renderProducts(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <h5 class="text-muted">Nenhum produto encontrado.</h5>
            </div>
        `;
        return;
    }

    products.forEach(product => {
        const imageUrl = product.fotos || 'https://picsum.photos/400';
        
        const cardHTML = `
            <div class="col">
                <div class="card product-card h-100 shadow-sm">
                    <img src="${imageUrl}" class="card-img-top product-image" alt="${product.nome_produto}">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${product.nome_produto}</h5>
                        
                        <div class="product-meta mb-3">
                            ${product.estado ? `<small class="d-block text-muted">Estado: ${product.estado}</small>` : ''}
                            ${product.cor ? `<small class="d-block text-muted">Cor: ${product.cor}</small>` : ''}
                            ${product.memoria ? `<small class="d-block text-muted">Armazenamento: ${product.memoria}</small>` : ''}
                            ${product.imei ? `<small class="d-block text-muted">IMEI: ${product.imei.length > 4 ? '****' + product.imei.slice(-4) : product.imei}</small>` : ''}
                        </div>
                                                
                        <button onclick="buyProduct('${product.nome_produto}')" 
                                class="btn btn-buy w-100">
                            <i class="bi bi-whatsapp me-2"></i> Comprar via WhatsApp
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.innerHTML += cardHTML;
    });
}


// Abrir WhatsApp
window.buyProduct = function(nomeProduto) {
    const message = `Olá, tenho interesse no produto: ${nomeProduto}.`;
    const number = getWhatsappNumber();
    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
};

// Filtros
function filterProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase().trim();
    const categoryFilter = document.getElementById('category-filter').value;
    const brandFilter = document.getElementById('brand-filter').value;

    const filtered = allProducts.filter(product => {
        const matchesSearch = !searchTerm || 
            product.nome_produto.toLowerCase().includes(searchTerm) ||
            product.descricao.toLowerCase().includes(searchTerm);
        
        // Comparar pela propriedade 'estadoId' usando igualdade exata
        const matchesCategory = !categoryFilter || product.estadoId === categoryFilter;
        // Se 'Iphone' for selecionado, mostrar todas as opções
        const matchesBrand = !brandFilter || brandFilter === 'Iphone' || product.marca === brandFilter;

        return matchesSearch && matchesCategory && matchesBrand;
    });

    renderProducts(filtered);
}

function populateFilters() {
    // Usar categorias fixas: valores correspondem a estadoProdutoId na planilha
    const categories = [
        { id: '8505', label: 'Novo' },
        { id: '8507', label: 'Semi novo' }
    ];
    // Popular o filtro de marcas com opções fixas conforme solicitado
    const brands = ['Iphone', 'Xiaomi'];

    const catSelect = document.getElementById('category-filter');
    const brandSelect = document.getElementById('brand-filter');

    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id;
        opt.textContent = cat.label;
        catSelect.appendChild(opt);
    });

    brands.forEach(brand => {
        const opt = document.createElement('option');
        opt.value = brand;
        opt.textContent = brand;
        brandSelect.appendChild(opt);
    });
}

function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// Inicialização
async function init() {
    initTheme();
    
    try {
        const response = await fetch(SHEET_URL);
        const data = await response.json();
        
        allProducts = normalizeProducts(data);
        
        populateFilters();
        renderProducts(allProducts);

        // Eventos
        document.getElementById('search-input').addEventListener('input', debounce(filterProducts, 300));
        document.getElementById('category-filter').addEventListener('change', filterProducts);
        document.getElementById('brand-filter').addEventListener('change', filterProducts);
        document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

    } catch (error) {
        console.error(error);
        document.getElementById('products-grid').innerHTML = `
            <div class="col-12 text-center py-5 text-danger">
                Erro ao carregar os produtos. Verifique se a planilha está pública.
            </div>
        `;
    }
}

window.onload = init;