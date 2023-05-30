window.addEventListener('load', () => {
    // берем данные с локалсторедж
    const film = JSON.parse(localStorage.getItem('film'));
    const seance = JSON.parse(localStorage.getItem('seance'));
    const place = JSON.parse(localStorage.getItem('places'));
    const hall = JSON.parse(localStorage.getItem('hall'));
    const price = JSON.parse(localStorage.getItem('price'));

    // вставляем данные в нужные элементы
    document.getElementById('ticket_title').textContent = film.film_name;
    document.getElementById('ticket_places').textContent = place.map(({row, char}) => ` ${row}/${char}`);
    document.getElementById('ticket_hall').textContent = hall.hall_name.replace(/[^+\d]/g, '');
    document.getElementById('ticket_seance').textContent = seance.seance_time;
    document.getElementById('ticket_price').textContent = price;
})