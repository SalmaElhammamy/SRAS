import React from "react";
import PropTypes from "prop-types";

//create a context to share values like state and functions between components without having to explicitly
//pass a prop through every level of the component
export const MaterialTailwind = React.createContext(null);

// takes the current state and an action, and returns the new state.
export function reducer(state, action) {
  switch (action.type) {
    case "OPEN_SIDENAV": {
      // update the state here
      return { ...state, openSidenav: action.value };
    }
    case "SIDENAV_TYPE": {
      return { ...state, sidenavType: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}


export function MaterialTailwindControllerProvider({ children }) {
  const initialState = {
    openSidenav: false,
    sidenavColor: "dark",
    sidenavType: "white",
    transparentNavbar: true,
    fixedNavbar: false,
    openConfigurator: false,
  };
  // usereducer returns the current state (controller) and a dispatch function, which can be used to update the state.
  const [controller, dispatch] = React.useReducer(reducer, initialState);
  // usememo memoizes the value returned by the function, so that it is not recomputed on every render.
  const value = React.useMemo(
    () => [controller, dispatch],
    [controller, dispatch]
  );

  return (
    // provider makes the controller available to all children and grandchildren of this component.
    <MaterialTailwind.Provider value={value}>
      {children}
    </MaterialTailwind.Provider>
  );
}

export function useMaterialTailwindController() {
  // allows components to access components to easily access the context's value
  const context = React.useContext(MaterialTailwind);
  if (!context) {
    throw new Error(
      "useMaterialTailwindController should be used inside the MaterialTailwindControllerProvider."
    );
  }
  return context;
}


MaterialTailwindControllerProvider.propTypes = {
//ensure that children props are passed to the MaterialTailwindControllerProvider, and that it is a React node.
  children: PropTypes.node.isRequired,
};

//helper functions that components can use to create an action object and dispatch it to the reducer to update the state
export const setOpenSidenav = (dispatch, value) =>
  dispatch({ type: "OPEN_SIDENAV", value });
export const setSidenavType = (dispatch, value) =>
  dispatch({ type: "SIDENAV_TYPE", value });
export const setSidenavColor = (dispatch, value) =>
  dispatch({ type: "SIDENAV_COLOR", value });
export const setTransparentNavbar = (dispatch, value) =>
  dispatch({ type: "TRANSPARENT_NAVBAR", value });
export const setFixedNavbar = (dispatch, value) =>
  dispatch({ type: "FIXED_NAVBAR", value });
export const setOpenConfigurator = (dispatch, value) =>
  dispatch({ type: "OPEN_CONFIGURATOR", value });
