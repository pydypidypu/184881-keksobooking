
'use strict';

window.Utils = (function () {

  var getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  /*
   * Функция возвращает окончание для множественного числа слова на основании числа и массива окончаний
   * param   iNumber Integer Число на основе которого нужно сформировать окончание
   * param  aEndings Array Массив слов или окончаний для чисел (1, 4, 5),
   *         например ['яблоко', 'яблока', 'яблок']
   * return String
   */
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

  return {
    getRandomInt: getRandomInt,
    getNumEnding: getNumEnding,
  };
})();
