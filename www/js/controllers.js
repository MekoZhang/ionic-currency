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

        $scope.items = [
            {id: 'CNY', name: '人民币', symbol: '¥'},
            {id: 'USD', name: '美元', symbol: '$'},
            {id: 'USD', name: '美元', symbol: '$'},
            {id: 'USD', name: '美元', symbol: '$'},
            {id: 'USD', name: '美元', symbol: '$'},
            {id: 'USD', name: '美元', symbol: '$'},
            {id: 'EUR', name: '欧元', symbol: '€'}
        ];
    })
    .controller('SwapCtrl', function ($scope, $state) {
        $scope.onSwipeRight = function() {
            $state.go("main");
        };
        $scope.back = function () {
            $state.go("main");
        };
        $scope.search = function () {
            $state.go("search");
        };
        $scope.right_bar_swipe = function (e) {
            console.log(e);
        }
    })
    .controller('SearchCtrl', function ($scope, $state) {
        $scope.cancel = function () {
            $state.go("main");
        };
    })
;