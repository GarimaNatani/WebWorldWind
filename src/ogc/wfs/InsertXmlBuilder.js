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
        var InsertXmlBuilder = function (Type) {

            var shape = "123";
            var line = line;
            var version = "1.0.0";
            console.log(this.buildInsertFeatureXmlRequest(Type, shape, line, version));
        };

        // Internal use only
        InsertXmlBuilder.prototype.buildInsertFeatureXmlRequest = function (service, geom, type, version) {
            console.log("hi");
            var describeElement = this.createBasewfsElement("Transaction Service", version);
            //  describeElement.appendChild(FeatureElement);
            return describeElement;

        };

        InsertXmlBuilder.prototype.createBasewfsElement = function (elementName, version) {
            var xmlnsW = "http://www.opengis.net/wfs";
            var xmlnsT = "http://www.openplans.org/topp";
            var xmlnsG = "http://www.opengis.net/gml";
            var xmlnsX = "http://www.w3.org/2001/XMLSchema-instance";

            var doc = document.implementation.createDocument(xmlnsW, 'wfs', null);
            doc.documentElement.setAttributeNS(xmlnsW, 'xmlns:wfs', 'http://www.opengis.net/wfs');
            var foo = doc.createElementNS(xmlnsW, 'insert');
            var bar = doc.createElementNS(xmlnsT, 'tasmania_roads');
            bar.appendChild(document.createTextNode('topp:geom'));
            foo.appendChild(bar);
            doc.documentElement.appendChild(foo);

            return doc;


            // var e1;
            //    container = document.getElementById("ContainerBox");
            //  newdiv = document.createElementNS("http://www.w3.org/1999/xhtml","div");
            //   e1.document.createElementNS("xmlnswfs","122");
            //e1 =document.createElementNS("xmlns:topp",InsertXmlBuilder.wfs2_XLMNS);
            //e1 =document.createElementNS("xmlns:gml",InsertXmlBuilder.wfs3_XLMNS);
            //e1 =document.createElementNS("xmlns:xsi",InsertXmlBuilder.wfs4_XLMNS);
            //el.setAttribute("version", version);
            //el.setAttribute(elementName,"WFS");
            //   return el;
        };
        return InsertXmlBuilder;
    });
