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
 * @exports WfsCapabilities
 */

define([
        '../../error/ArgumentError',
        '../../util/Logger',
        '../../ogc/ows/OwsWfsOperationsMetadata',
        '../../ogc/ows/OwsWfsServiceIdentification',
        '../../ogc/ows/OwsWfsServiceProvider'
    ],

    function (ArgumentError,
              Logger,
              OwsWfsOperationsMetadata,
              OwsWfsServiceIdentification,
              OwsWfsServiceProvider) {
        "use strict";

        /**
         * Constructs an OGC Wfs Capabilities instance from an XML DOM.
         * @alias WfsCapabilities
         * @constructor
         * @classdesc Represents the common properties of a Wfs Capabilities document. Common properties are parsed and
         * mapped to a plain javascript object model. Most fields can be accessed as properties named according to their
         * document names converted to camel case. This model supports version 1.0.0 and 2.0.x of the Wfs specification.
         * Not all properties are mapped to this representative javascript object model, but the provided XML dom is
         * maintained in xmlDom property for reference.
         * @param {{}} xmlDom an XML DOM representing the Wfs Capabilities document.
         * @throws {ArgumentError} If the specified XML DOM is null or undefined.
         */
        var WfsCapabilities = function (xmlDom) {
            if (!xmlDom) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "WfsCapabilities", "constructor", "missingDom"));
            }

            /**
             * The original unmodified XML document. Referenced for use in advanced cases.
             * @type {{}}
             */
            this.xmlDom = xmlDom;

            this.assembleDocument();
        };

        // Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleDocument = function () {
            // Determine version and update sequence
            var root = this.xmlDom.documentElement;

            this.version = root.getAttribute("version");
            this.updateSequence = root.getAttribute("updateSequence");

            // Wfs 1.0.0 does not utilize OWS Common GetCapabilities service and capability descriptions.
           if (this.version === "1.0.0") {
                this.assembleDocument100(root);
            }
            /*else if (this.version === "1.1.0" )
                this.assembleDocument110x(root);/*
            else if( this.version === "2.0.0") {
                this.assembleDocument200x(root);
                }

                else {
                 throw new ArgumentError(
                 Logger.logMessage(Logger.LEVEL_SEVERE, "WfsCapabilities", "assembleDocument", "unsupportedVersion"));
            }*/
        };

        // Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleDocument100 = function (root) {
            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "Service") {
                    this.Service = this.assembleService100(child);
                } else if (child.localName === "Capability") {
                    this.capability = this.assembleCapability100(child);
                } else if (child.localName === "FeatureTypeList") {
                    this.assembleFeatureType100(child);
                }   else if (child.localName === "ogc:Filter_Capabilities") {
                        this.assembleContents101(child);

                }
            }
        };

        // Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleDocument110x = function (root) {
            var children = root.children || root.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "ServiceIdentification") {
                    this.serviceWfsIdentification = new OwsWfsServiceIdentification(child);
                } else if (child.localName === "ServiceProvider") {
                    this.serviceProvider = new OwsWfsServiceProvider(child);
                } else if (child.localName === "OperationsMetadata") {
                    this.operationsMetadata = new OwsWfsOperationsMetadata(child);
                }  else if (child.localName === "FeatureTypeList") {
                    this.assembleFeatureType100(child);
                } else if (child.localName === "Filter_Capabilities") {
                    this.assembleContents110(child);
                }
            }
        };

// Internal. Intentionally not documented.
WfsCapabilities.prototype.assembleDocument200x = function (root) {
    var children = root.children || root.childNodes;
    for (var c = 0; c < children.length; c++) {
        var child = children[c];

        if (child.localName === "ServiceIdentification") {
            this.serviceWfsIdentification = new OwsWfsServiceIdentification(child);
        } else if (child.localName === "ServiceProvider") {
            this.serviceProvider = new OwsWfsServiceProvider(child);
        } else if (child.localName === "OperationsMetadata") {
            this.operationsMetadata = new OwsWfsOperationsMetadata(child);
        }  else if (child.localName === "FeatureTypeList") {
            this.assembleFeatureType100(child);
        } else if (child.localName === "Filter_Capabilities") {
            this.assembleContents110(child);
        }
    }
};


// Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleFeatureType100 = function (element) {
            var children = element.children || element.childNodes;
            var featureType = {};
            for (var c = 0; c < children.length; c++) {
                 var child = children[c];

                if (child.localName === "FeatureType") {
                    this.FeatureType = this.FeatureType || [];
                    this.FeatureType.push(this.assembleFeatureType101(child));
                }
                else if (child.localName === "Operations") {
                    featureType.Operations= this.assembleOperations100(child);
                }
            }
        };

        WfsCapabilities.prototype.assembleOperations100 = function (element) {
            var Operations = [];
            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                //Get all nodes check it
                Operations[c] = child.getTagNames;

                }
            return Operations;

        };

        WfsCapabilities.prototype.assembleContents101 = function (element) {
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "Spatial_Capabilities") {
                    this.assembleSpatialCapabilities(child);
                }
                 else if (child.localName === "Scalar_Capabilities") {
                    this.assembleScalarCapabilities(child);
                        }
            }
        };

        WfsCapabilities.prototype.assembleSpatialCapabilities =function (element) {
            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "Spatial_Operators") {

                    this.assembleOperator100(child);
                }
                else if (child.localName === "fes:GeometryOperands") {
                    this.Operators(child);
                }
                else if (child.localName === "fes:SpatialOperators") {
                        this.Operators(child);
                }

            }
            };

        WfsCapabilities.prototype.assembleOperator100 = function (element) {
            var Operator = [];
              var children = element.children || element.childNodes;

              for (var c = 0; c < children.length; c++) {
                       var child = children[c];

                        //Get all nodes check it
                        Operator[c] = child.getTagNames;
                    }
                    return Operator;

                };

        WfsCapabilities.prototype.assembleScalarCapabilities =function (element) {

            var children = element.children || element.childNodes;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "Logical_Operators") {
                    return child.getTagNames();
                }

              else if (child.localName === "Comparison_Operators") {
                    // Calling function created for Spatial proerty
                    this.assembleOperator100(child);
                }

              else if (child.localName === "Arithmetic_Operators") {
                    // Calling function created for Spatial proerty
                    this.assembleArthmeticOperator100(child);
                }
                else if (child.localName === "ComparisonOperators") {
                    // Calling function created for Spatial proerty
                    this.ComparisonOperators(child);
                }

               else if (child.localName === "LogicalOperators") {
                    return child.getTagNames();
                }
            }
                };

        WfsCapabilities.prototype.assembleArthmeticOperator100 =function (element) {
                var children = element.children || element.childNodes;
                for (var c = 0; c < children.length; c++) {
                    var child = children[c];
                if (child.localName === "Simple_Arithmetic") {
                    return child.getTagNames();
                }

               else if (child.localName === "Functions")
                {
                    this.assembleFunction100(child);
                }
                else if (child.localName === "ogc:Functions") {
                    this.Functions110(child);
                }

            }
        };
       // Internal. Intentionally not documented.

            WfsCapabilities.prototype.assembleFunction100 = function (element) {
                var children = element.children || element.childNodes, func = {};
                for (var c = 0; c < children.length; c++) {
                    var child = children[c];

                    if (child.localName === "Function_Name") {
                        func.Function_Name = func.Function_Name || [];
                        func.Function_Name.push(child.textContent);
                    }
                }
            };
        // Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleFeatureType101 = function (element) {
            var children = element.children || element.childNodes, FeatureType = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Name") {
                    FeatureType.Name = child.textContent;
                } else if (child.localName === "Title") {
                    FeatureType.Title = child.textContent;
                } else if (child.localName === "Keywords") {
                    FeatureType.Keywords = child.textContent;
                } else if (child.localName === "SRS") {
                    FeatureType.SRS = child.textContent;
                } else if (child.localName === "LatLongBoundingBox") {
                    FeatureType.LatLongBoundingBox = this.assembleLatLonBoundingBox(child);
                }
                  else if (child.localName === "Abstract") {
                    FeatureType.abstract = child.textContent;
                } else if (child.localName === "KeywordList") {
                    FeatureType.keywordList = this.assembleKeywordList(child);
                }
                else if (child.localName === "DefaultCRS") {
                    FeatureType.DefaultCRS = child.textContent;
                }
                else if (child.localName === "DefaultSRS") {
                    FeatureType.DefaultSRS = child.textContent;
                }
                else if (child.localName === "wgs84BoundingBox") {
                    FeatureType.wgs84BoundingBox = this.assembleBoundingBox(child);
                }

            }

            return FeatureType;
        };

        WfsCapabilities.prototype.assembleLatLonBoundingBox = function (bboxElement) {
            var result = {};
            result.minx = bboxElement.getAttribute("minx");
            result.miny = bboxElement.getAttribute("miny");
            result.maxx = bboxElement.getAttribute("maxx");
            result.maxy = bboxElement.getAttribute("maxy");
            //console.log(result);
            return result;
        };
        // Internal. Intentionally not documented.  --Service version 1.0.0 Attribute
        WfsCapabilities.prototype.assembleService100 = function (element) {
            var children = element.children || element.childNodes, service = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "Name") {
                    service.Name = child.textContent;
                } else if (child.localName === "Title") {
                    service.Title = child.textContent;
                } else if (child.localName === "Abstract") {
                    service.Abstract = child.textContent;
                } else if (child.localName === "Keywords") {
                    service.Abstract = child.textContent;
                } else if (child.localName === "accessConstraints") {
                    service.accessConstraints = service.accessConstraints || [];
                    service.accessConstraints.push(child.textContent);
                } else if (child.localName === "fees") {
                    service.fees = child.textContent;
                }
                else if (child.localName === "OnlineResource") {
                    service.Abstract = child.textContent;
                }
            }

            return service;
        };

        // Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleCapability100 = function (element) {
            var children = element.children || element.childNodes, capability = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Request") {
                    capability.request = this.assembleRequestCapabilities100(child);

                }
            }

            return capability;
        };

        // Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleRequestCapabilities100 = function (element) {
            var children = element.children || element.childNodes, request = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "GetCapabilities") {
                    request.getCapabilities = this.assembleDCPType100(child);
                } else if (child.localName === "DescribeFeatureType") {
                    request.describefeature = this.assembleDCPType100(child);
                } else if (child.localName === "GetFeature") {
                    request.getfeature = this.assembleDCPType100(child);
                }
                else if (child.localName === "Transaction") {
                    request.transaction = this.assembleDCPType100(child);
                }
                else if (child.localName === "LockFeature") {
                    request.Lockfeature = this.assembleDCPType100(child);
                }
                else if (child.localName === "GetFeatureWithLock") {
                    request.getfeaturewithlock = this.assembleDCPType100(child);
                }
            }

            return request;
        };

        // Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleDCPType100 = function (element) {
            var children = element.children || element.childNodes, dcpType = {};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "DCPType") {
                    this.assembleHttp100(child, dcpType);
                }
                else if(child.localName === "ResultFormat") {
                    this.assembleResFor100(child);
                }

            }

            return dcpType;
        };
            WfsCapabilities.prototype.assembleResFor100 = function (element) {
                var resultFormat = [];
                var children = element.children || element.childNodes;

                for (var c = 0; c < children.length; c++) {
                    var child = children[c];

                    //Get all nodes check it
                    resultFormat[c] = child.getTagNames;
                }
                        return resultFormat;

            };
        // Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleHttp100 = function (element, dcpType) {
            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "HTTP") {
                    return this.assembleMethod100(child, dcpType);
                }
            }
        };

        // Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleMethod100 = function (element, dcpType) {
            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];

                if (child.localName === "Get") {
                    dcpType["get"] = this.assembleOnlineResource100(child);
                } else if (child.localName === "Post") {
                    dcpType["post"] = this.assembleOnlineResource100(child);
                }

            }
        };

        // Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleOnlineResource100 = function (element) {
            var children = element.children || element.childNodes, Attribute;
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                Attribute = child.getAttribute("OnlineResource");
            }

                };






