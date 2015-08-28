﻿angular.module('Testility')
    .controller('SolutionController', ['$scope', 'solutionservice', 'dialogbox', function ($scope, service, dialogbox) {

        $scope.Loaded = false;
        $scope.Solution = service.empty();
        $scope.ReferencesModelSize = 'md';
        $scope.Messages = [];

        $scope.References = function (items) {
            if ($scope.Loaded) {
                if (items !== undefined) $scope.Solution.References = items;
                return $scope.Solution.References || [];
            }
        };

        $scope.addTab = function (solutionId) {
            if ($scope.Loaded) {
                if (!$scope.Solution.Items) $scope.Solution.Items = [];
                var result = dialogbox.show({
                    caption: 'Specify Name for Item',
                    type: 'DialogBox',
                    buttons: 'OkCancel', 
                    value: 'Class.cs',
                    modal: true
                });
                result.then(function (result) {
                    $scope.Solution.Items.push({ Id: 0, Name: result, active: true, SolutionId: $scope.Solution.Id });
                }
                , function (result) {
                });
            }
        };

        $scope.removeTab = function (index) {
            if (!$scope.Solution.Items) $scope.Solution.Items = [];
            if (index <= $scope.Solution.Items.length) {
                $scope.Solution.Items.splice(index, 1);
            }
        };

        $scope.removeMessage = function (index) {
            if (!$scope.Messages) $scope.Messages = [];
            if (index <= $scope.Messages.length) {
                $scope.Messages.splice(index, 1);
            }
        };

        $scope.refresh = function () {
            $scope.Messages = [];
            service.get($scope.Solution).then(function (solution) {
                if (solution) {
                    $scope.Solution = solution;
                    $scope.Loaded = true;
                } else {
                    $scope.Solution = service.empty();
                    $scope.Loaded = false;
                }                
            }, function (error) {
                $scope.Solution = service.empty();
                $scope.Loaded = false;
                dialogbox.show({ caption: 'Solution', message: error, icon: 'Error' });
            });
        };

        $scope.compile = function () {
            if ($scope.Loaded) {
                $scope.Messages = [];
                service.compile($scope.Solution).then(function (response) {
                    if (Array.isArray(response)) {
                        $scope.Messages = $scope.Messages.concat(status);
                    }
                }, function (error) {
                    if (Array.isArray(error)) {
                        $scope.Messages = $scope.Messages.concat(error);
                    } else {
                        dialogbox.show({ caption: 'Solution', message: error, icon: 'Error' });
                    }
                });
            }
        };

        $scope.submit = function () {
            $scope.Messages = [];
            service.submit($scope.Solution).then(function (response) {
                if (response) {
                    if (response.hasOwnProperty('compileErrors'))
                        $scope.Messages = $scope.Messages.concat(response.compileErrors);
                    if (response.hasOwnProperty('solution'))
                        $scope.Solution = response.solution;
                }
            }, function (error) {
                if (Array.isArray(error)) {
                    $scope.Messages = error;
                } else {
                    dialogbox.show({ caption: 'Solution', message: error, icon: 'Error' });
                }
            });
        };

        $scope.refresh();
    }])
    .controller("CodeController", ['$scope', function ($scope) {
        $scope.code = $scope.$parent.item.Code;
        $scope.$watch("code", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.$parent.item.Code = newValue;
            }
        });

    }]).directive('convertNumber', function() {
        return {
            require: 'ngModel',
            link: function(scope, el, attr, ctrl) {
                ctrl.$parsers.push(function(value) {
                    return parseInt(value, 10);
                });

                ctrl.$formatters.push(function(value) {
                    return value.toString();
                });      
            }
        }
    });
    