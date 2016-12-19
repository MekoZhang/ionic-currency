angular.module('starter.controllers', [])

    .controller('MainCtrl', function ($rootScope, $scope, $state, $http, $ionicListDelegate, $ionicPopup, currencyService) {

        if (!$rootScope.hasInited) {
            var url = "";
            $http.get(url + "data/currency.json")
                .then(function (response) {
                    currencyService.init(response.data);
                    $rootScope.hasInited = true;
                    $scope.currencyList = currencyService.getUserCurrency()
                })
            ;
        } else {
            $scope.currencyList = currencyService.getUserCurrency();
        }

        $scope.input = 213124124.22132;

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
        };
    })
    .controller('SwapCtrl', function ($rootScope, $scope, $state, $stateParams,
                                      $timeout, $location, $ionicScrollDelegate, $ionicViewSwitcher, currencyService) {

        $scope.targetText = '';
        $scope.currencyList = currencyService.getGroupCurrency();
        $scope.hotCurrencyList = currencyService.getHotCurrency();
        var index = $stateParams.index;

        $scope.onSwipeRight = function () {
            $state.go("main");
        };
        $scope.back = function () {
            $state.go("main");
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