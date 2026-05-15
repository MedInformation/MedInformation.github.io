let allDrugs = [];

// Загрузка списка препаратов
fetch('../data/drugs-list.json')
    .then(response => response.json())
    .then(data => {
        allDrugs = data;
    })
    .catch(() => {
        fetch('data/drugs-list.json')
            .then(response => response.json())
            .then(data => {
                allDrugs = data;
            });
    });

function searchDrugs(query) {
    if (!query || query.length < 1) return [];
    
    query = query.toLowerCase();
    return allDrugs.filter(drug => 
        drug.name.toLowerCase().includes(query) || 
        drug.lat.toLowerCase().includes(query) ||
        drug.category.toLowerCase().includes(query)
    ).slice(0, 10);
}

function displayResults(results, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    if (results.length === 0) {
        container.innerHTML = '<div class="search-result-item">Ничего не найдено</div>';
    } else {
        container.innerHTML = results.map(drug => `
            <div class="search-result-item" onclick="window.location.href='drugs/${drug.url}'">
                <strong>${drug.name}</strong> (${drug.lat})
                <br><small>${drug.category}</small>
            </div>
        `).join('');
    }
    
    container.classList.add('active');
}

document.addEventListener('DOMContentLoaded', function() {
    const headerSearch = document.getElementById('headerSearch');
    const headerResults = document.getElementById('headerSearchResults');
    
    if (headerSearch) {
        headerSearch.addEventListener('input', function() {
            const results = searchDrugs(this.value);
            displayResults(results, 'headerSearchResults');
        });
        
        headerSearch.addEventListener('focus', function() {
            if (this.value) {
                const results = searchDrugs(this.value);
                displayResults(results, 'headerSearchResults');
            }
        });
        
        document.addEventListener('click', function(e) {
            if (!headerSearch.contains(e.target) && !headerResults.contains(e.target)) {
                headerResults.classList.remove('active');
            }
        });
    }
    
    const mainSearch = document.getElementById('mainSearch');
    const mainResults = document.getElementById('mainSearchResults');
    
    if (mainSearch) {
        mainSearch.addEventListener('input', function() {
            const results = searchDrugs(this.value);
            displayResults(results, 'mainSearchResults');
        });
        
        document.addEventListener('click', function(e) {
            if (!mainSearch.contains(e.target) && !mainResults.contains(e.target)) {
                mainResults.classList.remove('active');
            }
        });
    }
});