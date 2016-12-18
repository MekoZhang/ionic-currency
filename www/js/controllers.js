angular.module('starter.controllers', [])

    .controller('MainCtrl', function ($scope, $state, $ionicListDelegate) {

        $scope.input = 213124124.22132;

        $scope.swap = function (item) {
            $state.go("swap");
            $ionicListDelegate.closeOptionButtons();
        };

        $scope.remove = function (item) {
            console.log(item);
            $ionicListDelegate.closeOptionButtons();
        };

        $scope.doAdd = function () {
            $state.go("swap");
            $scope.$broadcast('scroll.refreshComplete');
        };

        $scope.selectItem = function (item) {
            angular.forEach($scope.items, function (i) {
                i.selected = false;
            });
            item.selected = true;
        };

        $scope.items = [
            {id: 'CNY', name: '人民币', symbol: '¥', selected: true},
            {id: 'USD', name: '美元', symbol: '$'},
            {id: 'USD', name: '美元', symbol: '$'},
            {id: 'USD', name: '美元', symbol: '$'},
            {id: 'USD', name: '美元', symbol: '$'},
            {id: 'USD', name: '美元', symbol: '$'},
            {id: 'EUR', name: '欧元', symbol: '€'}
        ];
    })
    .controller('SwapCtrl', function ($rootScope, $scope, $state, $timeout, $location, $ionicScrollDelegate, $ionicViewSwitcher, currencyService) {

        $scope.targetText = '';
        $scope.currencyList = currencyService.getGroupCurrency();
        $scope.hotCurrencyList = currencyService.getHotCurrency();

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
            console.log(item);
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
    .controller('SearchCtrl', function ($scope, $state, $ionicViewSwitcher, currencyService) {
        $scope.searchText = "";
        $scope.currencyList = currencyService.getAllCurrency();

        $scope.cancel = function () {
            $ionicViewSwitcher.nextDirection('exit');
            $state.go("swap");
        };

        $scope.itemClick = function (item) {
            console.log(item);
        }
    })
;