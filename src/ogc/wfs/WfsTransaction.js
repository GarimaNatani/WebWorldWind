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
 * @exports WfsTransaction
 */

define([
        '../../error/ArgumentError',
        '../../util/Logger'
    ],

    function (ArgumentError,
              Logger) {
        "use strict";

        /**
         * Constructs an OGC Wfs Capabilities instance from an XML DOM.
         * @alias WfsTransaction
         * @constructor
         * @classdesc Represents the common properties of a Wfs Capabilities document. Common properties are parsed and
         * mapped to a plain javascript object model. Most fields can be accessed as properties named according to their
         * document names converted to camel case. This model supports version 1.0.0, 1.1.0 and 2.0.0 of the Wfs specification.
         * Not all properties are mapped to this representative javascript object model, but the provided XML dom is
         * maintained in xmlDom property for reference.
         * @param {{}} xmlDom an XML DOM representing the Wfs Capabilities document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         */
        var WfsTransaction = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WfsTransaction", "constructor", "missingDom"));
            }

            /**
             * The original unmodified XML document. Referenced for use in advanced cases.
             * @type {{}}
             */
            this.xmlDom = xmlDom;

            this.assembleDocument();
        };


        WfsTransaction.prototype.assembleDocument = function () {
            // Determine version
            var root = this.xmlDom.documentElement;
            this.version = root.getAttribute("version");
            this.assembleTransactionResponse(root);
        };

        WfsTransaction.prototype.assembleTransactionResponse = function (root) {
            var trans = {};
            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "TransactionSummary") {
                    this.transactionSummary(child);
                } else if (child.localName === "InsertResults") {
                     this.insertResults(child);
                }
            }
        };


        WfsTransaction.prototype.transactionSummary = function (element) {

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "totalInserted") {
                    this.totalInserted = child.textContent;
                } else if (child.localName === "totalUpdated") {
                    this.totalUpdated = child.textContent;
                } else if (child.localName === "totalReplaced") {
                    this.totalReplaced = child.textContent;
                } else if (child.localName === "totalDeleted") {
                    this.totalDeleted = child.textContent;
                }
            }
        };


        WfsTransaction.prototype.insertResults = function (element) {
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                 if (child.localName === "Feature") {
                    this.handle = this.handle || [];
                    this.handle.push(child.getAttribute("handle"));
                    this.resourceId =  this.resourceId || [];
                    this.resourceId.push(this.getResourceId(child));
                }
            }

        };

        WfsTransaction.prototype.getResourceId = function (element) {
            var featureRid = {};
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                featureRid.rid = featureRid.rid || [];
                featureRid.rid.push(child.getAttribute("rid"));
            }

            return featureRid;
        };

        return WfsTransaction;

    })
;