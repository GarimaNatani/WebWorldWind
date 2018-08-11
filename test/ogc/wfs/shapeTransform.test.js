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
             Path,
             Polygon,
             Position) {
    "use strict";


    describe("Shape Transformer", function () {

        it("should return type", function () {

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

            var Type = ShapeTransformer.Transform(polygon);

            expect(Type.type).toBe('Polygon');

        });

        it("should return Point", function () {

            var pathPositions = [];
            pathPositions.push(new Position(40, -100, 1e4));
            pathPositions.push(new Position(45, -110, 1e4));
            pathPositions.push(new Position(46, -122, 1e4));
            // Create the path.
            var path = new Path(pathPositions, null);
            var Type = ShapeTransformer.Transform(path);

            expect(Type.type).toBe('MultiLineString');

        });
    });
});
