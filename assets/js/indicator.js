var indicator = angular.module('indicator', []);


indicator.directive('indicatorWidget', [function (){
    return {
        restrict: 'A',
        replace: true,
        transclude: true,
        controller: function($scope, $element, $attrs){
            var diff = ($scope.expected - $scope.actual)/$scope.expected,
                canvasWidth = $element.attr('width'),
                canvasHeight = $element.attr('height'),
                circle = $element.find('circle')[0],
                radius = circle.r.baseVal.value;

            $scope.radius = radius;
            $scope.canvasWidth = canvasWidth;
            $scope.canvasHeight = canvasHeight;
            $scope.spacing = 0.9;

            function convertToRads(angle){
                return angle * (Math.PI / 180);
            }

            function findDegress(percentage){
                return 360 * percentage;
            }

            function getArcValues(index, radius, spacing){
                return {
                    innerRadius: (index + spacing) * radius,
                    outerRadius: (index + spacing) * radius
                };
            }

            $scope.findPathColor = function(){
                return (diff < 0.25) ? 'all-good' :
                        ((diff >= 0.25 && diff < 0.5) ? 'not-so-good' :
                        'way-behind');
            };

            $scope.innerArc = function(){
                var end = findDegress($scope.expected),
                    index = 1.1,
                    arcValues = getArcValues(index, $scope.radius, 0.05);

                return d3.svg.arc()
                        .innerRadius(arcValues.innerRadius)
                        .outerRadius(arcValues.outerRadius)
                        .startAngle(0)
                        .endAngle(convertToRads(end));
            };

            $scope.outerArc = function(){
                var end = findDegress($scope.actual),
                    index = 1.2,
                    arcValues = getArcValues(index, $scope.radius, 0.1);

                return d3.svg.arc()
                        .innerRadius(arcValues.innerRadius)
                        .outerRadius(arcValues.outerRadius)
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
                .attr(
                    "transform", 
                    "translate("+ scope.canvasWidth/2 + "," + scope.canvasHeight/2 + ")"
                );
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
                .attr(
                    "transform", 
                    "translate("+ scope.canvasWidth/2 + "," + scope.canvasHeight/2 + ")"
                );

            element.addClass(scope.findPathColor());
        }
    }; 
});
