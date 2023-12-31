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

import React from "react";
import { getIdentityFromSession } from "../uu5g05-integration/use-session.js";
import SessionMixin from "./session-mixin.js";
import Error from "./error.js";
import Environment from "../environment/environment.js";
import Tools from "./tools.js";

const AUTH = "authenticated";
const NOT_AUTH = "notAuthenticated";
const PENDING = "pending";

export const IdentityMixin = {
  //@@viewOn:mixins
  mixins: [SessionMixin],
  //@@viewOff:mixins

  //@@viewOn:statics
  statics: {
    "UU5.Common.IdentityMixin": {
      requiredMixins: ["UU5.Common.BaseMixin"],
      lsi: {
        login: {
          cs: "Uživatel je odhlášen...",
          en: "User is logged out...",
        },
      },
    },
  },
  //@@viewOff:statics

  //@@viewOn:propTypes
  //@@viewOff:propTypess

  //@@viewOn:getDefaultProps
  //@@viewOff:getDefaultProps

  //@@viewOn:reactLifeCycle
  getInitialState() {
    this.registerMixin("UU5.Common.IdentityMixin");

    let identityState = {
      identity: undefined,
      identityFeedback: PENDING,
    };

    let session = this.props.session || Environment.getSession();
    if (session && session.initComplete) {
      identityState.identity = getIdentityFromSession(session);
      identityState.identityFeedback = session.isAuthenticated() ? AUTH : NOT_AUTH;
    } else if (!session) {
      identityState = {
        identity: null,
        identityFeedback: NOT_AUTH,
      };
    }

    // state
    return identityState;
  },

  componentDidMount() {
    let session = this.props.session || Environment.getSession();
    if (session) {
      if (!session.initComplete) {
        session.initPromise.then(() => {
          if (this.isRendered()) {
            this._onChangeIdentity();
            window.UU5.Environment.EventListener.addIdentityChangeListener(
              session,
              this.getId(),
              this._onChangeIdentity
            );
          }
        });
      } else {
        window.UU5.Environment.EventListener.addIdentityChangeListener(session, this.getId(), this._onChangeIdentity);
      }
    }
  },

  componentWillUnmount() {
    let session = this.getSession();
    session && window.UU5.Environment.EventListener.removeIdentityChangeListener(session, this.getId());
  },
  //@@viewOff:reactLifeCycle

  //@@viewOn:interface
  hasUU5CommonIdentityMixin() {
    return this.hasMixin("UU5.Common.IdentityMixin");
  },

  getUU5CommonIdentityMixinProps() {
    return {};
  },

  getUU5CommonIdentityMixinPropsToPass() {
    return this.getUU5CommonIdentityMixinProps();
  },

  isAuthenticated() {
    return this.state.identityFeedback === AUTH;
  },

  isNotAuthenticated() {
    return this.state.identityFeedback === NOT_AUTH;
  },

  isPending() {
    return this.state.identityFeedback === PENDING;
  },

  getIdentityFeedback() {
    return this.state.identityFeedback;
  },

  getIdentity() {
    return this.state.identity;
  },

  setAuthenticated(isAuth, setStateCallback) {
    this.setState({ identityFeedback: isAuth ? AUTH : NOT_AUTH }, setStateCallback);
    return this;
  },

  changeIdentity(setStateCallback) {
    let session = this.getSession();
    session &&
      this.setState((state) => {
        let result;
        let identity = getIdentityFromSession(session);
        let identityFeedback = this._getIdentityFeedback(session);
        if (
          identityFeedback !== state.identityFeedback ||
          (identity !== state.identity && !Tools.deepEqual(identity, state.identity))
        ) {
          result = { identity, identityFeedback };
        }
        return result;
      }, setStateCallback);
    return this;
  },

  onChangeIdentityDefault(session) {
    this.changeIdentity();
    return this;
  },

  getAuthenticatedChild(getChild, opt) {
    let result;

    if (!this.isAuthenticated()) {
      result = (
        <Error
          {...this.getMainPropsToPass()}
          silent={opt.silent}
          inline={opt.inline}
          content={opt.message || this.getLsiComponent("login", "UU5.Common.IdentityMixin")}
        />
      );
    } else if (typeof getChild === "function") {
      result = getChild();
    }

    return result;
  },
  //@@viewOff:interface

  //@@viewOn:overriding
  //@@viewOff:overriding

  //@@viewOn:private
  _getIdentityFeedback(session) {
    let result = PENDING;
    if (session) {
      result = session.isAuthenticated() ? AUTH : NOT_AUTH;
    }

    return result;
  },

  _onChangeIdentity() {
    let session = this.getSession();
    if (session) {
      if (typeof this.onChangeIdentity_ === "function") {
        this.onChangeIdentity_(session);
      } else {
        this.onChangeIdentityDefault(session);
      }
    }
    return this;
  },
  //@@viewOff:private
};

export default IdentityMixin;
