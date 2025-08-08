import { create } from 'zustand';
import axios from 'axios';
import useAuthStore from './authStore';

const BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const useShopStore = create((set, get) => ({
  tyres: [],
  cart: [],
  bookings: [],
  serviceable: false,
  loading: false,
  error: null,

  //  Fetch all tyres
  fetchTyres: async () => {
    try {
      set({ loading: true, error: null });
      const res = await axios.get(`${BASE_URL}/tyres/getall`);
      set({ tyres: res.data.data });
    } catch (err) {
      set({ error: 'Failed to fetch tyres' });
    } finally {
      set({ loading: false });
    }
  },

  //  Check service area by postcode and suburb
  checkServiceArea: async (postcode, suburb) => {
  try {
    const res = await axios.post(`${BASE_URL}/service/check`, {
      postcode,
      suburb
    });
    set({ serviceable: res.data.isServiceable });
    return res.data.isServiceable;
  } catch (err) {
    set({ error: 'Failed to check service area' });
    return false;
  }
},


  //  Fetch user cart
  fetchCart: async () => {
    const phone = useAuthStore.getState().user?.phone;
    if (!phone) return;

    try {
      const res = await axios.get(`${BASE_URL}/cart/${phone}`);
      set({ cart: res.data.items });
    } catch (err) {
      set({ error: 'Failed to fetch cart' });
    }
  },

  //  Add item to cart
  addToCart: async (tyre, quantity ) => {
  const phone = useAuthStore.getState().user?.phone;
  if (!phone) {
    console.warn("User not logged in");
    return;
  }

  try {
    await axios.post(`${BASE_URL}/cart/add`, { phone, tyre, quantity });
    get().fetchCart();
  } catch (err) {
    console.error(err);
    set({ error: 'Failed to add to cart' });
  }
},

  //  Update cart item quantity
 updateCartItem: async (itemId, quantity,updatedPrice) => {
  const phone = useAuthStore.getState().user?.phone;
  if (!phone) return;

  try {
    await axios.put(`${BASE_URL}/cart/update`, { phone, itemId, quantity,updatedPrice });
    get().fetchCart();
  } catch (err) {
    set({ error: 'Failed to update cart item' });
  }
},


  //  Remove item from cart
  removeFromCart: async (itemId) => {
  const phone = useAuthStore.getState().user?.phone;
  if (!phone) return;

  try {
    await axios.delete(`${BASE_URL}/cart/remove`, {
      data: { phone, itemId }
    });
    get().fetchCart();
  } catch (err) {
    set({ error: 'Failed to remove cart item' });
  }
},


  //  Clear entire cart
  clearCart: async () => {
    const phone = useAuthStore.getState().user?.phone;
    if (!phone) return;

    try {
      await axios.delete(`${BASE_URL}/cart/clear/${phone}`);
      set({ cart: [] });
    } catch (err) {
      set({ error: 'Failed to clear cart' });
    }
  },

//booking ----------------------------------

createBooking: async ({ address, paymentMethod }) => {
  try {
    const user = useAuthStore.getState().user;
    const cart = get().cart;

    if (!user || !user._id || !user.phone) {
      alert("Please login first");
      return;
    }

    // Loop through cart items and create individual bookings
    for (let item of cart) {
      await axios.post(`${BASE_URL}/bookings/create`, {
        user: user._id,
        phone: user.phone,
        tyre: item.tyre, //  send full tyre object
        quantity: item.quantity,
        address,
        paymentMethod: paymentMethod || "CashOnDelivery"
      });
    }

    await get().fetchBookings();
    await get().clearCart();
  } catch (err) {
    console.error("Booking failed:", err);
    set({ error: "Failed to create booking" });
  }
},



fetchBookings: async () => {
  try {
    const user = useAuthStore.getState().user;
    if (!user || !user.phone) return;

    const res = await axios.get(`${BASE_URL}/bookings/user?phone=${user.phone}`);
    set({ bookings: res.data });
  } catch (err) {
    console.error("Fetching bookings failed:", err);
    set({ error: "Failed to fetch bookings" });
  }
},

  // =================== DRD FUNCTIONS ===================


// 1. 🔍 Search by Rego + State
searchByRego: async ({ rego, state }) => {
  try {
    const res = await axios.post(`${BASE_URL}/drd/search-by-rego`, { rego, state });

    if (res.data.multipleMatches) {
      // Multiple vehicle variants
      return {
        multipleMatches: true,
        variantCount: res.data.variantCount,
        variants: res.data.matchedTyres || [],
        vehicleMake:res.data.vehicleMake // Optional: add vehicleKeys or model names here
      };
    } else {
      // Single vehicle match — return full matched tyre list, not just first tyre
      return {
        multipleMatches: false,
        vehicle: res.data.vehicle || null,
        fitment: res.data.fitment || null,
        matchedTyres: res.data.matchedTyres || [], // return full array
      };
    }
  } catch (err) {
    console.error('Failed to search by rego/state:', err);
    return { error: 'Search failed' };
  }
},






// 3. 📏 Search Tyre by Size
searchBySize: async ({ width, profile, rimSize }) => {
  try {
    const res = await axios.post(`${BASE_URL}/tyreall/size`, {
      width,
      profile,
      rim:rimSize,
    });
    return res.data;
  } catch (err) {
    console.error('Tyre size search failed:', err);
    return { error: 'No tyres found or error occurred' };
  }
},

}));
