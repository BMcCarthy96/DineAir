// import React, { useState, useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { fetchMenuItemsByRestaurant } from "../../store/menuItems";
// import "./RestaurantDetails.css";

// function RestaurantDetails({ restaurantId }) {
//     const dispatch = useDispatch();
//     const [page, setPage] = useState(1);
//     const [menuItems, setMenuItems] = useState([]);
//     const [totalPages, setTotalPages] = useState(0);

//     useEffect(() => {
//         const fetchMenuItems = async () => {
//             try {
//                 const data = await dispatch(fetchMenuItemsByRestaurant(restaurantId, page));
//                 setMenuItems(data.items);
//                 setTotalPages(data.totalPages);
//             } catch (err) {
//                 console.error(err);
//             }
//         };

//         fetchMenuItems();
//     }, [dispatch, restaurantId, page]);

//     return (
//         <div>
//             <h1>Menu</h1>
//             {menuItems.length > 0 ? (
//                 <div>
//                     {menuItems.map((item) => (
//                         <div key={item.id}>
//                             <h3>{item.name}</h3>
//                             <p>{item.description}</p>
//                             <p>Price: ${item.price}</p>
//                         </div>
//                     ))}
//                     <div>
//                         <button disabled={page === 1} onClick={() => setPage(page - 1)}>
//                             Previous
//                         </button>
//                         <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>
//                             Next
//                         </button>
//                     </div>
//                 </div>
//             ) : (
//                 <p>No menu items available.</p>
//             )}
//         </div>
//     );
// }

// export default RestaurantDetails;
