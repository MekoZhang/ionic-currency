angular.module('starter.services', [])
    .factory('localStorageService', [function () {
        return {
            get: function (key, defaultValue) {
                var stored = localStorage.getItem(key);
                try {
                    stored = angular.fromJson(stored);
                } catch (error) {
                    stored = null;
                }
                if (defaultValue && stored === null) {
                    stored = defaultValue;
                }
                return stored;
            },
            update: function (key, value) {
                if (value) {
                    localStorage.setItem(key, angular.toJson(value));
                }
            },
            clear: function (key) {
                localStorage.removeItem(key);
            }
        }
    }])

    .factory('currencyService', ['localStorageService', function (localStorageService) {
        return {
            init: function (currencyList) {
                localStorageService.update("currency", currencyList);
            },
            getAllCurrency: function () {
                return localStorageService.get("currency");
            },
            getGroupCurrency: function () {
                var currencyList = localStorageService.get("currency");

                var groupMap = {};
                angular.forEach(currencyList, function (currency) {
                    var currencyName = currency['currency_name_Pinyin'];
                    var prefix = currencyName.substr(0, 1);
                    var groupCurrencyList = groupMap[prefix] || [];
                    groupCurrencyList.push(currency);
                    groupMap[prefix] = groupCurrencyList;
                });

                var sortObject = function (obj) {
                    return Object.keys(obj).sort().reduce(function (result, key) {
                        result[key] = obj[key];
                        return result;
                    }, {});
                };

                return sortObject(groupMap);
            },
            getHotCurrency: function () {
                var currencyList = localStorageService.get("currency");
                var hotSymbols = ['CNY', 'CNH', 'USD', 'EUR', 'JPY'];

                var hotList = [];
                angular.forEach(currencyList, function (currency) {
                    var symbol = currency['symbol'];
                    hotSymbols.indexOf(symbol) != -1 && hotList.push(currency);
                });
                return hotList;
            }
        }
    }])
;