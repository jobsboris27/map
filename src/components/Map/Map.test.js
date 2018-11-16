import React from "react";
import { mount, simulate, shallow } from "enzyme";
import Map from "./Map";

import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe("MapComponent rendered", () => {
  let props;
  let mountedListComponent;
  const mapComponent = () => {
    if (!mountedListComponent) {
      mountedListComponent = mount(
        <Map {...props} />
      );
    }
    return mountedListComponent;
  }

  beforeEach(() => {
    props = {
      routes: [],
      onHandleDragEndMarker: () => {},
    };
    mountedListComponent = undefined;
  });
  
  it("always renders a div", () => {
    const divs = mapComponent().find("div");
    expect(divs.length).toBeGreaterThan(0);
  });
});