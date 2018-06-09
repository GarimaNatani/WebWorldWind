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


        GetFeature.prototype.assembleDocumentAttribute = function (element) {

            if (root.hasAttribute("numberMatched")) {
                this.numberMatched = element.getAttribute("numberMatched");
            }
            if (root.hasAttribute("numberReturned")) {
                this.numberReturned = element.getAttribute("numberReturned");
            }
            if (root.hasAttribute("timeStamp")) {
                this.timestamp = element.getAttribute("timeStamp");
            }
        };

        GetFeature.prototype.assembleDocument = function () {
            var root = this.xmlDom.documentElement;
            this.assembleDocumentAttribute(root);
            var members = {};
            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName == "member") {
                    this.member = this.member || [];
                    this.member.push(this.assembleMember(child));
                }
                else if (child.localName == "featureMembers") {
                    this.featureMembers = this.featureMembers || [];
                    this.featureMembers.push(this.assembleFeatureMembers(child));
                }
                else if (root.localName == "boundedBy") {
                    this.boundedBy = this.boundedBy || [];
                    this.boundedBy.push(this.assembleBoundedBy(child));
                }
            }
        };


        GetFeature.prototype.assembleMember = function (element) {
            var member = {};
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                member.featureName = child.localName;
                member.id = child.getAttribute("gml:id");
                member.featuresAttributes = member.featuresAttributes || [];
                member.featuresAttributes.push(this.assembleFeatureAttributes(child));

            }
            return member;
        };


        GetFeature.prototype.assembleFeatureMembers = function (element) {
            var fMember = {};
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                fMember.featureName = child.localName;
                fMember.id = child.getAttribute("gml:id");
                fMember.featuresAttributes = fMember.featuresAttributes || [];
                fMember.featuresAttributes.push(this.assembleFeatureMemberAttributes(child));

            }
            return member;
        };

        GetFeature.prototype.assembleBoundedBy = function (element) {
            var boundedBy = {};
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                boundedBy.boundedBy = boundedBy.boundedBy || [];
                boundedBy.boundedBy.push(child.textContent);
            }
            return boundedBy;
        };

        GetFeature.prototype.assembleFeatureAttributes = function (element) {

            var feature = {};
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {

                var child = children[c];

                if (child.localName === "the_geom") {
                    feature.geom = this.assembleGeom(child);
                }
                else {
                    feature.subFeature = feature.subFeature || [];
                    feature.subFeature.push(this.assembleSubFeatures(child));
                }
            }
            return feature;
        };

        GetFeature.prototype.assembleFeatureMemberAttributes = function (element) {

            var feature = {};
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {

                var child = children[c];

                if (child.localName === "the_geom") {
                    feature.geom = this.assembleMemberGeom(child);
                }
                else {
                    feature.subFeature = feature.subFeature || [];
                    feature.subFeature.push(this.assembleSubFeatures(child));
                }
            }
            return feature;
        };
        GetFeature.prototype.assembleSubFeatures = function (element) {
            var temp = {};
            temp.name = element.localName
            temp.value = element.textContent;
            return temp;
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

        GetFeature.prototype.assembleMemberGeom = function (element) {

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
    }
)
;