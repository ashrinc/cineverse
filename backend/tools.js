import axios from "axios";

export async function getAllMovies(token) {
    const res = await axios.get(
        `${process.env.BASE_URL}/movies`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return res.data;
}

export async function addToWishlist(movieId, token) {
    const res = await axios.post(
        `${process.env.BASE_URL}/wishlist/${movieId}`,
        {},
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    );
    return res.data;
}
