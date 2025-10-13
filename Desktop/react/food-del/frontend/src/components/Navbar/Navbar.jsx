import React, { useContext, useState } from 'react';
import './Navbar.css';
import { assets } from '../../assets/assets';
import { Link } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';


const Navbar = ({setShowLogin}) => {
    const [menu, setMenu] = useState("home");
    const [showSearchBar, setShowSearchBar] = useState(false); 
    
    // 💡 FIX 3: Get setSearchQuery from context
    const { getTotalCartAmount, setSearchQuery } = useContext(StoreContext); 
    
    // 💡 FIX 4: Local state to control input value and handle context update
    const [localSearchQuery, setLocalSearchQuery] = useState('');

    const handleSearchChange = (event) => {
        const query = event.target.value;
        setLocalSearchQuery(query);
        // Update the global state in context immediately
        setSearchQuery(query); 
    };

    return (
        <div className='navbar'>
            <Link to='/' > <img src={assets.logo} alt='Logo'  /></Link>
            <ul className="navbar-menu">
                <Link  to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>home</Link>
                
                <a href='#explore-menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>menu</a>
                <a href='#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>mobile-app</a>
                <a href='#footer' onClick={() => setMenu("contact us")} className={menu === "contact us" ? "active" : ""}>contact us</a>
            </ul>
            
            <div className="navbar-right">
                {showSearchBar && (
                    <input 
                        type="text" 
                        placeholder="Search for food" 
                        className="navbar-search-input" 
                        value={localSearchQuery} // 💡 FIX 5: Bind value to local state
                        onChange={handleSearchChange} // 💡 FIX 6: Add onChange handler
                        
                    />
                )}
                
                <img 
                    src={assets.search_icon || '/search-icon.png'} 
                    alt='Search' 
                    onClick={() => setShowSearchBar(prev => !prev)}
                    style={{ cursor: 'pointer' }}
                />
                
                <div className="navbar-search-icon">
                    <Link  to='/cart'>  <img src={assets.basket_icon || '/basket-icon.png'} alt='Basket' /> </Link>
                    <div className={getTotalCartAmount()===0?"":"dot"}></div>
                </div>
                <button onClick={()=>setShowLogin(true)}>sign in</button>
            </div>
        </div>
    );
};

export default Navbar;