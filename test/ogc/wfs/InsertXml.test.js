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
    'src/ogc/wfs/InsertXmlBuilder'
], function (InsertXmlBuilder) {
    "use strict";

    describe("Constructor testing", function () {

        it("should throw an exception when nothing is provided as an argument", function () {
            expect((function () {
                new InsertXmlBuilder(null)
            })).toThrow();
        });
    });

    describe("Build Url", function () {

        it("should return Insert xml match", function () {
            var wfs = new InsertXmlBuilder("http://localhost:8080/geoserver/wfs/DescribeFeatureType?", "topp:tasmania_roads", "MultiLineString", "494475.71056415,5433016.8189323 494982.70115662,5435041.95096618");
            var oSerializer = new XMLSerializer();
            var sXML = oSerializer.serializeToString(wfs);

            expect(sXML).toBe("<wfs:Transaction service=\"WFS\" version=\"1.0.0\" " +
                "xmlns:wfs=\"http://www.opengis.net/wfs\" " +
                "xmlns:topp=\"http://www.openplans.org/topp\" " +
                "xmlns:gml=\"http://www.opengis.net/gml\" " +
                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
                "xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://www.openplans.org/topp http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename=topp:tasmania_roads\">" +
                "<wfs:Insert>" +
                "<topp:tasmania_roads>" +
                "<topp:the_geom>" +
                "<gml:MultiLineString srsName=\"http://www.opengis.net/gml/srs/epsg.xml#4326\">" +
                "<gml:lineStringMember>" +
                "<gml:LineString>" +
                "<gml:coordinates decimal=\".\" cs=\",\" ts=\" \">" +
                "494475.71056415,5433016.8189323 494982.70115662,5435041.95096618" +
                "</gml:coordinates>" +
                "</gml:LineString>" +
                "</gml:lineStringMember>" +
                "</gml:MultiLineString>" +
                "</topp:the_geom>" +
                "<topp:TYPE>alley</topp:TYPE>" +
                "</topp:tasmania_roads>" +
                "</wfs:Insert>" +
                "</wfs:Transaction>");
        });
    });
});
