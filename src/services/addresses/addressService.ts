interface Address {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
  isDefault?: boolean;
}

interface AddressesResponse {
  status: string;
  message: string;
  data: Address[];
}

interface AddAddressResponse {
  status: string;
  message: string;
  data: Address;
}

export const addressService = {
  // Get all addresses
  getAddresses: async (): Promise<AddressesResponse> => {
    const response = await fetch("/api/addresses", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Handle empty response
    const text = await response.text();
    
    if (!text) {
      return {
        status: "success",
        message: "No addresses found",
        data: []
      };
    }

    try {
      const data = JSON.parse(text);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to fetch addresses");
      }

      return data;
    } catch (parseError) {
      throw new Error("Invalid response from server");
    }
  },

  // Add new address
  addAddress: async (
  name: string,
  details: string,
  phone: string,
  city: string
): Promise<AddAddressResponse> => {
  const payload = {
    name,
    details,
    phone,
    city
  };
  
  console.log("Sending address payload:", payload); // Debug log

  const response = await fetch("/api/addresses/add", {
    method: "POST", // Make sure this is POST, not PUT
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload), // Ensure body is stringified
  });

  console.log("Response status:", response.status);

  // Handle empty response
  const text = await response.text();
  console.log("Response text:", text);
  
  if (!text) {
    if (response.ok) {
      return {
        status: "success",
        message: "Address added successfully",
        data: { _id: Date.now().toString(), name, details, phone, city }
      };
    }
    throw new Error("Failed to add address");
  }

  try {
    const data = JSON.parse(text);
    
    if (!response.ok) {
      throw new Error(data.error || data.message || "Failed to add address");
    }

    return data;
  } catch (parseError) {
    throw new Error("Invalid response from server");
  }
},

  // Delete address
  deleteAddress: async (addressId: string): Promise<any> => {
    const response = await fetch(`/api/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const text = await response.text();
    
    if (!text) {
      if (response.ok) {
        return {
          status: "success",
          message: "Address deleted successfully"
        };
      }
      throw new Error("Failed to delete address");
    }

    try {
      const data = JSON.parse(text);
      
      if (!response.ok) {
        throw new Error(data.error || data.message || "Failed to delete address");
      }

      return data;
    } catch (parseError) {
      throw new Error("Invalid response from server");
    }
  }
};