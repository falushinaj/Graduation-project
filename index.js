// рендер карточки фильма из полученых данных
function renderFilms(data) {
    const mainEl = document.querySelector('main'); //элемент контэйнер
    const films = data.films.result;
    const halls = data.halls.result;
    const seances = data.seances.result.map(seance => ({...seance, seance_start: parseInt(seance.seance_start)}));//получаю массив сеансов и делаю seance_start числов для удобной работы
    const nowToMinutes = (date => date.getHours() * 60 + date.getMinutes() + 1)(new Date()); // сколько минут прошло с 00
    const isTodayFilms = Boolean(document.querySelector('.page-nav__day_today.page-nav__day_chosen')); // если показ фильмов сегодня то true
    const today = document.querySelector('.page-nav__day_chosen').getAttribute('data-date');

    //итерирую массив фильмов
    films.forEach((film) => {
        const suitableSeances = seances.filter(seance => seance.seance_filmid === film.film_id); //получаю сеансы которые относятся к фильму
        const hallWithSeances = halls.map((hall) => {
            const suitableHalls = suitableSeances
                .filter(seances => seances.seance_hallid === hall.hall_id)
                .sort((a, b) => a.seance_start - b.seance_start); //сортирую сеансы по времени

            if (suitableHalls.length) return {...hall, seances: suitableHalls};
        }).filter(hall => hall); // получаю массив залов и сеансы которые будут в этом зале

        //создаю шаблон верстки зала с сеансами
        const hallHTMLTemplate = hallWithSeances.map((hall) => {
            const seancesHTMLTemplate = hall.seances.map((seance) => `<li class="movie-seances__time-block">
                    <a 
                        class="movie-seances__time ${seance.seance_start < nowToMinutes && isTodayFilms ? "movie-seances__time_disabled" : ""}"
                        href="hall.html?hallId=${seance.seance_hallid}&seanceId=${seance.seance_id}&date=${today}"
                     >${seance.seance_time}</a>
                </li>`).join(" ");

            return `
                <div class="movie-seances__hall">
                    <h3 class="movie-seances__hall-title">${hall.hall_name}</h3>
                    <ul class="movie-seances__list">  
                        ${seancesHTMLTemplate}
                    </ul>
                </div>`
        }).join(" ")

        //создаю шаблон верстки карточки фильма
        const filmHTMLTemplate = `
            <section class="movie">
                <div class="movie__info">
                    <div class="movie__poster">
                        <img class="movie__poster-image" alt="${film.film_name}" src="${film.film_poster}">
                    </div>
                    <div class="movie__description">
                        <h2 class="movie__title">${film.film_name}</h2>
                        <p class="movie__synopsis">${film.film_description}</p>
                        <p class="movie__data">
                            <span class="movie__data-duration">${film.film_duration}</span>
                            <span class="movie__data-origin">${film.film_origin}</span>
                        </p>
                    </div>
                </div> 
                ${hallHTMLTemplate}
            </section>`
        mainEl.insertAdjacentHTML("beforeend", filmHTMLTemplate) //добавляю карточку фильма в верстку
    })
}

//функция запроса фильмов по дате
function requestFilms(date) { //date это дата за которую нужно получить список фильмов
    request('event=update' + (date ? `&date=${date}` : ''))
        .then(renderFilms)
}

//функция изменения активной даты и вывода фильмов для этой даты
function changeDay(date) {
    //делаю активной дату по которой произошел клик
    document.querySelectorAll('.page-nav__day').forEach((el) => {
        if (el.getAttribute("data-date") === date) el.classList.add('page-nav__day_chosen');
        else el.classList.remove('page-nav__day_chosen')
    })
    document.querySelector('main').innerHTML = ""; //стираем старый список фильмов
    //отправляю запрос по дате
    requestFilms(date);
}

//рендер дней денели
function renderWeek() {
    const container = document.getElementById('week-navigate');
    const date = new Date();
    const day = date.getDate();
    const dayIntl = new Intl.DateTimeFormat('ru-RU', {
        weekday: "short"
    }); //интернализация даты в формате сокращенных наименований дней недели ПН, ВТ,...

    //делаю цикл для рендера дней на 7 дней вперед
    for (let dayIdx = 0; dayIdx < 7; dayIdx++) {
        const currentDate = new Date();
        currentDate.setDate(day + dayIdx);
        const currentDay = currentDate.getDate();
        const currentDayOfWeek = currentDate.getDay();
        const dateString = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDay}`;

        //шаблон для
        const dayHTMLTemplate = `
         <a 
            data-date="${dateString}"
            onclick="changeDay(this.getAttribute('data-date'))"
            class="page-nav__day ${currentDay === day ? 'page-nav__day_today page-nav__day_chosen' : ''}" 
            href="#"
          >
          <!--Выделение выходных дней красным-->
          <span class="page-nav__day-week ${currentDayOfWeek === 0 || currentDayOfWeek === 6 ? 'page-nav__day_weekend' : ''}"> 
            ${dayIntl.format(currentDate)}</span><span class="page-nav__day-number">${currentDay}
          </span>
        </a>`;
        //добавляю шаблон в контеинер
        container.insertAdjacentHTML("beforeend", dayHTMLTemplate)
    }
}

renderWeek(); //делаю начальный рендер дней
requestFilms();//делаю запрос фильмов на текущий день и рендерю их