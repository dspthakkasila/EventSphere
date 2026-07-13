import api from "./api";

export const getWishlist = async () => {
    const response = await api.get("wishlist/");
    return response.data;
};

export const addWishlist = async (eventId) => {
    const response = await api.post("wishlist/", { event: eventId });
    return response.data;
};

export const removeWishlist = async (id) => {
    await api.delete(`wishlist/${id}/`);
};
