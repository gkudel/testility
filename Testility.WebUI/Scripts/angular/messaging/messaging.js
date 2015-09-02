﻿angular.module('ui.messaging', [])
    .directive('uiMessaging', ['ui.config', function (uiConfig) {
        return {
            restrict: 'A',
            templateUrl: function (element, attrs) {
                var options = uiConfig.messagingConfig || {
                    templateUrl: '/Views/Shared/_Messaging.html'
                };
                options = angular.extend({}, options, attrs.uiMessaging);
                return options.templateUrl;
            },
        };
    }])
    .factory('messaging', function () {
        var service = function () {
            var _Messages = [];
            var _ErrorMessages = {};
            var _remove = function (index) {
                if (index <= _Messages.length) {
                    _Messages.splice(index, 1);
                }
            };
            var _clear = function (predicat) {
                if (predicat) {
                    for (var i = _Messages.length - 1; i >= 0; i--) {
                        if (predicat(_Messages[i])) {
                            _Messages.splice(i, 1);
                        }
                    }
                } else {
                    _Messages.length = 0;
                }
            };
            var _add = function (message) {               
                if (Array.isArray(message)) {
                    for (var i = 0; i < message.length; i++) {
                        _Messages.push(_createMessage(message[i]));
                    }
                } else {
                    _Messages.push(_createMessage(message));
                }
            };
            var _createMessage = function (message) {
                var m = {
                    Id: '',
                    Alert: 'danger',
                    Message: ''
                };
                if (typeof message === 'object') {
                    m = angular.extend({}, m, message);
                } else {
                    m.Message = message;
                }
                return m;
            }
            return {
                init: function (scope, form) {
                    if (scope) {
                        Object.defineProperty(scope, 'Messages', {
                            get: function () { return _Messages; }
                        });
                        Object.getPrototypeOf(scope).removeMessage = function (index) {
                            _remove(index);
                        };
                        Object.getPrototypeOf(scope).clearMessages = function () {
                            _clear();
                        };
                        Object.getPrototypeOf(scope).addMessage = function (message) {
                            _add(message);
                        };
                        if (form) {
                            angular.forEach(form, function (value, key) {
                                if (value.attributes.getNamedItem('client-validation-enabled')) {
                                    for (var i = 0; i < value.attributes.length; i++) {
                                        var item = value.attributes[i];
                                        if (item.name.indexOf('errormsg-') === 0) {
                                            var name = item.name.substring('errormsg-'.length);
                                            _ErrorMessages[name] = item.value;
                                        }
                                    }
                                    scope.$watchGroup(
                                        [form.name + ".$submitted",
                                         form.name + "." + value.name + '.$touched',
                                         form.name + "." + value.name + '.$invalid',
                                         form.name + "." + value.name + '.$error',
                                         form.name + "." + value.name + '.$name'],
                                        function (n, o, scope) {
                                            if ((n[0] || n[1])) {
                                                _clear(function (message) {
                                                    return message.Id.indexOf(n[4] + '-') === 0;
                                                });
                                                if (n[2] && n[3]) {                                                    
                                                    for (var key in n[3]) {
                                                        if (_ErrorMessages.hasOwnProperty(key)) {
                                                            _add({ Alert: 'danger', Message: _ErrorMessages[key], Id: n[4] + '-' + key });
                                                        }
                                                    }                                                    
                                                }                                                
                                            } 
                                        });
                                }
                            });
                        }
                    }
                },
                get Messages() {
                    return _Messages;
                },
                add: function (message) {
                    _add(message);
                },
                remove: function (index) {
                    _remove(index);
                },
                clear: function(){
                    _clear();
                }
            };
        };
        return new service();
    });