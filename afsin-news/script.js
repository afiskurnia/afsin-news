document.addEventListener('DOMContentLoaded', function() {
    // Toggle form pencarian mobile
    const mobileSearchBtn = document.getElementById('mobileSearchBtn');
    const mobileSearchForm = document.getElementById('mobileSearchForm');
    
    if (mobileSearchBtn && mobileSearchForm) {
        mobileSearchBtn.addEventListener('click', function() {
            mobileSearchForm.style.display = mobileSearchForm.style.display === 'none' ? 'block' : 'none';
       
            if (mobileSearchForm.style.display === 'block') {
                document.getElementById('mobileSearchInput').focus();
            }
        });
    }
    

    const mobileSearchFormInner = document.getElementById('mobileSearchFormInner');
    if (mobileSearchFormInner) {
        mobileSearchFormInner.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchQuery = document.getElementById('mobileSearchInput').value.trim().toLowerCase();
            filterNews(searchQuery); // Gunakan fungsi filterNews yang sudah ada
            mobileSearchForm.style.display = 'none';
        });
    }
});

// mulai
var allNews = [];
var filteredNews = [];
var currentPage = 1;
var itemsPerPage = 6;

function fetchNews() {
    var newsContainer = document.getElementById("news-container");
    var marqueeText = document.getElementById("marqueeText"); // elemen marquee
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://app.zenserp.com/api/v2/search", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            if (data.success && data.data.posts) {
                allNews = data.data.posts;
                filteredNews = allNews;

                // Render berita ke dalam news-container
                renderNews(currentPage);
                renderPagination();

                // Isi marquee (judul-judul berita)
                var newsHtml = "";
                allNews.forEach(function (post) {
                    newsHtml += post.title + " | "; 
                });
                marqueeText.innerHTML = newsHtml; // Set teks marquee
            } else {
                newsContainer.innerHTML = "<p class='text-danger'>Gagal memuat berita.</p>";
                marqueeText.innerHTML = "Tidak ada berita yang ditemukan."; // pesan jika tidak ada berita
            }
        }
    };
    xhr.onerror = function () {
        newsContainer.innerHTML = "<p class='text-danger'>Gagal mengambil data dari server.</p>";
        marqueeText.innerHTML = "Gagal memuat berita."; // Pesan error
    };
    xhr.send();
}

function renderNews(page) {
    var newsContainer = document.getElementById("news-container");
    var start = (page - 1) * itemsPerPage;
    var end = start + itemsPerPage;
    var newsHtml = "";

    for (var i = start; i < end && i < filteredNews.length; i++) {
        var news = filteredNews[i];
        var articleDate = new Date(news.pubDate).toLocaleDateString("id-ID", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        });

        newsHtml +=
            '<div class="col-md-4">' +
            '<div class="card h-100 card-hover-effect">' + 
            '<img src="' + news.thumbnail + '" class="card-img-top news-image" alt="' + news.title + '" style="object-fit:cover;">' + 
            '<div class="card-body">' +
            '<a href="' + news.link + '" class="link-artikel" target="_blank" rel="noopener">' +
            '<h5 class="card-title">' + news.title + '</h5>' +
            '<p class="text-muted"><small>' + articleDate + '</small></p>' +
            '<p class="card-text">' + news.description + '</p>' +
            '</a>'+
            '</div>' +
            '<div class="card-footer">' +
            '<a href="' + news.link + '" class="btn btn-new-news" target="_blank">Baca Selengkapnya</a>' + 
            '<i class="bi bi-bookmark bookmark-icon" onclick="toggleBookmark(this)"></i>' +
            '</div>' +
            '</div>' +
            '</div>';
    }

    newsContainer.innerHTML = newsHtml;
}

