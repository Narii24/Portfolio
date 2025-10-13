import React, { useContext } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'



const FoodDisplay = ({category}) => {

    // 💡 FIX 7: Get searchQuery from context
    const { food_list, searchQuery } = useContext(StoreContext) 
    
    return (
        <div className='food-display'  id='food-display'>
            <h2>Top dishes near you </h2>
            <div className="food-display-list">
                {food_list.map((item , index)=>{
                    
                    // Convert search query to lowercase for case-insensitive matching
                    const query = searchQuery.toLowerCase();
                    const itemName = item.name.toLowerCase();
                    
                    // Condition 1: Check if the item matches the current category
                    const categoryMatch = category === "All" || category === item.category;

                    // Condition 2: Check if the item name includes the search query
                    const searchMatch = itemName.includes(query);

                    // 💡 FIX 8: Combine category and search filtering
                    // Only display the item if it matches the category AND the search query
                    if (categoryMatch && searchMatch) {
                        return  ( 
                            <FoodItem 
                                key={index} 
                                id={item._id} 
                                name={item.name} 
                                description={item.description} 
                                price={item.price} 
                                image={item.image}
                            />  
                        );
                    }
                    // We don't need the else block, as nothing is returned if the condition is false.
                    return null;

                })}
            </div>


        </div>
    )
}

export default FoodDisplay