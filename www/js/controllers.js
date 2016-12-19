angular.module('starter.controllers', [])

    .controller('MainCtrl', function ($rootScope, $scope, $state, $http, $ionicListDelegate, $ionicPopup, currencyService) {

        $scope.currencyList = currencyService.getUserCurrency();

        $scope.$on('user-currency-changed', function () {
            $scope.currencyList = currencyService.getUserCurrency();
        });

        $scope.showOperation = false;

        $scope.display = 0;
        var operator = 0;
        var memory = [];
        var operand = 0;
        $scope.numbers = function (x) {
            memory.push(x);
            $scope.display = memory.join('') * 1;
            $scope.updateSelectedValue();
        };
        $scope.operation = function (x) {
            operand = $scope.display;
            memory = [];
            operator = x;
        };
        $scope.clear = function () {
            $scope.display = 0;
            operand = 0;
            memory = [];
            $scope.updateSelectedValue();
        };
        $scope.equals = function () {
            if (operator === 1) {
                $scope.display += operand;
            } else if (operator === 2) {
                $scope.display = operand - $scope.display;
            } else if (operator === 3) {
                $scope.display *= operand;
            } else if (operator === 4) {
                $scope.display = operand / $scope.display;
            }
            $scope.updateSelectedValue();
        };


        $scope.write = function (c) {
            $scope.input = "" + $rootScope.$eval($scope.input + c);
            $scope.updateSelectedValue();
        };

        $scope.swap = function (item) {
            $state.go("swap", {index: item.index});
            $ionicListDelegate.closeOptionButtons();
        };

        $scope.remove = function (item) {
            if ($scope.currencyList.length <= 2) {
                $ionicPopup.alert({
                    title: '无法移除',
                    template: '至少保留两个币种'
                });
            } else {
                currencyService.removeUserCurrency(item.index);
                $scope.currencyList = currencyService.getUserCurrency();
            }
            $ionicListDelegate.closeOptionButtons();
        };

        $scope.doAdd = function () {
            $state.go("swap", {index: $scope.currencyList.length});
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.selectItem = function (item) {
            angular.forEach($scope.currencyList, function (i) {
                i.selected = false;
            });
            item.selected = true;
            $scope.updateSelectedValue();
        };

        $scope.updateSelectedValue = function() {
            var selectedItem;
            angular.forEach($scope.currencyList, function (i) {
                if (i.selected) {
                    i.value = $scope.display;
                    selectedItem = i;
                }
            });
            angular.forEach($scope.currencyList, function (i) {
                i.value = (i.rate / selectedItem.rate * selectedItem.value).toFixed(2);
            });
        }
    })
    .controller('SwapCtrl', function ($rootScope, $scope, $state, $stateParams,
                                      $timeout, $location, $ionicScrollDelegate, $ionicViewSwitcher, currencyService) {

        $scope.targetText = '';
        $scope.currencyList = currencyService.getGroupCurrency();
        $scope.hotCurrencyList = currencyService.getHotCurrency();
        var index = $stateParams.index;

        $scope.back = function () {
            $state.go("main");
        };
        $scope.onSwipeRight = function () {
            $scope.back();
        };
        $scope.search = function () {
            $ionicViewSwitcher.nextDirection('enter');
            $state.go("search");
        };
        $scope.itemClick = function (item) {
            if (item.hasSelected) return false;
            currencyService.updateUserCurrency(index, item);
            $state.go("main");
        };
        $scope.right_bar_touch = function (e) {
            var text = e.target.innerText;
            $scope.targetText = text;
            if (text == '☆') {
                $ionicScrollDelegate.scrollTop();
            } else if (text == '#') {
                $ionicScrollDelegate.scrollBottom();
            } else {
                $location.hash('item' + text);
                $ionicScrollDelegate.anchorScroll();
            }
            $timeout(function () {
                $scope.targetText = '';
            }, 1000);
        }
    })
    .controller('SearchCtrl', function ($scope, $state, $stateParams, $ionicViewSwitcher, currencyService) {
        $scope.searchText = "";
        $scope.currencyList = currencyService.getAllCurrency();
        var index = $stateParams.index;

        $scope.cancel = function () {
            $ionicViewSwitcher.nextDirection('exit');
            $state.go("swap", {index: index});
        };

        $scope.itemClick = function (item) {
            if (item.hasSelected) return false;
            currencyService.updateUserCurrency(index, item);
            $state.go("main");
        }
    })
;