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
        var UpdateXmlBuilder = {

            Update: function (doc, typeName, propertyName, value, filterId) {

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
                Update.appendChild(UpdateXmlBuilder.Filter(doc, filterId));
                doc.documentElement.appendChild(Update);
                return doc;


            },


            updateGeom: function (doc, typeName, propertyName, value, filterId) {
                var Update = doc.createElement('wfs:Update');
                Update.setAttribute('typeName', typeName);
                var prop = doc.createElement('wfs:Property');
                var propName = doc.createElement('wfs:Name');
                propName.textContent = propertyName;
                var literal = doc.createElement('wfs:Value');
                literal.appendChild(UpdateXmlBuilder.Geometry(doc, value));
                prop.appendChild(propName);
                prop.appendChild(literal);
                Update.appendChild(prop);
                Update.appendChild(UpdateXmlBuilder.Filter(doc, filterId));
                doc.documentElement.appendChild(Update);
                return doc;
            },

            Geometry: function (doc, coordinate) {

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
            },

            Filter: function (doc, filterId) {

                var filter = doc.createElement('ogc:Filter');
                var Id = doc.createElement('ogc:FeatureId');
                Id.setAttribute('fid', filterId);
                filter.appendChild(Id);

                return filter;
            }

        };

        return UpdateXmlBuilder;
    });
