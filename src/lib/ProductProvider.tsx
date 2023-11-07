import {createContext, ParentComponent, useContext} from "solid-js";
import {Product} from "~/utils";


const productContext = createContext<Product>();

type ProductProviderProps = {
    product: Product;
}

export const ProductProvider: ParentComponent<ProductProviderProps> = (props) => {

    return <>
        <productContext.Provider value={props.product}>
            {props.children}
        </productContext.Provider>
    </>
}

export const useProduct = ()=> {
    return useContext(productContext)!;
}