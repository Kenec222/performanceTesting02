/**
 * Copyright (C) 2019 Unicorn a.s.
 * 
 * This program is free software; you can use it under the terms of the UAF Open License v01 or
 * any later version. The text of the license is available in the file LICENSE or at www.unicorn.com.
 * 
 * This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even
 * the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See LICENSE for more details.
 * 
 * You may contact Unicorn a.s. at address: V Kapslovne 2767/2, Praha 3, Czech Republic or
 * at the email: info@unicorn.com.
 */

import React from "react";
import Environment from "../environment/environment.js";

const REACT_MAJOR_VERSION = parseInt(React.version.match(/\d+/)[0]);
const REACT_MINOR_VERSION = parseInt(React.version.match(/\.(\d+)/)[1]);
const allowContext = REACT_MAJOR_VERSION > 16 || (REACT_MAJOR_VERSION === 16 && REACT_MINOR_VERSION >= 4);

class Context {
  static create(defaultValue = {}) {
    let context;

    if (Context.isSupported()) {
      context = React.createContext(defaultValue);
    } else {
      process.env.NODE_ENV === "development" && console.error("For Context implementation use React 16.4+");
      context = {
        Consumer: ({ children }) => children(),
        Provider: ({ children }) => children
      }
    }

    return context;
  }

  static isSupported() {
    return React.createContext && allowContext;
  }
}

export const LsiContext = Context.create();

export const withLsiContext = Component => {
  // disable context for jest tests - enzyme doesn't support React 16.3 Context API
  if (!Context.isSupported() || process.env.NODE_ENV === "test") return Component;
  let forwardRef = React.forwardRef((props, ref) => {
    return (
      <LsiContext.Consumer>
        {({ registerLsi, unregisterLsi, setLanguage, getLanguage }) => (
          <Component
            {...props}
            ref={ref}
            registerLsi={registerLsi}
            unregisterLsi={unregisterLsi}
            setLanguage={setLanguage}
            getLanguage={getLanguage}
          />
        )}
      </LsiContext.Consumer>
    );
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return forwardRef;
};

export const TextCorrectorContext = Context.create();

const _getContextValue = (propValue, textCorrectorPropValue, contextValue, environmentValue) => {
  if (propValue !== undefined) {
    return propValue;
  }
  if (textCorrectorPropValue !== undefined) {
    return textCorrectorPropValue;
  }
  if (contextValue !== undefined) {
    return contextValue;
  }
  if (environmentValue) {
    return true;
  }
  return undefined;
};

export const withTextCorrectorContext = Component => {
  // disable context for jest tests - enzyme doesn't support React 16.3 Context API
  if (!Context.isSupported() || process.env.NODE_ENV === "test") return Component;
  let forwardRef = React.forwardRef((props, ref) => {
    return (
      <TextCorrectorContext.Consumer>
        {({ checkSpaces, checkGrammar, checkHighlight, language }) => (
          <Component
            {...props}
            ref={ref}
            checkSpaces={_getContextValue(
              props.checkSpaces,
              props.textCorrector,
              checkSpaces,
              Environment.textCorrector
            )}
            checkGrammar={_getContextValue(
              props.checkGrammar,
              props.textCorrector,
              checkGrammar,
              Environment.textCorrector
            )}
            checkHighlight={_getContextValue(
              props.checkHighlight,
              props.textCorrector,
              checkHighlight,
              Environment.textCorrector
            )}
            language={props.language || language}
          />
        )}
      </TextCorrectorContext.Consumer>
    );
  });

  forwardRef.isUu5PureComponent = true;
  forwardRef.displayName = `forwardRef(${Component.displayName || Component.name || "Component"})`;
  forwardRef.tagName = Component.tagName;

  return forwardRef;
};

export default Context;