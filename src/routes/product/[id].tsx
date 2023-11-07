import {Outlet, useParams} from "solid-start";
import {RouteDataFuncArgs} from "@solidjs/router";
import {useQueryClient} from "@tanstack/solid-query";
import {getProduct} from "~/lib/api";
import {ProductProvider} from "~/lib/ProductProvider";
import {createQuery} from "@tanstack/solid-query";
import {createEffect, Show} from "solid-js";

export function routeData({params}: RouteDataFuncArgs) {
    const queryClient = useQueryClient();
    queryClient.prefetchQuery({
        queryKey: ["product", params.id],
        queryFn: () => getProduct(params.id),
        staleTime: 5 * 60 * 1000
    }).then(() => {
        console.log(`PREFETCH product ${params.id} DONE`);
    });
}

export default function ProductLayout() {
    const params = useParams();
    const product = createQuery(() => ({
        queryKey: ["product", params.id],
        queryFn: () => getProduct(params.id),
        staleTime: 5 * 60 * 1000
    }));

    console.log("PRODUCT LAYOUT");

    createEffect(()=>console.debug(`ProductLayout for ${product.data?.id}`));

    return <>
        <Show when={product.data}>
            <ProductProvider product={product.data!}>
                 <Outlet />
            </ProductProvider>
        </Show>
    </>
}