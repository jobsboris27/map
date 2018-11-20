import React, { Component } from 'react';
import List from "./components/List/List";
import Map from "./components/Map/Map";
import './App.css';

class App extends Component {
  dragged = null;
  dropped = null;
  inputNode = null;
  coordsByName = {};
  state = {
    routes: []
  }
  
  onDragStartRoute = event => {
    this.dragged = event.currentTarget;
  }

  onDragEndRoute = () => {
    const { routes } = this.state;
    const currIndex = Number(this.dragged.dataset.id);
    const targetIndex = Number(this.dropped.dataset.id);
    const currEL = routes[currIndex];
    const targetEL = routes[targetIndex];

    this.dragged.classList.remove("dropped");
    this.dropped.classList.remove("dragged");

    routes[targetIndex] = currEL;
    routes[currIndex] = targetEL;

    this.setState({
      routes
    })
  }

  onDragOver = event => {
    event.preventDefault();

    if (this.dropped) {
      this.dropped.classList.remove("dragged");
    }

    this.dropped = event.target;
    this.dropped.classList.add("dragged");

    this.dragged.classList.add("dropped");
  }

  onRemoveRoute = (index, event) => {
    event && event.preventDefault();
    const { routes } = this.state;
    routes.splice(index, 1);

    this.setState({
      routes
    })
  }

  handleSubmit = event => {
    event.preventDefault();
    
    if (!this.inputNode.value) { 
      alert("Empty input")
      return;
    }
    
    const { routes } = this.state;
    
    this.getCoordsByName(this.inputNode.value).then(value => {
      routes.push(value);
      this.setState({
        routes
      }, () => {
        this.inputNode.value = "";
      })
    }).catch(err => {
      console.warn(err);
      alert(`Что-то пошло не так, скорее всего нет такого адреса - ${this.inputNode.value}`);
      this.inputNode.value = "";
    })
  }

  onChangeRoute = (newRoute, index) => {
    const { routes } = this.state;
    routes.splice(index, 1, newRoute);
    this.setState({
      routes
    })
  } 

  getCoordsByName(name) {
    if (this.coordsByName[name]) {
      return Promise.resolve(this.coordsByName[name]);
    }

    return window.ymaps.geocode(name).then(res => {
      try {
        this.coordsByName[name] = {
          name: name,
          coords: res.geoObjects.get(0).geometry.getCoordinates()
        }
        return this.coordsByName[name];
      } catch (err) {
        throw new Error(err);
      }
    })
  }

  handleDragEndMarker = (placeMarker, index, event) => {
    window.ymaps.geocode(placeMarker.geometry.getCoordinates(), {
      results: 1
    }).then(res => {
      const newContent = res.geoObjects.get(0) ?
              res.geoObjects.get(0).properties.get('name') :
              'Не удалось определить адрес.';

      this.coordsByName[newContent] = {
        name: newContent,
        coords: res.geoObjects.get(0).geometry.getCoordinates()
      }

      this.onChangeRoute(this.coordsByName[newContent], index);

      placeMarker.properties.set('balloonContent', newContent);
    });
  }

  render() {
    return (
      <div className="app container">
        <div className="row">
          <h3 className="app__description">Проложите свой маршрут</h3>
        </div>
        <div className="row">
          <div className="col-md-4">
            <form onSubmit={this.handleSubmit}>
              <input 
                placeholder="Новая точка маршрута"
                ref={node => (this.inputNode = node)}
                type="text"
                className="form-control"/> 
            </form>
            <List 
              items={this.state.routes}
              onDragStartHandler={this.onDragStartRoute.bind(this)}
              onDragEndHandler={this.onDragEndRoute.bind(this)}
              onDragOverHandler={this.onDragOver.bind(this)}
              onRemoveHandler={this.onRemoveRoute.bind(this)}
            />
          </div>
          <div className="col-md-8">
            <div className="app__map">
              <Map
                routes={this.state.routes}
                onHandleDragEndMarker={this.handleDragEndMarker.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
