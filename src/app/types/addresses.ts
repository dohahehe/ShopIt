export interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
  isDefault?: boolean;
}

export interface AddressesResponse {
  status: string;
  message: string;
  data: Address[];
}

export interface AddAddressResponse {
  status: string;
  message: string;
  data: Address;
}

