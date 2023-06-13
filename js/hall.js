window.addEventListener('load', async () => {
    const params = new URLSearchParams(window.location.search); // Получаю квери параметры
    const hallId = params.get('hallId');
    const seanceId = params.get('seanceId');
    const today = params.get('date');

    const {hall, seance, film} = await request(`event=update&date=${today}`) //ассинхронная функция
        .then(({halls, seances, films}) => {
            const hall = halls.result.find(hall => hall.hall_id === hallId);
            const seance = seances.result.find(seance => seance.seance_id === seanceId);
            const film = films.result.find(film => film.film_id === seance.seance_filmid);
            return {hall, seance, film}
        });
    seance.day = today;

    const hallWrapper = document.querySelector('.conf-step__wrapper'); //обертка

    document.querySelector('.buying__info-title').textContent = film.film_name;
    document.querySelector('.buying__info-start').textContent = `Начало сеанса: ${seance.seance_time}`;
    document.querySelector('.buying__info-hall').textContent = hall.hall_name;

    const key = `${seance.day}_${seance.seance_start}_${seance.seance_id}_${seance.seance_hallid}`; // создаем уникальный ключ зала по которому смотрим в локалсторедж
    const historyBuy = JSON.parse(localStorage.getItem('historyBuy'))  || {};  //история покупок

    hallWrapper.insertAdjacentHTML('beforeend', key in historyBuy ?? historyBuy[key].length ? historyBuy[key] : hall.hall_config);

    hallWrapper.addEventListener('click', (e) => {
        const el = e.target;
        const classList = el.classList;

        if (
            classList.contains('conf-step__chair') &&  //проверка что кликнули по месту
            !classList.contains('conf-step__chair_disabled') &&  // если клик не по задизейбленному месту
            !classList.contains('conf-step__chair_taken') // если клик не по занятому месту
        ) classList.toggle('conf-step__chair_selected'); //Переключаем класс места с занятого на незанятое и наоборот
    })

    document.querySelector('.acceptin-button').addEventListener('click', () => {
        let price = 0;
        //по родителю получаем индекс элемента клетки и ряда
        let chairs = Array.from(hallWrapper.querySelectorAll('.conf-step__chair_selected')).reduce((chars, charEl) => {
            const rowEl = charEl.parentNode;
            price+= charEl.classList.contains('conf-step__chair_vip') ? parseInt(hall.hall_price_vip) : parseInt(hall.hall_price_standart);
            return [...chars, {
                row: [].indexOf.call(rowEl.parentNode.children, rowEl) + 1,
                char: [].indexOf.call(rowEl.children, charEl) + 1
            }]
        }, []); //получаю массив выбранных мест

        hall.hall_config = hallWrapper.innerHTML.replace(/conf-step__chair_selected/g, "conf-step__chair_taken"); //выбранные места отмечаем как занятые

        localStorage.setItem('places', JSON.stringify(chairs));
        localStorage.setItem('film', JSON.stringify(film));
        localStorage.setItem('hall', JSON.stringify(hall));
        localStorage.setItem('seance', JSON.stringify(seance));
        localStorage.setItem('price', price.toString());
        window.location.href = "./payment.html"; //переход на страницу оплаты
    })
})

