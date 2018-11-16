import React, { Component } from 'react';
import PropTypes from 'prop-types';


export default class Map extends Component {
  ymaps = null;
  map = null;
  mapOptions = {
    center: [55.76, 37.64],
    zoom: 14
  };
  
  polygonOptions = {
    balloonCloseButton: false,
    strokeColor: "#000000",
    strokeWidth: 4,
    strokeOpacity: 0.5
  };

  componentDidMount() {
    this.ymaps = window.ymaps;
    this.ymaps && this.ymaps.ready(this.drawMap.bind(this));
  }

  componentDidUpdate() {
    this.drawMap();
  }

  drawMap() {
    const { routes } = this.props;
    const drawLines = (coords, info = {}, options) => {
      return new this.ymaps.Polyline(
        [ ...coords ],
        info,
        {
          ...options,
          editorMaxPoints: coords.length
        }
      );
    }

    //Init map instance
    if (!this.map) {
      this.map = new this.ymaps.Map("map", this.mapOptions);
    }

    if (routes.length === 0) {
      this.map && this.map.geoObjects.removeAll();
      return;
    }

    //Clear all Objects
    this.map.geoObjects.removeAll();

    //Create and add markers to map
    routes.forEach((item, index) => {
      const placeMarker = new this.ymaps.Placemark(item.coords, {
        balloonContent: item.name,
      }, {draggable: true});

      placeMarker.events.add(["dragend"], this.props.onHandleDragEndMarker.bind(this, placeMarker, index));
      this.map.geoObjects.add(placeMarker);
    });

    const polylineCoords = routes.map(c => c.coords);
    const line = drawLines(polylineCoords, {
      balloonContentBody: 'Балун',
      hintContent: 'Хинт'
    }, this.polygonOptions);


    this.map.setCenter(polylineCoords[polylineCoords.length - 1], this.mapOptions.zoom);
    this.map.geoObjects.add(line);
  }

  render() {
    return <div id="map"></div>;
  }
}

Map.propTypes = {
  routes: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    coords: PropTypes.array.isRequired
  })),
  onHandleDragEndMarker: PropTypes.func.isRequired 
};
