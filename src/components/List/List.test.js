import React from "react";
import { mount, simulate, shallow } from "enzyme";
import List from "./List";

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe("ListComponent rendered", () => {
  let props;
  let mountedListComponent;
  const list = () => {
    if (!mountedListComponent) {
      mountedListComponent = mount(
        <List {...props} />
      );
    }
    return mountedListComponent;
  }

  beforeEach(() => {
    props = {
      items: [],
      onDragStartHandler: () => {},
      onDragEndHandler: () => {},
      onDragOverHandler: () => {},
      onRemoveHandler: () => {},
    };
    mountedListComponent = undefined;
  });
  
  it("always renders a div", () => {
    const divs = list().find("div");
    expect(divs.length).toBeGreaterThan(0);
  });
});

describe("ListComponent check render list", () => {
  let props;
  let mountedListComponent;
  const list = () => {
    if (!mountedListComponent) {
      mountedListComponent = mount(
        <List {...props} />
      );
    }
    return mountedListComponent;
  }

  beforeEach(() => {
    props = {
      items: [
        {
          name: "Test",
          coords: [],
        },
        {
          name: "Test2",
          coords: [],
        },
      ],
      onDragStartHandler: () => {},
      onDragEndHandler: () => {},
      onDragOverHandler: () => {},
      onRemoveHandler: () => {},
    };
    mountedListComponent = undefined;
  });
  
  it("should render list items", () => {
    const items = list().find(".list-group-item");
    expect(items.length).toBe(2);
  });

  it("should remove item  by click", () => {
    const items = list();
    const button = items.find("button").first();
    button.simulate('click');

    items.update();
    
    expect(items.length).toBe(1);
  });
});