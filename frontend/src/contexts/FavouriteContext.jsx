import React, {createContext, useState} from 'react';

export const FavouriteContext = createContext();

export default function FavouriteProvider (props){
    const [listFavourite, setListFavourite] = useState([])
    const addToFav = (product)=>{
        const matchIndex = listFavourite.findIndex(item => {
            return item.id === product.id
        });

        if(matchIndex !== -1){
            
            return
        }
        setListFavourite([...listFavourite, product])

        
        
    }
    const removeFromFav = (product)=>{
        const rlst = listFavourite.filter(item => item.id !== product.id);
        setListFavourite(rlst)
    }
    
    return <FavouriteContext.Provider value={{listFavourite, addToFav, removeFromFav}}>
        {props.children}
    </FavouriteContext.Provider>
}

