import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import axios from '../utils/axiosInstance';

const getAuthHeader = () => ({
  headers: { Authorization: `${localStorage.getItem('adminToken')}` },
});

export const useAdminStore = create(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      tyres: [],
      orders: [],
      serviceAreas: [],
      bookings: [],
      contactMessages: [],
      loginError: '',
      blogs: [],

      // Admin login
      loginAdmin: async (username, password) => {
        try {
          const res = await axios.post('/api/admin/login', { username, password });
          localStorage.setItem('adminToken', res.data.token);
          set({ isAuthenticated: true, loginError: '' });
          window.location.href = '/admin';
        } catch (err) {
          set({
            loginError: err.response?.data?.error || 'Login failed. Please try again.',
          });
        }
      },

      // Admin logout
      logoutAdmin: () => {
        localStorage.removeItem('adminToken');
        set({ isAuthenticated: false });
        window.location.href = '/login/admin';
      },

      //  TYRE FUNCTIONS
      fetchTyres: async () => {
        try {
          const res = await axios.get('/api/tyreall/');


          set({ tyres: res.data ? res.data : [] });
        } catch (err) {
          console.error('Failed to fetch tyres:', err);
          set({ tyres: [] });
        }
      },

      addTyre: async (formData) => {
        try {
          await axios.post('/api/tyreall/add', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });


          await get().fetchTyres();
        } catch (err) {
          console.error('Failed to add tyre:', err.response?.data || err.message);
          throw err;
        }
      },


      deleteTyre: async (id) => {
        try {
          await axios.delete(`/api/tyreall/delete/${id}`, getAuthHeader());
          await get().fetchTyres();
        } catch (err) {
          console.error("Failed to delete tyre:", err);
          throw err;
        }
      },


      updateTyreImage: async (id, file) => {
        try {
          const formData = new FormData();
          formData.append("image", file);

          await axios.put(`/api/tyreall/update-image/${id}`, formData, {
            headers: {
              ...getAuthHeader().headers,
              "Content-Type": "multipart/form-data",
            },
          });

          await get().fetchTyres();
        } catch (err) {
          console.error("Failed to update image:", err);
          throw err;
        }
      },


      updateTyreStock: async (id, StockValue) => {
        try {
          await axios.put(`/api/tyreall/update-stock/${id}`, { inStock: StockValue }, getAuthHeader());
          await get().fetchTyres();
        } catch (err) {
          console.error("Failed to update stock:", err);
          throw err;
        }
      },

      updateTyrePrices: async (id, prices) => {
        try {
          const response = await axios.put(
            `/api/tyreall/update-prices/${id}`,
            prices // prices = { "Price for 1": 60, "Price for 2": 58, ... }
          );
          await get().fetchTyres();
         
          return response.data;
        } catch (error) {
          console.error(" Failed to update prices:", error.response?.data || error.message);
          throw error;
        }
      },










      // SERVICE AREA FUNCTIONS
      fetchServiceAreas: async () => {
        try {
          const res = await axios.get('/api/service', getAuthHeader());
          const formatted = Array.isArray(res.data)
            ? res.data.map(item => {
              const [postcode, suburb] = item.split(',');
              return { postcode, suburb };
            })
            : [];
          set({ serviceAreas: formatted });
        } catch (err) {
          console.error('Failed to fetch service areas:', err);
          set({ serviceAreas: [] });
        }
      },

      addServiceArea: async (postcode, suburb) => {
        try {
          await axios.post('/api/service/add', { postcode, suburb }, getAuthHeader());
          await get().fetchServiceAreas();
        } catch (err) {
          console.error('Failed to add service area:', err);
        }
      },

      removeServiceArea: async (postcode, suburb) => {
        try {
          await axios.post('/api/service/delete', { postcode, suburb }, getAuthHeader());
          await get().fetchServiceAreas();
        } catch (err) {
          console.error('Failed to remove service area:', err);
        }
      },



      //  BOOKINGS
      fetchBookings: async () => {
        try {
          const res = await axios.get('/api/bookings/all', getAuthHeader());
          set({ bookings: Array.isArray(res.data) ? res.data : [] });
        } catch (err) {
          console.error('Failed to fetch bookings:', err);
          set({ bookings: [] });
        }
      },

      deleteBooking: async (id) => {
        try {
          await axios.delete(`/api/bookings/${id}`, getAuthHeader());
          set((state) => ({
            bookings: state.bookings.filter((b) => b._id !== id),
          }));
        } catch (err) {
          console.error('Failed to delete booking:', err);
        }
      },

      updateBookingStatus: async (id, newStatus) => {
        try {
          const res = await axios.patch(
            `/api/bookings/${id}/status`,
            { status: newStatus },
            getAuthHeader()
          );

          const updatedBooking = res.data.booking; //  FIXED: access booking object

          set((state) => ({
            bookings: state.bookings.map((b) =>
              b._id === id ? updatedBooking : b
            ),
          }));
        } catch (err) {
          console.error('Failed to update booking status:', err);
        }
      },

      // contact-------------
      fetchMessages: async () => {
        try {
          const res = await axios.get('/api/contact/all', getAuthHeader());
          set({ contactMessages: Array.isArray(res.data) ? res.data : [] });
        } catch (err) {
          console.error('Failed to fetch contact messages:', err);
          set({ contactMessages: [] });
        }
      },

      deleteMessage: async (id) => {
        try {
          await axios.delete(`/api/contact/${id}`, getAuthHeader());
          set((state) => ({
            contactMessages: state.contactMessages.filter((msg) => msg._id !== id),
          }));
        } catch (err) {
          console.error('Failed to delete contact message:', err);
        }
      },

      clearMessages: async () => {
        try {
          await axios.delete(`/api/contact`, getAuthHeader());
          set({ contactMessages: [] });
        } catch (err) {
          console.error('Failed to clear contact messages:', err);
        }
      },
      fetchBlogs: async () => {
        try {
          const res = await axios.get('/api/blogs/getall');
          set({ blogs: Array.isArray(res.data.data) ? res.data.data : [] });
        } catch (err) {
          console.error('Failed to fetch blogs:', err);
          set({ blogs: [] });
        }
      },

      addBlog: async (formData) => {
        try {
          const res = await axios.post('/api/blogs/add', formData, {
            headers: {
              ...getAuthHeader().headers,
              'Content-Type': 'multipart/form-data',
            },
          });

          set((state) => ({
            blogs: [res.data.data, ...state.blogs],
          }));
        } catch (err) {
          console.error('Failed to add blog:', err);
          throw err;
        }
      },

      deleteBlog: async (id) => {
        try {
          await axios.delete(`/api/blogs/${id}`, getAuthHeader());
          set((state) => ({
            blogs: state.blogs.filter((b) => b._id !== id),
          }));
        } catch (err) {
          console.error('Failed to delete blog:', err);
        }
      },

    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
