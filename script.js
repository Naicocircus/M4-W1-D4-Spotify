document.addEventListener('DOMContentLoaded', function() {
    let currentTracks = []; // Variabile per memorizzare le tracce correnti

    const initializeApp = () => {
        const handleSearch = async () => {
            const searchInput = document.getElementById('searchField').value.toLowerCase();
            let apiUrl = '';
            
            // Nascondi tutte le sezioni
            document.querySelectorAll('.artist-section').forEach(section => {
                section.classList.add('d-none');
            });

            // Seleziona l'URL appropriato in base all'input
            switch(searchInput) {
                case 'eminem':
                    apiUrl = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=eminem';
                    break;
                case 'metallica':
                    apiUrl = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=metallica';
                    break;
                case 'queen':
                    apiUrl = 'https://striveschool-api.herokuapp.com/api/deezer/search?q=queen';
                    break;
                default:
                    return;
            }

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                
                // Memorizza le tracce correnti
                currentTracks = data.data.slice(0, 12);
                
                const cardsHTML = currentTracks.map(track => `
                    <div class="col-12 col-md-4 mb-4">
                        <div class="card bg-dark text-white">
                            <img src="${track.album.cover_medium}" class="card-img-top w-100" alt="${track.title}">
                            <div class="card-body p-2">
                                <h5 class="card-title text-truncate mb-0">${track.title}</h5>
                                <p class="card-text text-muted small">${track.artist.name}</p>
                            </div>
                        </div>
                    </div>
                `).join('');

                // Mostra la sezione appropriata e inserisci le card
                const searchResults = document.getElementById('searchResults');
                const resultsContainer = searchResults.querySelector('.imgLinks');
                resultsContainer.innerHTML = cardsHTML;
                searchResults.style.display = 'block';

            } catch (error) {
                console.error('Errore durante la ricerca:', error);
            }
        };

        // Funzione per mostrare la lista delle tracce nel modale
        const showTracksList = () => {
            const tracksList = document.getElementById('tracksList');
            if (currentTracks.length === 0) {
                tracksList.innerHTML = '<li class="list-group-item bg-dark text-white">No tracks available. Please perform a search first.</li>';
                return;
            }

            const tracksHTML = currentTracks.map(track => `
                <li class="list-group-item bg-dark text-white d-flex justify-content-between align-items-center">
                    <div>
                        <img src="${track.album.cover_small}" class="mr-3" style="width: 50px;">
                        <span>${track.title}</span>
                    </div>
                    <div class="text-muted">
                        ${track.artist.name} - ${track.duration}s
                    </div>
                </li>
            `).join('');
            
            tracksList.innerHTML = tracksHTML;
            $('#tracksModal').modal('show');
        };

        // Inizializza gli event listener
        const initializeEventListeners = () => {
            document.getElementById('button-search').addEventListener('click', handleSearch);
            document.getElementById('searchField').addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    handleSearch();
                }
            });
            document.getElementById('listButton').addEventListener('click', showTracksList);
        };

        initializeEventListeners();
    };

    initializeApp();
});