import React from 'react';
import PropTypes from 'prop-types';

const List = ({
    items, 
    onDragStartHandler, 
    onDragEndHandler, 
    onDragOverHandler,
    onRemoveHandler
  }) => {
  const itemsTmpl = items.map((item, index) => (
    <div
      data-id={index}
      key={index}
      draggable
      onDragStart={onDragStartHandler.bind(null)}                    
      onDragEnd={onDragEndHandler.bind(null)}
      className="list-group-item">
      <span>{item.name}</span>
      <button className="btn btn-danger" onClick={onRemoveHandler.bind(null, index)}> 
        X
      </button> 
    </div>
  ))
  return (
    <div className="list-group" onDragOver={onDragOverHandler.bind(null)}>
      {itemsTmpl}
    </div>
  )
}

List.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    coords: PropTypes.array.isRequired
  })),
  onDragStartHandler: PropTypes.func.isRequired, 
  onDragEndHandler: PropTypes.func.isRequired, 
  onDragOverHandler: PropTypes.func.isRequired, 
  onRemoveHandler: PropTypes.func.isRequired, 
};

export default List;