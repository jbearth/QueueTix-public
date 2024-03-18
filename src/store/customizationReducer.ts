
// action - state management
import * as actionTypes from './actions';

export const initialState = {
  isOpen: [], // for active default menu
  defaultId: 'default',
  fontFamily: 'Sarabun-Regular',
  borderRadius: 12,
  opened: false,
  AmusementParkId: '',
  navcollapseitemSelected: ''
};

// ==============================|| CUSTOMIZATION REDUCER ||============================== //

const customizationReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case actionTypes.MENU_OPEN:
      return {
        ...state,
        isOpen: [action.id]
      };
    case actionTypes.SET_MENU:
      return {
        ...state,
        opened: action.opened
      };
    case actionTypes.ITEMCOLLASPDRAWEROPENED_SELECT:
      return {
        ...state,
        drawerOpenedItemCollapse: action.drawerOpenedItemCollapse
      };
    case actionTypes.ITEMCOLLASPDRAWERCLOSED_SELECT:
      return {
        ...state,
        drawerClosedItemCollapse: action.drawerClosedItemCollapse
      };
    case actionTypes.SET_BORDER_RADIUS:
      return {
        ...state,
        borderRadius: action.borderRadius
      };
    case actionTypes.SETAMUSEMENTPARKIDS:
      return {
        ...state,
        AmusementParkId: action.AmusementParkId
      };
    default:
      return state;
  }
};

export default customizationReducer;
