define([], function(){
    var ShapeTransfomer = function() {

    }

    /**
     * Accepts AbstractShape from the Shapes and transforms in the coordinates with the type that can be used by the
     * XML Builders.
     */
    ShapeTransfomer.prototype.transform = function(shape) {
        return {
            type: 'LineString',
            coordinates: [45, 56, 23]
        }
    }
});