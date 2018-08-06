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
/**
 * @exports InsertXmlBuilder
 */
define([
        '../../error/ArgumentError',
        '../../util/Logger',
        '../../util/Promise'
    ],
    function (ArgumentError,
              Logger,
              Promise
    ) {
        "use strict";

        /**
         * Provides a list of Features from a Web Feature Service including the capabilities and Feature description
         * documents. For automated configuration, utilize the create function which provides a Promise with a fully
         * configured InsertXmlBuilder.
         * @constructor
         */
        var InsertXmlBuilder = function (ServerUrl, typeName, type, coordinates) {
            var version = "1.0.0";
            return this.createBasewfsElement(ServerUrl, typeName, version, type, coordinates);
            //   console.log(s);
        };


        InsertXmlBuilder.prototype.createBasewfsElement = function (ServerUrl, typeName, version, type, coordinates) {

            var xmlnsW = "http://www.opengis.net/wfs";
            var xmlnsT = "http://www.openplans.org/topp";
            var xmlnsG = "http://www.opengis.net/gml";
            var xmlnsX = "http://www.w3.org/2001/XMLSchema-instance";
            var doc = document.implementation.createDocument(xmlnsW, 'wfs:Transaction', null);
            doc.documentElement.setAttribute('service', 'WFS');
            doc.documentElement.setAttribute('version', version);
            doc.documentElement.setAttribute('xmlns:wfs', xmlnsW);
            doc.documentElement.setAttribute('xmlns:topp', xmlnsT);
            doc.documentElement.setAttribute('xmlns:gml', xmlnsG);
            doc.documentElement.setAttribute('xmlns:xsi', xmlnsX);
            var schemaLocation = "http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd http://www.openplans.org/topp " + ServerUrl + "typename=" + typeName;
            doc.documentElement.setAttribute('xsi:schemaLocation', schemaLocation);
            var insert = doc.createElement('wfs:Insert');
            var typename = doc.createElement(typeName);
            var geom = doc.createElement('topp:the_geom');

            geom.appendChild(this.geometry(doc, type, coordinates));
            var type = doc.createElement('topp:TYPE');
            type.textContent = 'alley';
            typename.appendChild(geom);
            typename.appendChild(type);
            insert.appendChild(typename);

            doc.documentElement.appendChild(insert);
            return doc;
        };

        InsertXmlBuilder.prototype.geometry = function (doc, type, coordinate) {

            if (type === 'MultiLineString') {
                var multiLine = doc.createElement('gml:MultiLineString');
                multiLine.setAttribute('srsName', "http://www.opengis.net/gml/srs/epsg.xml#4326");
                var lineStringMember = doc.createElement('gml:lineStringMember');
                var lineString = doc.createElement('gml:LineString');
                var coordinates = doc.createElement('gml:coordinates');
                coordinates.setAttribute('decimal', ".");
                coordinates.setAttribute('cs', ",");
                coordinates.setAttribute('ts', " ");
                coordinates.textContent = coordinate;
                lineString.appendChild(coordinates);
                lineStringMember.appendChild(lineString);
                multiLine.appendChild(lineStringMember);

                return multiLine;
            }

            if (type === 'Polygon') {

                var polygon = doc.createElement('gml:Polygon');
                polygon.setAttribute('srsName', "urn:ogc:def:crs:EPSG::4326http://www.opengis.net/def/crs/epsg/0/4326");
                polygon.setAttribute('gml:id', "P1");
                var exter = doc.createElement('gml:exterior');
                var LinearRing = doc.createElement('gml:LinearRing');
                var posList = doc.createElement('gml:posList');
                posList.textContent = coordinate;

                LinearRing.appendChild(posList);
                exter.appendChild(LinearRing);
                polygon.appendChild(exter);
                return polygon;
            }
            return null;
        };

        return InsertXmlBuilder;
    });
