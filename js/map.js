/* global Utils */
/* global Data */

'use strict';

window.Map = (function () {
  var Ads = [];
  var map = document.querySelector('.map');

  var renderPins = function () {
    var fragmentLabel = document.createDocumentFragment();
    var pin = document.querySelector('.map__pin');
    var pinW = window.getComputedStyle(pin).width.replace('px', '');
    var pinH = window.getComputedStyle(pin).height.replace('px', '');

    for (var i = 0; i < Ads.length; i++) {
      var labelElement = pin.cloneNode(true);
      labelElement.setAttribute('data-id', i);
      labelElement.classList.remove('map__pin--main');
      labelElement.classList.add('map__pin--adv');
      var x = Ads[i].location.x - pinW / 2;
      var y = Ads[i].location.y - pinH;
      labelElement.setAttribute('style', 'left:' + x + 'px; top:' + y + 'px;');
      labelElement.querySelector('img').setAttribute('src', Ads[i].author.avatar);
      labelElement.querySelector('svg').remove();
      fragmentLabel.appendChild(labelElement);
    }

    document.querySelector('.map__pins').appendChild(fragmentLabel);
  };

  var showPinCard = function (info) {
    var AdTemplate = document.querySelector('template');
    var article = AdTemplate.content.querySelector('article.map__card.popup');

    var adElement = article.cloneNode(true);
    adElement.querySelector('h3').textContent = info.offer.title;
    adElement.querySelector('small').textContent = info.offer.address;
    adElement.querySelector('.popup__price').textContent = info.offer.price + '₽/ночь';
    adElement.querySelector('.popup__price').innerHTML = info.offer.price + '&#x20bd; ₽/ночь';
    adElement.querySelector('h4').textContent = info.offer.type_title;
    adElement.querySelector('.popup__desc').textContent = info.offer.rooms + ' ' + Utils.getNumEnding(info.offer.rooms, ['комната', 'комнаты', 'комнат']) + ' для ' + info.offer.guests + ' ' + Utils.getNumEnding(info.offer.guests, ['гостя', 'гостей', 'гостей']);
    adElement.querySelector('.popup__times').textContent = 'Заезд после ' +
    info.offer.checkin + ', выезд до ' + info.offer.checkout;

    var fList = adElement.querySelector('.popup__features');
    var liTpl = fList.children[0].cloneNode();
    liTpl.classList.remove('feature--wifi');
    fList.innerHTML = '';
    var featuresFragment = document.createDocumentFragment();
    for (var i = 0; i < info.offer.features.length; i++) {
      var li = liTpl.cloneNode();
      li.classList.add('feature--' + info.offer.features[i]);
      featuresFragment.appendChild(li);
    }

    fList.appendChild(featuresFragment);

    adElement.children[9].textContent = info.offer.description;
    adElement.querySelector('.popup__pictures').children[0].setAttribute('src', info.author.avatar);
    var fragmentAd = document.createDocumentFragment();
    fragmentAd.appendChild(adElement);
    map.appendChild(fragmentAd);
    document.querySelector('.map__card').classList.remove('hidden');
  };

  var enableMap = function () {
    map.classList.remove('map--faded');

    var noticeForm = document.querySelector('.notice__form');
    var fieldsets = noticeForm.querySelectorAll('fieldset');

    for (var i = 0; i < fieldsets.length; i++) {
      fieldsets[i].removeAttribute('disabled');
    }

    noticeForm.classList.remove('notice__form--disabled');
  };

  var ESC_KEYCODE = 27;

  var closePopup = function (event) {
    if (event.keyCode === ESC_KEYCODE || event.type === 'click') {
      var popup = document.querySelector('.map__card');
      popup.remove();
      document.querySelector('.map__pin--active').classList.remove('map__pin--active');
    }
  };

  var timeChange = function (time1, time2) {
    var selectedIndex = time1.options.selectedIndex;
    time2.options[selectedIndex].selected = true;
  };

  var priceChange = function () {
    if (price.value >= 10000) {
      inputType.options[3].selected = true;

      return;
    }

    if (price.value >= 5000 && price.value < 10000) {
      inputType.options[2].selected = true;

      return;
    }

    if (price.value >= 1000 && price.value < 5000) {
      inputType.options[0].selected = true;
    }

    if (price.value < 1000) {
      inputType.options[1].selected = true;
    }
  };

  var capacity = document.querySelector('#capacity');
  var roomNumber = document.querySelector('#room_number');
  var roomNumberMax = roomNumber.options[3].value;

  var roomNumberCorrect = function () {
    var roomNumberValue = +roomNumber.value;
    var capacityValue = +capacity.value;
    roomNumber.style.outline = 'none';

    if (roomNumberValue < capacityValue) {
      capacity.value = roomNumberValue;
    }

    if (roomNumberValue === roomNumberMax) {
      capacity.value = 0;
    }

  };

  var validForm = function (event) {
    var roomNumberValue = roomNumber.value;
    var capacityValue = capacity.value;
    if ((roomNumberValue !== roomNumberMax && capacityValue === '0') || (roomNumberValue < capacityValue)) {
      roomNumber.style.outline = '2px solid rgba(255,0,0,0.5)';
      event.preventDefault();
    }
  };

  var initMap = function () {

    Data.load(function (pinsData) {
      Ads = pinsData;

      renderPins(Ads);

      map.addEventListener('click', function (event) {
        var id;
        if (event.target.nodeName === 'IMG') {
          id = event.target.parentNode.getAttribute('data-id');
        } else {
          id = event.target.getAttribute('data-id');
        }

        if (event.target.className === 'popup__close') {
          closePopup(event);
        }

        if (!id) {
          return;
        }

        var activePin = document.querySelector('.map__pin--active');
        if (activePin) {
          activePin.classList.remove('map__pin--active');
          document.querySelector('.map__card').remove();
        }

        if (event.target.nodeName === 'IMG') {
          event.target.parentNode.classList.add('map__pin--active');
        } else {
          event.target.classList.add('map__pin--active');
        }

        showPinCard(Ads[id]);
      });

      enableMap();
    });

  };

  document.querySelector('.map__pin--main').addEventListener('click', initMap);
  document.addEventListener('keydown', closePopup);

  var timein = document.querySelector('#timein');
  var timeout = document.querySelector('#timeout');
  timein.addEventListener('change', timeChange.bind(null, timein, timeout));
  timeout.addEventListener('change', timeChange.bind(null, timeout, timein));

  var price = document.querySelector('#price');
  var inputType = document.querySelector('#type');
  price.addEventListener('change', priceChange);

  var formSubmit = document.querySelector('.form__submit');
  roomNumber.addEventListener('change', roomNumberCorrect);
  formSubmit.addEventListener('click', validForm);
  roomNumberCorrect();
})();
