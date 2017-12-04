/* global Utils */
'use strict';

window.Data = (function () {

  var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];

  var TYPES = {
    flat: 'Квартира',
    house: 'Дом',
    bungalo: 'Бунгало',
  };
  var TIMES = ['12:00', '13:00', '14:00'];

  var avatars = [1, 2, 3, 4, 5, 6, 7, 8];
  var Ads = [];
  var countAd = 8;

  // Генерация объявлений
  var generateRandomData = function () {

    var genrRandom = function (array, repeat) {
      var index = Utils.getRandomInt(0, array.length - 1);
      var randomValue = array[index];
      if (!repeat) {
        array.splice(index, 1);
      }

      return randomValue;
    };

    var type = genrRandom(Object.keys(TYPES), true);
    var typeTitle = TYPES[type];

    for (var i = 0; i < countAd; i++) {

      var commonFeatures = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
      var features = [];
      var countFeatures = Utils.getRandomInt(0, commonFeatures.length);
      for (var j = 0; j < countFeatures; j++) {
        features[j] = genrRandom(commonFeatures, false);
      }

      var Ad = {
        location: {
          x: Utils.getRandomInt(300, 900),
          y: Utils.getRandomInt(100, 500),
        },
        author: {
          avatar: 'img/avatars/user0' + genrRandom(avatars, false) + '.png',
        },
        offer: {
          title: genrRandom(TITLES, false),
          price: Utils.getRandomInt(1000, 1000000),
          type: type, typeTitle: typeTitle,
          rooms: Utils.getRandomInt(1, 5),
          guests: Utils.getRandomInt(1, 10),
          checkin: genrRandom(TIMES, true),
          checkout: genrRandom(TIMES, true),
          features: features,
          description: '',
          photos: [],
        },
      };
      Ad.offer.address = Ad.location.x + ',' + Ad.location.y;
      Ads.push(Ad);
    }
  };

  generateRandomData();

  // example use:
  // Data.load(function(ads){
  //  console.log(ads)
  // })

  return {
    load: function (callback) {
      callback(Ads);
    },
  };
})();