// Internal. Intentionally not documented.
    WfsCapabilities.assembleBoundingBox = function (element) {
        var boundingBoxboundingBox = {};


        var children = element.children || element.childNodes;
        for (var c = 0; c < children.length; c++) {
            var child = children[c];

            if (child.localName === "LowerCorner") {
                var lc = child.textContent.split(" ");
                boundingBox.lowerCorner = [parseFloat(lc[0]), parseFloat(lc[1])];
            } else if (child.localName === "UpperCorner") {
                var uc = child.textContent.split(" ");
                boundingBox.upperCorner = [parseFloat(uc[0]), parseFloat(uc[1])];
            }
        }

    return boundingBox;
};

WfsCapabilities.prototype.assembleKeywordList = function (element) {
    var keywords = [];

    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
        var child = children[c];

        if (child.localName === "Keyword") {
            keywords.push(child.textContent);
        }
    }

    return keywords;
};

WfsCapabilities.prototype.assembleContents110 = function (element) {
    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
        var child = children[c];
        if (child.localName === "fes:Conformance") {
            this.Conformance(child);
        }
        else if (child.localName === "fes:Id_Capabilities") {
            this.Id_Capabilities(child);
        }
        else if (child.localName === "Scalar_Capabilities") {
            this.assembleScalarCapabilities(child);
        }
        else if (child.localName === "Spatial_Capabilities") {
            this.assembleSpatialCapabilities(child);
        }
        else if (child.localName === "fes:Temporal_Capabilities") {
            this.Temporal_Capabilities(child);
        }
        else if (child.localName === "fes:Functions") {
            this.Functions(child);
        }

    }
};

