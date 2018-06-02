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
 * @exports GetFeature
 */

define([
        '../../error/ArgumentError',
        '../../util/Logger',
    ],

    function (ArgumentError,
              Logger
    ) {
        "use strict";

        /**
         * Constructs an OGC Get Feature instance from an XML DOM.
         * @alias GetFeature
         * @constructor
         * @classdesc Represents the common properties of a Wfs Capabilities document. Common properties are parsed and
         * mapped to a plain javascript object model. Most fields can be accessed as properties named according to their
         * document names converted to camel case. This model supports version 1.0.0 and 2.0.x of the Get Feature.
         * Not all properties are mapped to this representative javascript object model, but the provided XML dom is
         * maintained in xmlDom property for reference.
         * @param {{}} xmlDom an XML DOM representing the Wfs Capabilities document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         */
        var GetFeature = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "GetFeature", "constructor", "missingDom"));
            }

            /**
             * The original unmodified XML document. Referenced for use in advanced cases.
             * @type {{}}
             */
            this.xmlDom = xmlDom;

            this.assembleDocument();
        };


        GetFeature.prototype.assembleDocument = function () {
            var root = this.xmlDom.documentElement;

            this.numberMatched = root.getAttribute("numberMatched");
            this.numberReturned = root.getAttribute("numberReturned");
            this.timestamp = root.getAttribute("timeStamp");

            this.member = this.assembleMember(root);

        };


        GetFeature.prototype.assembleMember = function (element) {
            var member = {}
            var children1 = element.firstChild;
            var children = children1.children || children1.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                member.bugsite = member.bugsite || [];
                member.bugsite.push(this.assembleBugsites(child));
            }
            return member;
        };

        GetFeature.prototype.assembleBugsites = function (element) {

            var bugsite = {};
            bugsite.id = element.getAttribute("gml:id");

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {

                var child = children[c];

                if (child.localName === "the_geom") {
                    bugsite.geom = this.assembleGeom(child);
                } else if (child.localName === "cat") {
                    bugsite.cat = child.textContent;
                }
                else if (child.localName === "str1") {
                    bugsite.str1 = child.textContent;
                }
            }
            return bugsite
        };

        GetFeature.prototype.assembleGeom = function (element) {

            var geom = {};
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "Point") {
                    geom.srsName = child.getAttribute("srsName");
                    geom.srsDimension = child.getAttribute("srsDimension");
                }
                else if (child.localName === "pos") {
                    geom.pos = child.textContent;
                }
            }
            return geom;
        };
        return GetFeature;
    });