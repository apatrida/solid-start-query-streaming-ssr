import {createQuery, useQueryClient} from "@tanstack/solid-query";
import {
    For,
    Show,
    Suspense,
    createEffect,
    createMemo,
    createSignal,
} from "solid-js";
import { RouteDataFuncArgs } from "@solidjs/router"
import { isServer } from "solid-js/web";
import { A, useParams } from "solid-start";
import { Star } from "~/components/icons";
import { Product, RecommendedPick, Comment } from "~/utils";
import {getAvailableSizes, getProduct, getRecommendedPicks, getReviews} from "~/lib/api";
import {ProductProvider, useProduct} from "~/lib/ProductProvider";


export function routeData({ params }: RouteDataFuncArgs) {
    const queryClient = useQueryClient();

    queryClient.prefetchQuery({
        queryKey: ["product", params.id],
        queryFn: () => getProduct(Number(params.id)),
        staleTime: 5 * 60 * 1000
    }).then(() => {
        console.log(`PREFETCH product ${params.id} DONE`);
    });

    queryClient.prefetchQuery({
        queryKey: ["sizes", params.id],
        queryFn: () => getAvailableSizes(Number(params.id)),
        staleTime: 5 * 60 * 1000
    }).then(() => {
        console.log(`PREFETCH sizes ${params.id} DONE`);
    });

    queryClient.prefetchQuery({
        queryKey: ["recommended", params.id],
        queryFn: () => getRecommendedPicks(Number(params.id)),
        staleTime: 5 * 60 * 1000
    }).then(() => {
        console.log(`PREFETCH recommended ${params.id} DONE`);
    });

    queryClient.prefetchQuery({
        queryKey: ["reviews", params.id],
        queryFn: () => getReviews(Number(params.id)),
        staleTime: 5 * 60 * 1000
    }).then(() => {
        console.log(`PREFETCH reviews  ${params.id} DONE`);
    });
}

export default function ProductDetails() {
    const params = useParams();
    const product = createQuery(() => ({
        queryKey: ["product", params.id],
        queryFn: () => getProduct(Number(params.id)),
        staleTime: 5 * 60 * 1000
    }));

    createEffect(()=>console.debug(`ProductDetails for ${product.data?.id}`));

    return (
        <Show when={product.data}>
            <ProductProvider product={product}>
                <div class="flex flex-col gap-4">
                    <div class="flex gap-4">
                        <Gallery />
                        <Info />
                    </div>
                    <div class="flex flex-col gap-2">
                        <p class="text-xl font-semibold text-gray-600">Recommended Picks</p>
                        <RecommendedPicks />
                    </div>
                    <div class="flex flex-col gap-2">
                        <p class="text-xl font-semibold text-gray-600">Reviews</p>
                        <Reviews />
                    </div>
                </div>
            </ProductProvider>
        </Show>
    );
}