WfsCapabilities.prototype.Conformance= function (element) {
    var Constraints = {};
    var children = element.children || element.childNodes, service = {};
    for (var c = 0; c < children.length; c++) {
        var child = children[c];
        Constraints.name = child.getAttribute("name");
        this.Constraints = new OwsWfsConstraint(child);
    }

};


WfsCapabilities.prototype.Id_Capabilities= function (element) {

    var children = element.children|| element.childNodes,Name;
    if (child.localName === "fes:ResourceIdentifier")
     Name = child.getAttribute("name");
           };


        WfsCapabilities.prototype.Operators = function (element) {

            var children = element.children|| element.childNodes,Operators;
            for (var c = 0; c < children.length; c++) {
                Operators.TagName = child.localName
                Operators.AttributeName = child.getAttribute("name");
            }
        };

        WfsCapabilities.prototype.Temporal_Capabilities= function (element) {
                var Constraints = {};
                var children = element.children || element.childNodes ;
                for (var c = 0; c < children.length; c++) {
                    var child = children[c];
                 if (child.localName === "fes:TemporalOperands") {
                     this.Operators(child);
                 }
                 else if (child.localName === "fes:TemporalOperators") {
                         this.Operators(child);
                     }
                 }
                 };


  WfsCapabilities.prototype.Functions= function (element) {
      var children = element.children || element.childNodes, Function = {};
      for (var c = 0; c < children.length; c++) {
          var child = children[c];

          Function.Name = child.getAttribute("name");
          var children1 = child.children || child.childNodes;
          for (var c = 0; c < children1.length; c++) {
              var subchild = children[c];

              if (subchild.localName === "Returns") {
                  Function.returnValue = this.textContent();

              }
              else if (subchild.localName === "Arguments") {
                  Function.funcArg = this.funcArguments(subchild);

              }
          }
      }
  };

      WfsCapabilities.prototype.Functions110= function (element) {
          var children = element.children || element.childNodes, Function = {};
          for (var c = 0; c < children.length; c++) {
              var child = children[c];
                  {
                 Function.Name = child.textContent();
                 Function.funcArg =child.getAttribute("nArgs");
                 Function.returnValue="NA";

                     }
  }
            };


       WfsCapabilities.prototype.Functions= function (element) {
               var children = element.children || element.childNodes, Arguments = {};
                for (var c = 0; c < children.length; c++) {
                    var child = children[c];
                    Arguments.Name = child.getAttribute("name");
                    var children1 = child.children || child.childNodes;
                    Arguments.Type= children1.textContent();

        }

        };



        return WfsCapabilities;
});