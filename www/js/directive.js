angular.module('starter.directives', [])

    .directive('ecPositionMiddle', ['$window', function ($window) {
        return {
            link: function (scope, iElm) {
                var height = $window.innerHeight - 44 - 49 - iElm[0].offsetHeight;
                if (height >= 0) {
                    iElm[0].style.top = (height + 44) + 'px';
                } else {
                    iElm[0].style.top = 44 + 'px';
                }
            }
        }
    }])

;