function renderPagination() {
    var pagination = document.getElementById("pagination").getElementsByTagName("ul")[0];
    var totalPages = Math.ceil(filteredNews.length / itemsPerPage);
    pagination.innerHTML = "";

    // Tombol "previous"
    var prevLi = document.createElement("li");
    prevLi.className = "page-item" + (currentPage === 1 ? " disabled" : "");
    prevLi.innerHTML = '<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">Sebelumnya</span></a>';
    prevLi.addEventListener("click", function (e) {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            renderNews(currentPage);
            renderPagination();
        }
    });
    pagination.appendChild(prevLi);

    // Nomor halaman
    for (var i = 1; i <= totalPages; i++) {
        var li = document.createElement("li");
        li.className = "page-item" + (i === currentPage ? " active" : "");
        li.innerHTML = '<a class="page-link" href="#">' + i + '</a>';
        li.addEventListener("click", function (e) {
            e.preventDefault();
            currentPage = parseInt(e.target.textContent);
            renderNews(currentPage);
            renderPagination();
        });
        pagination.appendChild(li);
    }

    // Tombol "next"
    var nextLi = document.createElement("li");
    nextLi.className = "page-item" + (currentPage === totalPages ? " disabled" : "");
    nextLi.innerHTML = '<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">Selanjutnya</span></a>';
    nextLi.addEventListener("click", function (e) {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            renderNews(currentPage);
            renderPagination();
        }
    });
    pagination.appendChild(nextLi);
}

function filterNews(query) {
    filteredNews = allNews.filter(function (news) {
        return news.title.toLowerCase().includes(query) || news.description.toLowerCase().includes(query);
    });

    currentPage = 1;
    renderNews(currentPage);
    renderPagination();
}

function toggleBookmark(icon) {
    icon.classList.toggle("bi-bookmark");
    icon.classList.toggle("bi-bookmark-fill");
    icon.classList.toggle("active");
}

// Hubungkan kedua form pencarian ke fungsionalitas yang sama
document.getElementById("searchForm").addEventListener("submit", function (event) {
    event.preventDefault();
    var searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();
    filterNews(searchQuery);
});

document.getElementById("mobileSearchFormInner").addEventListener("submit", function (event) {
    event.preventDefault();
    var searchQuery = document.getElementById("mobileSearchInput").value.trim().toLowerCase();
    filterNews(searchQuery);
});

document.addEventListener("DOMContentLoaded", function () {
    fetchNews();
});


//  section2
const berita = [
    {
        
        id: 1,
        kategori: ["Healty"], // (Tips: Koreksi ejaan 'Healthy' jika diperlukan)
        judul: "Preserved Vegetable Food: Delicious, Long-Lasting, and Healthy",
        deskripsi: "Plant-based preserves have become an increasingly popular choice among foodies and health-conscious eaters. In addition to offering delicious flavors, plant-based preserves also have the advantage of being long-lasting, allowing them to be stored for long periods of time without losing their quality.",
        gambar: "https://blog.thompson-morgan.com/wp-content/uploads/2022/07/20220607_tm_overview_of_preserved_fruits.jpg",
        tanggal: "22 Maret 2025",
        link: "artikel1/index1.html"

    },
    {
        id: 2,
        kategori: ["Science"],
        judul: "How to spot the 2025 Lyrids and Eta Aquarids meteor showers",
        deskripsi: "The Lyrids result from pieces of debris from the Thatcher comet interacting with Earth’s atmosphere and eventually disintegrating to become the bright streaks of light we see in the night sky. The meteor shower’s radiant – the spot in the night sky from which the meteors appear to radiate – is in the northern-hemisphere constellation Lyra, which contains the bright star Vega. People have been spotting the Lyrids for at least 2700 years. “The Lyrids are maybe the smallest of the major showers,” says Margaret Campbell-Brownat Western University in Canada. “The rates are not as high as most other meteor showers, but they do sometimes have a lot of bright meteors.”",
        gambar: "https://www.gamelab.id/uploads/report/project_21278/21278_20250416_145834.jpeg",
        tanggal: "15 April 2025",
        link: "artikel1"
    },
    {
        id: 3,
        kategori: ["Business"],
        judul: "China vows ‘resolute and effective measures’ after Trump’s 104% tariffs take effect",
        deskripsi: "China has promised to take “resolute and effective measures” to safeguard its rights and interests, hours after US President Donald Trump’s 104% tariffs on Chinese imports took effect on Wednesday.",
        gambar: "https://www.gamelab.id/uploads/report/project_21278/21278_20250416_135554.png",
        tanggal: "8 April 2025",
        link: "artikell2"
    }
];

