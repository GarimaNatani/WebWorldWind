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
    'src/ogc/wfs/ShapeTransformer',
    'src/shapes/Path',
    'src/shapes/Polygon',
    'src/geom/Position'
], function (ShapeTransformer,
             ath,
             Polygon,
             Position) {
    "use strict";


    describe("Shape Transformer", function () {

        it("should return ok", function () {

            var boundaries = [];
            boundaries[0] = []; // outer boundary
            boundaries[0].push(new Position(40, -100, 1e5));
            boundaries[0].push(new Position(45, -110, 1e5));
            boundaries[0].push(new Position(40, -120, 1e5));
            boundaries[1] = []; // inner boundary
            boundaries[1].push(new Position(41, -103, 1e5));
            boundaries[1].push(new Position(44, -110, 1e5));
            boundaries[1].push(new Position(41, -117, 1e5));
            var polygon = new Polygon(boundaries, null);

            var ok = new ShapeTransformer(polygon);

            expect(ok).toBe("2018-06-02T10:08:44.847Z");

        });
    });

});
