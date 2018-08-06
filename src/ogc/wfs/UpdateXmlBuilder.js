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
 * @exports UpdateXmlBuilder
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
         * configured UpdateXmlBuilder.
         * @constructor
         */
        var UpdateXmlBuilder = function (typeName, propertyName, value, Id) {
            var version = "1.0.0";
              if (propertyName === 'the_geom')
                return this.createGeomElement(typeName, propertyName, value, Id, version);
            else
                return this.createBasewfsElement(typeName, propertyName, value, Id, version);
        };


        UpdateXmlBuilder.prototype.createBasewfsElement = function (typeName, propertyName, value, filterId, version) {

            var xmlnsO = "http://www.opengis.net/ogc";
            var xmlnsW = "http://www.opengis.net/wfs";
            var xmlnsT = "http://www.openplans.org/topp";
            var doc = document.implementation.createDocument(xmlnsW, 'wfs:Transaction', null);
            doc.documentElement.setAttribute('service', 'WFS');
            doc.documentElement.setAttribute('version', version);
            doc.documentElement.setAttribute('xmlns:topp', xmlnsT);
            doc.documentElement.setAttribute('xmlns:ogc', xmlnsO);
            doc.documentElement.setAttribute('xmlns:wfs', xmlnsW);
            var Update = doc.createElement('wfs:Update');
            Update.setAttribute('typeName', typeName);
            var prop = doc.createElement('wfs:Property');
            var propName = doc.createElement('wfs:Name');
            propName.textContent = propertyName;
            var literal = doc.createElement('wfs:Value');
            literal.textContent = value;
            prop.appendChild(propName);
            prop.appendChild(literal);
            Update.appendChild(prop);
            Update.appendChild(this.filter(doc,filterId));
            doc.documentElement.appendChild(Update);
            return doc;


        };


        UpdateXmlBuilder.prototype.createGeomElement = function (typeName, propertyName, value, filterId, version) {

            var xmlnsO = "http://www.opengis.net/ogc";
            var xmlnsW = "http://www.opengis.net/wfs";
            var xmlnsT = "http://www.openplans.org/topp";
            var xmlnsG = "http://www.opengis.net/gml";
            var xmlnsX = "http://www.w3.org/2001/XMLSchema-instance";
            var doc = document.implementation.createDocument(xmlnsW, 'wfs:Transaction', null);
            doc.documentElement.setAttribute('service', 'WFS');
            doc.documentElement.setAttribute('version', version);
            doc.documentElement.setAttribute('xmlns:topp', xmlnsT);
            doc.documentElement.setAttribute('xmlns:ogc', xmlnsO);
            doc.documentElement.setAttribute('xmlns:wfs', xmlnsW);
            doc.documentElement.setAttribute('xmlns:gml', xmlnsG);
            doc.documentElement.setAttribute('xmlns:xsi', xmlnsX);
            var schemaLocation = "http://www.opengis.net/wfs http://schemas.opengis.net/wfs/1.0.0/WFS-transaction.xsd";
            doc.documentElement.setAttribute('xsi:schemaLocation', schemaLocation);

            var Update = doc.createElement('wfs:Update');
            Update.setAttribute('typeName', typeName);
            var prop = doc.createElement('wfs:Property');
            var propName = doc.createElement('wfs:Name');
            propName.textContent = propertyName;
            var literal = doc.createElement('wfs:Value');
            literal.appendChild(this.geometry(doc, value));
            prop.appendChild(propName);
            prop.appendChild(literal);
            Update.appendChild(prop);
            Update.appendChild(this.filter(doc,filterId));
            doc.documentElement.appendChild(Update);
            return doc;
        };

        UpdateXmlBuilder.prototype.geometry = function (doc, coordinate) {

                var multiLine = doc.createElement('gml:MultiLineString');
                multiLine.setAttribute('srsName', "http://www.opengis.net/gml/srs/epsg.xml#4326");
                var lineStringMember = doc.createElement('gml:lineStringMember');
                var lineString = doc.createElement('gml:LineString');
                var coordinates = doc.createElement('gml:coordinates');
                coordinates.textContent = coordinate;
                lineString.appendChild(coordinates);
                lineStringMember.appendChild(lineString);
                multiLine.appendChild(lineStringMember);

                return multiLine;
            };

        UpdateXmlBuilder.prototype.filter = function (doc, filterId) {

            var filter = doc.createElement('ogc:Filter');
            var Id = doc.createElement('ogc:FeatureId');
            Id.setAttribute('fid', filterId);
            filter.appendChild(Id);

            return filter;
        };

            return UpdateXmlBuilder;
        });
