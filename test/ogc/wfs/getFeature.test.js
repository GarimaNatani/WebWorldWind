/*
 * Copyright 2018 WorldWind Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
define([
    'src/ogc/wfs/GetFeature'
], function (GetFeature) {
    "use strict";

    describe("Constructor testing", function () {

        it("should throw an exception when nothing is provided as an argument", function () {
            expect((function () {
                new GetFeature(null)
            })).toThrow();
        });
    });

    describe("Get Feature Parsing", function () {

        var xmlDom;

        beforeAll(function (done) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "../base/test/ogc/wfs/wfsGetFeature.xml", true);
            xhr.addEventListener('load', function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        xmlDom = xhr.responseXML;
                        done();
                    } else {
                        done("Test wfs Capabilities Retrieval Error: " + xhr.statusText);
                    }
                }
            });
            xhr.send(null);
        });

        it("should have numberMatched 1", function () {
            var wfsGetF = new GetFeature(xmlDom);

            var numberMatched = wfsGetF.numberMatched;

            expect(numberMatched).toBe("1");
        });

        it("should have timestamp 2018-06-02T10:08:44.847Z", function () {
            var wfsGetF = new GetFeature(xmlDom);

            var timestamp = wfsGetF.timestamp;

            expect(timestamp).toBe("2018-06-02T10:08:44.847Z");
        });

        it("should have bugsite Id 3", function () {
            var wfsGetF = new GetFeature(xmlDom);
            var bugsiteId = wfsGetF.member.bugsite[0].id;
            expect(bugsiteId).toBe("bugsites.3");
        });

        it("should have geom srsName urn:ogc:def:crs:EPSG::26713", function () {
            var wfsGetF = new GetFeature(xmlDom);
            var srsName = wfsGetF.member.bugsite[0].geom.srsName;
            expect(srsName).toBe("urn:ogc:def:crs:EPSG::26713");
        });
    });
});