const Gallery = () => {
    const images = () => useProduct().images;

    return (
        <div class="flex flex-col gap-2 w-72">
            <div class="h-72 w-72 flex-shrink-0 bg-gray-50 rounded border overflow-hidden">
                <Suspense>
                    <Show when={images()?.[0]} keyed>
                        {(image) => <img src={image} class="h-full w-full object-cover" />}
                    </Show>
                </Suspense>
            </div>
            <div class="flex gap-2 ">
                <div class="flex-1 w-full aspect-square bg-gray-50 rounded border overflow-hidden">
                    <Suspense>
                        <Show when={images()?.[1]} keyed>
                            {(image) => (
                                <img src={image} class="h-full w-full object-cover" />
                            )}
                        </Show>
                    </Suspense>
                </div>
                <div class="flex-1 aspect-square bg-gray-50 rounded border overflow-hidden">
                    <Suspense>
                        <Show when={images()?.[2]} keyed>
                            {(image) => (
                                <img src={image} class="h-full w-full object-cover" />
                            )}
                        </Show>
                    </Suspense>
                </div>
                <div class="flex-1 aspect-square bg-gray-50 rounded border overflow-hidden">
                    <Suspense>
                        <Show when={images()?.[3]} keyed>
                            {(image) => (
                                <img src={image} class="h-full w-full object-cover" />
                            )}
                        </Show>
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

const Info = () => {
    const product = useProduct();

    return (
        <div class="flex-1 flex flex-col">
            <Suspense>
                <h1 class="font-bold text-2xl">{product.name}</h1>

                <Show when={product.price} keyed>
                    {(price) => <DisplayPrice price={price} />}
                </Show>

                <Show when={product.rating} keyed>
                    {(rating) => <Ratings rating={rating} />}
                </Show>

                <p class="leading-tight text-gray-600 pt-2">
                    {product.description}
                </p>
            </Suspense>

            <div class="flex-1 flex-col flex justify-end gap-4">
                <Suspense fallback={<PlaceholderSizes />}>
                    <Sizes />
                </Suspense>
                <button class="bg-orange-500 hover:bg-orange-600 rounded text-white font-semibold py-2">
                    Add To Cart
                </button>
            </div>
        </div>
    );
};

const Sizes = () => {
    const product = useProduct();

    const sizes = createQuery(() => ({
        queryKey: ["sizes", product.id],
        queryFn: () => getAvailableSizes(product.id),
        staleTime: 5 * 60 * 1000
    }));

    const [selectedSize, setSelectedSize] = createSignal<string | undefined>();

    createEffect(() => {
        const id = product.id;
        setSelectedSize(undefined);
    });

    return (
        <div class="grid grid-cols-5 gap-2">
            <For each={sizes.data?.total}>
                {(size) => (
                    <button
                        class={`bg-gray-100 h-10 hover:bg-gray-200 disabled:cursor-not-allowed disabled:hover:bg-gray-100 border border-gray-300 rounded disabled:opacity-40 ${
                            size === selectedSize() && "border-orange-600 border-2"
                        }`}
                        onClick={() => setSelectedSize(size)}
                        disabled={!sizes.data!.available.includes(size)}
                    >
                        {size}
                    </button>
                )}
            </For>
        </div>
    );
};

const PlaceholderSizes = () => {
    const placeholderSizes = Array.from({ length: 10 }).map((_, i) => i);

    return (
        <div class="grid grid-cols-5 gap-2 relative">
            <div class="absolute top-0 left-0 border-2 rounded-se-none border-orange-600 w-[calc(100%_+_1rem)] h-[calc(100%_+_1rem)] -translate-x-2 -translate-y-2 rounded">
                <div class="absolute px-3 text-sm top-0 right-0 -translate-y-full bg-orange-600 font-medium py-0.5 translate-x-[1px] text-white rounded-t">
                    {isServer ? "Streaming Data" : "Client Loading"}
                </div>
            </div>
            <For each={placeholderSizes}>
                {(size) => (
                    <button
                        class={`bg-gray-200 animate-pulse text-transparent h-10 hover:bg-gray-200 disabled:cursor-not-allowed disabled:hover:bg-gray-100 border border-gray-300 rounded disabled:opacity-40`}
                    >
                        {size}
                    </button>
                )}
            </For>
        </div>
    );
};

const DisplayPrice = (props: { price: Product["price"] }) => {
    const getDiscountedPrice = createMemo(() => {
        const price = props.price;
        if (!price.discount) return price.value;
        return price.value - (price.value * price.discount) / 100;
    });

    return (
        <p class="text-xl font-semibold flex gap-2">
            <span>${getDiscountedPrice()}</span>
            <Show when={props.price.discount} keyed>
                {(discount) => (
                    <>
            <span class=" text-gray-400 line-through">
              ${props.price.value}
            </span>
                        <span class="text-orange-500">-{discount}%</span>
                    </>
                )}
            </Show>
        </p>
    );
};

const RecommendedPicks = () => {
    const product = useProduct();

    const picks = createQuery(() => ({
        queryKey: ["recommended", product.id],
        queryFn: () => getRecommendedPicks(product.id),
        staleTime: 5 * 60 * 1000
    }));

    return (
        <Suspense fallback={<PlaceholderPicks />}>
            {/* <PlaceholderPicks /> */}
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 h-max">
                <For each={picks.data}>{(pick) => <Pick pick={pick} />}</For>
            </div>
        </Suspense>
    );
};

const Pick = (props: { pick: RecommendedPick }) => {
    const getDiscountedPrice = createMemo(() => {
        const price = props.pick.price;
        if (!price.discount) return price.value;
        return price.value - (price.value * price.discount) / 100;
    });

    const deliveryDate = createMemo(() => {
        const d = new Date(props.pick.delivery_date);

        // FOrmat the date as Monday, Nov 6
        const day = d.toLocaleDateString("en-US", { day: "numeric" });
        const month = d.toLocaleDateString("en-US", { month: "short" });
        const year = d.toLocaleDateString("en-US", { year: "numeric" });
        return `${month} ${day}`;
    });

    return (
        <A
            href={`../${props.pick.id}`}
            class="border border-gray-300 rounded p-3 group flex flex-col"
        >
            <div class="aspect-square bg-gray-50 w-full rounded-sm overflow-hidden border border-gray-300">
                <img src={props.pick.images[0]} class="h-full w-full object-cover" />
            </div>
            <p class="font-semibold text-gray-600 pt-2 group-hover:underline">
                {props.pick.name}
            </p>
            <p class="text-gray-500 leading-tight font-semibold flex gap-2">
                <span class="">${getDiscountedPrice()}</span>
                <Show when={props.pick.price.discount} keyed>
                    {(discount) => <span class="text-orange-500">-{discount}%</span>}
                </Show>
            </p>
            <p class="pt-1 font-semibold text-gray-500">Get it by {deliveryDate()}</p>
        </A>
    );
};

const PlaceholderPicks = () => {
    return (
        <div class="grid grid-cols-4 gap-4 relative">
            <div class="absolute top-0 left-0 border-2 rounded-se-none border-orange-600 w-[calc(100%_+_1rem)] h-[calc(100%_+_1rem)] -translate-x-2 -translate-y-2 rounded">
                <div class="absolute px-3 text-sm top-0 right-0 -translate-y-full bg-orange-600 font-medium py-0.5 translate-x-[1px] text-white rounded-t">
                    {isServer ? "Streaming Data" : "Client Loading"}
                </div>
            </div>
            {Array.from({ length: 4 }).map((_, i) => (
                <div class="border border-gray-300 rounded p-3 group gap-1 flex flex-col">
                    <div class="aspect-square animate-pulse bg-gray-100 w-full rounded-sm overflow-hidden border border-gray-300"></div>
                    <p class="font-semibold leading-snug text-transparent bg-gray-200 rounded w-4/5 animate-pulse">
                        -
                    </p>
                    <p class="text-transparent bg-gray-200 animate-pulse rounded-sm w-1/3 leading-tight font-semibold flex gap-2">
                        <span class="animate-pulse">-</span>
                    </p>
                    <p class="mt-1 bg-gray-200 leading-snug w-1/2 font-semibold text-transparent rounded animate-pulse">
                        -
                    </p>
                </div>
            ))}
        </div>
    );
};

const Reviews = () => {
    const product = useProduct();
    const reviews = createQuery(() => ({
        queryKey: ["reviews", product.id],
        queryFn: () => getReviews(product.id),
        staleTime: 5 * 60 * 1000
    }));

    return (
        <Suspense fallback={<PlaceholderReviews />}>
            {/* <PlaceholderReviews /> */}
            <div class="flex flex-col gap-3">
                <For each={reviews.data}>{(review) => <Review review={review} />}</For>
            </div>
        </Suspense>
    );
};

const PlaceholderReviews = () => {
    return (
        <div class="flex flex-col gap-2 relative">
            <div class="absolute top-0 left-0 border-2 rounded-se-none border-orange-600 w-[calc(100%_+_1rem)] h-[calc(100%_+_1rem)] -translate-x-2 -translate-y-2 rounded">
                <div class="absolute px-3 text-sm top-0 right-0 -translate-y-full bg-orange-600 font-medium py-0.5 translate-x-[1px] text-white rounded-t">
                    {isServer ? "Streaming Data" : "Client Loading"}
                </div>
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
                <div class="border rounded flex gap-4 p-3 pr-4 pb-3">
                    <div class="h-10 w-10 bg-gray-100 flex-shrink-0 rounded-full animate-pulse"></div>
                    <div class="flex flex-col gap-0.5 w-full">
                        <p class="font-semibold leading-tight bg-gray-200 text-transparent animate-pulse w-52 rounded">
                            -
                        </p>
                        <p class="leading-none bg-gray-200 text-transparent animate-pulse w-32 rounded">
                            -
                        </p>
                        <div class="pt-1.5 flex flex-col gap-1 w-full">
                            <p class="font-medium leading-none bg-gray-200 text-transparent animate-pulse w-60 rounded">
                                -
                            </p>
                            <p class="bg-gray-200 text-transparent animate-pulse w-full h-20 rounded">
                                -
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const Review = (props: { review: Comment }) => {
    return (
        <div class="border rounded flex gap-4 p-3 pr-4 pb-3">
            <div class="h-10 w-10 bg-gray-100 flex-shrink-0 rounded-full">
                <img
                    src={`https://source.boringavatars.com/marble/240/${props.review.name}?colors=f19601,f21f26,DC164B,ebc83a,73b295`}
                    class="h-full w-full"
                />
            </div>
            <div class="flex flex-col">
                <p class="font-semibold leading-snug">{props.review.name}</p>
                <p class="leading-none pt-0.5 text-gray-500">
                    {new Date(props.review.created_at).toDateString()}
                </p>
                <div class="pt-3">
                    <p class="font-medium leading-snug text-gray-600">
                        {props.review.title}
                    </p>
                    <p class="text-gray-600 leading-snug pt-0.5">
                        {props.review.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

const Ratings = (props: { rating: number }) => {
    return (
        <div class="flex gap-1 pt-2 pb-0.5 items-center">
            {Array.from({ length: 5 }).map((_, i) => (
                <div class={props.rating > i ? "text-gray-500" : "text-gray-300"}>
                    <Star />
                </div>
            ))}
        </div>
    );
};
