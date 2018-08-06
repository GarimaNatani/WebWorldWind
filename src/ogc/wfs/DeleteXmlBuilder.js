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
 * @exports DeleteXmlBuilder
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
         * configured DeleteXmlBuilder.
         * @constructor
         */
        var DeleteXmlBuilder = function (typeName,propertyName) {
            var version = "1.0.0";
            return this.createBasewfsElement(typeName,propertyName,version);
            //   console.log(s);
        };


        DeleteXmlBuilder.prototype.createBasewfsElement = function (typeName,propertyName,version) {

            var xmlnsC = "http://www.opengis.net/cite/data";
            var xmlnsO = "http://www.opengis.net/ogc";
            var xmlnsW = "http://www.opengis.net/wfs";
            var xmlnsT = "http://www.openplans.org/topp";
            var doc = document.implementation.createDocument(xmlnsW, 'wfs:Transaction', null);
            doc.documentElement.setAttribute('service', 'WFS');
            doc.documentElement.setAttribute('version', version);
            doc.documentElement.setAttribute('xmlns:cdf', xmlnsC);
            doc.documentElement.setAttribute('xmlns:ogc', xmlnsO);
            doc.documentElement.setAttribute('xmlns:wfs', xmlnsW);
            doc.documentElement.setAttribute('xmlns:topp', xmlnsT);
            var Delete = doc.createElement('wfs:Delete');
            Delete.setAttribute('typeName', typeName);
            var filter = doc.createElement('ogc:Filter');
            var filtType = doc.createElement('ogc:PropertyIsEqualTo');
            var propName = doc.createElement('ogc:PropertyName');
            propName.textContent =propertyName;
            var literal = doc.createElement('ogc:Literal');
            literal.textContent = 'alley';
            filtType.appendChild(propName);
            filtType.appendChild(literal);
            filter.appendChild(filtType);
            Delete.appendChild(filter);

            doc.documentElement.appendChild(Delete);
            return doc;
        };



        return DeleteXmlBuilder;
    });
