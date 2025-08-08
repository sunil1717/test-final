import React, { useEffect, useState } from 'react';
import { useAdminStore } from '../store/adminStore';
import { FaTrash } from "react-icons/fa";

import { useConfirm } from '../components/ConfirmDialog';

export default function AdminDashboard() {

  const confirm = useConfirm();


  const {
    tyres = [],
    serviceAreas = [],
    bookings = [],
    fetchTyres,
    deleteTyre,
    updateTyreImage,
    updateTyreStock,
    updateTyrePrices,
    addTyre,
    fetchServiceAreas,
    addServiceArea,
    removeServiceArea,
    fetchBookings,
    deleteBooking,
    updateBookingStatus,
    logoutAdmin,
    contactMessages,
    fetchMessages,
    deleteMessage,
    clearMessages,
    blogs = [],
    fetchBlogs,
    addBlog,
    deleteBlog
  } = useAdminStore();



  const [newBlog, setNewBlog] = useState({
    title: '',
    description: '',
    image: null,
  });
  const [blogImagePreview, setBlogImagePreview] = useState(null);


  const [tab, setTab] = useState('tyres');
  const [pincode, setPincode] = useState('');
  const [suburb, setSuburb] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const [newTyre, setNewTyre] = useState({
    Brand: '',
    width: '',
    profile: '',
    rimSize: '',
    Model: '',
    Type: '',
    "LOAD/SPEED RATING": '',
    Marking: '',
    RunFlat: '',
    "Price Incl GST": '',
    "In Stock": '',
    "UNLOADING IN 24 HRS": '',
    "Price for 1": '',
    "Price for 2": '',
    "Price for 3": '',
    "Price for 4": '',
    "Price for 5": '',


    image: null,
  });


  const [filterBrand, setFilterBrand] = useState("");
  const [filterModel, setFilterModel] = useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [stockValue, setstockValue] = useState("")
  const [updatedPrices, setUpdatedPrices] = useState({});




  useEffect(() => {
    fetchTyres();
    fetchServiceAreas();
    fetchBookings();
    fetchMessages();
    fetchBlogs();
  }, []);

  const handleAddTyre = async () => {
    const {
      Brand,
      width,
      profile,
      rimSize,
      Model,
      Type,
      "LOAD/SPEED RATING": rating,
      Marking,
      RunFlat,
      "Price Incl GST": price,
      "In Stock": inStock,
      "UNLOADING IN 24 HRS": unloading,
      "Price for 1": price1,
      "Price for 2": price2,
      "Price for 3": price3,
      "Price for 4": price4,
      "Price for 5": price5,
      image,
    } = newTyre;

    if (!Brand || !width || !profile || !rimSize || !Model || !price || !inStock || !image) {
      alert("Please fill all required fields and upload an image.");
      return;
    }

    const SIZE = `${width}/${profile}R${rimSize}`; //  Convert to SIZE format

    const formData = new FormData();
    formData.append("Brand", Brand);
    formData.append("SIZE", SIZE); // This goes to backend
    formData.append("Model", Model);
    if (Type) formData.append("Type", Type);
    if (rating) formData.append("LOAD/SPEED RATING", rating);
    if (Marking) formData.append("Marking", Marking);
    if (RunFlat) formData.append("RunFlat", RunFlat);
    formData.append("Price Incl GST", price);
    formData.append("In Stock", inStock);
    if (unloading) formData.append("UNLOADING IN 24 HRS", unloading);
    if (price1) formData.append("Price for 1", price1);
    if (price2) formData.append("Price for 2", price2);
    if (price3) formData.append("Price for 3", price3);
    if (price4) formData.append("Price for 4", price4);
    if (price5) formData.append("Price for 5", price5);
    formData.append("image", image);

    setLoading(true);

    try {
      await addTyre(formData);
      setSuccessMessage("Tyre added successfully!");

      setNewTyre({
        Brand: '',
        width: '',
        profile: '',
        rimSize: '',
        Model: '',
        Type: '',
        "LOAD/SPEED RATING": '',
        Marking: '',
        RunFlat: '',
        "Price Incl GST": '',
        "In Stock": '',
        "UNLOADING IN 24 HRS": '',
        "Price for 1": '',
        "Price for 2": '',
        "Price for 3": '',
        "Price for 4": '',
        "Price for 5": '',
        image: null,
      });
      setImagePreview(null);
    } catch (err) {
      console.error("Failed to add tyre:", err);
      alert("Something went wrong!");
    }
    finally {
      setLoading(false);
    }
  };




  const handleDelete = async (id) => {
    const ok = await confirm("Are you sure you want to delete this tyre?");
    if (!ok) return;
    
      setLoading(true);
      try {
        await deleteTyre(id);
        setSuccessMessage("Tyre deleted successfully!");
      } catch (err) {
        alert("Delete failed.");
      } finally {
        setLoading(false);
      }
    
  };

  const handleImageupdate = async (id, file) => {

    setLoading(true);
    try {
      await updateTyreImage(id, file);
      setSuccessMessage("Image updated successfully!");
    } catch (err) {
      alert("Image update failed.");
    } finally {
      setLoading(false);
    }
  }

  const handleStockupdate = async (id, stockValue) => {

    setLoading(true);
    try {
      await updateTyreStock(id, stockValue);
      setSuccessMessage("Stock updated successfully!");
    } catch (err) {
      alert("Stock update failed.");
    } finally {
      setLoading(false);
    }
  }

  const handlePriceUpdate = async (id, prices) => {
    setLoading(true);
    try {
      await updateTyrePrices(id, prices);
      setSuccessMessage("Prices updated successfully");
    } catch (err) {
      alert("Failed to update prices");
    } finally {
      setLoading(false);
    }
  };








  const handleAddServiceArea = () => {
    if (!pincode || !suburb) return;
    setLoading(true);
    try {
      addServiceArea(pincode, suburb);
      setSuccessMessage("service area added successfully");

      setPincode('');
      setSuburb('');
    }
    catch (err) {
      alert("Failed to add sevice area");
    } finally {
      setLoading(false);
    }

  };






  const handleRemoveServiceArea = async(postcode, suburb) => {
    const ok = await confirm("Are you sure you want to delete this service area ?");
    if (!ok) return;
    setLoading(true);
    try{
    removeServiceArea(postcode, suburb);
    setSuccessMessage("service area delete successfully");
    }catch (err) {
      alert("Failed to remove service area");
    } finally {
      setLoading(false);
    }

  };


  const handleDeleteBooking = async (id) => {
    const ok = await confirm("Are you sure you want to delete this Booking");
    if (!ok) return;

    await deleteBooking(id);
  };

  const handleAddBlog = async () => {
    setLoading(true);
    const { title, description, image } = newBlog;
    if (!title || !description || !image) {
      alert('All fields are required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('image', image);

    try {
      await addBlog(formData);
      setSuccessMessage("Blog added successfully");
      setNewBlog({ title: '', description: '', image: null });
      setBlogImagePreview(null);
    } catch (err) {
      alert('Failed to add blog');
    }finally {
      setLoading(false);
    }
  };

  const handleDeleteBlog = async (id) => {
    const ok = await confirm("Are you sure you want to delete this Blog ?");
    if (!ok) return;
    await deleteBlog(id);
  };




  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">Admin Dashboard</h1>
        <button
          onClick={logoutAdmin}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 text-sm sm:text-base w-full sm:w-auto"
        >
          Logout
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-6">
        {['tyres', 'service', 'bookings', 'contact', 'blogs'].map((key) => (
          <button
            key={key}
            className={`px-4 py-2 rounded text-sm sm:text-base w-full sm:w-auto ${tab === key ? 'bg-red-600 text-white' : 'bg-gray-200'
              }`}
            onClick={() => setTab(key)}
          >
            {key === 'tyres'
              ? 'Tyres'
              : key === 'service'
                ? 'Service Areas'
                : key === 'bookings'
                  ? 'Bookings'
                  : key === 'contact'
                    ? 'Contact'
                    : key === 'blogs'
                      ? 'Blogs'
                      : key}
          </button>
        ))}
      </div>

      {tab === 'tyres' && (
        <div className="space-y-6">
          {/* Loading Overlay with Blur Effect */}
          {loading && (
            <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
              <div className="bg-white px-6 py-4 rounded shadow text-lg font-semibold text-gray-700">
                Processing...
              </div>
            </div>
          )}

          {successMessage && (
            <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow z-50 flex items-center gap-2 transition-opacity duration-300">
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage('')} className="font-bold text-lg leading-none">×</button>
            </div>
          )}

          {/*Add new tyre  */}
          <div className="bg-white rounded-xl shadow-md p-6 max-w-5xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Add New Tyre</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Brand */}
              <div>
                <label className="text-sm font-medium text-gray-700">Brand</label>
                <input
                  type="text"
                  value={newTyre.Brand}
                  onChange={(e) => setNewTyre({ ...newTyre, Brand: e.target.value })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="e.g. MRF"
                />
              </div>

              {/* Model */}
              <div>
                <label className="text-sm font-medium text-gray-700">Model</label>
                <input
                  type="text"
                  value={newTyre.Model}
                  onChange={(e) => setNewTyre({ ...newTyre, Model: e.target.value })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="e.g. ZLX"
                />
              </div>

              {/* Width */}
              <div>
                <label className="text-sm font-medium text-gray-700">Width</label>
                <input
                  type="text"
                  value={newTyre.width}
                  onChange={(e) => setNewTyre({ ...newTyre, width: e.target.value })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="e.g. 205"
                />
              </div>

              {/* Profile */}
              <div>
                <label className="text-sm font-medium text-gray-700">Profile</label>
                <input
                  type="text"
                  value={newTyre.profile}
                  onChange={(e) => setNewTyre({ ...newTyre, profile: e.target.value })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="e.g. 55"
                />
              </div>

              {/* Rim Size */}
              <div>
                <label className="text-sm font-medium text-gray-700">Rim Size</label>
                <input
                  type="text"
                  value={newTyre.rimSize}
                  onChange={(e) => setNewTyre({ ...newTyre, rimSize: e.target.value })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="e.g. 16"
                />
              </div>

              {/* Type */}
              <div>
                <label className="text-sm font-medium text-gray-700">Type</label>
                <input
                  type="text"
                  value={newTyre.Type}
                  onChange={(e) => setNewTyre({ ...newTyre, Type: e.target.value })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="e.g. PCR, SUV"
                />
              </div>

              {/* LOAD/SPEED RATING */}
              <div>
                <label className="text-sm font-medium text-gray-700">Load/Speed Rating</label>
                <input
                  type="text"
                  value={newTyre["LOAD/SPEED RATING"]}
                  onChange={(e) => setNewTyre({ ...newTyre, "LOAD/SPEED RATING": e.target.value })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="e.g. 91H"
                />
              </div>

              {/* Marking */}
              <div>
                <label className="text-sm font-medium text-gray-700">Marking</label>
                <input
                  type="text"
                  value={newTyre.Marking}
                  onChange={(e) => setNewTyre({ ...newTyre, Marking: e.target.value })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="Optional marking"
                />
              </div>

              {/* RunFlat */}
              <div>
                <label className="text-sm font-medium text-gray-700">RunFlat</label>
                <input
                  type="text"
                  value={newTyre.RunFlat}
                  onChange={(e) => setNewTyre({ ...newTyre, RunFlat: e.target.value })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="Yes / No"
                />
              </div>

              {/* Price Incl GST */}
              <div>
                <label className="text-sm font-medium text-gray-700">Price (Incl GST)</label>
                <input
                  type="number"
                  value={newTyre["Price Incl GST"]}
                  onChange={(e) => setNewTyre({ ...newTyre, "Price Incl GST": e.target.value })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="e.g. 4500"
                />
              </div>
              {/* Price for 1 */}
              <div>
                <label className="text-sm font-medium text-gray-700">Price for 1</label>
                <input
                  type="number"
                  value={newTyre["Price for 1"] || ''}
                  onChange={(e) => setNewTyre({ ...newTyre, "Price for 1": Number(e.target.value) })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="Price for 1 tyre"
                />
              </div>

              {/* Price for 2 */}
              <div>
                <label className="text-sm font-medium text-gray-700">Price for 2</label>
                <input
                  type="number"
                  value={newTyre["Price for 2"] || ''}
                  onChange={(e) => setNewTyre({ ...newTyre, "Price for 2": Number(e.target.value) })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="Price for 2 tyres"
                />
              </div>

              {/* Price for 3 */}
              <div>
                <label className="text-sm font-medium text-gray-700">Price for 3</label>
                <input
                  type="number"
                  value={newTyre["Price for 3"] || ''}
                  onChange={(e) => setNewTyre({ ...newTyre, "Price for 3": Number(e.target.value) })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="Price for 3 tyres"
                />
              </div>

              {/* Price for 4 */}
              <div>
                <label className="text-sm font-medium text-gray-700">Price for 4</label>
                <input
                  type="number"
                  value={newTyre["Price for 4"] || ''}
                  onChange={(e) => setNewTyre({ ...newTyre, "Price for 4": Number(e.target.value) })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="Price for 4 tyres"
                />
              </div>

              {/* Price for 5 */}
              <div>
                <label className="text-sm font-medium text-gray-700">Price for 5</label>
                <input
                  type="number"
                  value={newTyre["Price for 5"] || ''}
                  onChange={(e) => setNewTyre({ ...newTyre, "Price for 5": Number(e.target.value) })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="Price for 5 tyres"
                />
              </div>

              {/* In Stock */}
              <div>
                <label className="text-sm font-medium text-gray-700">In Stock</label>
                <input
                  type="number"
                  value={newTyre["In Stock"]}
                  onChange={(e) => setNewTyre({ ...newTyre, "In Stock": e.target.value })}
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="e.g. 20"
                />
              </div>

              {/* UNLOADING IN 24 HRS */}
              <div>
                <label className="text-sm font-medium text-gray-700">Unloading in 24 Hrs</label>
                <input
                  type="number"
                  value={newTyre["UNLOADING IN 24 HRS"]}
                  onChange={(e) =>
                    setNewTyre((prev) => ({
                      ...prev,
                      "UNLOADING IN 24 HRS": e.target.value === '' ? '' : Number(e.target.value),
                    }))
                  }
                  className="w-full border px-3 py-2 rounded text-sm"
                  placeholder="e.g. 1 / 2 / 3"
                />
              </div>


              {/* Image Upload */}
              <div>
                <label className="text-sm font-medium text-gray-700">Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setNewTyre({ ...newTyre, image: file });
                      setImagePreview(URL.createObjectURL(file));
                    }
                  }}
                  className="w-full border px-3 py-2 rounded text-sm"
                />
              </div>




              {/* Image Preview */}
              {imagePreview && (
                <div className="flex items-center">
                  <img src={imagePreview} alt="Preview" className="w-28 h-28 object-contain border rounded" />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6 text-right">
              <button
                onClick={handleAddTyre}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md text-sm font-medium transition"
              >
                Add Tyre
              </button>
            </div>
          </div>


          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <h3>Filter Tyre :</h3>
            <input
              type="text"
              placeholder="Filter by Brand"
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value.toLowerCase())}
              className="border px-3 py-2 rounded text-sm w-full md:w-60"
            />
            <input
              type="text"
              placeholder="Filter by Model"
              value={filterModel}
              onChange={(e) => setFilterModel(e.target.value.toLowerCase())}
              className="border px-3 py-2 rounded text-sm w-full md:w-60"
            />
          </div>

          {/* Tyre Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tyres
              .filter((tyre) =>
                tyre.Brand?.toLowerCase().includes(filterBrand || '') &&
                tyre.Model?.toLowerCase().includes(filterModel || '')
              )
              .map((tyre) => (
                <div key={tyre._id} className="border rounded-lg p-4 bg-white shadow-md space-y-2">
                  <img
                    src={tyre.image_url}
                    alt={`${tyre.Brand} ${tyre.Model}`}
                    className="w-full h-32 object-contain mb-2"
                  />
                  <div className="text-sm">
                    <p><strong>Brand:</strong> {tyre.Brand}</p>
                    <p><strong>Model:</strong> {tyre.Model}</p>
                    <p><strong>Size:</strong> {tyre.SIZE}</p>
                    <p><strong>Load/Speed:</strong> {tyre["LOAD/SPEED RATING"]}</p>
                    <p><strong>Type:</strong> {tyre.Type}</p>
                    <p><strong>Marking:</strong> {tyre.Marking || 'N/A'}</p>
                    <p><strong>RunFlat:</strong> {tyre.RunFlat || 'N/A'}</p>
                    <p><strong>Price:</strong> ${tyre["Price Incl GST"]}</p>
                    <p><strong>Price for 1:</strong> ${tyre["Price for 1"] || 'N/A'}</p>
                    <p><strong>Price for 2:</strong> ${tyre["Price for 2"] || 'N/A'}</p>
                    <p><strong>Price for 3:</strong> ${tyre["Price for 3"] || 'N/A'}</p>
                    <p><strong>Price for 4:</strong> ${tyre["Price for 4"] || 'N/A'}</p>
                    <p><strong>Price for 5:</strong> ${tyre["Price for 5"] || 'N/A'}</p>

                    <p><strong>In Stock:</strong> {tyre["In Stock"]}</p>
                    <p><strong>Unloading in 24 Hrs:</strong> {tyre["UNLOADING IN 24 HRS"]}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    {/* Delete */}
                    <div className="flex justify-end">
                      <button
                        onClick={() => handleDelete(tyre._id)}
                        className="text-red-600 hover:text-red-800 p-2"
                        title="Delete Tyre"
                      >
                        <FaTrash size={16} />
                      </button>
                    </div>

                    {/* Image Upload */}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleImageupdate(tyre._id, file);
                      }}
                      className="block w-full text-sm text-gray-700"
                    />


                    {/* Price Update */}
                    <div className="space-y-1">
                      {["Price for 1", "Price for 2", "Price for 3", "Price for 4", "Price for 5"].map((label) => (
                        <div key={label} className="flex items-center gap-1">
                          <label className="text-xs w-20">{label}:</label>
                          <input
                            type="number"
                            defaultValue={tyre[label]}
                            onChange={(e) => {
                              const newPrice = e.target.value.trim();
                              setUpdatedPrices((prev) => ({
                                ...prev,
                                [tyre._id]: {
                                  ...(prev[tyre._id] || {}),
                                  [label]: newPrice
                                }
                              }));
                            }}
                            className="w-20 border px-1 py-0.5 rounded text-xs"
                          />
                        </div>
                      ))}
                      <button
                        onClick={() => {
                          if (updatedPrices[tyre._id]) {
                            handlePriceUpdate(tyre._id, updatedPrices[tyre._id]);
                          }
                        }}
                        className="bg-green-600 text-white text-xs px-2 py-1 rounded hover:bg-green-700"
                      >
                        Update Prices
                      </button>
                    </div>



                    {/* Stock Update */}
                    <div className="flex gap-1 items-center">
                      <input
                        type="text"
                        placeholder="Stock"
                        defaultValue={tyre["In Stock"]}
                        onChange={(e) => {
                          setstockValue(e.target.value.trim())
                        }}
                        className="w-16 border px-1 py-0.5 rounded text-xs"
                      />
                      <button
                        onClick={() => {

                          if (stockValue !== undefined && stockValue !== "" && stockValue !== tyre["In Stock"]) {
                            handleStockupdate(tyre._id, stockValue);
                          }
                        }}
                        className="bg-blue-500 text-white text-xs px-2 py-1 rounded hover:bg-blue-600"
                      >
                        Update
                      </button>
                    </div>


                  </div>
                </div>
              ))}
          </div>




        </div>
      )}

      {tab === 'service' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {loading && (
            <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
              <div className="bg-white px-6 py-4 rounded shadow text-lg font-semibold text-gray-700">
                Processing...
              </div>
            </div>
          )}
            {successMessage && (
              <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow z-50 flex items-center gap-2 transition-opacity duration-300">
                <span>{successMessage}</span>
                <button onClick={() => setSuccessMessage('')} className="font-bold text-lg leading-none">×</button>
              </div>
            )}
            {serviceAreas.length > 0 ? (
              serviceAreas.map((area, idx) => (
                <div key={idx} className="flex items-center justify-between border px-4 py-2 rounded shadow bg-white">
                  <span>{area.postcode}, {area.suburb}</span>
                  <button
                    onClick={() => handleRemoveServiceArea(area.postcode, area.suburb)}
                    className="text-red-500 text-sm"
                  >
                    Remove
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No service areas found.</p>
            )}
          </div>
          <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="text"
              placeholder="Pincode"
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="border px-2 py-2 rounded w-full sm:w-auto text-sm"
            />
            <input
              type="text"
              placeholder="Suburb"
              value={suburb}
              onChange={(e) => setSuburb(e.target.value)}
              className="border px-2 py-2 rounded w-full sm:w-auto text-sm"
            />
            <button
              onClick={handleAddServiceArea}
              className="bg-red-600 text-white px-3 py-2 rounded text-sm w-full sm:w-auto"
            >
              Add Service Area
            </button>
          </div>
        </div>
      )}

      {tab === 'bookings' && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">All Bookings</h2>
          {loading && (
            <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
              <div className="bg-white px-6 py-4 rounded shadow text-lg font-semibold text-gray-700">
                Processing...
              </div>
            </div>
          )}
          {successMessage && (
            <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow z-50 flex items-center gap-2 transition-opacity duration-300">
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage('')} className="font-bold text-lg leading-none">×</button>
            </div>
          )}

          {bookings.length === 0 ? (
            <p className="text-gray-500">No bookings yet.</p>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const tyre = booking.tyre;
                const qty = booking.quantity;
                const totalPrice = tyre?.price ? tyre.price * qty : 0;

                return (
                  <div
                    key={booking._id}
                    className="border p-4 rounded shadow-sm bg-white flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-start"
                  >
                    {/*  Left section: Tyre image + details */}
                    <div className="flex flex-col sm:flex-row sm:gap-4 w-full sm:w-4/5">
                      {/*  Tyre Image */}
                      {tyre?.image && (
                        <img
                          src={tyre.image}
                          alt="Tyre"
                          className="w-full sm:w-28 h-28 object-contain border rounded mb-2 sm:mb-0"
                        />
                      )}

                      {/*  Booking Info */}
                      <div className="text-sm space-y-1">
                        <p className="font-semibold text-base">
                          <span className="text-red-700">User:</span> {booking.phone || booking.user?.phone}
                        </p>

                        <p className="text-gray-600">
                          <span className="font-medium">Tyre:</span> {tyre?.brand} - {tyre?.model}
                        </p>

                        <p className="text-gray-600">
                          <span className="font-medium">Size:</span> {tyre?.width}/{tyre?.profile}R{tyre?.rimSize}
                        </p>

                        <p className="text-gray-600">
                          <span className="font-medium">Price/Unit:</span> ${tyre?.price}
                        </p>

                        <p className="text-gray-600">
                          <span className="font-medium">Quantity:</span> {qty}
                        </p>

                        <p className="text-gray-600 font-medium">
                          Total: ${totalPrice}
                        </p>

                        <p className="text-gray-600">
                          <span className="font-medium">Address:</span> {booking.address}
                        </p>

                        <p className="text-gray-600">
                          <span className="font-medium">Date/Time:</span> {booking.date} at {booking.time}
                        </p>

                        <p className="text-gray-600">
                          <span className="font-medium">Payment:</span> {booking.paymentMethod}
                        </p>
                      </div>
                    </div>

                    {/*  Right section: Status dropdown & delete button */}
                    <div className="flex flex-col gap-2 sm:items-end sm:w-1/5">
                      <select
                        value={booking.status}
                        onChange={(e) => updateBookingStatus(booking._id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm w-full sm:w-auto"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>

                      <button
                        onClick={() => {
                           handleDeleteBooking(booking._id);
                        }}
                        className="text-sm text-red-600 hover:underline w-full sm:w-auto text-left sm:text-right"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}


      {tab === 'contact' && (
        <div className="space-y-4">
          {loading && (
            <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
              <div className="bg-white px-6 py-4 rounded shadow text-lg font-semibold text-gray-700">
                Processing...
              </div>
            </div>
          )}
          {successMessage && (
            <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow z-50 flex items-center gap-2 transition-opacity duration-300">
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage('')} className="font-bold text-lg leading-none">×</button>
            </div>
          )}
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Contact Messages</h2>
            <button
              onClick={() => {
                if (window.confirm("Clear all messages?")) clearMessages();
              }}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Clear All
            </button>
          </div>

          {contactMessages.length === 0 ? (
            <p className="text-gray-500">No messages found.</p>
          ) : (
            contactMessages.map((msg) => (
              <div key={msg._id} className="border p-4 rounded shadow bg-white">
                <p className="text-sm">
                  <strong>Email:</strong> {msg.email}
                </p>
                <p className="text-sm">
                  <strong>Subject:</strong> {msg.subject}
                </p>
                <p className="text-sm mt-2 text-gray-700">{msg.message}</p>
                <button
                  onClick={() => {
                    if (window.confirm("Delete this message?")) deleteMessage(msg._id);
                  }}
                  className="mt-3 bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      )}
      {tab === 'blogs' && (
        <div className="space-y-6">
          {loading && (
            <div className="fixed inset-0 backdrop-blur-sm bg-white/10 flex items-center justify-center z-50">
              <div className="bg-white px-6 py-4 rounded shadow text-lg font-semibold text-gray-700">
                Processing...
              </div>
            </div>
          )}
          {successMessage && (
            <div className="fixed top-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow z-50 flex items-center gap-2 transition-opacity duration-300">
              <span>{successMessage}</span>
              <button onClick={() => setSuccessMessage('')} className="font-bold text-lg leading-none">×</button>
            </div>
          )}
          {/* Blog List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {blogs.length > 0 ? (
              blogs.map((blog) => (
                <div key={blog._id} className="border p-4 rounded shadow bg-white">
                  {blog.image && (
                    <img src={blog.image} alt="blog" className="w-full h-40 object-cover rounded mb-2" />
                  )}
                  <h2 className="text-lg font-semibold">{blog.title}</h2>
                  <p className="text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">{blog.description}</p>
                  <button
                    onClick={() => handleDeleteBlog(blog._id)}
                    className="mt-3 bg-red-500 text-white px-3 py-1 rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No blogs found.</p>
            )}
          </div>

          {/* Add New Blog */}
          <div className="border p-4 rounded shadow bg-white">
            <h2 className="text-lg font-semibold mb-4">Add New Blog</h2>
            <div className="grid grid-cols-1 gap-3 mb-4">
              <input
                type="text"
                placeholder="Title"
                value={newBlog.title}
                onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })}
                className="border px-2 py-2 rounded text-sm"
              />
              <textarea
                placeholder="Description"
                value={newBlog.description}
                onChange={(e) => setNewBlog({ ...newBlog, description: e.target.value })}
                className="border px-2 py-2 rounded text-sm"
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setNewBlog({ ...newBlog, image: file });
                    setBlogImagePreview(URL.createObjectURL(file));
                  }
                }}
                className="border px-2 py-2 rounded text-sm"
              />
              {blogImagePreview && (
                <img src={blogImagePreview} alt="Preview" className="w-32 h-32 object-contain border rounded" />
              )}
            </div>

            <button
              onClick={handleAddBlog}
              className="bg-red-600 text-white px-4 py-2 rounded text-sm"
            >
              Add Blog
            </button>
          </div>
        </div>
      )}


    </div>

  );
}
