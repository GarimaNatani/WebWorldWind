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
        var ShapeTransformer = {


            Transform: function (shape) {

                var shapeVal = {};
                if (shape.boundaries) {
                    shapeVal.type = 'Polygon';
                    shapeVal.coordinates = shape.boundaries;
                }
                if (shape.positions) {
                    shapeVal.type = 'MultiLineString';
                    shapeVal.coordinates = shape.positions;
                }

                return shapeVal;
            }
        };
            return ShapeTransformer;

    } );