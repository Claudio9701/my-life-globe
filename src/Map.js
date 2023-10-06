import React from 'react';
import { DeckGL } from 'deck.gl';
import { useMemo } from 'react';
import { BitmapLayer } from '@deck.gl/layers';
import { TileLayer } from '@deck.gl/geo-layers';
import {
  COORDINATE_SYSTEM,
  _GlobeView as GlobeView,
  LightingEffect,
  AmbientLight,
  _SunLight as SunLight
} from '@deck.gl/core';

import ArcBrushingLayer from './goodies/ArcBrushingLayer';


const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 0.5
});
const sunLight = new SunLight({
  color: [255, 255, 255],
  intensity: 2.0,
  timestamp: 0
});
// create lighting effect with light sources
const lightingEffect = new LightingEffect({ambientLight, sunLight});
              
export default function Map({
  viewState,
  onViewStateChange,
  data,
  style,
}) {

  const backgroundLayer = useMemo(
    () => new TileLayer({
        data: 'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png',
        // data: 'https://c.tile.openstreetmap.org/{z}/{x}/{y}.png',
        minZoom: 0,
        maxZoom: 19,
        tileSize: 256,

        renderSubLayers: props => {
          const {
            bbox: {west, south, east, north}
          } = props.tile;

          return new BitmapLayer(props, {
            data: null,
            image: props.data,
            _imageCoordinateSystem: COORDINATE_SYSTEM.CARTESIAN,
            bounds: [west, south, east, north]
          });
        }
      }),
    []
  );

  const layers = [
    new ArcBrushingLayer({
      data: data,
      getSourcePosition: d => d.from.coordinates,
      getTargetPosition: d => d.to.coordinates,
      getSourceColor: [255, 0, 128],
      getTargetColor: [0, 128, 255],
      getWidth: 5,
      getHeight: 0.1,
      pickable: true,
      visible: style.arcCoef > 1e-6,
      coef: style.arcCoef,
    }),
    backgroundLayer,
  ];

  return (
    <DeckGL 
      layers={layers} 
      viewState={viewState} 
      onViewStateChange={onViewStateChange}
      effects={[lightingEffect]}
      controller={true}
      views={new GlobeView({resolution: 10})}
      getTooltip={({object}) => object && object.text}
    />
  )
  }
