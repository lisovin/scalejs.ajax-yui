
define('yui',[],function () {
    
    // because it's easier then typeof, and undefined isn't allowed in ES5
    var notDefined,
        Y,
        defaultSrc = 'http://yui.yahooapis.com/3.4.1/build/yui/yui-min.js';

    function loadModule(name, load, config) {
        if (config.isBuild) {
            //buildMap[name] = true;
            load(Y);
        } else {
            // split the name into an array, with modules that YUI.use
            // needs to load.
            var useParams = name.split(',');

            // If it's just trying to load YUI, return that
            if (name === 'yui') {
                return load(Y);
            }

            // Add a callback for Y.use as the end of useParams
            useParams.push(function (Y) {
                // tell RequireJS Y has been loaded
                load(Y);
            });

            Y.use.apply(Y, useParams);
        }
    }

    return {
        load: function (name, req, load, config) {
            var src,
                configYUI = config.YUI;

            // YUI is loaded, load the module
            if (Y) {
                loadModule(name, load, config);

                // YUI isn't loaded, load it from the config.
            } else if (typeof YUI === 'undefined') {
                if (typeof configYUI === 'string') {
                    src = configYUI;
                    configYUI = notDefined;
                } else if (typeof configYUI === 'object') {
                    src = configYUI.src;
                } else {
                    src = defaultSrc;
                    configYUI = notDefined;
                }

                req([src], function () {
                    // Create a YUI instance, for modules using this plugin
                    if (Y) {
                        loadModule(name, load, config);
                    } else {
                        if (typeof YUI != 'undefined') {
                            Y = YUI(configYUI);
                        }
                        loadModule(name, load, config);
                    }
                });

                // YUI is loaded and Y isn't assigned yet
            } else if (Y === notDefined) {
                // create a new YUI instance
                Y = YUI(configYUI);
                loadModule(name, load, config);

                // YUI wasn't found, throw an error
            } else {
                throw 'YUI could not be located';
            }
        },

        write: function (pluginName, moduleName, write, config) {
            write.asModule("yui!"+moduleName, "define(['yui!base,"+moduleName+"'], function (Y) { return Y;});\n");
        } 
    };
})
;
define('yui!io',['yui!base,io'], function (Y) { return Y;});

/*global define*/
define('scalejs.ajax-yui/ajax',[
    'yui!io',
    'scalejs!core'
], function (
    Y,
    core
) {
    

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

define('yui!json',['yui!base,json'], function (Y) { return Y;});

/*global define,console,document*/
define('scalejs.ajax-yui/json',[
    'yui!json'
], function (
    Y
) {
    

    function toJson(obj) {
        return Y.JSON.stringify(obj);
    }

    function fromJson(json) {
        if (json === "") {
            return {};
        }
        return Y.JSON.parse(json);
    }

    return {
        toJson: toJson,
        fromJson: fromJson
    };
});

/*global define*/
define('scalejs.ajax-yui',[
    'scalejs.ajax-yui/ajax',
    'scalejs.ajax-yui/json'
], function (
    ajax,
    json
) {
    

    return {
        ajax: ajax,
        json: json
    };
});

