/*global define*/
define([
    'yui!io',
    'scalejs!core'
], function (
    Y,
    core
) {
    'use strict';

    function ajax(url, options) {
        var observable = core.reactive.Observable,
            fromJson = core.json.fromJson,
            error = core.log.error,
            merge = core.object.merge;

        return observable.create(function (observer) {
            var jsonString,
                cfg;
            /*jslint unparam: true*/
            function success(id, response) {
                var resp = fromJson(response.responseText);
                observer.onNext(resp);
                observer.onCompleted();
            }
            /*jslint unparam: false*/

            /*jslint unparam: true*/
            function failure(id, response) {
                error('Error: "' + response.status + ': ' +
                                response.statusText + '" in response to ajax call "' +
                                jsonString + '" to "' + url + '"');
                observer.onError({
                    status: response.status,
                    statusText: response.statusText,
                    responseText: response.responseText
                });
                observer.onCompleted();
            }
            /*jslint unparam: false*/

            cfg = merge({
                method: 'POST',
                on: {
                    success: success,
                    failure: failure
                }
            }, options);

            Y.io(url, cfg);

            return function () {
            };
        });
    }

    function get(url, data, options) {
        options = core.object.merge(options, {
            type: 'GET',
            data: data
        });

        return ajax(url, options);
    }

    function postMultipart(url, data, options) {
        options = core.object.merge(options, {
            type: 'POST',
            data: data
        });

        return ajax(url, options);
    }

    function postJson(url, data, options) {
        var jsonString = core.json.toJson(data);
        options = core.object.merge(options, {
            type: 'POST',
            data: jsonString,
            contentType: 'application/json;charset=utf-8'
        });

        return ajax(url, options);
    }

    return {
        postJson: postJson,
        postMultipart: postMultipart,
        get: get
    };
});
