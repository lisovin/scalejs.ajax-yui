/*global require*/
/// <reference path="Scripts/require.js"/>
/// <reference path="Scripts/jasmine.js"/>
require({
    "paths":  {
        "rx":  "Scripts/rx",
        "rx.binding":  "Scripts/rx.binding",
        "rx.time":  "Scripts/rx.time",
        "scalejs":  "Scripts/scalejs-0.1.12",
        "scalejs.ajax-yui":  "../scalejs.ajax-yui/build/scalejs.ajax-yui-0.1.2",
        "scalejs.reactive":  "Scripts/scalejs.reactive-0.1.0",
        "yui":  "Scripts/yui"
    },
    "scalejs":  {
        "extensions":  [
            "scalejs.ajax-yui",
            "scalejs.reactive"
        ]
    }
}, ['tests/all.tests']);
