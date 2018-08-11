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
    'src/util/WfsUrlBuilder'
], function (WfsUrlBuilder) {
    "use strict";

    describe("Constructor testing", function () {

        it("should throw an exception when nothing is provided as an argument", function () {
            expect((function () {
                new WfsUrlBuilder(null)
            })).toThrow();
        });
    });


    describe("Build Url", function () {

        it("should return Url", function () {
            var wfsurl = new WfsUrlBuilder("http://localhost:8080/geoserver/wfs", "STATE_NAME,PERSONS", "topp:states", "1.1.0");
            var url = wfsurl.urlForGetFeature("topp:states", "application/json");
            expect(url).toBe("http://localhost:8080/geoserver/wfs?&request=GetFeature&version=1.1.0&typeName=topp:states&propertyName=STATE_NAME,PERSONS");
        });
    });

});
