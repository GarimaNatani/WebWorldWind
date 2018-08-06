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
    'src/ogc/wfs/InsertXmlBuilder',
    'src/ogc/wfs/DeleteXmlBuilder',
    'src/shape/Path',
    'src/shape/Polygon',
    'src/geom/Position',
    'src/ogc/wfs/UpdateXmlBuilder',
    'src/ogc/wfs/WfsTransaction'
], function (InsertXmlBuilder,
             DeleteXmlBuilder,
             Path,
             Polygon,
             Position,
             UpdateXmlBuilder,
             WfsTransaction) {
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

        it("should return Insert xml polygon match", function () {
            var wfs = new InsertXmlBuilder("http://localhost:8080/geoserver/wfs/DescribeFeatureType?", "topp:tasmania_roads", "Polygon", "-30.93597221374512 117.6290588378906 -30.94830513000489 117.6447219848633 -30.95219421386719 117.6465530395508 -30.95219421386719 117.6431121826172 -30.94802856445312 117.6386108398438 -30.94799995422363 117.6314163208008 -30.946138381958 117.62850189209 -30.94430541992188 117.6295852661133 -30.93280601501464 117.6240539550781 -30.92869377136231 117.624641418457 -30.92386054992676 117.6201400756836 -30.92111206054688 117.6206970214844 -30.92458343505859 117.6275863647461 -30.93597221374512 117.6290588378906");
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
                "<gml:Polygon srsName=\"urn:ogc:def:crs:EPSG::4326http://www.opengis.net/def/crs/epsg/0/4326\" gml:id=\"P1\">" +
                "<gml:exterior>" +
                "<gml:LinearRing>" +
                "<gml:posList>-30.93597221374512 117.6290588378906 -30.94830513000489 117.6447219848633 -30.95219421386719 117.6465530395508 -30.95219421386719 117.6431121826172 -30.94802856445312 117.6386108398438 -30.94799995422363 117.6314163208008 -30.946138381958 117.62850189209 -30.94430541992188 117.6295852661133 -30.93280601501464 117.6240539550781 -30.92869377136231 117.624641418457 -30.92386054992676 117.6201400756836 -30.92111206054688 117.6206970214844 -30.92458343505859 117.6275863647461 -30.93597221374512 117.6290588378906</gml:posList>" +
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
            var wfsD = new DeleteXmlBuilder("topp:tasmania_roads", "topp:TYPE");
            var oSerializer = new XMLSerializer();
            var sXML = oSerializer.serializeToString(wfsD);

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
            var wfsU = new UpdateXmlBuilder("topp:tasmania_roads", "TYPE","street","tasmania_roads.1");
            var oSerializer = new XMLSerializer();
            var sXML = oSerializer.serializeToString(wfsU);
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
            var wfsU = new UpdateXmlBuilder("topp:tasmania_roads", "the_geom","500000,5450000,0 540000,5450000,0","tasmania_roads.1");
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
                "<ogc:Filter>"+
            "<ogc:FeatureId fid=\"tasmania_roads.1\"/>" +
            "</ogc:Filter>" +
            "</wfs:Update>" +
            "</wfs:Transaction>");
        });

        describe('should accept Polygon and provide the document for: ', function(){
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

            // This is stub of the method. You have to finish the code.
            it('insert', function(){
                var wfsTransaction = WfsTransaction.create();
                wfsTransaction.insert(polygon);
            })
        })

        describe('should accept Path and provide the document for: ', function(){
            var pathPositions = [];
            pathPositions.push(new Position(40, -100, 1e4));
            pathPositions.push(new Position(45, -110, 1e4));
            pathPositions.push(new Position(46, -122, 1e4));

            // Create the path.
            var path = new Path(pathPositions, null);

            // This is stub of the method. You have to finish the code.
            it('insert', function(){
                var wfsTransaction = WfsTransaction.create();
                wfsTransaction.insert(path);

                // E
            })
        })
    });

});
