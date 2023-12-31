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

//@@viewOn:revision
// coded: Petr Bišof, 8.10.2020
// reviewed: Filip Janovský, 12.10.2020
//@@viewOff:revision

//@@viewOn:imports
import * as UU5 from "uu5g04";
import ns from "./bricks-ns.js";
import Css from "./internal/css.js";

import TabsItem from "./tabs-item.js";
import Button from "./button.js";
import Line from "./line.js";
import { InlineMode } from "./internal/inline-mode.js";
import Lsi from "./bricks-lsi.js";
const EditationComponent = UU5.Common.Component.lazy(async () => {
  await SystemJS.import("uu5g04-forms");
  await SystemJS.import("uu5g04-bricks-editable");
  return import("./internal/tabs-editable.js");
});

import "./tabs.less";
//@@viewOff:imports

const MOUNT_TAB_CONTENT_VALUES = {
  onFirstRender: "onFirstRender",
  onFirstActive: "onFirstActive",
  onActive: "onActive",
};

const getMountTabContent = (props) => {
  return props.mountTabContent === undefined ? MOUNT_TAB_CONTENT_VALUES.onFirstRender : props.mountTabContent;
};

const CLASS_NAMES = {
  inline: (renderDots) => {
    let dots = renderDots ? "..." : "";
    return Css.css(`
      & > *{
        pointer-events: none;
        &::after {
          content: ", ";
        }
        &:last-child{
          &::after {
            content: "${dots}";
          }
        }
      }
    `);
  },
};

