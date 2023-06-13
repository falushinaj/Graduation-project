
// базовая функция запросов
async function request(body) {
    return fetch("https://jscp-diplom.netoserver.ru/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded; charset=utf-8"
        },
        body
    })
        .then(res => res.json()) //распаршиваем ответ json в объект
}
