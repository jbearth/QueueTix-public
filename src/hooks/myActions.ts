import { storeBookingFastpass, storePurchaseTicketProps } from "@src/screens/Tickets/typePurchaseTicket";

// action - customizationreducer
export const addToCart = (ticket: storePurchaseTicketProps) => {
  return {
    type: 'ADD_TO_CART',
    payload: ticket,
  };
};

export const removeToCart = (ticket: storePurchaseTicketProps) => {
  return {
    type: 'REMOVE_TO_CART',
    payload: ticket,
  };
};

export const removeToCartAll = () => {
  return {
    type: 'REMOVE_TO_CART_ALL',
    payload: null,
  };
};

export const addToBooking = (fastpass: storeBookingFastpass) => {
  return {
    type: 'ADD_TO_BOOKING',
    payload: fastpass,
  };
};

export const removeToBooking = (fastpass: storeBookingFastpass) => {
  return {
    type: 'REMOVE_TO_BOOKING',
    payload: fastpass,
  };
};

export const removeToBookingAll = () => {
  return {
    type: 'REMOVE_TO_BOOKING_ALL',
    payload: null,
  };
};

export const addToSelectRides = (rides: any) => {
  return {
    type: 'ADD_TO_SELECTRIDES',
    payload: rides,
  };
};

export const changeOpen = (isopen: any) => {
  return {
    type: 'GIVE_OPEN',
    payload: isopen,
  };
};

export const refbillpayment = (billpayment: any) => {
  return {
    type: 'REFOFBILLPAYMENT',
    payload: billpayment,
  };
};

export const addPurchaseDetail = (purchaseDetail: any) => {
  return {
    type: 'ADD_PURCHASEDETAIL',
    payload: purchaseDetail,
  };
};

export const addAmusementParkId = (amusementparkId: string) => {
  return {
    type: 'ADD_AMUSEMENTPARKID',
    payload: amusementparkId,
  };
};

