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
    'src/ogc/wfs/WfsTransaction'
], function (WfsTransaction) {
    "use strict";

    describe("Transaction response parsing", function () {

        var xmlDom;

        beforeAll(function (done) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "../base/test/ogc/wfs/wfsTransactionAll.xml", true);
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

        describe("Response", function () {

            it("should have version 2.0.0 ", function () {
                var wfsTrans = WfsTransaction.create(xmlDom);
                var version = wfsTrans.version;
                expect(version).toBe("2.0.2");
            });


            it("should have totalInserted 3", function () {
                var wfsTrans = WfsTransaction.create(xmlDom);
                var totalInserted = wfsTrans.totalInserted;
                expect(totalInserted).toBe("3");
            });

            it("should have feature as Statement 1", function () {
                var wfsTrans = WfsTransaction.create(xmlDom);
                var feature = wfsTrans.handle[0];
                expect(feature).toBe("Statement 1");
            });
        });
    });
});
