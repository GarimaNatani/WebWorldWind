define([
        '../../error/ArgumentError',
        '../../util/Logger',
        'src/shapes/Path',
        'src/shapes/Polygon',
        'src/geom/Position'],
    function (
        ArgumentError,
        Logger,
        Path,
        Polygon,
        Position) {
        "use strict";

        var ShapeTransformer = function (polygon) {
            if (!polygon) {
                throw new ArgumentError(
                    Logger.logMessage(Logger.LEVEL_SEVERE, "ShapeTranformer", "constructor", "missingDom"));
            }

            this.transform(polygon);
        };

        /**
         * Accepts AbstractShape from the Shapes and transforms in the coordinates with the type that can be used by the
         * XML Builders.
         */
        ShapeTransformer.prototype.transform = function (shape) {
            console.log(shape);
            return {
                type: 'LineString',
                coordinates: [45, 56, 23]
            }
        };
    });