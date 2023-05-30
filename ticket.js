window.addEventListener('load', () => {
    const film = JSON.parse(localStorage.getItem('film'));
    const seance = JSON.parse(localStorage.getItem('seance'));
    const places = JSON.parse(localStorage.getItem('places')).map(({row, char}) => ` ${row}/${char}`);
    const hall = JSON.parse(localStorage.getItem('hall'));
    const price = JSON.parse(localStorage.getItem('price'));

    // по ключу дополняем историю покупок
    const key = `${seance.day}_${seance.seance_start}_${seance.seance_id}_${seance.seance_hallid}`;
    const historyBuy = JSON.parse(localStorage.getItem('historyBuy')) || {};
    historyBuy[key] = hall.hall_config;

    //сохраняем историю покупок
    localStorage.setItem('historyBuy', JSON.stringify(historyBuy))

    document.getElementById('ticket_title').textContent = film.film_name;
    document.getElementById('ticket_places').textContent = places;
    document.getElementById('ticket_hall').textContent = hall.hall_name.replace(/[^+\d]/g, '');
    document.getElementById('ticket_seance').textContent = seance.seance_time;

    // данные для qr кода
    const data = JSON.stringify({
        ticket_title: film.film_name,
        ticket_places: places.join(", "),
        ticket_hall: hall.hall_name,
        ticket_seance: seance.seance_time,
        ticket_price: price
    });

    //добавляем qr код в элемент
    document.getElementById('qrcode').append(QRCreator(data,
        {
            mode: 4,
            image: 'png',
        }).result)
})