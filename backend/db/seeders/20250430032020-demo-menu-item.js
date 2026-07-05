"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

const img = (id) =>
    `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=800&q=80`;

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "MenuItems";
        await queryInterface.bulkInsert(
            options,
            [
                // --- Original 30 items: order/ids preserved (cart/order/review seeders reference these by id) ---
                // Taco 'Bout It
                {
                    restaurantId: 1,
                    name: "Taco Supreme",
                    description: "A taco with all the fixings!",
                    price: 8.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/(El%20Flaco)%20Al%20Pastor%20Tacos.jpg?width=800",
                },
                {
                    restaurantId: 1,
                    name: "Spicy Nachos",
                    description: "Loaded nachos with jalapeños and cheese.",
                    price: 7.99,
                    available: true,
                    imageUrl: img("1513456852971-30c0b8199d4d"),
                },
                {
                    restaurantId: 1,
                    name: "Churros",
                    description: "Sweet cinnamon churros with chocolate dip.",
                    price: 4.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Chocolate%20con%20churros%20de%20lazo.jpg?width=800",
                },

                // The Wok and Roll
                {
                    restaurantId: 2,
                    name: "Sushi Roll",
                    description: "A roll of sushi that’s totally on a roll!",
                    price: 12.99,
                    available: true,
                    imageUrl: img("1553621042-f6e147245754"),
                },
                {
                    restaurantId: 2,
                    name: "Teriyaki Chicken",
                    description: "Grilled chicken with teriyaki sauce.",
                    price: 10.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Pollo%20teriyaki%20de%20Sarku%20Japan%20(Colombia).jpg?width=800",
                },
                {
                    restaurantId: 2,
                    name: "Miso Soup",
                    description:
                        "Traditional Japanese soup with tofu and seaweed.",
                    price: 3.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Miso%20Soup%20001.jpg?width=800",
                },

                // Pasta La Vista
                {
                    restaurantId: 3,
                    name: "Spaghetti Carbonara",
                    description: "Classic Italian pasta with creamy sauce.",
                    price: 14.99,
                    available: true,
                    imageUrl: img("1551183053-bf91a1d81141"),
                },
                {
                    restaurantId: 3,
                    name: "Margherita Pizza",
                    description: "Fresh pizza with mozzarella and basil.",
                    price: 12.99,
                    available: true,
                    imageUrl: img("1513104890138-7c749659a591"),
                },
                {
                    restaurantId: 3,
                    name: "Tiramisu",
                    description:
                        "Traditional Italian dessert with coffee flavor.",
                    price: 6.99,
                    available: true,
                    imageUrl: img("1571877227200-a0d98ea607e9"),
                },

                // Bagel Space
                {
                    restaurantId: 4,
                    name: "Everything Bagel",
                    description:
                        "Bagel with cream cheese and everything seasoning.",
                    price: 5.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Bagel-Plain-Alt.jpg?width=800",
                },
                {
                    restaurantId: 4,
                    name: "Lox Bagel",
                    description:
                        "Bagel with smoked salmon, cream cheese, capers, and dill.",
                    price: 8.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Bagel%20with%20cream%20cheese%2C%20salmon%20and%20vegetables%20-%20Sarah%20Stierch.jpg?width=800",
                },
                {
                    restaurantId: 4,
                    name: "Bagel Sandwich",
                    description: "Bagel with egg, cheese, and bacon.",
                    price: 7.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/BEC%20Sandwich%20on%20Everything%20Bagel.jpg?width=800",
                },

                // Brew & Fly
                {
                    restaurantId: 5,
                    name: "Cappuccino",
                    description: "Rich espresso with steamed milk and foam.",
                    price: 4.99,
                    available: true,
                    imageUrl: img("1572442388796-11668a67e53d"),
                },
                {
                    restaurantId: 5,
                    name: "Latte",
                    description: "Smooth espresso with steamed milk.",
                    price: 4.49,
                    available: true,
                    imageUrl: img("1461023058943-07fcbe16d735"),
                },
                {
                    restaurantId: 5,
                    name: "Blueberry Muffin",
                    description: "Freshly baked muffin with blueberries.",
                    price: 3.99,
                    available: true,
                    imageUrl: img("1607958996333-41aef7caefaa"),
                },

                // Burger Terminal
                {
                    restaurantId: 6,
                    name: "Classic Cheeseburger",
                    description:
                        "A juicy 100% Angus beef patty with melted cheese.",
                    price: 9.99,
                    available: true,
                    imageUrl: img("1550547660-d9450f859349"),
                },
                {
                    restaurantId: 6,
                    name: "Bacon Cheeseburger",
                    description:
                        "100% Angus beef patty topped with crispy Benton's bacon.",
                    price: 11.99,
                    available: true,
                    imageUrl: img("1553979459-d2229ba7433b"),
                },
                {
                    restaurantId: 6,
                    name: "Fries",
                    description: "Crispy golden fries with ketchup and ranch.",
                    price: 3.99,
                    available: true,
                    imageUrl: img("1573080496219-bb080dd4f877"),
                },

                // Pho Real
                {
                    restaurantId: 7,
                    name: "Beef Pho",
                    description:
                        "Traditional Vietnamese noodle soup with beef.",
                    price: 12.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Beef-pho-vietnamese-soup.jpg?width=800",
                },
                {
                    restaurantId: 7,
                    name: "Chicken Pho",
                    description: "Classic pho with tender chicken slices.",
                    price: 11.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Chicken-pho-vietnamese-soup.JPG?width=800",
                },
                {
                    restaurantId: 7,
                    name: "Spring Rolls",
                    description: "Fresh rolls with shrimp and peanut sauce.",
                    price: 6.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Vietnamese%20fried%20spring%20rolls%20in%20Ho%20Chi%20Minh%20City%2C%20Vietnam.jpg?width=800",
                },

                // The Flying Curry
                {
                    restaurantId: 8,
                    name: "Butter Chicken",
                    description: "Creamy curry with tender chicken pieces.",
                    price: 13.99,
                    available: true,
                    imageUrl: img("1585937421612-70a008356fbe"),
                },
                {
                    restaurantId: 8,
                    name: "Vegetable Curry",
                    description:
                        "A mix of fresh vegetables in a spicy curry sauce.",
                    price: 11.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Mixed%20Vegetable%20Curry.JPG?width=800",
                },
                {
                    restaurantId: 8,
                    name: "Garlic Naan",
                    description: "Soft naan bread with a hint of garlic.",
                    price: 3.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Garlic%20Naan.JPG?width=800",
                },

                // Poke Paradise
                {
                    restaurantId: 9,
                    name: "Ahi Tuna Bowl",
                    description:
                        "Fresh ahi tuna with rice and tropical toppings.",
                    price: 14.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Uwajimaya%20Poke%20Bowl%20with%20salmon%2C%20tuna%2C%20ginger%2C%20and%202%20scoops%20of%20rice.jpg?width=800",
                },
                {
                    restaurantId: 9,
                    name: "Salmon Poke Bowl",
                    description: "Salmon with avocado, rice, and sesame seeds.",
                    price: 13.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Salmon%20%26%20Tuna%20Poke%20Bowl%20(M)%20with%20Spicy%20Mayo%20sauce%20-%20Kitokito%202025-04-25.jpg?width=800",
                },
                {
                    restaurantId: 9,
                    name: "Veggie Poke Bowl",
                    description:
                        "A vegetarian option with tofu and fresh veggies.",
                    price: 12.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Fried%20Tofu%20Poke%20Bowl%20(S)%20with%20kimchi%20sauce%20-%20Kitokito.jpg?width=800",
                },

                // Crepe Escape
                {
                    restaurantId: 10,
                    name: "Nutella Crepe",
                    description: "Sweet crepe filled with Nutella and bananas.",
                    price: 8.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Nutella%20%26%20banana%20cr%C3%AApe%20and%20classic%20galette%20-%20Oui%20Cr%C3%AAperie.jpg?width=800",
                },
                {
                    restaurantId: 10,
                    name: "Ham and Cheese Crepe",
                    description: "Savory crepe with ham and melted cheese.",
                    price: 9.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Savoyarde%20buckwheat%20crepe%2C%20with%20prosciutto%2C%20cheese%2C%20potato%2C%20shallots%2C%20cornichons%20-%20San%20Francisco%2C%20CA.jpg?width=800",
                },
                {
                    restaurantId: 10,
                    name: "Strawberry Crepe",
                    description: "Fresh strawberries with whipped cream.",
                    price: 8.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Cr%C3%AApe%20with%20Strawberry%20Ice%20Cream.JPG?width=800",
                },

                // --- New items appended after id 30 so existing cart/order/review seeders stay valid ---
                {
                    restaurantId: 1,
                    name: "Street Tacos",
                    description: "Trio of grilled street tacos with lime and onion.",
                    price: 9.49,
                    available: true,
                    imageUrl: img("1611250188496-e966043a0629"),
                },
                {
                    restaurantId: 1,
                    name: "Chicken Quesadilla",
                    description: "Grilled quesadilla with melted cheese and pico de gallo.",
                    price: 8.49,
                    available: true,
                    imageUrl: img("1618040996337-56904b7850b9"),
                },
                {
                    restaurantId: 2,
                    name: "Ramen Bowl",
                    description: "Rich pork broth ramen with soft egg and scallions.",
                    price: 11.99,
                    available: true,
                    imageUrl: img("1591814468924-caf88d1232e1"),
                },
                {
                    restaurantId: 2,
                    name: "Dumplings",
                    description: "Steamed pork and chive dumplings, six pieces.",
                    price: 7.49,
                    available: true,
                    imageUrl: img("1496116218417-1a781b1c416c"),
                },
                {
                    restaurantId: 3,
                    name: "Risotto",
                    description: "Creamy parmesan risotto with wild mushrooms.",
                    price: 13.99,
                    available: true,
                    imageUrl: img("1595908129746-57ca1a63dd4d"),
                },
                {
                    restaurantId: 3,
                    name: "Lasagna",
                    description: "Layered pasta with beef ragu and béchamel.",
                    price: 13.49,
                    available: true,
                    imageUrl: img("1619895092538-128341789043"),
                },
                {
                    restaurantId: 4,
                    name: "Butter Croissant",
                    description: "Flaky, buttery French croissant.",
                    price: 3.99,
                    available: true,
                    imageUrl: img("1555507036-ab1f4038808a"),
                },
                {
                    restaurantId: 4,
                    name: "Cinnamon Roll",
                    description: "Warm cinnamon roll with cream cheese glaze.",
                    price: 4.49,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Rollo%20de%20canela%20(Cinnamon%20roll).jpg?width=800",
                },
                {
                    restaurantId: 5,
                    name: "Espresso Shot",
                    description: "Double shot of rich, bold espresso.",
                    price: 2.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Espresso%20shot%20in%20a%20cappuccino%20cup.jpg?width=800",
                },
                {
                    restaurantId: 5,
                    name: "Iced Coffee",
                    description: "Cold brew coffee over ice.",
                    price: 3.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Iced%20Coffee%20in%20Glass%20-%20Sunshine%20Coffee%20-%20Laramie%20Cafe%20(53838344552).jpg?width=800",
                },
                {
                    restaurantId: 6,
                    name: "Double Cheeseburger",
                    description: "Two beef patties, double cheese, all the fixings.",
                    price: 13.99,
                    available: true,
                    imageUrl: img("1586190848861-99aa4a171e90"),
                },
                {
                    restaurantId: 6,
                    name: "Milkshake",
                    description: "Thick hand-spun vanilla milkshake.",
                    price: 5.49,
                    available: true,
                    imageUrl: img("1579954115545-a95591f28bfc"),
                },
                {
                    restaurantId: 7,
                    name: "Banh Mi",
                    description: "Vietnamese baguette with pork and pickled veggies.",
                    price: 8.99,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/B%C3%A1nh%20mi%20Sandwich(Takadanobaba)IMG%2020220215%20104413%2003.jpg?width=800",
                },
                {
                    restaurantId: 7,
                    name: "Fried Rice",
                    description: "Wok-fried rice with egg and scallions.",
                    price: 7.99,
                    available: true,
                    imageUrl: img("1603133872878-684f208fb84b"),
                },
                {
                    restaurantId: 8,
                    name: "Chicken Biryani",
                    description: "Fragrant basmati rice with spiced chicken.",
                    price: 13.49,
                    available: true,
                    imageUrl: img("1563379091339-03b21ab4a4f8"),
                },
                {
                    restaurantId: 8,
                    name: "Samosa",
                    description: "Crispy pastry filled with spiced potato and peas.",
                    price: 4.99,
                    available: true,
                    imageUrl: img("1601050690597-df0568f70950"),
                },
                {
                    restaurantId: 9,
                    name: "Spicy Tuna Poke",
                    description: "Spicy tuna over rice with crunchy toppings.",
                    price: 14.49,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Spicy%20ahi%20tunna.jpg?width=800",
                },
                {
                    restaurantId: 9,
                    name: "Classic Poke Bowl",
                    description: "House special with a mix of fresh fish.",
                    price: 15.49,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Poke%20Bowl%20at%20Churutto.jpg?width=800",
                },
                {
                    restaurantId: 10,
                    name: "Chocolate Crepe",
                    description: "Warm crepe drizzled with rich chocolate sauce.",
                    price: 8.49,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Crepe%20with%20strawberries%20and%20banana%20and%20chocolate%20in%20it.jpg?width=800",
                },
                {
                    restaurantId: 10,
                    name: "Banana Split Crepe",
                    description: "Crepe with banana, ice cream, and syrup.",
                    price: 9.49,
                    available: true,
                    imageUrl: "https://commons.wikimedia.org/wiki/Special:FilePath/Royal%20Street%20Bananas%20Foster%20Crepe%20-%208567020641.jpg?width=800",
                },
            ],
            { validate: true }
        );
    },

    async down(queryInterface, Sequelize) {
        options.tableName = "MenuItems";
        await queryInterface.bulkDelete(options, null, {});
    },
};
