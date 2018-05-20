/*
 * Copyright 2015-2017 WorldWind Contributors
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
 * @exports OwsWfsOperationsMetadata
 */
define([
        '../../error/ArgumentError',
        '../../util/Logger',
        '../../ogc/ows/OwsWfsConstraint'
    ],
    function (ArgumentError,
              Logger,
              OwsWfsConstraint) {
        "use strict";

        /**
         * Constructs an OWS Operations Metadata instance from an XML DOM.
         * @alias OwsWfsOperationsMetadata
         * @constructor
         * @classdesc Represents an OWS Operations Metadata section of an OGC capabilities document.
         * This object holds as properties all the fields specified in the OWS Operations Metadata section.
         * Most fields can be accessed as properties named according to their document names converted to camel case.
         * For example, "operations".
         * @param {Element} element An XML DOM element representing the OWS Service Provider section.
         * @throws {ArgumentError} If the specified XML DOM element is null or undefined.
         */
        var OwsWfsOperationsMetadata = function (element) {
            if (!element) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "OwsWfsOperationsMetadata", "constructor", "missingDomElement"));
            }

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Operation") {
                    this.operation = this.operation || [];
                    this.operation.push(OwsWfsOperationsMetadata.getOperationMetadataByName(child));
                }
              }
        };

        OwsWfsOperationsMetadata.prototype.getOperationMetadataByName = function (element) {
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (!child) {
                    throw new ArgumentError(
                        Logger.logMessage(Logger.LEVEL_SEVERE, "OwsWfsOperationsMetadata", "getOperationsMetadataByName", "missingName"));
                }

                if (child.localName === "operation") {


                    var children1 = child.children || child.childNodes;
                    for (var c = 0; c < children1.length; c++) {
                        var child1 = children1[c];
                        OwsWfsOperationsMetadata.assembleOperation(child1);
                    }
                }
                else if (child.localName === "Constraint") {

                    var children2 = child.children || child.childNodes;
                    for (var c = 0; c < children2.length; c++) {
                        var child2 = children2[c];
                        OwsWfsOperationsMetadata.assembleOperation(child2);
                    }
                }
            }
        };

        OwsWfsOperationsMetadata.assembleOperation = function (element) {
            var operation = {};

            operation.name = element.getAttribute("name");
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "DCP") {
                    operation.dcp = operation.dcp || [];
                    operation.dcp.push(OwsWfsOperationsMetadata.assembleDcp(child));
                }

                else if (child.localName === "Parameter") {
                    operation.Parameter = operation.Parameter || [];
                    operation.Parameter.push(OwsWfsOperationsMetadata.assembleParameterVal(child));
                }
                else if (child.localName === "Constraints") {
                    operation.Constraints = operation.Constraints || [];
                    operation.Constraints.push(OwsWfsOperationsMetadata.assembleConstraintsVal(child));
                }

            }

            return operation;
        };

        OwsWfsOperationsMetadata.assembleDcp = function (element) {
            var dcp = {};

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "HTTP") {
                    var httpMethods = child.children || child.childNodes;
                    for (var c2 = 0; c2 < httpMethods.length; c2++) {
                        var httpMethod = httpMethods[c2];

                        if (httpMethod.localName === "Get") {
                            dcp.getMethods = dcp.getMethods || [];
                            dcp.getMethods.push(OwsWfsOperationsMetadata.assembleMethod(httpMethod));
                        } else if (httpMethod.localName === "Post") {
                            dcp.postMethods = dcp.postMethods || [];
                            dcp.postMethods.push(OwsWfsOperationsMetadata.assembleMethod(httpMethod));
                        }
                    }
                }
            }

            return dcp;
        };


        OwsWfsOperationsMetadata.assembleParameterVal  = function (element) {
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.getAttribute(name) === "AcceptVersions") {
                       this.AcceptVersions = new OwsWfsConstraint(child);
                }

                       else if (child.getAttribute(name) === "AcceptFormats")
                    {
                        this.AcceptFormats = new OwsWfsConstraint(child);
                    }

                else if (child.getAttribute(name) === "OutputFormats")
                {
                    this.OutputFormats = new OwsWfsConstraint(child);
                }
                else if (child.getAttribute(name) === "resultType")
                {
                    this.resultType = new OwsWfsConstraint(child);
                }
                else if (child.getAttribute(name) === "resultType")
                {
                    this.resultType = new OwsWfsConstraint(child);
                }
                }
          };

        OwsWfsOperationsMetadata.assembleConstraintsVal = function (element) {
            var Constraints={};
            Constraints.name = element.getAttribute("name");
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                this.Constraints = new OwsWfsConstraint(child);
                }
        };

        return OwsWfsOperationsMetadata;
    });