import api from "./api";

export const getBookings = async () => {
  const response = await api.get("bookings/");
  return response.data;
};

export const createBooking = async (eventId, quantity) => {
  const response = await api.post("bookings/", {
    event: eventId,
    quantity,
  });
  return response.data;
};

export const cancelBooking = async (id) => {
  await api.delete(`bookings/${id}/`);
};
