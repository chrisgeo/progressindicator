var indicator = angular.module('indicator', []);


indicator.directive('indicatorWidget', [function (){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        controller: function($scope, $element, $attrs){
            var diff = ($scope.expected - $scope.actual)/$scope.expected,
                svg = d3.select($element.find('svg')),
                circle = $element.find('circle')[0],
                radius = circle.r.baseVal.value,
                cx = circle.cx,
                cy = circle.cy;

            $scope.radius = radius;

            function convertToRads(angle){
                return angle * (Math.PI / 180);
            }

            function findDegress(percentage){
                return 360 * percentage;
            }

            $scope.findPathColor = function(){
                return (diff < 0.25) ? 'all-good' :
                        ((diff >= 0.25 && diff < 0.5) ? 'not-so-good' :
                        'way-behind');
            };

            $scope.innerArc = function(){
                var end = findDegress($scope.expected),
                    radius = $scope.radius + 8; // Move out a little

                return d3.svg.arc()
                        .innerRadius(radius)
                        .outerRadius(radius)
                        .startAngle(0)
                        .endAngle(convertToRads(end));
            };

            $scope.outerArc = function(){
                var end = findDegress($scope.actual),
                    radius = $scope.radius + 14; // Move out a little

                return d3.svg.arc()
                        .innerRadius(radius)
                        .outerRadius(radius)
                        .startAngle(0)
                        .endAngle(convertToRads(end));
            };
        },
        templateUrl: 'indicator.html',
        link: function(scope, element, attrs){
            scope.actual_formatted = (scope.actual * 100).toFixed(0);
        },
        scope: {
            actual: '@',
            expected: '@'
        }
    };
}]);

indicator.directive('innerPath', function(){
    return {
        restrict: 'A',
        transclude: true,
        requires: 'indicatorWidget',
        link: function(scope, element, attrs, ctrl){
            var arc = d3.select(element[0]),
                innerArc = scope.innerArc(),
                color = (scope.diff < 0.25) ? 'all-good' :
                        ((scope.diff >= 0.25 && scope.diff < 0.5) ? 'not-so-good' :
                        'way-behind');

            arc.attr('d', innerArc)
                .attr("transform", "translate(75,75)");
        }
    };
});

indicator.directive('outerPath', function(){
    return {
        restrict: 'A',
        transclude: true,
        requires: 'indicatorWidget',
        link: function(scope, element, attrs){
            var arc = d3.select(element[0]),
                innerArc = scope.outerArc();

            arc.attr('d', innerArc)
                .attr("transform", "translate(75,75)");

            element.addClass(scope.findPathColor());
        }
    }; 
});
