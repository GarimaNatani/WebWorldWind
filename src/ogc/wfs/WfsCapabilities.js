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
        '../../ogc/ows/OwsWfsServiceProvider',
        '../../ogc/ows/OwsWfsKeywords',
        '../../ogc/ows/OwsWfsConstraint'
    ],

    function (ArgumentError,
              Logger,
              OwsWfsOperationsMetadata,
              OwsWfsServiceIdentification,
              OwsWfsServiceProvider,
              OwsWfsKeywords,
              OwsWfsConstraint) {
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

            else if (this.version === "1.1.0" || this.version === "2.0.0") {

              this.assembleDocument200x(root);
                }

                else {
                 throw new ArgumentError(
                 Logger.logMessage(Logger.LEVEL_SEVERE, "WfsCapabilities", "assembleDocument", "unsupportedVersion"));
            }
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
                }   else if (child.localName === "Filter_Capabilities") {
                      this.Filter_Capabilities = this.assembleContents101(child);

                }
            }
        };

        // Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleDocument110x = function (root) {
            var children = root.children || root.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];
               // console.log(child);
                if (child.localName === "ServiceIdentification") {
                   this.serviceWfsIdentification = new OwsWfsServiceIdentification(child);
                } else if (child.localName === "ServiceProvider") {
                   this.serviceProvider = new OwsWfsServiceProvider(child);
                } else if (child.localName === "OperationsMetadata") {
                      this.operationsMetadata = new OwsWfsOperationsMetadata(child);
                }  else if (child.localName === "FeatureTypeList") {
                       this.assembleFeatureType100(child);
                } else if (child.localName === "Filter_Capabilities") {
                    this.Filter_Capabilities= this.assembleContents110(child);
                  //  console.log(this.Filter_Capabilities);
                }
            }
        };

// Internal. Intentionally not documented.
WfsCapabilities.prototype.assembleDocument200x = function (root) {
    var children = root.children || root.childNodes;
    //console.log("Inside 2 X......................................................................");
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
            this.Filter_Capabilities= this.assembleContents110(child);
          //  console.log(this.Filter_Capabilities);
        }
    }
};


