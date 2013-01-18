/*global define,describe,expect,it,runs,waitsFor,console,spyOn*/
/*jslint sloppy: true*/
/// <reference path="../Scripts/jasmine.js"/>
/// <reference path="../Scripts/rx.js"/>
/// <reference path="../Scripts/json2.js"/>
define([
    'scalejs!core',
    'scalejs!application'
], function (core) {
    var ajax = core.ajax,
        json = core.json;

    describe('ajax', function () {
        it('is defined', function () {
            expect(ajax).toBeDefined();
        });

        it('valid `get` succedes', function () {
            var done = false,
                date = new Date().getTime().toString(),
                result;
            runs(function () {
                ajax.get('http://jsfiddle.net/echo/json/', { js: date }).subscribe(function (r) {
                    done = true;
                    result = r;
                    console.debug('ajax.get test result: ' + json.toJson(result));
                });
            });

            waitsFor(function () {
                return done;
            }, 4000);

            runs(function () {
                expect(result).toBeDefined();
                expect(result).not.toEqual(date);
            });
        });

        it('`get` notifies on error', function () {
            var done = false,
                date = new Date().getTime().toString(),
                result,
                observer = {
                    onNext: function () { }
                };
            runs(function () {
                ajax.get('http://jsfiddle.net/foo/bar/', { js: date }).subscribe(observer.onNext,
                    function (r) {
                        done = true;
                        result = r;
                        console.debug('ajax.getError test result: ' + json.toJson(result));
                    });
            });

            spyOn(observer, 'onNext');

            waitsFor(function () {
                return done;
            }, 2000);

            runs(function () {
                expect(observer.onNext).not.toHaveBeenCalled();
            });

        });

        it('`get` notifies on bad host error', function () {
            var done = false,
                date = new Date().getTime().toString(),
                result,
                observer = {
                    onNext: function () { }
                };
            runs(function () {
                ajax.get('http://jfdasfu8fus00923qh0.net/foo/bar/', { js: date }).subscribe(observer.onNext,
                    function (r) {
                        done = true;
                        result = r;
                        console.debug('ajax.getHostError test result: ' + json.toJson(result));
                    });
            });

            spyOn(observer, 'onNext');

            waitsFor(function () {
                return done;
            }, 2000);

            runs(function () {
                expect(observer.onNext).not.toHaveBeenCalled();
            });

        });

        it('`postMultipart` works', function () {
            var done = false,
                date = new Date().getTime().toString(),
                result;

            runs(function () {
                var json = core.json.toJson({date: date});
                ajax.postMultipart('http://jsfiddle.net/echo/json/', {json: json}).subscribe(function (r) {
                    done = true;
                    result = r;
                    console.debug('ajax.post test result: ' + json.toJson(result));
                });
            });

            waitsFor(function () {
                return done;
            }, 2000);

            runs(function () {
                expect(result).toBeDefined();
                expect(result).toEqual({ date: date });
            });
        });
    });
});