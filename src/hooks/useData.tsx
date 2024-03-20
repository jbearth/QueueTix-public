import React, { createContext, useCallback, useContext, useEffect, useReducer, useState } from 'react';
import Storage from '@react-native-async-storage/async-storage';

import {
  ITheme,
} from '../constants/types';

import { light } from '../constants';
import { storePurchaseTicketProps, storeBookingFastpass } from "@src/screens/Tickets/typePurchaseTicket";
import { billPaymentProps, PurchaseAmusementDetail } from '@src/screens/Tickets/typePurchaseTicket';

type InitialStateProps = {
  amusementparkId: string,
  cart: storePurchaseTicketProps[];
  booking: storeBookingFastpass[],
  selectRides: [],
  isOpen: boolean;
  billPayment: billPaymentProps;
  purchaseticketdetail: PurchaseAmusementDetail;
};

const initialState: InitialStateProps = {
  amusementparkId: "",
  cart: [],
  booking: [],
  selectRides: [],
  isOpen: false,
  billPayment: {
    ref1: "",
    ref2: ""
  },
  purchaseticketdetail: {
    id_amusementpark: "",
    picture: "",
    name: "",
    description: ""
  }
};

export const DataContext = createContext<{
  state: InitialStateProps;
  dispatch: React.Dispatch<any>;
} | undefined>(undefined);

const customizationReducer = (state: InitialStateProps, action: any) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const newItem: storePurchaseTicketProps = action.payload;
      let existingItemIndex = -1;

      console.log("state cart: ", state.cart)

      if (state.cart?.length != 0) {
        console.log("index: ")
        // หาตำแหน่งของตัวแปร 'types' ที่เหมือนกันกับข้อมูลที่รับเข้ามา
        existingItemIndex = state.cart.findIndex((item) => item.types_of_ticket === newItem.types_of_ticket);
      }

      if (existingItemIndex !== -1) {
        console.log("replace Item")
        // แทนที่ข้อมูลใหม่
        const updatedCart = [...state.cart];
        updatedCart[existingItemIndex] = newItem;

        return {
          ...state,
          cart: updatedCart,
        };
      } else {
        console.log("new Item: ", newItem)
        // เพิ่มข้อมูลใหม่
        return {
          ...state,
          cart: [...state.cart, newItem],
        };
      }

    case 'REMOVE_TO_CART':
      const itemToRemove = action.payload;
      const updatedCart = state.cart.filter((item) => item.id_ticket !== itemToRemove.id_ticket);

      if (state.cart.length === 1) {
        return {
          ...state,
          cart: [],
        };
      } else {
        return {
          ...state,
          cart: updatedCart,
        };
      }

    case 'REMOVE_TO_CART_ALL':
      console.log("Remove Cart All")
      return {
        ...state,
        cart: [],
      };

    case 'ADD_TO_SELECTRIDES':
      const newItemSelectTickets: any = action.payload;

      console.log("state selectRides: ", state.selectRides)

      // เพิ่มข้อมูลใหม่
      return {
        ...state,
        selectRides: [...state.selectRides, newItemSelectTickets],
      };

    case 'ADD_TO_BOOKING':
      const newItemBooking: storeBookingFastpass = action.payload;
      let existingItemIndexBooking = -1;

      console.log("+++++++++++++++++++++++++++++++++++++")

      if (state.booking?.length != 0) {
        // หาตำแหน่งของตัวแปร 'types' ที่เหมือนกันกับข้อมูลที่รับเข้ามา
        existingItemIndexBooking = state.booking.findIndex((item) => item.id_purchasetickettypes === newItemBooking.id_purchasetickettypes);
        console.log("indexinusedata: ", existingItemIndexBooking)
      }

      if (existingItemIndexBooking !== -1) {
        console.log("replace Item")
        // แทนที่ข้อมูลใหม่
        const updatedBooking = [...state.booking];
        updatedBooking[existingItemIndexBooking] = newItemBooking;

        return {
          ...state,
          booking: updatedBooking,
        };
      } else {
        // เพิ่มข้อมูลใหม่
        return {
          ...state,
          booking: [...state.booking, newItemBooking],
        };
      }

    case 'REMOVE_TO_BOOKING':
      const itemToRemoveBooking = action.payload;
      const updatedBooking = state.booking.filter((item) => item.id_purchasetickettypes !== itemToRemoveBooking.id_purchasetickettypes);

      if (state.booking.length === 1) {
        return {
          ...state,
          booking: [],
        };
      } else {
        return {
          ...state,
          booking: updatedBooking,
        };
      }

    case 'REMOVE_TO_BOOKING_ALL':
      console.log("Remove Booking All")
      return {
        ...state,
        booking: [],
      };

    case 'GIVE_OPEN':
      return {
        ...state,
        isOpen: action.payload,
      };

    case 'REFOFBILLPAYMENT':
      return {
        ...state,
        billPayment: { ...action.payload },
      };

    case 'ADD_PURCHASEDETAIL':
      return {
        ...state,
        purchaseticketdetail: { ...action.payload },
      };

    case 'ADD_AMUSEMENTPARKID':
      return {
        ...state,
        amusementparkId: action.payload,
      };

    default:
      return state;
  }
};

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDark, setIsDark] = useState(false);
  const [theme, setTheme] = useState<ITheme>(light);

  const [state, dispatch] = useReducer<any>(customizationReducer, initialState);

  // get isDark mode from storage
  const getIsDark = useCallback(async () => {
    // รับข้อมูลใน storage ตาม key ที่ระบุ
    const isDarkJSON = await Storage.getItem('isDark');

    if (isDarkJSON !== null) {
      // set isDark if has updated
      setIsDark(JSON.parse(isDarkJSON));
    }
  }, [setIsDark]);

  // handle isDark mode
  const handleIsDark = useCallback(
    (payload: boolean) => {
      // set isDark if has updated
      setIsDark(payload);
      // บันทึก key และข้อมูลลงใน AsyncStorage
      Storage.setItem('isDark', JSON.stringify(payload));
    },
    [setIsDark],
  );

  // รับข้อมูลเริ่มต้นสำหรับ: isDark
  useEffect(() => {
    getIsDark();
  }, [getIsDark]);

  // เปลี่ยนธีมตามที่ isDark updates
  useEffect(() => {
    setTheme(isDark ? light : light);
  }, [isDark]);

  const contextValue: any = {
    state,
    dispatch,
    isDark,
    handleIsDark,
    theme,
    setTheme,
  };

  return (
    <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