// Internal. Intentionally not documented.
        WfsCapabilities.prototype.assembleFeatureType100 = function (element) {
            var children = element.children || element.childNodes;
            //var featureType = {};
            for (var c = 0; c < children.length; c++) {
                 var child = children[c];

                if (child.localName === "FeatureType") {
                    this.FeatureType = this.FeatureType || [];
                    this.FeatureType.push(this.assembleFeatureType101(child));
                }
                else if (child.localName === "Operations") {
                   // featureType.Operations = featureType.Operations || [];
                    //featureType.Operations.push(this.assembleOperations100(child));
                    this.Operations= this.assembleOperations100(child);
                }
            }
            //return featureType;
        };

        WfsCapabilities.prototype.assembleOperations100 = function (element) {
            var operations = [];
            var children = element.children || element.childNodes;

            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                //Get all nodes check it
                this.operations = this.operations || []
                this.operations.push(child.localName);


                }

            return operations;

        };

        WfsCapabilities.prototype.assembleContents101 = function (element) {
            var children = element.children || element.childNodes;
               // spatial00 ={};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "Spatial_Capabilities") {
                    this.Spatial_Capabilities= this.assembleSpatialCapabilities(child);
                }
                 else if (child.localName === "Scalar_Capabilities") {
                    this.Scalar_Capabilities= this.assembleScalarCapabilities(child);
                        }
            }
      //  return spatial00;
        };

        WfsCapabilities.prototype.assembleSpatialCapabilities =function (element) {
            var children = element.children || element.childNodes,spatialCap ={};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "Spatial_Operators") {

                    spatialCap.spop=this.assembleOperator100(child);
                }
                else if (child.localName === "GeometryOperands") {
                    spatialCap.geop= this.getOperatorName(child);
                }
                else if (child.localName === "SpatialOperators") {
                    spatialCap.spop=this.getOperatorName(child);
                }

            }
            return spatialCap;
            };

        WfsCapabilities.prototype.assembleOperator100 = function (element) {
            var Operator = [];
              var children = element.children || element.childNodes;

              for (var c = 0; c < children.length; c++) {
                       var child = children[c];
                      //  console.log(child.localName);
                        Operator.name=Operator.name ||[];
                        Operator.name.push(child.localName);
                    }
                    return Operator;

                };

        WfsCapabilities.prototype.assembleScalarCapabilities =function (element) {

            var children = element.children || element.childNodes, scalarCap ={};
            for (var c = 0; c < children.length; c++) {
                var child = children[c];
                if (child.localName === "Logical_Operators") {
                    scalarCap.Logical_Operators= child.localName;
                }

              else if (child.localName === "Comparison_Operators") {
                    // Calling function created for Spatial proerty
                    scalarCap.Comparison_Operators= this.assembleOperator100(child);
                }

              else if (child.localName === "Arithmetic_Operators") {
                    // Calling function created for Spatial proerty
                    scalarCap.Arithmetic_Operators= this.assembleArthmeticOperator100(child);
                }
                else if (child.localName === "ComparisonOperators") {
                   scalarCap.ComparisonOperators= this.getOperatorName(child);
                }

               else if (child.localName === "LogicalOperators") {
                    scalarCap.LogicalOperators = child.localName;
                     }
                else if (child.localName === "ArithmeticOperators") {
                    // Calling function created for Spatial proerty
                    scalarCap.ArithmeticOperators= this.assembleArthmeticOperator100(child);
                }
            }
            return scalarCap;
                };

        WfsCapabilities.prototype.assembleArthmeticOperator100 =function (element) {
                var children = element.children || element.childNodes, Arth={};
                for (var c = 0; c < children.length; c++) {
                    var child = children[c];
                if (child.localName === "Simple_Arithmetic") {
                    Arth.simpleArithmetic= child.localName;
                }

               else if (child.localName === "Functions")
                {
                    Arth.functions=this.assembleFunction100(child);
                }
             }
             return Arth;
        };
       // Internal. Intentionally not documented.

            WfsCapabilities.prototype.assembleFunction100 = function (element) {
                var children = element.children || element.childNodes, func = {};
                   var child = children[0];
                     var children1 = child.children1 || child.childNodes;
                         for(var c = 0; c < children1.length; c++) {
                          var child1 = children1[c];
                          func.functionName = func.functionName || [];
                          func.functionName.push(this.nameArgument(child1));
                   }

               return func;
            };

        WfsCapabilities.prototype.nameArgument = function (element) {
            var func1 = {};
              func1.name = element.textContent;
              func1.nArgs =element.getAttribute("nArgs");
            return func1;
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
                    FeatureType.Keywords =new OwsWfsKeywords(child);
                } else if (child.localName === "SRS") {
                    FeatureType.SRS = child.textContent;
                } else if (child.localName === "LatLongBoundingBox") {
                    FeatureType.LatLongBoundingBox = this.assembleLatLonBoundingBox(child);
                }
                  else if (child.localName === "Abstract") {
                    FeatureType.abstract = child.textContent;
                } else if (child.localName === "KeywordList") {
                   FeatureType.keywordList =new OwsWfsKeywords(child);
                }
                else if (child.localName === "DefaultCRS") {
                    FeatureType.DefaultCRS = child.textContent;
                }
                else if (child.localName === "DefaultSRS") {
                    FeatureType.DefaultSRS = child.textContent;
                }
                else if (child.localName === "WGS84BoundingBox") {
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
                    service.Keywords = child.textContent;
                } else if (child.localName === "AccessConstraints") {
                    service.accessConstraints = child.textContent;
                } else if (child.localName === "Fees") {
                    service.fees = child.textContent;
                }  else if (child.localName === "OnlineResource") {
                    service.OnlineResource = child.textContent;
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
                    dcpType.ResultFormat = this.assembleResFor100(child);
                }
                else if(child.localName === "SchemaDescriptionLanguage")
                {

                    dcpType.SchemaDescriptionLanguage=this.assembleSchemaDescriptionLanguage(child);
                }

            }

            return dcpType;
        };
            WfsCapabilities.prototype.assembleResFor100 = function (element) {
                var resultFormat = {};
                var children = element.children || element.childNodes;

                for (var c = 0; c < children.length; c++) {
                    var child = children[c];

                    //Get all nodes check it
                    resultFormat.resfom =resultFormat.resfom || [];
                    resultFormat.resfom.push(child.localName);
                }
                        return resultFormat;

            };

        WfsCapabilities.prototype.assembleSchemaDescriptionLanguage = function (element) {
            var SchemaDescriptionLanguage= {};
            var children = element.children || element.childNodes;
            var child = children[0];
                SchemaDescriptionLanguage.name=child.localName;
                return child.localName;

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

                return element.getAttribute("onlineResource");
                            };






// Internal. Intentionally not documented.
    WfsCapabilities.prototype.assembleBoundingBox = function (element) {
        var boundingBox = {};
        var children = element.children || element.childNodes;
        for (var c = 0; c < children.length; c++) {
            var child = children[c];

            if (child.localName === "LowerCorner") {
                var lc = child.textContent.split(" ");
               // console.log(parseFloat(lc[0]));
                boundingBox.lowerCorner = [parseFloat(lc[0]), parseFloat(lc[1])];
            } else if (child.localName === "UpperCorner") {
                var uc = child.textContent.split(" ");

                boundingBox.upperCorner = [parseFloat(uc[0]), parseFloat(uc[1])];
             //   console.log(boundingBox.upperCorner);
            }
        }

    return boundingBox;
};

