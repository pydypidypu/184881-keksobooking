
'use strict';

/**
 * Функция возвращает окончание для множественного числа слова на основании числа и массива окончаний
 * @param  iNumber Integer Число на основе которого нужно сформировать окончание
 * @param  aEndings Array Массив слов или окончаний для чисел (1, 4, 5),
 *         например ['яблоко', 'яблока', 'яблок']
 * @return String
 */
var FLATS = ['комната', 'комнаты', 'комнат'];
var GUESTS = ['гостя', 'гостей', 'гостей'];
var getNumEnding = function (iNumber, aEndings) {
  var sEnding;
  var i;
  iNumber = iNumber % 100;
  if (iNumber >= 11 && iNumber <= 19) {
    sEnding = aEndings[2];
  } else {
    i = iNumber % 10;
    switch (i) {
      case (1): sEnding = aEndings[0]; break;
      case (2):
      case (3):
      case (4): sEnding = aEndings[1]; break;
      default: sEnding = aEndings[2];
    }
  }

  return sEnding;
};

var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

var TYPES = {
  flat: 'Квартира',
  house: 'Дом',
  bungalo: 'Бунгало',
};
var TIMES = ['12:00', '13:00', '14:00'];

var getRandomInt = function (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Функция генерации случайных данных
var genrRandom = function (array, repeat) {
  var index = getRandomInt(0, array.length - 1);
  var randomValue = array[index];
  if (!repeat) {
    array.splice(index, 1);
  }

  return randomValue;
};

var avatars = [1, 2, 3, 4, 5, 6, 7, 8];
var Ads = [];
var countAd = 8;

// Генерация объявлений
var genrAds = function () {
  for (var i = 0; i < countAd; i++) {
    var Ad = {};
    var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
    var features = [];
    features.length = getRandomInt(1, FEATURES.length);
    for (var j = 0; j < features.length; j++) {
      features[j] = genrRandom(FEATURES, false);
    }

    Ad = {
      location: {
        x: getRandomInt(300, 900),
        y: getRandomInt(100, 500),
      },
      author: {
        avatar: 'img/avatars/user0' + genrRandom(avatars, false) + '.png',
      },
      offer: {
        title: genrRandom(TITLES, false),
        price: getRandomInt(1000, 1000000),
        type: genrRandom(Object.keys(TYPES), true),
        rooms: getRandomInt(1, 5),
        guests: getRandomInt(1, 10),
        checkin: genrRandom(TIMES, true),
        checkout: genrRandom(TIMES, true),
        features: features,
        description: '',
        photos: [],
      },
    };
    Ad.offer.address = Ad.location.x + ',' + Ad.location.y;
    Ads[i] = Ad;
  }

  return Ads;
};

var map = document.querySelector('.map');
map.classList.remove('map--faded');

var pins = document.querySelector('.map__pins');
var pin = document.querySelector('.map__pin');
var pinMain = document.querySelector('.map__pin--main');

var fragmentLabel = document.createDocumentFragment();

var createLabels = function () {
  genrAds();
  var pinW = window.getComputedStyle(pinMain).width.replace('px', '');
  var pinH = window.getComputedStyle(pinMain).height.replace('px', '');
  for (var i = 0; i < Ads.length; i++) {
    var labelElement = pin.cloneNode(true);
    var x = Ads[i].location.x - pinW / 2;
    var y = Ads[i].location.y - pinH;
    labelElement.setAttribute('style', 'left:' + x + 'px; top:' + y + 'px;');
    labelElement.querySelector('img').setAttribute('src', Ads[i].author.avatar);
    fragmentLabel.appendChild(labelElement);
  }

  pins.appendChild(fragmentLabel);
  return labelElement;
};

var AdTemplate = document.querySelector('template');
var article = AdTemplate.content.querySelector('article.map__card.popup');

var createAd = function () {
  createLabels();
  var adElement = article.cloneNode(true);
  adElement.querySelector('h3').textContent = Ads[0].offer.title;
  adElement.querySelector('small').textContent = Ads[0].offer.address;
  adElement.querySelector('.popup__price').textContent = Ads[0].offer.price + '₽/ночь';
  adElement.querySelector('.popup__price').innerHTML = Ads[0].offer.price + '&#x20bd; ₽/ночь';

  adElement.querySelector('h4').textContent = TYPES[Ads[0].offer.type];
  adElement.querySelector('.popup__desc').textContent = Ads[0].offer.rooms + ' ' + getNumEnding(Ads[0].offer.rooms, FLATS) + ' для ' + Ads[0].offer.guests + ' ' + getNumEnding(Ads[0].offer.guests, GUESTS);
  adElement.querySelector('.popup__times').textContent = 'Заезд после ' +
  Ads[0].offer.checkin + ', выезд до ' + Ads[0].offer.checkout;

  var fList = adElement.querySelector('.popup__features');
  var liTpl = fList.children[0].cloneNode(true);
  fList.innerHTML = '';
  var featuresFragment = document.createDocumentFragment();
  for (var i = 0; i < Ads[0].offer.features.length; i++) {
    var li = liTpl.cloneNode(true);
    li.classList.add('feature--' + Ads[0].offer.features[i]);
    featuresFragment.appendChild(li);
  }

  fList.appendChild(featuresFragment);

  adElement.children[9].textContent = Ads[0].offer.description;
  adElement.querySelector('.popup__pictures').children[0].setAttribute('src', Ads[0].author.avatar);
  var fragmentAd = document.createDocumentFragment();
  fragmentAd.appendChild(adElement);
  map.appendChild(fragmentAd);
};

createAd();
