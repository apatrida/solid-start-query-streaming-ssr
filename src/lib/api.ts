import server$ from "solid-start/server";
import {API_URL, Comment, Product, RecommendedPick} from "~/utils";

export const getProduct = server$(async (id: string) => {
    console.log(`fetch product ${id}`);
    const res = await fetch(`${API_URL}/products/details/${id}`);
    return res.json() as Promise<Product>;
});

export const getRecommendedPicks = server$(async (id: string) => {
    console.log(`fetch recommended ${id}`);
    const res = await fetch(`${API_URL}/products/recommended/${id}`);
    return res.json() as Promise<RecommendedPick[]>;
});

export const getReviews = server$(async (id: string) => {
    console.log(`fetch reviews ${id}`);
    const res = await fetch(`${API_URL}/products/comments/${id}`);
    return res.json() as Promise<Comment[]>;
});

export const getAvailableSizes = server$(async (id: string) => {
    console.log(`fetch sizes ${id}`);
    const res = await fetch(`${API_URL}/products/sizes/${id}`);
    return res.json() as Promise<{
        total: string[];
        available: string[];
    }>;
});