function renderCards(data) {
    var container = document.getElementById("card-container-artikel");
    container.innerHTML = "";
    data.forEach(function (item) {
        var card = '<div class="col-md-12">' +
            '<div class="card-artikel card-hover-effect-artikel">' +
                '<div class="row row-artikel">' +
                    '<div class="col-sm-4">' +
                        '<div class="img-artikel">' +
                            '<img src="' + item.gambar + '" class="img-fluid">' +
                            '<span class="kategori" data-kategori="' + item.kategori[0] + '">' + item.kategori.join(", ") + '</span>' +
                        '</div>' +
                    '</div>' +
                    '<div class="col-sm-8">' +
                        '<div class="card-body-artikel">' +
                            '<a href="' + item.link + '" class="link-artikel-2" target="_blank">' +
                            '<div class="title-artikel custom-article-title">' +
                                '<h5>' + item.judul + '</h5>' +
                            '</div>' +
                            '<div class="meta-artikel">' +
                                '<span><i class="bi bi-calendar"></i> ' + item.tanggal + '</span>' +
                                // '<p class="outlet-date mobile-outlet-date">' +
                                //     '<i class="bi bi-calendar"></i>' + item.tanggal +
                                // '</p>' +
                                
                            '</div>' +
                            
                            '<div class="sub-artikel custom-article-subtitle">' +
                                '<p>' + item.deskripsi + '</p>' +
                            '</div>' +
                            '</a>' +
                            '<a href="' + item.link + '" class="btn btn-card-artikel" target="_blank">Baca Selengkapnya</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
        
        container.innerHTML += card;
    });
}

document.getElementById("search").addEventListener("input", function () {
    var keyword = this.value.toLowerCase();
    var filteredBerita = berita.filter(function (item) {
        return item.judul.toLowerCase().includes(keyword) ||
            item.kategori.some(function (kat) {
                return kat.toLowerCase().includes(keyword);
            });
    });
    renderCards(filteredBerita);
});

// Render data awal
renderCards(berita);

// SCROLL TO TOP
// Progress bar
function updateProgressBar() {
  const progressBar = document.querySelector('.progress-bar');
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  const progress = (window.pageYOffset / totalHeight) * 100;
  progressBar.style.width = progress + '%';
}

updateProgressBar(); 
window.addEventListener('scroll', updateProgressBar);
window.addEventListener('resize', updateProgressBar);

// Progress circle
function updateProgressCircle() {
  const progressElement = document.querySelector('.progress-circle-bar');
  const scrollToTopElement = document.querySelector('.scroll-to-top');
  const totalHeight = document.body.scrollHeight - window.innerHeight;
  let progress = (window.pageYOffset / totalHeight) * 283;
  progress = Math.min(progress, 283);
  progressElement.style.strokeDashoffset = 283 - progress;

  if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
    scrollToTopElement.style.opacity = '1';
  } else {
    scrollToTopElement.style.opacity = '0';
  }
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


const scrollToTopElement = document.querySelector('.scroll-to-top');
scrollToTopElement.addEventListener('click', scrollToTop);


updateProgressCircle();
window.addEventListener('scroll', updateProgressCircle);
window.addEventListener('resize', updateProgressCircle);


