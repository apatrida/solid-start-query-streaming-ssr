import {Accessor, createContext, ParentComponent, useContext} from "solid-js";
import {Product} from "~/utils";
import {CreateQueryResult} from "@tanstack/solid-query";


const productContext = createContext<Product>();

type ProductProviderProps = {
    product: CreateQueryResult<Product, Error>;
}

export const ProductProvider: ParentComponent<ProductProviderProps> = (props) => {
    return <>
        <productContext.Provider value={props.product.data}>
            {props.children}
        </productContext.Provider>
    </>
}

export const useProduct = ()=> {
    return useContext(productContext)!;
}