import server$ from "solid-start/server";
import {API_URL, Comment, Product, RecommendedPick} from "~/utils";

export const getProduct = server$(async (id: number) => {
    console.log(`fetch product ${id}`);
    const res = await fetch(`${API_URL}/products/details/${id}`);
    return await res.json() as Product;
});

export const getRecommendedPicks = server$(async (id: number) => {
    console.log(`fetch recommended ${id}`);
    const res = await fetch(`${API_URL}/products/recommended/${id}`);
    return await res.json() as RecommendedPick[];
});

export const getReviews = server$(async (id: number) => {
    console.log(`fetch reviews ${id}`);
    const res = await fetch(`${API_URL}/products/comments/${id}`);
    return await res.json() as Comment[];
});

export const getAvailableSizes = server$(async (id: number) => {
    console.log(`fetch sizes ${id}`);
    const res = await fetch(`${API_URL}/products/sizes/${id}`);
    return await res.json() as {
        total: string[];
        available: string[];
    };
});