const qrcode1 = QRCreator('Привет, Мир!',
{ mode: 4,
  eccl: 0,
  version: 3,
  mask: -1,
  image: 'html',
  modsize: -1,
  margin: 1
});
// const qrcode2 = QRCreator('Привет, Мир!', { mode: 1});

const content = (qrcode) =>{
  return qrcode.error ?
    `недопустимые исходные данные ${qrcode.error}`:
     qrcode.result;
};

document.getElementById('qrcode1').append( '', content(qrcode1));
// document.getElementById('qrcode2').append( 'QR-код № 2: ', content(qrcode2));
