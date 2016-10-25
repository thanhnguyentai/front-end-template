define(['jquery'], function ($) {

    'use strict';

    return {
        getUrlParams: function (url) {
            if (!url || url.length == 0)
                return {};

            var paramStr = url.split("?");
            
            if (paramStr && paramStr.length > 0) {
                paramStr = paramStr[1];

                var params = paramStr.split('&');
                var allParams = {};

                for (var i = 0; i < params.length; i++) {
                    var keyValue = params[i].split('=');

                    if (keyValue && keyValue.length == 2) {
                        try {
                            if(isNaN(keyValue[1])){
                                allParams[keyValue[0]] = keyValue[1];
                            }
                            else {
                                allParams[keyValue[0]] = parseInt(keyValue[1]);
                            }
                        }
                        catch (ex) {
                            allParams[keyValue[0]] = keyValue[1];
                        }
                    }
                }

                return allParams;
            }

            return {};
        }
    };
});
