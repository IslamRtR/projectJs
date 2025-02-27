document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkTheme') === 'enabled') {
    document.body.classList.add('dark-theme');
  }
  if(localStorage.getItem("currentUser")){
    document.querySelector('#nav-list #profile-link').style.display = 'none';
    let currentUsername = JSON.parse(localStorage.getItem("currentUser"));
    let li = document.createElement('li');
    li.innerHTML = `<a href="" id="link">Привет, ${currentUsername[0].username}</a>`
    document.getElementById('nav-list').appendChild(li)
  }

  const movieGrid = document.getElementById("movie-grid");

  const themeSwitch = document.createElement('label');
  themeSwitch.classList.add('theme-switch');
  themeSwitch.style.cursor = 'pointer';
  const themeCheckbox = document.createElement('input');
  themeCheckbox.type = 'checkbox';
  themeCheckbox.style.display = 'none';
  if (document.body.classList.contains('dark-theme')) {
    themeCheckbox.checked = true;
  }

  const slider = document.createElement('span');
  slider.classList.add('slider');

  themeSwitch.appendChild(themeCheckbox);
  themeSwitch.appendChild(slider);
  // document.body.appendChild(themeSwitch);
  document.querySelector('.container').appendChild(themeSwitch);

  themeCheckbox.addEventListener('change', () => {
    if (themeCheckbox.checked) {
      document.body.classList.add('dark-theme');
      localStorage.setItem('darkTheme', 'enabled');
    } else {
      document.body.classList.remove('dark-theme');
      localStorage.setItem('darkTheme', 'disabled');
    }
  });


  fetch("data/movies.json")
    .then(response => response.json())
    .then(movies => {
      const searchInput = document.getElementById("search-input");
      const searchButton = document.getElementById("search-button");
      function displayMovies(moviesToDisplay){
        movieGrid.innerHTML = "";
        if (moviesToDisplay.length === 0) {
          movieGrid.innerHTML = "<p>Нет фильмов для отображения.</p>";
          return;
        }
        moviesToDisplay.forEach(movie => {
          const card = document.createElement("div");
          card.classList.add("movie-card");
          const button = document.createElement('button');
          button.className = "bttn";
          button.innerHTML = `
            <img src="${movie.image}" alt="${movie.title}">
            <h3>${movie.title}</h3>
            <p><strong>Жанр:</strong> ${movie.genres ? movie.genres.join(", ") : ''} | <strong>Год:</strong> ${movie.year ? movie.year : ''}</p>
            <p><strong>Рейтинг:</strong> ${movie.rating ? movie.rating : ''}</p>
          `;
          button.addEventListener("click", () => showFilm(movie));
          card.appendChild(button);
          movieGrid.appendChild(card);
        });
      };

      displayMovies(movies);

      function showFilm(movie) {
        movieGrid.innerHTML = `
          <div class="displayMovies">
            <button id="nazad">Назад</button>
            <h3>${movie.title}</h3>
            <button id="smotret">Смотреть</button>
            <img class="displayMovies-img" src="${movie.obloshka}" alt="${movie.title}">
            <div class="displayMovies-box">
              <p><strong>Жанр:</strong> ${movie.genres ? movie.genres.join(", ") : ''} | <strong>Год:</strong> ${movie.year ? movie.year : ''}</p>
              <p><strong>Рейтинг:</strong> ${movie.rating ? movie.rating : ''}</p>
              <p><strong>Описание:</strong> ${movie.description ? movie.description : 'Нет описания'}</p>
              <p><strong>Режиссер:</strong> ${movie.director ? movie.director : 'Неизвестно'}</p>
              <p><strong>Актеры:</strong> ${movie.cast ? movie.cast.join(", ") : 'Неизвестно'}</p>
              <p><strong>Продолжительность:</strong> ${movie.duration ? movie.duration + ' мин.' : 'Неизвестно'}</p>
              <div class="review-box">
                <textarea id="review-input" placeholder="Напишите ваш отзыв..."></textarea>
                <button id="add-review">Добавить отзыв</button>
                <div class="otzyv-box">
                  <p class="otzyv"><strong>Отзывы:</strong></p>
                  <div id="reviews-list">
                    ${movie.reviews.map(review => `
                    <li>
                      <img class="otzyv-img" src="data:image/png;base64,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" alt="${movie.title}" width="100">
                      <span>${review}</span>
                    </li>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="recomendation-box">

          </div>
        `;

        movieGrid.style.display = "flex"

        document.getElementById("nazad").addEventListener("click", () => {
          displayMovies(movies);
          movieGrid.style.display = "grid"
        });

        document.getElementById("smotret").addEventListener("click", () => {
          window.location.href = movie.url; 
        });

        document.getElementById("add-review").addEventListener("click", () => {
          const reviewInput = document.getElementById("review-input");
          const reviewText = reviewInput.value.trim();
          if (reviewText) {
            movie.reviews.push(reviewText);
            reviewInput.value = '';
            showFilm(movie);
          }
        });
        // Внутри функции showFilm(movie) после установки innerHTML:
const recomendationBox = document.querySelector(".recomendation-box");
fetch("data/movies.json")
  .then(response => response.json())
  .then(allMovies => {
    // Исключаем текущий фильм
    const otherMovies = allMovies.filter(m => m.title !== movie.title);
    // Перемешиваем фильмы и выбираем до 7
    const recommended = otherMovies.sort(() => Math.random() - 0.1).slice(0, 3);
    let recHTML = "<h4> Рекомендуемые фильмы:</h4>";
    recommended.forEach(rec => {
      recHTML += `
        <div class="rec-movie" data-title="${rec.title}">
          <img class="rec-img" src="${rec.image}" alt="${rec.title}" width="100">
          <p class="rec-title">${rec.title}</p>
          <p class="rec-genres"><strong>Жанр:</strong> ${movie.genres} </p>
          <p class="rec-duration"><strong>Продолжительность:</strong> ${movie.duration ? movie.duration + ' мин.' : 'Неизвестно'}</p>
        </div>
      `;
    });
    recomendationBox.innerHTML = recHTML;
    // Добавляем обработчики клика на каждый рекомендованный фильм
    document.querySelectorAll(".rec-movie").forEach(item => {
      item.addEventListener("click", () => {
        const selectedTitle = item.getAttribute("data-title");
        const selectedMovie = allMovies.find(m => m.title === selectedTitle);
        if (selectedMovie) {
          showFilm(selectedMovie);
        }
      });
    });
  })
  .catch(error => console.error("Ошибка загрузки рекомендованных фильмов:", error));
      }

      searchButton.addEventListener('click', () => {
        const query = searchInput.value;
        const filteredMovies = searchMovies(movies, query);
        displayMovies(filteredMovies);
      });
    })
    .catch(error => console.error("Ошибка загрузки данных:", error));

  const navToggler = document.getElementById("nav-toggler");
  const mobileMenu = document.getElementById("mobile-menu");
  if (navToggler && mobileMenu) {
    navToggler.addEventListener("click", () => {
      mobileMenu.classList.toggle("show");
    });
  }

  const interesniy = document.getElementById("contact-link");
  if (interesniy) {
    interesniy.addEventListener("click", (e) => {
      e.preventDefault();
      movieGrid.innerHTML = ''
      let filteredMovies = []

      if(localStorage.getItem('currentUser')){
        movieGrid.innerHTML = `Куте тур`

        fetch('data/movies.json')
        .then(response => response.json())
        .then(movies => {
          console.log(movies)
          let currentUser = JSON.parse(localStorage.getItem("currentUser"));
          let userNameGenres = currentUser[0].genre
          console.log(userNameGenres);
          
          userNameGenres.forEach(genre => {
            movies.forEach(movie => {
              movie.genres.forEach(genreMovie => {
                if(genreMovie == genre){
                  filteredMovies.push(movie)
                }
              })
              
            })
          })
          console.log("Filtered movies:", filteredMovies);

          displayMovies(filteredMovies)
        })

        function displayMovies(moviesToDisplay){
          movieGrid.innerHTML = "";
          if (moviesToDisplay.length === 0) {
            movieGrid.innerHTML = "<p>Нет фильмов для отображения.</p>";
            return;
          }
          moviesToDisplay.forEach(movie => {
            const card = document.createElement("div");
            card.classList.add("movie-card");
            const button = document.createElement('button');
            button.className = "bttn";
            button.innerHTML = `
              <img src="${movie.image}" alt="${movie.title}">
              <h3>${movie.title}</h3>
              <p><strong>Жанр:</strong> ${movie.genres ? movie.genres.join(", ") : ''} | <strong>Год:</strong> ${movie.year ? movie.year : ''}</p>
              <p><strong>Рейтинг:</strong> ${movie.rating ? movie.rating : ''}</p>
            `;
            button.addEventListener("click", () => showFilm(movie));
            card.appendChild(button);
            movieGrid.appendChild(card);
          });
        };

        function showFilm(movie) {
          movieGrid.innerHTML = `
            <div class="displayMovies">
              <button id="nazad">Назад</button>
              <h3>${movie.title}</h3>
              <button id="smotret">Смотреть</button>
              <img class="displayMovies-img" src="${movie.obloshka}" alt="${movie.title}">
              <div class="displayMovies-box">
                <p><strong>Жанр:</strong> ${movie.genres ? movie.genres.join(", ") : ''} | <strong>Год:</strong> ${movie.year ? movie.year : ''}</p>
                <p><strong>Рейтинг:</strong> ${movie.rating ? movie.rating : ''}</p>
                <p><strong>Описание:</strong> ${movie.description ? movie.description : 'Нет описания'}</p>
                <p><strong>Режиссер:</strong> ${movie.director ? movie.director : 'Неизвестно'}</p>
                <p><strong>Актеры:</strong> ${movie.cast ? movie.cast.join(", ") : 'Неизвестно'}</p>
                <p><strong>Продолжительность:</strong> ${movie.duration ? movie.duration + ' мин.' : 'Неизвестно'}</p>
                <div class="review-box">
                    <textarea id="review-input" placeholder="Напишите ваш отзыв..."></textarea>
                    <button id="add-review">Добавить отзыв</button>
                <div class="otzyv-box">
                  <p class="otzyv"><strong>Отзывы:</strong></p>
                  <ul id="reviews-list">
                    ${movie.reviews.map(review => `
                    <li>
                      <img class="otzyv-img" src="data:image/png;base64,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" alt="${movie.title}" width="100">
                      <span>${review}</span>
                    </li>
                    `).join('')}
                  </ul>
                </div>
              </div>
              </div>
            </div>
            <div class="recomendation-box">
  
            </div>
          `;
  
          movieGrid.style.display = "flex"
  
          document.getElementById("nazad").addEventListener("click", () => {
            displayMovies(filteredMovies);
            movieGrid.style.display = "grid"
          });
  
          document.getElementById("smotret").addEventListener("click", () => {
            window.location.href = movie.url; 
          });
          
  
          document.getElementById("add-review").addEventListener("click", () => {
            const reviewInput = document.getElementById("review-input");
            const reviewText = reviewInput.value.trim();
            if (reviewText) {
              movie.reviews.push(reviewText);
              reviewInput.value = '';
              showFilm(movie);
            }
          });
const recomendationBox = document.querySelector(".recomendation-box");
fetch("data/movies.json")
  .then(response => response.json())
  .then(allMovies => {

    const otherMovies = allMovies.filter(m => m.title !== movie.title);
    const recommended = otherMovies.sort(() => Math.random() - 0.1).slice(0, 3);
    let recHTML = "<h4>Рекомендуемые фильмы:</h4>";
    recommended.forEach(rec => {
      recHTML += `
        <div class="rec-movie" data-title="${rec.title}">
          <img class="rec-img" src="${rec.image}" alt="${rec.title}" width="100">
          <p class="rec-title">${rec.title}</p>
          <p class="rec-genres"><strong>Жанр:</strong> ${movie.genres} </p>
          <p class="rec-duration"><strong>Продолжительность:</strong> ${movie.duration ? movie.duration + ' мин.' : 'Неизвестно'}</p>
        </div>
      `;
    });
    recomendationBox.innerHTML = recHTML;
    document.querySelectorAll(".rec-movie").forEach(item => {
      item.addEventListener("click", () => {
        const selectedTitle = item.getAttribute("data-title");
        const selectedMovie = allMovies.find(m => m.title === selectedTitle);
        if (selectedMovie) {
          showFilm(selectedMovie);
        }
      });
    });
  })
  .catch(error => console.error("Ошибка загрузки рекомендованных фильмов:", error));
        }
      }else{
        movieGrid.style.display = "flex"
        movieGrid.innerHTML = `Сіз өкінішке орай тіркелмегенсіз.<a href="" id="profile-link">Тіркелу</a>`
      }
    });
  }

  const profileLink = document.getElementById("profile-link");
  const loginModal = document.getElementById("login-modal");
  if (profileLink && loginModal) {
    profileLink.addEventListener("click", (e) => {
      e.preventDefault();
      loginModal.style.display = "block";
    });
  }

  const closeButton = document.querySelector(".modal .close");
  if (closeButton) {
    closeButton.addEventListener("click", () => {
      loginModal.style.display = "none";
    });
  }

  const showRegisterLink = document.getElementById("show-register");
  const showLoginLink = document.getElementById("show-login");
  const authSection = document.getElementById("auth-section");
  const registerSection = document.getElementById("register-section");
  if (showRegisterLink) {
    showRegisterLink.addEventListener("click", (e) => {
      e.preventDefault();
      authSection.style.display = "none";
      registerSection.style.display = "block";
    });
  }
  if (showLoginLink) {
    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault();
      authSection.style.display = "block";
      registerSection.style.display = "none";
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === loginModal) {
      loginModal.style.display = "none";
    }
  });
});

const searchMovies = (movies, query) => {
  return movies.filter(movie => {
    const titleMatch = movie.title.toLowerCase().includes(query.toLowerCase());
    const genreMatch = movie.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()));
    return titleMatch || genreMatch;
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('register-form');
  const loginForm = document.getElementById('login-form');

  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.querySelector('.login1').value;
    const email = document.querySelector('.email1').value;
    const password = document.querySelector('.password1').value;
    const selectedGenres = Array.from(document.querySelectorAll('.label-box input:checked')).map(input => input.nextElementSibling.textContent);

    if (localStorage.getItem(username)) {
      alert('Такой пользователь уже существует!');
      return;
    }

    const userData = { username,email, password, genres: selectedGenres };
    localStorage.setItem(username, JSON.stringify(userData));
    alert('Регистрация успешна! Теперь войдите в аккаунт.');

    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('register-section').style.display = 'none';
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.querySelector('.login').value;
    const password = document.querySelector('.password').value;

    const storedUser = localStorage.getItem(username);
    if (!storedUser) {
      alert('Пользователь не найден!');
      return;
    }

    const userData = JSON.parse(storedUser);
    if (userData.password === password) {
      alert(`Вход успешен! Ваши любимые жанры: ${userData.genres.join(', ') || 'не выбраны'}`);
      localStorage.setItem('currentUser', JSON.stringify([{username:userData.username,genre:userData.genres,current:true}]));
      document.querySelector('#nav-list #profile-link').style.display = 'none';
      document.querySelector('.modal-content').style.display = 'none';

      let currentUsername = JSON.parse(localStorage.getItem("currentUser"));
      let li = document.createElement('li');
      li.innerHTML = `<a href="" id="link">Привет, ${currentUsername[0].username}</a>`
      document.getElementById('nav-list').appendChild(li)
    } else {
      alert('Неверный пароль!');
    }
  });
});

const searchMovie = (movies, query) => {
  const lowerQuery = query.toLowerCase();
  return movies.filter(movie => 
    movie.title.toLowerCase().includes(lowerQuery) ||
    movie.genres.some(genre => genre.toLowerCase().includes(lowerQuery))
  );
};

function showUserProfile(user) {
  let profileDiv = document.getElementById("user-profile");

  if (!profileDiv) {
      profileDiv = document.createElement("div");
      profileDiv.id = "user-profile";
      document.body.appendChild(profileDiv);
  }

  profileDiv.innerHTML = `
    <div class="profile-content" style="position: relative;">
      <button id="back-btn">X</button>
      <img src="data:image/png;base64,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" alt="User" class="user-profile-img">
      <h3 class="user-profile-h3">Привет, ${user.username}!</h3>
      <p class="user-profile-p">Любимые жанры: ${user.genre ? user.genre.join(', ') : 'Нет данных'}</p>
      <button id="logout-btn">Выйти</button>
  `;

  document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("currentUser");
    profileDiv.remove();
    location.reload();
});

document.getElementById("back-btn").addEventListener("click", (e) => {
  e.stopPropagation(); 
  profileDiv.remove();
});

document.addEventListener("click", function clickOutside(e) {
  if (!profileDiv.contains(e.target)) {
      profileDiv.remove();
      document.removeEventListener("click", clickOutside);
  }
});
}

let currentUser = JSON.parse(localStorage.getItem("currentUser"));
if (currentUser && currentUser.length) {
  showUserProfile(currentUser[0]);
}  
