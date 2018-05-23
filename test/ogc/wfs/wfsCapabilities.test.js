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
            console.log(updateSequence);
            expect(updateSequence).toBe("58950");
        });
    });

/*        describe("Service Identification", function () {

            it("should have scaling extension detailed in the profile", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var scalingExtension = wfsCaps.assembleService100.profile[1];

                expect(scalingExtension)
                    .toBe("http://www.opengis.net/spec/wfs_service-extension_scaling/1.0/conf/scaling");
            });
        });

        describe("Operations Metadata", function () {

            it("should have a GET GetFeature link defined", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var url = wfsCaps.operationsMetadata.getOperationMetadataByName("GetFeature").dcp[0].getMethods[0].url;

                expect(url).toBe("http://localhost:8080/geoserver/wfs?");
            });
        });

        describe("Service Metadata", function () {

            it("should have seven supported formats", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var formatsSupported = wfsCaps.serviceMetadata.formatsSupported.length;

                expect(formatsSupported).toBe(7);
            });

            it("should suport image/tiff as the sixth format", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var imageTiffFormat = wfsCaps.serviceMetadata.formatsSupported[5];

                expect(imageTiffFormat).toBe("image/tiff");
            });

            it("should include 5841 supported crs", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var supportedCrsCount = wfsCaps.serviceMetadata.extension.crsSupported.length;

                expect(supportedCrsCount).toBe(5841);
            });

            it("should include three supported interpolation methods", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var supportedInterpolationMethods = wfsCaps.serviceMetadata.extension.interpolationSupported.length;

                expect(supportedInterpolationMethods).toBe(3);
            });
        });

        describe("Contents", function () {

            it("should provide a FeatureId of testing__pacificnw_usgs_ned_10m", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var FeatureId = wfsCaps.Features[1].FeatureId;

                expect(FeatureId).toBe("testing__pacificnw_usgs_ned_10m");
            });
        });
    }); */

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

/*        it("should have a update sequence of 5", function () {
            var wfsCaps = new wfsCapabilities(xmlDom);

            var updateSequence = wfsCaps.updateSequence;

            expect(updateSequence).toBe("11");
        });

        describe("Features", function () {

            it("should provide a name of testing:pacificnw_usgs_ned_10m", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var name = wfsCaps.Features[1].name;

                expect(name).toBe("testing:pacificnw_usgs_ned_10m");
            });

            it("should have a bounding box with the correct order", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                // determine the lowest longitude value and ensure that coordinate is specified first in the bounding box
                var lowerValue = parseFloat(wfsCaps.Features[0].wgs84BoundingBox.lowerCorner.split(/\s+/)[0]);
                var upperValue = parseFloat(wfsCaps.Features[0].wgs84BoundingBox.upperCorner.split(/\s+/)[0]);

                expect(lowerValue).toBeLessThan(upperValue);
            });
        });

        describe("Service", function () {

            it("should have the wfs name", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var name = wfsCaps.service.name;

                expect(name).toBe("wfs");
            });

            it("should have NONE fees", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var fees = wfsCaps.service.fees;

                expect(fees).toBe("NONE");
            });

            it("should have NONE accessConstraints", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var accessContraints = wfsCaps.service.accessConstraints[0];

                expect(accessContraints).toBe("NONE");
            });
        });

        describe("Capability", function () {

            it("should have a get capabilities GET url of http://localhost:8080/geoserver/wfs?", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var getCapabilitiesUrl = wfsCaps.capability.request.getCapabilities.get;

                expect(getCapabilitiesUrl).toBe("http://localhost:8080/geoserver/wfs?");
            });

            it("should have a get capabilities POST url of http://localhost:8080/geoserver/wfs?", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var getCapabilitiesUrl = wfsCaps.capability.request.getCapabilities.post;

                expect(getCapabilitiesUrl).toBe("http://localhost:8080/geoserver/wfs?");
            });

            it("should have a describe Feature GET url of http://localhost:8080/geoserver/wfs?", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var describeFeatureUrl = wfsCaps.capability.request.describeFeature.get;

                expect(describeFeatureUrl).toBe("http://localhost:8080/geoserver/wfs?");
            });

            it("should have a describe Feature POST url of http://localhost:8080/geoserver/wfs?", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var describeFeatureUrl = wfsCaps.capability.request.describeFeature.post;

                expect(describeFeatureUrl).toBe("http://localhost:8080/geoserver/wfs?");
            });

            it("should have a get Feature GET url of http://localhost:8080/geoserver/wfs?", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var getFeatureUrl = wfsCaps.capability.request.getFeature.get;

                expect(getFeatureUrl).toBe("http://localhost:8080/geoserver/wfs?");
            });

            it("should have a get Feature POST url of http://localhost:8080/geoserver/wfs?", function () {
                var wfsCaps = new wfsCapabilities(xmlDom);

                var getFeatureUrl = wfsCaps.capability.request.getFeature.post;

                expect(getFeatureUrl).toBe("http://localhost:8080/geoserver/wfs?");
            });
        });*/
    });
});
