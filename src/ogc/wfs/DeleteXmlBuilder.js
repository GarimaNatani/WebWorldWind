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
        var DeleteXmlBuilder = {
            Delete: function (doc, typeName, propertyName) {
                var Delete = doc.createElement('wfs:Delete');
                Delete.setAttribute('typeName', typeName);
                var filter = doc.createElement('ogc:Filter');
                var filtType = doc.createElement('ogc:PropertyIsEqualTo');
                var propName = doc.createElement('ogc:PropertyName');
                propName.textContent = propertyName;
                var literal = doc.createElement('ogc:Literal');
                literal.textContent = 'alley';
                filtType.appendChild(propName);
                filtType.appendChild(literal);
                filter.appendChild(filtType);
                Delete.appendChild(filter);
                doc.documentElement.appendChild(Delete);
                return doc;
            }
        };

        return DeleteXmlBuilder;
    });
