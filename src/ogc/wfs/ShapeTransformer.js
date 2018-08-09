define([
        '../../error/ArgumentError',
        '../../util/Logger',
        '../../shapes/Path',
        '../../shapes/Polygon',
        '../../geom/Position'],
    function (
        ArgumentError,
        Logger,
        Path,
        Polygon,
        Position) {

        "use strict";
        /**
         * Accepts AbstractShape from the Shapes and transforms in the coordinates with the type that can be used by the
         * XML Builders.
         */
        var ShapeTransformer = function () {
            this.data = {
                type: 'LineString',
                coordinates: [45, 56, 23]
            };
        };

        ShapeTransformer.Transform = function (shape) {

            console.log(shape);
            return {
                type: 'LineString',
                coordinates: [45, 56, 23]
            };
        };

    });