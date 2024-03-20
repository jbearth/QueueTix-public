// =============================== กำหนด type =================================
export type TypesOfTicket =
  "Entrance" |
  "IncludeRides" |
  "DreamWorldVisa" |
  "SuperVisa"

export type storePurchaseTicketProps = {
  id_ticket?: string;
  id_amusementpark?: string;
  titleticket?: string;
  priceofchild: number;
  amountofchild: number;
  priceofadult: number;
  amountofadult: number;
  totalprice: number;
  types_of_ticket: TypesOfTicket;
  maxround: number;
  dateofuse: Date;
  haspromotion: number;
}

export type storeBookingFastpass = {
  id_amusementpark?: string;
  id_purchasetickettypes: string;
  id_rides?: string;
  id_roundrides?: string;
  startDateTime?: string;
  endDateTime?: string;
}

export type billPaymentProps = {
  ref1: string,
  ref2: string
}

export type PurchaseAmusementDetail = {
  id_amusementpark: string,
  picture?: string,
  name: string,
  description?: string
}