import axiosInstance from "@/services/axiosInstance";
import { toast } from "sonner";
import {
  storeAllOrders,
  addOrder,
  updateOrder,
  removeOrder,
} from "../store/orderSlice";

/**
 * Fetch all orders from /seo/orders
 */
export const getAllOrders = async (dispatch) => {
  try {
    const res = await axiosInstance.get("/seo/orders");
    dispatch(storeAllOrders(res.data));
    return res.data;
  } catch (error) {
    const msg = error.response?.data
      ? Object.values(error.response.data).flat().join("; ")
      : "Failed to load orders";
    toast.error(msg);
    console.error("getAllOrders error:", error);
    return [];
  }
};

/**
 * Create a new order
 */
export const createOrder = async (dispatch, payload) => {
  try {
    const res = await axiosInstance.post("/seo/orders/", payload);
    dispatch(addOrder(res.data));
    toast.success("Order created successfully!");
    return res.data;
  } catch (error) {
    const msg = error.response?.data
      ? Object.values(error.response.data).flat().join("; ")
      : "Failed to create order";
    toast.error(msg);
    console.error("createOrder error:", error);
    throw error;
  }
};

/**
 * Update an existing order
 */
export const updateOrderById = async (dispatch, orderId, payload) => {
  try {
    const res = await axiosInstance.put(`/seo/orders/${orderId}/`, payload);
    dispatch(updateOrder(res.data));
    toast.success("Order updated successfully!");
    return res.data;
  } catch (error) {
    const msg = error.response?.data
      ? Object.values(error.response.data).flat().join("; ")
      : "Failed to update order";
    toast.error(msg);
    console.error("updateOrderById error:", error);
    throw error;
  }
};

/**
 * Delete an order
 */
export const deleteOrderById = async (dispatch, orderId) => {
  try {
    await axiosInstance.delete(`/seo/orders/${orderId}/`);
    dispatch(removeOrder(orderId));
    toast.success("Order deleted successfully!");
  } catch (error) {
    toast.error("Failed to delete order");
    console.error("deleteOrderById error:", error);
    throw error;
  }
};
