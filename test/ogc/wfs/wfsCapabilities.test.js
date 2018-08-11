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
define([
    'src/ogc/wfs/WfsCapabilities'
], function (WfsCapabilities) {
    "use strict";

    describe("Constructor testing", function () {

        it("should throw an exception when nothing is provided as an argument", function () {
            expect((function () {
                new WfsCapabilities(null)
            })).toThrow();
        });
    });

    describe("wfs 2.0.0 Capabilities Parsing", function () {

        var xmlDom;

        beforeAll(function (done) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "../base/test/ogc/wfs/wfs201GetCapabilities.xml", true);
            xhr.addEventListener('load', function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        xmlDom = xhr.responseXML;
                        done();
                    } else {
                        done("Test wfs Capabilities Retrieval Error: " + xhr.statusText);
                    }
                }
            });
            xhr.send(null);
        });

        it("should have a 2.0.0 version", function () {
            var wfsCaps = new WfsCapabilities(xmlDom);

            var version = wfsCaps.version;

            expect(version).toBe("2.0.0");
        });

        it("should have a update sequence of 58950", function () {
            var wfsCaps = new WfsCapabilities(xmlDom);
            var updateSequence = wfsCaps.updateSequence;
            expect(updateSequence).toBe("58950");
        });

        describe("Service Identification", function () {

            it("should have title My GeoServer WFS", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var title = wfsCaps.serviceWfsIdentification.titles[0].value;
                expect(title).toBe('My GeoServer WFS');
            });
        });

        describe("ServiceProvider", function () {

            it("should have blank value", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var name = wfsCaps.serviceProvider.serviceContact.individualName;
                expect(name).toBe("");
            });
        });

        describe("OperationsMetadata", function () {

            it("should have url", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var url = wfsCaps.operationsMetadata.operation[2].dcp[0].getMethods[0].url;
                expect(url).toBe("https://urban-tep.eo.esa.int/puma/wfs");
            });

            it("should have Constraints as ImplementsBasicWFS value", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var name = wfsCaps.operationsMetadata.Constraint[0].name;
                expect(name).toBe("ImplementsBasicWFS");
            });
        });

        describe("FeatureTypeList", function () {

            it("should have Keywords AUT_75m_binConnectivity_10km_5km_3km_2_km_1km", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var name = wfsCaps.featureType[0].keywords.keywords[1].value;
                expect(name).toBe("AUT_75m_binConnectivity_10km_5km_3km_2_km_1km");
            });
        });


        describe("filterCapabilities", function () {

            it("should have Constraint ImplementsQuery", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var name = wfsCaps.filterCapabilities.conformance.constraints[0].name;
                expect(name).toBe("ImplementsQuery");
            });

            it("should have Id_Capabilities", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var name = wfsCaps.filterCapabilities.idCap.resourceIdentifierName[0];
                expect(name).toBe("fes:ResourceId");
            });

            it("should have Scalar_Capabilities and ComparisonOperators as PropertyIsLessThan", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var name = wfsCaps.filterCapabilities.assCap.comparisonOperators.attributeName[0];
                expect(name).toBe("PropertyIsLessThan");
            });

            it("should have Spatial_Capabilities and GeometryOperands as gml:MultiLineString", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var name = wfsCaps.filterCapabilities.assSpCap.geop.attributeName[4];
                expect(name).toBe("gml:MultiLineString");
            });

            it("should have Temporal_Capabilities and TemporalOperand", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var name = wfsCaps.filterCapabilities.temporalCap.temporalOperands.attributeName[0];
                expect(name).toBe("gml:TimeInstant");
            });
        });

        describe("Functions", function () {

            it("should have Argument coverageB", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var name = wfsCaps.filterCapabilities.func.subChild[5].funcArg.name[1];
                expect(name).toBe("coverageB");
            });

            it("should have return type", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var name = wfsCaps.filterCapabilities.func.subChild[5].retValue;
                expect(name).toBe("xs:string");
            });
        });

    });


    describe("wfs 1.0.0 Capabilities Parsing", function () {
        var xmlDom;

        beforeAll(function (done) {

            var xhr = new XMLHttpRequest();
            xhr.open("GET", "../base/test/ogc/wfs/wfs100GetCapabilities.xml", true);
            xhr.addEventListener('load', function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        xmlDom = xhr.responseXML;
                        done();
                    } else {
                        done("Test wfs Capabilities Retrieval Error: " + xhr.statusText);
                    }
                }
            });
            xhr.send(null);
        });

        it("should have a 1.0.0 version", function () {
            var wfsCaps = new WfsCapabilities(xmlDom);

            var version = wfsCaps.version;

            expect(version).toBe("1.0.0");
        });

        describe("Service Identification", function () {

            it("should have title My GeoServer WFS", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var servId = wfsCaps.Service.name;
                expect(servId).toBe('My GeoServer WFS');
            });
        });

        describe("Capability", function () {

            it("should have request url", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var url = wfsCaps.capability.request.request[0].get;
                expect(url).toBe("https://urban-tep.eo.esa.int/puma/wfs?request=GetCapabilities");
            });
        });

        describe("FeatureTypeList", function () {

            it("should have operator as Query", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var operation = wfsCaps.operations[0];
                expect(operation).toBe("Query");
            });

            it("should have keywords as AUT_75m_binConnectivity_10km_5km_3km_2_km_1km", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var keywords = wfsCaps.featureType[0].keywords.keywords;
                expect(keywords).toBe("features, AUT_75m_binConnectivity_10km_5km_3km_2_km_1km");
            });
        });

        describe("Spatial_Capabilities", function () {

            it("should have Spatial_Operators as Disjoint", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var spOp = wfsCaps.spatialCapabilities.spop.name[0];
                expect(spOp).toBe("Disjoint");
            });
        });

        describe("Scalar_Capabilities", function () {

            it("should have Spatial_Operators as Disjoint", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var scalarCap = wfsCaps.scalarCapabilities.arithmetic_Operators.functions.functionName[0].name;
                expect(scalarCap).toBe("abs");
            });
        });
    });

    describe("wfs 1.1.0 Capabilities Parsing", function () {

        var xmlDom;

        beforeAll(function (done) {
            var xhr = new XMLHttpRequest();
            xhr.open("GET", "../base/test/ogc/wfs/wfs110GetCapabilities.xml", true);
            xhr.addEventListener('load', function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        xmlDom = xhr.responseXML;
                        done();
                    } else {
                        done("Test wfs Capabilities Retrieval Error: " + xhr.statusText);
                    }
                }
            });
            xhr.send(null);
        });

        it("should have a 1.1.0 version", function () {
            var wfsCaps = new WfsCapabilities(xmlDom);
            var version = wfsCaps.version;
            expect(version).toBe("1.1.0");
        });

        describe("Service Identification", function () {
            it("should have title My GeoServer WFS", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var ServId = wfsCaps.serviceWfsIdentification.titles[0].value;
                expect(ServId).toBe('My GeoServer WFS');
            });
        });

        describe("filterCapabilities", function () {
            it("should have GeometryOperand as gml:Envelope", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var name = wfsCaps.filterCapabilities.assSpCap.geop.attributeName[0];
                expect(name).toBe("gml:Envelope");
            });
        });

        describe("WGS84BoundingBox", function () {
            it("should have one of the value as 21.8087501525879", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var bBox = wfsCaps.featureType[2].wgs84BoundingBox.lowerCorner[0];
                expect(bBox).toBe(21.8087501525879);
            });
        });

        describe("Spatial_Capabilities", function () {
            it("should have FunctionNames as abs", function () {
                var wfsCaps = new WfsCapabilities(xmlDom);
                var spCp = wfsCaps.filterCapabilities.assCap.arithmeticOperators.functions.functionName[0].name;
                expect(spCp).toBe("abs");
            });
        });

    });
});
