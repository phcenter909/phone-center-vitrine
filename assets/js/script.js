const SHEET_URL = "https://opensheet.elk.sh/1vF0D_WJXH5RUC7liF3fbcZCrLvre_xEGFGTD3FDYq1U/Page1";
const WHATSAPP_NUMBER = "5511982150000";

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
        estado: product.estadoProdutoDescricao?.trim() || "",
        sku: product.sku?.trim() || "",
        quantidade: parseInt(product.quantidade) || 0,
        fornecedor: product.fornecedorNome?.trim() || ""
    })).filter(p => p.disponivel && p.quantidade > 0);
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
                        <p class="card-text text-muted small flex-grow-1">${product.descricao}</p>
                        
                        <div class="product-meta mb-3">
                            ${product.cor ? `<small class="d-block text-muted">Cor: ${product.cor}</small>` : ''}
                            ${product.memoria ? `<small class="d-block text-muted">Memória: ${product.memoria}</small>` : ''}
                            ${product.estado ? `<small class="d-block text-muted">Estado: ${product.estado}</small>` : ''}
                            ${product.fornecedor ? `<small class="d-block text-muted">Fornecedor: ${product.fornecedor}</small>` : ''}
                            ${product.quantidade > 0 ? `<small class="d-block text-success"><i class="bi bi-check-circle"></i> ${product.quantidade} em estoque</small>` : '<small class="d-block text-danger">Fora de estoque</small>'}
                        </div>
                        
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <span class="price">R$ ${product.preco.toFixed(2)}</span>
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
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
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
        
        const matchesCategory = !categoryFilter || product.categoria === categoryFilter;
        const matchesBrand = !brandFilter || product.marca === brandFilter;

        return matchesSearch && matchesCategory && matchesBrand;
    });

    renderProducts(filtered);
}

function populateFilters() {
    const categories = [...new Set(allProducts.map(p => p.categoria))].sort();
    const brands = [...new Set(allProducts.map(p => p.marca))].sort();

    const catSelect = document.getElementById('category-filter');
    const brandSelect = document.getElementById('brand-filter');

    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat;
        opt.textContent = cat;
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