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
    'src/ogc/wfs/WfsTransaction',
    'src/shapes/Path',
    'src/shapes/Polygon',
    'src/geom/Position'
], function (
    WfsTransaction,
    Path,
    Polygon,
    Position) {

    "use strict";

    describe("Build Url", function () {

        it("should return Insert xml match", function () {
            var schemas = [

                {schemaNamespace: 'xmlns:wfs', schemaUrl: 'http://www.opengis.net/wfs'},
                {schemaNamespace: 'xmlns:topp', schemaUrl: 'http://www.openplans.org/topp'},
                {schemaNamespace: 'xmlns:gml', schemaUrl: 'http://www.opengis.net/gml'},
                {schemaNamespace: 'xmlns:xsi', schemaUrl: 'http://www.w3.org/2001/XMLSchema-instance'},
                {
                    schemaNamespace: 'xsi:schemaLocation',
                    schemaUrl: 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://www.openplans.org/topp http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename=topp:tasmania_roads'
                }
            ];

            var pathPositions = [];
            pathPositions.push(new Position(40, -100, 1e4));
            pathPositions.push(new Position(45, -110, 1e4));
            pathPositions.push(new Position(46, -122, 1e4));
            // Create the path.
            var path = new Path(pathPositions, null);
            var typeName = 'topp:tasmania_roads';
            var wfs = (WfsTransaction.insert(schemas, path, typeName));
            var sXML = WfsTransaction.serialize(wfs);

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
                "(40°, -100°, 10000),(45°, -110°, 10000),(46°, -122°, 10000)" +
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

        it("should return Insert xml polygon match", function () {
            var schemas = [

                {schemaNamespace: 'xmlns:wfs', schemaUrl: 'http://www.opengis.net/wfs'},
                {schemaNamespace: 'xmlns:topp', schemaUrl: 'http://www.openplans.org/topp'},
                {schemaNamespace: 'xmlns:gml', schemaUrl: 'http://www.opengis.net/gml'},
                {schemaNamespace: 'xmlns:xsi', schemaUrl: 'http://www.w3.org/2001/XMLSchema-instance'},
                {
                    schemaNamespace: 'xsi:schemaLocation',
                    schemaUrl: 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://www.openplans.org/topp http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename=topp:tasmania_roads'
                }
            ];

            var boundaries = [];
            boundaries[0] = []; // outer boundary
            boundaries[0].push(new Position(40, -100, 1e5));
            boundaries[0].push(new Position(45, -110, 1e5));
            boundaries[0].push(new Position(40, -120, 1e5));
            boundaries[1] = []; // inner boundary
            boundaries[1].push(new Position(41, -103, 1e5));
            boundaries[1].push(new Position(44, -110, 1e5));
            boundaries[1].push(new Position(41, -117, 1e5));
            var polygon = new Polygon(boundaries, null);

            var typeName = 'topp:tasmania_roads';
            var wfs = (WfsTransaction.insert(schemas, polygon, typeName));
            var sXML = WfsTransaction.serialize(wfs);

            expect(sXML).toBe("<wfs:Transaction service=\"WFS\" version=\"1.0.0\" " +
                "xmlns:wfs=\"http://www.opengis.net/wfs\" " +
                "xmlns:topp=\"http://www.openplans.org/topp\" " +
                "xmlns:gml=\"http://www.opengis.net/gml\" " +
                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
                "xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://www.openplans.org/topp http://localhost:8080/geoserver/wfs/DescribeFeatureType?typename=topp:tasmania_roads\">" +
                "<wfs:Insert>" +
                "<topp:tasmania_roads>" +
                "<topp:the_geom>" +
                "<gml:Polygon srsName=\"urn:ogc:def:crs:EPSG::4326http://www.opengis.net/def/crs/epsg/0/4326\" gml:id=\"P1\">" +
                "<gml:exterior>" +
                "<gml:LinearRing>" +
                "<gml:posList>(40°, -100°, 100000),(45°, -110°, 100000),(40°, -120°, 100000),(41°, -103°, 100000),(44°, -110°, 100000),(41°, -117°, 100000)</gml:posList>" +
                "</gml:LinearRing>" +
                "</gml:exterior>" +
                "</gml:Polygon>" +
                "</topp:the_geom>" +
                "<topp:TYPE>alley</topp:TYPE>" +
                "</topp:tasmania_roads>" +
                "</wfs:Insert>" +
                "</wfs:Transaction>");
        });

        it("should return Delete xml", function () {
            // var wfsD = new DeleteXmlBuilder("topp:tasmania_roads", "topp:TYPE");
            var schemas = [

                {schemaNamespace: 'xmlns:cdf', schemaUrl: 'http://www.opengis.net/cite/data'},
                {schemaNamespace: 'xmlns:ogc', schemaUrl: 'http://www.opengis.net/ogc'},
                {schemaNamespace: 'xmlns:wfs', schemaUrl: 'http://www.opengis.net/wfs'},
                {schemaNamespace: 'xmlns:topp', schemaUrl: 'http://www.openplans.org/topp'},

            ];
            var propertyName = 'topp:TYPE';
            var typeName = 'topp:tasmania_roads';
            var wfs = WfsTransaction.delete(schemas, typeName, propertyName);
            var sXML = WfsTransaction.serialize(wfs);

            expect(sXML).toBe("<wfs:Transaction service=\"WFS\" version=\"1.0.0\" " +
                "xmlns:cdf=\"http://www.opengis.net/cite/data\" " +
                "xmlns:ogc=\"http://www.opengis.net/ogc\" " +
                "xmlns:wfs=\"http://www.opengis.net/wfs\" " +
                "xmlns:topp=\"http://www.openplans.org/topp\">" +
                "<wfs:Delete typeName=\"topp:tasmania_roads\">" +
                "<ogc:Filter>" +
                "<ogc:PropertyIsEqualTo>" +
                "<ogc:PropertyName>topp:TYPE</ogc:PropertyName>" +
                "<ogc:Literal>alley</ogc:Literal>" +
                "</ogc:PropertyIsEqualTo>" +
                "</ogc:Filter>" +
                "</wfs:Delete>" +
                "</wfs:Transaction>");
        });

        it("should return Update xml", function () {
            var schemas = [
                {schemaNamespace: 'xmlns:topp', schemaUrl: 'http://www.openplans.org/topp'},
                {schemaNamespace: 'xmlns:ogc', schemaUrl: 'http://www.opengis.net/ogc'},
                {schemaNamespace: 'xmlns:wfs', schemaUrl: 'http://www.opengis.net/wfs'},


            ];
            var propertyName = 'TYPE';
            var typeName = 'topp:tasmania_roads';
            var value = 'street';
            var FeatureId = 'tasmania_roads.1';
            var wfsU = new WfsTransaction.update(schemas, typeName, propertyName, value, FeatureId);
            var sXML = WfsTransaction.serialize(wfsU);
            expect(sXML).toBe("<wfs:Transaction service=\"WFS\" version=\"1.0.0\" " +
                "xmlns:topp=\"http://www.openplans.org/topp\" " +
                "xmlns:ogc=\"http://www.opengis.net/ogc\" " +
                "xmlns:wfs=\"http://www.opengis.net/wfs\">" +
                "<wfs:Update typeName=\"topp:tasmania_roads\">" +
                "<wfs:Property>" +
                "<wfs:Name>TYPE</wfs:Name>" +
                "<wfs:Value>street</wfs:Value>" +
                "</wfs:Property>" +
                "<ogc:Filter>" +
                "<ogc:FeatureId fid=\"tasmania_roads.1\"/>" +
                "</ogc:Filter>" +
                "</wfs:Update>" +
                "</wfs:Transaction>");
        });

        it("should return Update geom xml", function () {

            var schemas = [


                {schemaNamespace: 'xmlns:topp', schemaUrl: 'http://www.openplans.org/topp'},
                {schemaNamespace: 'xmlns:ogc', schemaUrl: 'http://www.opengis.net/ogc'},
                {schemaNamespace: 'xmlns:wfs', schemaUrl: 'http://www.opengis.net/wfs'},
                {schemaNamespace: 'xmlns:gml', schemaUrl: 'http://www.opengis.net/gml'},
                {schemaNamespace: 'xmlns:xsi', schemaUrl: 'http://www.w3.org/2001/XMLSchema-instance'},
                {
                    schemaNamespace: 'xsi:schemaLocation',
                    schemaUrl: 'http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd'
                },

            ];
            var propertyName = 'the_geom';
            var typeName = 'topp:tasmania_roads';
            var value = '500000,5450000,0 540000,5450000,0';
            var FeatureId = 'tasmania_roads.1';
            var wfsU = new WfsTransaction.update(schemas, typeName, propertyName, value, FeatureId);
            var oSerializer = new XMLSerializer();
            var sXML = oSerializer.serializeToString(wfsU);
            expect(sXML).toBe("<wfs:Transaction service=\"WFS\" version=\"1.0.0\" " +
                "xmlns:topp=\"http://www.openplans.org/topp\" " +
                "xmlns:ogc=\"http://www.opengis.net/ogc\" " +
                "xmlns:wfs=\"http://www.opengis.net/wfs\" " +
                "xmlns:gml=\"http://www.opengis.net/gml\" " +
                "xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" " +
                "xsi:schemaLocation=\"http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd\">" +
                "<wfs:Update typeName=\"topp:tasmania_roads\">" +
                "<wfs:Property>" +
                "<wfs:Name>the_geom</wfs:Name>" +
                "<wfs:Value>" +
                "<gml:MultiLineString srsName=\"http://www.opengis.net/gml/srs/epsg.xml#4326\">" +
                "<gml:lineStringMember>" +
                "<gml:LineString>" +
                "<gml:coordinates>500000,5450000,0 540000,5450000,0</gml:coordinates>" +
                "</gml:LineString>" +
                "</gml:lineStringMember>" +
                "</gml:MultiLineString>" +
                "</wfs:Value>" +
                "</wfs:Property>" +
                "<ogc:Filter>" +
                "<ogc:FeatureId fid=\"tasmania_roads.1\"/>" +
                "</ogc:Filter>" +
                "</wfs:Update>" +
                "</wfs:Transaction>");
        });

    });

})
;