export const Tabs = UU5.Common.VisualComponent.create({
  displayName: "Tabs", // for backward compatibility (test snapshots)
  //@@viewOn:mixins
  mixins: [
    UU5.Common.BaseMixin,
    UU5.Common.PureRenderMixin,
    UU5.Common.ElementaryMixin,
    UU5.Common.NestingLevelMixin,
    UU5.Common.ColorSchemaMixin,
    UU5.Common.ContentMixin,
    UU5.Common.ScreenSizeMixin,
    UU5.Common.EditableMixin,
  ],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    tagName: ns.name("Tabs"),
    nestingLevelList: UU5.Environment.getNestingLevelList("bigBoxCollection", "smallBox"),
    classNames: {
      main: ns.css("tabs"),
      ul: ns.css("tabs-list", "tabs-list-"),
      pills: ns.css("tabs-list-pills"),
      justified: ns.css("tabs-list-justified"),
      stacked: ns.css("tabs-list-stacked"),
      content: ns.css("tabs-list-content"),
      size: ns.css("tabs-list-size-"),
      active: ns.css("tabs-list-active"),
      inline: Css.css(`
      & > *{
        pointer-events: none;
        &::after {
          content: ", ";
        }
        &:last-child{
          color: green;
          &::after {
            content: " eee";
          }
        }
      }
    `),
    },
    defaults: {
      childTagName: "UU5.Bricks.Tabs.Item",
    },
    opt: {
      nestingLevelWrapper: true,
    },
    editMode: {
      enablePlaceholder: true,
      name: Lsi.inlineComponentHeaders.tabsName,
      startMode: "button",
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  propTypes: {
    type: UU5.PropTypes.oneOf(["tabs", "pills"]),
    stacked: UU5.PropTypes.oneOfType([
      UU5.PropTypes.bool,
      UU5.PropTypes.shape({
        xs: UU5.PropTypes.number,
        s: UU5.PropTypes.number,
        m: UU5.PropTypes.number,
        l: UU5.PropTypes.number,
        xl: UU5.PropTypes.number,
      }),
      UU5.PropTypes.string,
    ]),
    justified: UU5.PropTypes.bool,
    fade: UU5.PropTypes.bool,
    initialActiveName: UU5.PropTypes.string,
    activeName: UU5.PropTypes.string,
    allowTags: UU5.PropTypes.arrayOf(UU5.PropTypes.string),
    size: UU5.PropTypes.oneOf(["s", "m", "l", "xl"]),
    onChange: UU5.PropTypes.func,
    borderRadius: UU5.PropTypes.string,
    elevation: UU5.PropTypes.oneOf(["0", "1", "2", "3", "4", "5", 0, 1, 2, 3, 4, 5]),
    elevationHover: UU5.PropTypes.oneOf(["0", "1", "2", "3", "4", "5", 0, 1, 2, 3, 4, 5]),
    underline: UU5.PropTypes.bool,
    lineProps: UU5.PropTypes.object,
    getButton: UU5.PropTypes.func,
    mountTabContent: UU5.PropTypes.oneOf([
      MOUNT_TAB_CONTENT_VALUES.onFirstRender,
      MOUNT_TAB_CONTENT_VALUES.onFirstActive,
      MOUNT_TAB_CONTENT_VALUES.onActive,
    ]),
    headerColorSchema: UU5.PropTypes.string,
    contentColorSchema: UU5.PropTypes.string,
  },
  //@@viewOff:propTypes

  //@@viewOn:getDefaultProps
  getDefaultProps() {
    return {
      type: "tabs",
      stacked: false,
      justified: false,
      fade: false,
      initialActiveName: undefined,
      activeName: null,
      allowTags: [],
      size: "m",
      onChange: null,
      borderRadius: null,
      elevation: null,
      elevationHover: null,
      underline: true,
      lineProps: null,
      mountTabContent: undefined,
      headerColorSchema: undefined,
      contentColorSchema: undefined,
    };
  },
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this._btn = {};
    UU5.Environment.getColorSchema(this.props.contentColorSchema);

    return this._getState(this.props);
  },

  UNSAFE_componentWillReceiveProps(nextProps) {
    this.setState((state) => this._getState(nextProps, state));
    if (nextProps.controlled) {
      if (this.props.contentColorSchema !== nextProps.contentColorSchema) {
        UU5.Environment.getColorSchema(nextProps.contentColorSchema);
      }
    }
  },

  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  isTabs() {
    return true;
  },

  setActive(name) {
    this.setState((state) => {
      return {
        activeName: name,
        renderedTabs: this._addRenderedTab(state, name),
      };
    });
    return this;
  },

  getActive() {
    return (
      this.state.activeName ||
      (this.getChildren() &&
        this.getChildren()[0] &&
        (this.getChildren()[0].props.name || this.getChildren()[0].props.id))
    );
  },

  onChangeDefault(opt) {
    let tab = opt.tab ? opt.tab : opt;
    this.setState((state) => {
      return {
        activeName: tab.props.name || tab.props.id,
        renderedTabs: this._addRenderedTab(state, tab),
      };
    });

    return this;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  shouldChildRender_(child) {
    let childTagName = UU5.Common.Tools.getChildTagName(child);
    let defaultChildTagName = this.getDefault().childTagName;
    let childTagNames = this.props.allowTags.concat(defaultChildTagName);
    let result = childTagNames.indexOf(childTagName) > -1;
    if (!result && (typeof child !== "string" || child.trim())) {
      if (childTagName)
        this.showError("childTagNotAllowed", [childTagName, this.getTagName(), childTagName, defaultChildTagName], {
          mixinName: "UU5.Common.BaseMixin",
        });
      else this.showError("childNotAllowed", [child, defaultChildTagName], { mixinName: "UU5.Common.BaseMixin" });
    }

    return result;
  },

  expandChildProps_(child, childIndex) {
    let newChildProps = { ...child.props };
    newChildProps.id = newChildProps.name || newChildProps.id || this.getId() + "-" + childIndex;

    let active = false;
    let activeName = this.state ? this.state.activeName : null;
    if (!activeName) {
      if (childIndex === 0) {
        active = true;
      }
    } else if (newChildProps.id === activeName) {
      active = true;
    }

    newChildProps._active = active;
    newChildProps._fade = this.props.fade;
    newChildProps.getButton = () => this._getButton(childIndex);

    return newChildProps;
  },

  onChangeScreenSize_(actualScreenSize, e) {
    this.setState((state) =>
      state.screenSize !== actualScreenSize
        ? {
            screenSize: actualScreenSize,
            stacked: this._isStacked(actualScreenSize),
          }
        : undefined
    );
  },

  onBeforeForceEndEditation_() {
    return this._editableTabs ? this._editableTabs.getPropsToSave() : undefined;
  },

  getEditablePropsValues_(propsArray) {
    let props = this.getEditablePropsValuesDefault(propsArray);

    if (typeof props.elevation === "number") {
      props.elevation = "" + props.elevation;
    }

    if (typeof props.elevationHover === "number") {
      props.elevationHover = "" + props.elevationHover;
    }

    return props;
  },
  //@@viewOff:overriding

  //@@viewOn:private
  _getState(props = this.props, state = this.state) {
    // in editation mode we need to keep opened same tab to prevent loss of edited content (keep activeName from state)
    // this method could be called as setStateCallback - to check if it is after end of editation mode we need to check
    // valid state before set editation to false (currentState)
    let activeName;
    if (!state) {
      activeName = props.initialActiveName || props.activeName;
    } else if (props.controlled && props.activeName) {
      activeName = props.activeName;
    } else {
      activeName = state.activeName;
    }

    let result = {
      renderedTabs: [],
      ...state,
      activeName,
      stacked: props.controlled || !state ? this._isStacked(this.getScreenSize(), props) : state.stacked,
    };

    let builtChildren = this.buildChildren(props);
    if (builtChildren) {
      if (!Array.isArray(builtChildren)) {
        builtChildren = [builtChildren];
      }

      if (builtChildren.length) {
        if (getMountTabContent(props) === MOUNT_TAB_CONTENT_VALUES.onFirstRender) {
          result.renderedTabs = builtChildren.map((tab) => ({ id: tab.props.id, name: tab.props.name }));
        } else if (getMountTabContent(props) === MOUNT_TAB_CONTENT_VALUES.onFirstActive) {
          result.renderedTabs = result.renderedTabs.filter((tab) =>
            builtChildren.some((builtChild) => builtChild.props.name === tab.name || builtChild.props.id === tab.id)
          );

          // check if active item is in result.renderedTabs and add it if needed
          if (result.activeName) {
            let activeItem = builtChildren
              .map((tab) => ({ id: tab.props.id, name: tab.props.name }))
              .find((tab) => tab.name === result.activeName || tab.id === result.activeName);

            if (!result.renderedTabs.some((tab) => tab.name === activeItem.name || tab.id === activeItem.id)) {
              result.renderedTabs.push(activeItem);
            }
          }
        } else if (getMountTabContent(props) === MOUNT_TAB_CONTENT_VALUES.onActive) {
          let activeItem = builtChildren.find(
            (tab) => tab.props.name === result.activeName || tab.props.id === result.activeName
          );
          result.renderedTabs = activeItem ? [{ id: activeItem.props.id, name: activeItem.props.name }] : [];
        }

        if (!result.renderedTabs || !result.renderedTabs.length) {
          let activeIndex = 0;
          if (result.activeName) {
            activeIndex = builtChildren.findIndex(
              (tab) => tab.props.name === result.activeName || tab.props.id === result.activeName
            );
          }

          let { id, name } = builtChildren[activeIndex].props;
          result.renderedTabs = [{ id, name }];
        }
      }
    }

    return result;
  },

  _addRenderedTab(state, newTab) {
    let renderedTabs = [...state.renderedTabs];

    if (typeof newTab === "string") {
      newTab = { name: newTab, id: newTab };
    } else if (typeof newTab === "object" && newTab.props) {
      newTab = { name: newTab.props.name, id: newTab.props.id };
    } else {
      return renderedTabs;
    }

    let matchingTab = renderedTabs.find(
      (renderedTab) => (renderedTab.name && renderedTab.name === newTab.name) || renderedTab.id === newTab.id
    );

    if (!matchingTab) {
      state.renderedTabs.push(newTab);
      renderedTabs = state.renderedTabs;
    } else {
      renderedTabs = state.renderedTabs;
    }

    return renderedTabs;
  },

  _isStacked(actualScreenSize, props) {
    props = props || this.props;
    let result = props.stacked;

    if (typeof props.stacked === "boolean") {
      result = actualScreenSize === "xs" ? true : props.stacked;
    } else if (typeof props.stacked === "string") {
      let splitter = props.stacked.split(" ");

      if (splitter.indexOf(actualScreenSize) > -1) {
        result = true;
      } else {
        result = false;
      }
    }

    return result;
  },

  _onChange(tab) {
    let opt = { tab: tab, component: this };
    if (typeof this.props.onChange === "function") {
      this.props.onChange(opt);
    } else {
      this.onChangeDefault(tab);
    }
    return this;
  },

  _getButton(i) {
    return this._btn[i];
  },

  _filterChildren(children) {
    if (getMountTabContent(this.props) === MOUNT_TAB_CONTENT_VALUES.onFirstActive) {
      children = children.filter(
        (child) =>
          !!this.state.renderedTabs.find(
            (tabName) => (tabName.name && tabName.name === child.props.name) || tabName.id === child.props.id
          )
      );
    } else if (getMountTabContent(this.props) === MOUNT_TAB_CONTENT_VALUES.onActive) {
      if (this.state.activeName) {
        children = children.find(
          (child) => child.props.name === this.state.activeName || child.props.id === this.state.activeName
        );
      } else {
        children = children[0];
      }
    } else {
      // children = children;
    }

    return children;
  },

  _getItems() {
    let children = this.getChildren();
    if (!children) children = [];
    else if (!Array.isArray(children)) children = [children];
    let bgStyle =
      this.props.type === "pills" || (this.state.stacked && this.props.justified) ? "filled" : "transparent";

    //fix - in first render may occurs that first Tab.Item can't be set as active because first child of Tabs component can be string
    let defaultChildTagName = this.getDefault().childTagName;
    let childTagNames = this.props.allowTags.concat(defaultChildTagName);
    if (
      !this.state.activeName &&
      children[0] &&
      !children[0].props._active &&
      childTagNames.indexOf(UU5.Common.Tools.getChildTagName(children[0])) !== -1
    ) {
      children[0] = UU5.Common.Element.clone(children[0], { _active: true, mountContent: this.props.mountContent });
    }

    let items = children.map((tab, i) => {
      const activeItem = (
        <li key={i} className={this.getClassName("active")}>
          <Button
            ref_={(btn) => (this._btn[i] = btn)}
            bgStyle={bgStyle}
            size={this.props.size}
            disabled={tab.props.disabled}
            elevation={this.props.elevation}
            elevationHover={this.props.elevationHover}
            content={tab.props.header}
            borderRadius={this.props.borderRadius}
            controlled={tab.props.controlled}
            hidden={tab.props.hidden}
            colorSchema={this.props.headerColorSchema ? this.props.headerColorSchema : this.props.colorSchema}
          />
        </li>
      );

      if (!this.state.activeName) {
        if (i === 0) {
          return activeItem;
        }
      } else if ((tab.props.name || tab.props.id) === this.state.activeName) {
        return activeItem;
      }

      return (
        <li key={i}>
          <Button
            ref_={(btn) => (this._btn[i] = btn)}
            bgStyle={bgStyle}
            size={this.props.size}
            onClick={() => this._onChange(tab)}
            disabled={tab.props.disabled}
            borderRadius={this.props.borderRadius}
            content={tab.props.header}
            controlled={tab.props.controlled}
            hidden={tab.props.hidden}
            colorSchema={this.props.headerColorSchema ? this.props.headerColorSchema : this.props.colorSchema}
          />
        </li>
      );
    });

    return { items, children: this._filterChildren(children) };
  },

  _buildUlAttributes() {
    let ulClassName = this.getClassName().ul;

    if (this.state.stacked && (this.props.justified || this.props.type === "pills")) {
      ulClassName += "pills " + this.getClassName("stacked");
    } else if (this.state.stacked && this.props.type !== "pills") {
      ulClassName += "tabs " + this.getClassName("stacked");
    } else {
      ulClassName += this.props.type;
    }

    this.props.justified && (ulClassName += " " + this.getClassName().justified);
    return ulClassName;
  },

  _getLineProps() {
    return {
      ...(!this.props.stacked ? { size: "1px" } : { vertical: true, size: "s" }),
      colorSchema: "custom",
      ...this.props.lineProps,
    };
  },

  _renderEditationMode() {
    return (
      <UU5.Common.Suspense fallback="">
        <EditationComponent component={this} ref_={this._registerEditableComponent} />
      </UU5.Common.Suspense>
    );
  },

  _registerEditableComponent(tabs) {
    this._editableTabs = tabs;
  },

  _prepareInlineTitle() {
    let titles = this.getChildren();
    let renderDots = titles.length > 3;
    titles = titles.slice(0, 3);

    return (
      <span className={CLASS_NAMES.inline(renderDots)}>
        {titles.map((tab, index) => (
          <span key={index}>{tab.props.header}</span>
        ))}
      </span>
    );
  },
  //@@viewOff:private

  //@@viewOn:render
  render() {
    const { items, children } = this._getItems();
    const mainAttrs = this.getMainAttrs();
    mainAttrs.className = mainAttrs.className.replace(/color-schema-[a-z-]+ ?/, "");

    let contentColorSchema = this.props.contentColorSchema ? this.props.contentColorSchema : this.props.colorSchema;
    let contentColorSchemaClassName = contentColorSchema ? " color-schema-" + contentColorSchema : "";

    return this.getNestingLevel() ? (
      <UU5.Common.Fragment>
        <div {...mainAttrs}>
          <ul className={this._buildUlAttributes()}>
            {items}
            {this.props.underline ? <Line {...this._getLineProps()} /> : null}
          </ul>

          <div className={this.getClassName().content + contentColorSchemaClassName}>{children}</div>
          {this.getDisabledCover()}
        </div>
        {this.state.editation ? this._renderEditationMode() : null}
      </UU5.Common.Fragment>
    ) : (
      <InlineMode
        component={this}
        Component={UU5.Bricks.Tabs}
        editModalHeader={<UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.tabsName} />}
        linkTitle={this._prepareInlineTitle() || <UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.tabsName} />}
        modalHeader={<UU5.Bricks.Lsi lsi={Lsi.inlineComponentHeaders.tabsName} />}
        getPropsToSave={this.onBeforeForceEndEditation_}
        renderEditationMode={this._renderEditationMode}
      />
    );
  },
  //@@viewOff:render
});

Tabs.Item = TabsItem;
export default Tabs;
