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

    .factory('currencyService', ['$rootScope', 'localStorageService', function ($rootScope, localStorageService) {
        return {
            init: function (currencyList, currencyRateList) {

                if (!localStorageService.get("currency")) {
                    localStorageService.update("currency", currencyList);
                }

                if (!localStorageService.get("userCurrency")) {
                    var defaultSymbols = ['CNY', 'CNH', 'USD', 'EUR', 'JPY'];
                    var defaultList = [];
                    var i = 0;
                    angular.forEach(currencyList, function (currency) {
                        var symbol = currency['symbol'];
                        if (defaultSymbols.indexOf(symbol) != -1) {
                            defaultList.push(angular.extend(currency, {
                                selected: i == 0,
                                index: i++
                            }));
                        }
                    });
                    localStorageService.update("userCurrency", defaultList);
                }

                if (!this.getCurrencyRate()) {
                    this.updateCurrencyRate(currencyRateList);
                }
            },
            updateCurrencyRate: function(currencyRateList) {
                if (!!currencyRateList) {
                    var currencyRateMap = {};
                    angular.forEach(currencyRateList, function (currencyRate) {
                        currencyRateMap[currencyRate.resource.fields.symbol.replace('=X', '')] = currencyRate.resource.fields.price;
                    });
                    localStorageService.update("currencyRate", currencyRateMap);
                    $rootScope.$broadcast('user-currency-changed');
                }
            },
            getCurrencyRate: function() {
               return localStorageService.get("currencyRate");
            },
            getUserCurrency: function () {
                var userCurrency = localStorageService.get("userCurrency") || [];
                var currencyRate = this.getCurrencyRate();
                angular.forEach(userCurrency, function (currency) {
                    currency.rate = currencyRate[currency.symbol];
                    currency.value = 0;
                });
                return userCurrency;
            },
            removeUserCurrency: function (index) {
                var currencyList = localStorageService.get("userCurrency");
                var userCurrency = [];
                var i = 0;
                angular.forEach(currencyList, function (currency) {
                    if (currency.index !== index) {
                        userCurrency.push(angular.extend(currency, {
                            index: i++
                        }));
                    }
                });
                localStorageService.update("userCurrency", userCurrency);
            },
            updateUserCurrency: function (index, currency) {
                var currencyList = localStorageService.get("userCurrency");
                if (currencyList.length <= index) {
                    currencyList.push(angular.extend(currency, {
                        index: currencyList.length,
                        selected: false
                    }));
                } else {
                    angular.forEach(currencyList, function (c) {
                        if (c.index === index) {
                            currencyList[index] = angular.extend(currency, {
                                index: index,
                                selected: c.selected
                            });
                        }
                    });
                }
                localStorageService.update("userCurrency", currencyList);
            },
            getAllCurrency: function () {
                var userCurrencySymbols = [];
                angular.forEach(this.getUserCurrency(), function (userCurrency) {
                    userCurrencySymbols.push(userCurrency.symbol);
                });
                var allCurrency = localStorageService.get("currency");
                angular.forEach(allCurrency, function (currency) {
                    if (userCurrencySymbols.indexOf(currency['symbol']) != -1) {
                        currency.hasSelected = true;
                    }
                });
                return allCurrency;
            },
            getGroupCurrency: function () {
                var currencyList = this.getAllCurrency();

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
                var currencyList = this.getAllCurrency();
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