import React, {createContext, useState} from 'react';
import { library } from '../data/library';

export const ProductContext = createContext();

export default function ProductProvider(props){
    const [products, setProducts] = useState(library || []);
    return <ProductContext.Provider value={ {products} }>
        {props.children}
    </ProductContext.Provider>
}