// kategori-tabs
function changeTab(tabId) {
    // Hide all tab panes
    var tabPanes = document.getElementsByClassName('tab-pane');
    for (var i = 0; i < tabPanes.length; i++) {
        tabPanes[i].classList.remove('active');
    }
    
    // Show selected tab pane
    document.getElementById(tabId).classList.add('active');
    
    // Update active tab button
    var tabButtons = document.getElementsByClassName('tab-button');
    for (var i = 0; i < tabButtons.length; i++) {
        tabButtons[i].classList.remove('active');
    }
    event.currentTarget.classList.add('active');
    
    // Load content for the tab if empty
    if (document.getElementById(tabId + '-content').children.length === 0) {
        loadNewsForCategory(tabId);
    }
}

// News Loading Function
function loadNewsForCategory(category) {
    var apiUrl = '';
    var contentDiv = document.getElementById(category + '-content');
    
    // Show loading indicator
    contentDiv.innerHTML = '<div class="col-12 text-center py-4"><div class="spinner-border text-primary" role="status"></div><p>Memuat berita...</p></div>';
    
    switch(category) {
        case 'berita-utama':
            apiUrl = 'https://api-berita-indonesia.vercel.app/kumparan/terbaru/';
            break;
        case 'nasional':
            apiUrl = 'https://api-berita-indonesia.vercel.app/cnn/nasional/';
            break;
        case 'internasional':
            apiUrl = 'https://api-berita-indonesia.vercel.app/cnn/internasional/';
            break;
        case 'ekonomi':
            apiUrl = 'https://api-berita-indonesia.vercel.app/cnn/ekonomi/';
            break;
        case 'olahraga':
            apiUrl = 'https://api-berita-indonesia.vercel.app/cnn/olahraga/';
            break;
        default:
            apiUrl = 'https://api-berita-indonesia.vercel.app/cnn/terbaru/';
    }
    
    // Make AJAX request
    var xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);
    xhr.onload = function() {
        if (this.status == 200) {
            var response = JSON.parse(this.responseText);
            if (response.success && response.data && response.data.posts) {
                displayNews(response.data.posts, category);
            } else {
                contentDiv.innerHTML = '<div class="col-12 text-center py-4"><p class="text-danger">Gagal memuat berita.</p></div>';
            }
        } else {
            contentDiv.innerHTML = '<div class="col-12 text-center py-4"><p class="text-danger">Gagal mengambil data dari server.</p></div>';
        }
    };
    xhr.onerror = function() {
        contentDiv.innerHTML = '<div class="col-12 text-center py-4"><p class="text-danger">Koneksi error.</p></div>';
    };
    xhr.send();
}

function displayNews(newsItems, category) {
    var contentDiv = document.getElementById(category + '-content');
    var newsHtml = '';
    var itemsPerRow = 3; // Number of news items perrow
    
    contentDiv.innerHTML = '';
 
    for (var i = 0; i < Math.min(newsItems.length, 9); i++) { // Limit to 9 items
        var news = newsItems[i];
        var newsDate = new Date(news.pubDate).toLocaleDateString('id-ID', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        newsHtml += '<div class="col-md-4 mb-4">' +
            '<div class="card tabs news-card-kategori card-hover-effect h-100">' +
            '<img src="' + (news.thumbnail || 'https://via.placeholder.com/300x200?text=No+Image') + '" class="card-img-top" alt="' + news.title + '">' +
            '<div class="card-body">' +
            '<a href="' + news.link + '" class="link-artikel" target="_blank">' +
            '<h5 class="card-title">' + news.title + '</h5>' +
            '<p class="card-date text-muted meta-artikel"><small> <i class="bi bi-calendar"></i>' + newsDate + '</small></p>' +
            '</a>' +
            '</div>' +
            
            '<div class="card-footer">' +
            '<a href="' + news.link + '" class="btn btn-news-kategori" target="_blank">Baca Selengkapnya</a>' + 
            '<i class="bi bi-bookmark bookmark-icon" onclick="toggleBookmark(this)"></i>' +
            '</div>' +
            '</div>' +
            '</div>';
    }
    
    contentDiv.innerHTML = newsHtml;
}


window.onload = function() {
    loadNewsForCategory('berita-utama');
};
