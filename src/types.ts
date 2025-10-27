export interface OrderLine {
  orderLineId: number;
  itemNum: string;
  itemDescription: string;
}

export interface Customer {
  customerId: number;
  customerCode: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface Address {
  addressId: number;
  fullName: string;
  addressType: string;
  addressLine1: string;
  addressLine2: string;
}

export interface Order {
  orderId: number;
  referenceNum: string;
  countryCode: string;
  customer: Customer;
  address: Address;
  orderLines: OrderLine[];
}

export interface OrderUpdateRequest {
  countryCode?: string;

  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;

  fullName?: string;
  addressType?: string;
  addressLine1?: string;
  addressLine2?: string;

  orderLines?: {
    itemNum: string;
    itemDescription: string;
  }[];
}
