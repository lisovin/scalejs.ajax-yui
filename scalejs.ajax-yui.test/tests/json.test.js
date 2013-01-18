/*global define,describe,expect,it*/
/*jslint sloppy: true*/
/// <reference path="../Scripts/jasmine.js"/>
define([
    'scalejs!core',
    'scalejs!application'
], function (core) {
    var json = core.json;

    describe('json', function () {
        it('is defined', function () {
            expect(json).toBeDefined();
        });

        it('parses json correctly', function () {
            var o = {
                    foo: 1,
                    bar: 'xyz'
                },
                s = "{\"foo\":1,\"bar\":\"xyz\"}";
            expect(json.fromJson(s)).toEqual(o);
        });

        it('serializes json correctly', function () {
            var o = {
                    foo: 1,
                    bar: 'xyz'
                },
                s = "{\"foo\":1,\"bar\":\"xyz\"}";
            expect(json.toJson(o)).toBe(s);
        });

        it('parses empty string as empty object', function () {
            expect(json.fromJson('')).toEqual({});
        });

        it('serializes null as "null"', function () {
            expect(json.toJson(null)).toEqual("null");
        });

        it('serializes undefined as undefined', function () {
            expect(json.toJson(undefined)).toEqual(undefined);
        });
    });
});