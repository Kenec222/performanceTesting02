/**
 * Copyright (C) 2021 Unicorn a.s.
 *
 * This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public
 * License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later
 * version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied
 * warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License at
 * <https://gnu.org/licenses/> for more details.
 *
 * You may obtain additional information at <https://unicorn.com> or contact Unicorn a.s. at address: V Kapslovne 2767/2,
 * Praha 3, Czech Republic or at the email: info@unicorn.com.
 */

import UU5 from "uu5g04";
import "uu5g04-bricks";

const { mount, shallow, wait } = UU5.Test.Tools;

/**
 * Component is avaible from 1.9.0 version.
 */

describe(`UU5.Bricks.Switch interface testing`, () => {
  it("setSwitched(switchedOn, setStateCallback)", () => {
    const wrapper = shallow(<UU5.Bricks.Switch size="xl" id={"uuID"} />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    expect(wrapper.instance().isSwitchedOn()).toBeFalsy();
    const returnValue = wrapper.instance().setSwitched(true, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.switchedOn).toBeTruthy();
    expect(wrapper.instance().isSwitchedOn()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("setSwitched(switchedOff, setStateCallback)", () => {
    const wrapper = shallow(<UU5.Bricks.Switch size="xl" id={"uuID"} switchedOn={true} />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeTruthy();
    expect(wrapper.instance().isSwitchedOn()).toBeTruthy();
    const returnValue = wrapper.instance().setSwitched(false, mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    expect(wrapper.instance().isSwitchedOn()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("switchOn(setStateCallback)", () => {
    const wrapper = shallow(<UU5.Bricks.Switch size="xl" id={"uuID"} />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    expect(wrapper.instance().isSwitchedOn()).toBeFalsy();
    const returnValue = wrapper.instance().switchOn(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.switchedOn).toBeTruthy();
    expect(wrapper.instance().isSwitchedOn()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
  });

  it("switchOff(setStateCallback)", () => {
    const wrapper = shallow(<UU5.Bricks.Switch size="xl" id={"uuID"} switchedOn={true} />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeTruthy();
    expect(wrapper.instance().isSwitchedOn()).toBeTruthy();
    const returnValue = wrapper.instance().switchOff(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    expect(wrapper.instance().isSwitchedOn()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("toggle(setStateCallback)", () => {
    const wrapper = shallow(<UU5.Bricks.Switch size="xl" id={"uuID"} />);
    const mockFunc = jest.fn();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    expect(wrapper.instance().isSwitchedOn()).toBeFalsy();
    const returnValue = wrapper.instance().toggle(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(returnValue === wrapper.instance()).toBe(true);
    expect(wrapper.instance().state.switchedOn).toBeTruthy();
    expect(wrapper.instance().isSwitchedOn()).toBeTruthy();
    expect(wrapper).toMatchSnapshot();
    //Now we should switch off by toggle.
    wrapper.instance().toggle(mockFunc);
    wrapper.update();
    expect(mockFunc).toBeCalled();
    expect(mockFunc).toHaveBeenCalledTimes(2);
    expect(wrapper.instance().state.switchedOn).toBeFalsy();
    expect(wrapper.instance().isSwitchedOn()).toBeFalsy();
    expect(wrapper).toMatchSnapshot();
  });

  it("isSwitchedOn() should return false", () => {
    const wrapper = shallow(<UU5.Bricks.Switch size="xl" id={"uuID"} switchedOn={false} />);
    expect(wrapper.instance().isSwitchedOn()).toBeFalsy();
    expect(wrapper.instance().isSwitchedOn()).not.toBeUndefined();
    expect(wrapper.instance().isSwitchedOn()).not.toBeNull();
    expect(wrapper).toMatchSnapshot();
  });

  it("isSwitchedOn() should return true", () => {
    const wrapper = shallow(<UU5.Bricks.Switch size="xl" id={"uuID"} switchedOn={true} />);
    expect(wrapper.instance().isSwitchedOn()).toBeTruthy();
    expect(wrapper.instance().isSwitchedOn()).not.toBeUndefined();
    expect(wrapper.instance().isSwitchedOn()).not.toBeNull();
    expect(wrapper).toMatchSnapshot();
  });
});