/*WfsCapabilities.prototype.assembleKeywordList = function (element) {
    var key ={};
    var children = element.children || element.childNodes;
    cnsole.log(children.length);
    for (var c = 0; c < children.length; c++) {
        var child = children[c];
        console.log(child.textContent);
        key.Keyword=key.Keyword;
        key.Keyword.push(child.textContent);
    }
    return key;
};*/

WfsCapabilities.prototype.assembleContents110 = function (element) {
    var filterCap= {};
    var children = element.children || element.childNodes;
    for (var c = 0; c < children.length; c++) {
        var child = children[c];
        if (child.localName === "Conformance") {
           filterCap.conformance= this.Conformance(child);
        }
        else if (child.localName === "Id_Capabilities") {
            filterCap.idCap= this.Id_Capabilities(child);
             }
        else if (child.localName === "Scalar_Capabilities") {
            filterCap.assCap= this.assembleScalarCapabilities(child);
        }
        else if (child.localName === "Spatial_Capabilities") {
            filterCap.assSpCap= this.assembleSpatialCapabilities(child);
        }
        else if (child.localName === "Temporal_Capabilities") {
            filterCap.temporalCap= this.Temporal_Capabilities(child);
        }
        else if (child.localName === "Functions") {
            filterCap.func=this.Functions(child);
        }

    }
    return filterCap;
};

WfsCapabilities.prototype.Conformance= function (element) {
    var Constraints = {};
    var children = element.children || element.childNodes, service = {};
    for (var c = 0; c < children.length; c++) {
        var child = children[c];
        Constraints.constraints =Constraints.constraints || [];
       Constraints.constraints .push(new OwsWfsConstraint(child));

    }
return Constraints;
};


WfsCapabilities.prototype.Id_Capabilities= function (element) {

     var children = element.children|| element.childNodes,ResourceIdentifier={};
     for(var c = 0; c < children.length; c++){
     var children1=children[c];
      if (children1.localName === "ResourceIdentifier") {
          ResourceIdentifier.resourceIdentifierName = ResourceIdentifier.resourceIdentifierName || [];
          ResourceIdentifier.resourceIdentifierName.push(children1.getAttribute("name"));
      }
    }
      return ResourceIdentifier;
           };


        WfsCapabilities.prototype.getOperatorName = function (element) {

            var children = element.children|| element.childNodes,Operators={},child;

            for (var c = 0; c < children.length; c++) {
                child = children[c];
                if(child.textContent)
                {
                    Operators.attributeName = Operators.attributeName || [];
                    Operators.attributeName.push(child.textContent);

                }
                else {
                    Operators.attributeName = Operators.attributeName || [];
                    Operators.attributeName.push(child.getAttribute("name"));
                }
            }
            return Operators;
        };

        WfsCapabilities.prototype.Temporal_Capabilities= function (element) {
                var tmpCap = {};
                var children = element.children || element.childNodes ;
                for (var c = 0; c < children.length; c++) {
                    var child = children[c];
                 if (child.localName === "TemporalOperands") {
                     tmpCap.temporalOperands=this.getOperatorName(child);
                 }
                 else if (child.localName === "TemporalOperators") {
                     tmpCap.temporalOperator= this.getOperatorName(child);
                     }
                 }
                 return tmpCap;
           };


  WfsCapabilities.prototype.Functions= function (element) {
      var children = element.children || element.childNodes, Function = {Name:[],subChild:[]};
      for (var c = 0; c < children.length; c++) {
          var child = children[c];
         Function.Name[c] = child.getAttribute("name");
         Function.subChild[c] = this.FunctionsSubChild(child);
      }

      return Function;
  };

        WfsCapabilities.prototype.FunctionsSubChild= function (element) {
            //console.log(element.localName);
            var children = element.children || element.childNodes, subChild = {};
          //  console.log(children.length);
            for (var c = 0; c < children.length; c++) {
               // console.log(c);
                  var Child = children[c];
             //   console.log(Child.localName);
                if (Child.localName === "Returns") {
                    subChild.retValue = Child.textContent;
                                 }
                else if (Child.localName === "Arguments") {
                    subChild.funcArg = this.funcArguments(Child);
                }

            }
            return subChild;
        };



        WfsCapabilities.prototype.funcArguments= function (element) {

            var children = element.children || element.childNodes, Argument = {name:[],type:[]};
            //console.log(element);

           for (var c = 0; c < children.length; c++) {
               var child = children[c];
                if (child.localName === "Argument") {
                   Argument.name[c] = child.getAttribute("name");
                   var child1 = child.children|| element.childNodes;
                   var child2=child1[0]
                   Argument.type[c] = child2.textContent;
               }


           }
            return Argument;
        };
          return WfsCapabilities;
});