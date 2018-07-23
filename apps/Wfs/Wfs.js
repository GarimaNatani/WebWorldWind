/*
 * Copyright 2003-2006, 2009, 2017, United States Government, as represented by the Administrator of the
 * National Aeronautics and Space Administration. All rights reserved.
 *
 * The NASAWorldWind/WebWorldWind platform is licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under thshapee License.
 */
define(['../../src/WorldWind',
        '../util/GoToBox',
        '../util/LayersPanel',
        '../util/ProjectionMenu',
        '../util/FeaturePanel',
        '../util/TimeSeriesPlayer'],
    function (ww,
              GoToBox,
              LayersPanel,
              ProjectionMenu,
              FeaturePanel,
              TimeSeriesPlayer) {
        "use strict";

        var Wfs = function () {
            WorldWind.Logger.setLoggingLevel(WorldWind.Logger.LEVEL_WARNING);
            // Create the WorldWindow.
            this.wwd = new WorldWind.WorldWindow("canvasOne");
            /**
             * Added imagery layers.
             */
            var layers = [
                {layer: new WorldWind.BMNGLayer(), enabled: true, hide: true},
                {layer: new WorldWind.BingAerialWithLabelsLayer(null), enabled: true},
                {layer: new WorldWind.OpenStreetMapImageLayer(null), enabled: false},
                {layer: new WorldWind.CompassLayer(), enabled: true, hide: true},
                {layer: new WorldWind.CoordinatesDisplayLayer(this.wwd), enabled: true, hide: true},
                {layer: new WorldWind.ViewControlsLayer(this.wwd), enabled: true, hide: true}
            ];

            for (var l = 0; l < layers.length; l++) {
                layers[l].layer.enabled = layers[l].enabled;
                layers[l].layer.hide = layers[l].hide;
                this.wwd.addLayer(layers[l].layer);
            }


           var resourcesUrl1 ="http://localhost:8080/geoserver/wfs?request=GetFeature&outputFormat=application/json&version=1.1.0&typeName=topp:states&propertyName=STATE_NAME,PERSONS&BBOX=-75.102613,40.212597,-72.361859,41.512517,EPSG:4326";
            var wfsLayer = new WorldWind.RenderableLayer("WFS");
            var wfsGetFeature = new WorldWind.GeoJSONParser(resourcesUrl1);
            wfsGetFeature.load(null, shapeConfigurationCallback, wfsLayer);
            this.wwd.addLayer(wfsLayer);
            // Start the view pointing to a longitude within the current time zone.
            this.wwd.navigator.lookAtLocation.latitude = 30;
            this.wwd.navigator.lookAtLocation.longitude = -(180 / 12) * ((new Date()).getTimezoneOffset() / 60);

            this.goToBox = new GoToBox(this.wwd);
            this.layersPanel = new LayersPanel(this.wwd);
            this.timeSeriesPlayer = new TimeSeriesPlayer(this.wwd);
            this.FeaturePanel = new FeaturePanel(this.wwd, this.layersPanel, this.timeSeriesPlayer);
            this.projectionMenu = new ProjectionMenu(this.wwd);

            this.layersPanel.timeSeriesPlayer = this.timeSeriesPlayer;

          //  this.FeaturePanel.attachServer("http://localhost:8080/geoserver/wfs");
            
              };




        return Wfs;
    }
)
;