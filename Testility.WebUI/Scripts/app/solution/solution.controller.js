﻿(function (angular) {
    angular
        .module('testility.solution')
        .controller('SolutionController', SolutionController)
        .controller('CodeMirrorController', CodeMirrorController);
           
    SolutionController.$inject = ['$scope', 'SolutionService', 'dialogbox', 'messaging'];
    function SolutionController($scope, service, dialogbox, messaging) {
        
        var vm = this;

        service.init();
        messaging.init(SolutionForm, $scope);

        //Members
        vm.Entry = service.Entry;
        vm.Solution = service.Solution;
        //Functions
        vm.IsLoaded = isLoaded;
        vm.AddTab = addTab;
        vm.RemoveTab = removeTab;
        vm.Refresh = refresh;
        vm.Compile = compile;
        vm.Submit = submit;        
        vm.GetReferences = service.Solution.RefList;
        vm.SetReferences = setReferences;
        vm.ChangeSolution = changeSolution;
        vm.editorOptions = {
            lineNumbers: true,
            matchBrackets: true,
            mode: 'text/x-csharp'
        };

        refresh();

        function isLoaded() {
            return service.Loaded;
        }

        function addTab(solutionId) {
            if (service.Loaded) {
                var result = dialogbox.show({
                    caption: 'Specify Name for Item',
                    type: 'DialogBox',
                    buttons: 'OkCancel', 
                    value: 'Class.cs',
                    modal: true
                });
                result.then(function (result) {
                    service.newItem(result);
                }
                , function (result) {
                });
            } else {
                throw 'Solution not loaded';
            }
        };

        function removeTab(index) {
            service.removeItem(index);
        };

        function refresh() {
            messaging.clear();

            service.get()
                .then(function (solution) { },
                      function (error) {
                          dialogbox.show({
                              caption: 'Solution', message: error, icon: 'Error'
                          });
                      });
        };

        function compile() {
            if (service.Loaded) {
                messaging.clear();
                service.compile().then(function (response) {
                    if (Array.isArray(response)) {
                        messaging.add(response);
                    }
                }, function (error) {
                    if (Array.isArray(error)) {
                        messaging.add(error);
                    } else {
                        dialogbox.show({ caption: 'Solution', message: error, icon: 'Error' });
                    }
                });
            } else {
                throw 'Solution not loaded';
            }
        };

        function submit() {
            messaging.clear();
            if (!SolutionForm.$invalid && !SolutionForm.$pending) {
                service.submit().then(function (response) {
                    if (response) {
                        if (response.hasOwnProperty('compileErrors'))
                            messaging.add(response.compileErrors);
                    }
                }, function (error) {
                    if (Array.isArray(error)) {
                        messaging.add(error);
                    } else {
                        dialogbox.show({ caption: 'Solution', message: error, icon: 'Error' });
                    }
                });
            }
        };

        function setReferences(ref) {
            service.Solution.RefList = ref;
        };

        function changeSolution() {
            service.changeSolution(function (response) {                
            }, function (error) {
                if(error) {
                    dialogbox.show({ caption: 'Solution', message: error, icon: 'Error' });
                }
            });
        };
    };

    CodeMirrorController.$inject = ['$scope'];
    function CodeMirrorController($scope) {
        var vm = this;
        vm.Code = $scope.$parent.item.Code;
    

        $scope.$watch("code", function (newValue, oldValue) {
            if (newValue !== oldValue) {
                $scope.$parent.item.Code = newValue;
            }
        });
    };
})(window.angular);
    