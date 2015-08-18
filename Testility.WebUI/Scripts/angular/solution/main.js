﻿var solutionApp = angular.module("solutionApp", []);

solutionApp.controller("ReferenceController", ['$scope', '$http', function ($scope, $http) {
    $scope.ReferencesClick = function (id) {
        if ($scope.References === undefined) {
            $http.get('/References/GetListOfReferences/' + id, 'content.json').then(function (response) {
                $scope.References = response.data.AvailableReferences;
                $scope.SolutionReferences = response.data.SelectedReferences;
            });
        }
    }
    $scope.Selected = function (id) {
        var returnValue = false;
        angular.forEach($scope.SolutionReferences, function (item, key) {
            if (item.Id === id) {
                returnValue = true;
                return;
            }
        });
        return returnValue;
    };
}]);