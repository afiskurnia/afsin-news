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

// isi
var allNews = [];
var filteredNews = [];
var currentPage = 1;
var itemsPerPage = 21;

function fetchNews() {
    var newsContainer = document.getElementById("news-container");
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "https://api-berita-indonesia.vercel.app/cnn/gayaHidup/", true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);

            if (data.success && data.data.posts) {
                allNews = data.data.posts;
                filteredNews = allNews;

                renderNews(currentPage);
                renderPagination();

                
            } else {
                newsContainer.innerHTML = "<p class='text-danger'>Gagal memuat berita.</p>";
                marqueeText.innerHTML = "Tidak ada berita yang ditemukan."; 
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
        //   '<div class="col-md-12">' +
        //     '<div class="card beritaa-rekomen">' +
        //     '<div class="row no-gutters">' +
        //     '<div class="col-md-4">' +
        //     '<a href="' + news.link + '" class="link-artikel" target="_blank">' +
        //     '<img src="' + news.thumbnail + '" class="card-img artikel-populer-img" alt="' + news.title + '" style="width: 100%; height: 110px; object-fit: cover;">' +
        //     '</div>' +
        //     '<div class="col-md-8">' +
        //     '<div class="card-body">' +
        //     '<h5 class="card-title">' + news.title + '</h5>' +
        //     '<p class="text-muted"><small>' + articleDate + '</small></p>' +
        //     // '<p class="card-text">' + news.description + '</p>' +
        //     '</div>' +
        //     '</a>' +
        //     '</div>' +
        //     '</div>' +
        //     '</div>' +
        //     '</div>';
        
      
        '<div class="col-md-12">' +
        '<div class="card beritaa-rekomen custom-article-card">' + // Menambahkan kelas khusus
        '<div class="row no-gutters">' +
        '<div class="col-md-4 custom-article-img-container">' + // Menambahkan kelas khusus untuk container gambar
        '<a href="' + news.link + '" class="link-artikel" target="_blank">' +
        '<img src="' + news.thumbnail + '" class="card-img artikel-populer-img custom-article-img" alt="' + news.title + '" style="width: 100%; height: 110px; object-fit: cover;">' + 
        '</a>' +
        '</div>' +
        '<div class="col-md-8">' +
        '<div class="card-body custom-article-body">' + // Menambahkan kelas khusus untuk body
        '<h5 class="card-title custom-article-title">' + news.title + '</h5>' + // Menambahkan kelas khusus untuk title
        '<p class="text-muted"><small>' + articleDate + '</small></p>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
        }


    newsContainer.innerHTML = newsHtml;
}

// document.getElementById("searchForm").addEventListener("submit", function (event) {
//     event.preventDefault();
//     var searchQuery = document.getElementById("searchInput").value.trim().toLowerCase();
//     filterNews(searchQuery);
// });

document.addEventListener("DOMContentLoaded", function () {
    fetchNews();
});




// penulis unggulan
document.querySelectorAll('.follow-btn').forEach(button => {
    button.addEventListener('click', function () {
        const button = this;
        const isFollowing = button.getAttribute('data-state') === 'following';

        if (isFollowing) {
            // batalkan mengikuti
            Swal.fire({
                title: 'Apakah Anda yakin?',
                text: 'Anda akan berhenti mengikuti penulis ini.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ya, batalkan!',
                cancelButtonText: 'Tidak'
            }).then((result) => {
                if (result.isConfirmed) {
                    button.textContent = '+ Ikuti';
                    button.classList.remove('btn-success');
                    button.classList.add('btn-outline-success');
                    button.setAttribute('data-state', 'follow');

                    Swal.fire(
                        'Dibatalkan!',
                        'Anda berhenti mengikuti penulis ini.',
                        'success'
                    );
                }
            });
        } else {
            // ikuti
            Swal.fire({
                title: 'Berhasil!',
                text: 'Anda sekarang mengikuti penulis ini.',
                icon: 'success',
                confirmButtonText: 'OK'
            }).then((result) => {
                if (result.isConfirmed) {
                    button.textContent = '✓ Mengikuti';
                    button.classList.remove('btn-outline-success');
                    button.classList.add('btn-success');
                    button.setAttribute('data-state', 'following');
                }
            });
        }
    });
});


// toc
$(document).ready(function(){
    // Toggle Table of Contents
    $('#btn_toc').click(function() {
        $('#toc').slideToggle();
    });

    // Smooth scrolling for TOC links
    $("a[href^='#toc_']").on('click', function(event) {
        event.preventDefault();
        
        var hash = this.hash;
        var target = $(hash);
        
        if (target.length) {
            $('html, body').animate({
                scrollTop: target.offset().top - 100 
            }, 800, function() {
                window.location.hash = hash;
            });
        }
    });
});