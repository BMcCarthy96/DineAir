"use strict";

let options = {};
if (process.env.NODE_ENV === "production") {
    options.schema = process.env.SCHEMA;
}

/** @type {import('sequelize-cli').Migration} */

module.exports = {
    async up(queryInterface, Sequelize) {
        options.tableName = "MenuItems";
        await queryInterface.bulkInsert(
            options,
            [
                // Taco 'Bout It
                {
                    restaurantId: 1,
                    name: "Taco Supreme",
                    description: "A taco with all the fixings!",
                    price: 8.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/1146906219/photo/small-4inch-soft-beef-tacos.jpg?s=2048x2048&w=is&k=20&c=lE1T__n4nYwVzq7UpdMtpZ95GGjO9rdl4JEx0U-1GB0=",
                },
                {
                    restaurantId: 1,
                    name: "Spicy Nachos",
                    description: "Loaded nachos with jalapeños and cheese.",
                    price: 7.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/588215300/photo/homemade-barbecue-pulled-pork-nachos.jpg?s=2048x2048&w=is&k=20&c=CSgRAgIU4sgdR0OFt2c6UFiqB2IgvbtD0YEBdLc-GD0=",
                },
                {
                    restaurantId: 1,
                    name: "Churros",
                    description: "Sweet cinnamon churros with chocolate dip.",
                    price: 4.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/528418040/photo/churros-with-hot-chocolate-and-powdered-sugar.jpg?s=2048x2048&w=is&k=20&c=uaCT6EEc5KpX5xJTy0vLIDUYfilix1f-gNtrANxxCbk=",
                },

                // The Wok and Roll
                {
                    restaurantId: 2,
                    name: "Sushi Roll",
                    description: "A roll of sushi that’s totally on a roll!",
                    price: 12.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/135849804/photo/sushi.jpg?s=2048x2048&w=is&k=20&c=MnvR4zVobM9zc19Ga5cvfX-1VqE2CUMdok7qBe6oJR4=",
                },
                {
                    restaurantId: 2,
                    name: "Teriyaki Chicken",
                    description: "Grilled chicken with teriyaki sauce.",
                    price: 10.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/1348103225/photo/healthy-asian-teriyaki-chicken.jpg?s=612x612&w=0&k=20&c=GTgt3CDSaF3tjGzS_leHTj0YQKRvX87TtP0nVuP2TEQ=",
                },
                {
                    restaurantId: 2,
                    name: "Miso Soup",
                    description:
                        "Traditional Japanese soup with tofu and seaweed.",
                    price: 3.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/155341533/photo/miso-soup.jpg?s=612x612&w=0&k=20&c=0614e4CQibtJ5RlwsHfdFuVPa9FS6QG38ITuBXoh4Qk=",
                },

                // Pasta La Vista
                {
                    restaurantId: 3,
                    name: "Spaghetti Carbonara",
                    description: "Classic Italian pasta with creamy sauce.",
                    price: 14.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/1201523342/photo/spaghetti-carbonara.jpg?s=612x612&w=0&k=20&c=qRapeFYq9sKOeKFi-obdtoF5l-5Pti5ydUjO1zfMoJA=",
                },
                {
                    restaurantId: 3,
                    name: "Margherita Pizza",
                    description: "Fresh pizza with mozzarella and basil.",
                    price: 12.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/1518606270/photo/directly-above-freshly-baked-pizza-margherita.jpg?s=612x612&w=0&k=20&c=7Q-aYhT2kjBxnhQFJmwjgxMsvkWaSMIo8J0gNqDGVN8=",
                },
                {
                    restaurantId: 3,
                    name: "Tiramisu",
                    description:
                        "Traditional Italian dessert with coffee flavor.",
                    price: 6.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/956986120/photo/italian-dessert-tiramisu-with-mascarpone-cheese-and-espresso-coffee.jpg?s=612x612&w=0&k=20&c=XAyRuKGFSX3iAQXG69_ADauMTOvrtfcks9BbuppAcmA=",
                },

                // Bagel Space
                {
                    restaurantId: 4,
                    name: "Everything Bagel",
                    description:
                        "Bagel with cream cheese and everything seasoning.",
                    price: 5.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/493161146/photo/toasted-bagel-with-cream-cheese-at-your-desk.jpg?s=612x612&w=0&k=20&c=3G0HjCkBcj2FWrfvcbb_0M18IhRVMZpu5sbufSmrElU=",
                },
                {
                    restaurantId: 4,
                    name: "Lox Bagel",
                    description:
                        "Bagel with smoked salmon, cream cheese, capers, and dill.",
                    price: 8.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/160142349/photo/bagel.jpg?s=612x612&w=0&k=20&c=HNpbgipnVSj78KadCgxFOmSPlPs4syvmEQai7gUuWGo=",
                },
                {
                    restaurantId: 4,
                    name: "Bagel Sandwich",
                    description: "Bagel with egg, cheese, and bacon.",
                    price: 7.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/534159727/photo/hearty-breakfast-sandwich-on-a-bagel.jpg?s=612x612&w=0&k=20&c=tUIgL9GFlT5wx9p9GVaSM85O03CERb9L3oE_xxaKJ5g=",
                },

                // Brew & Fly
                {
                    restaurantId: 5,
                    name: "Cappuccino",
                    description: "Rich espresso with steamed milk and foam.",
                    price: 4.99,
                    available: true,
                    imageUrl: "/images/cappuccino.jpg",
                },
                {
                    restaurantId: 5,
                    name: "Latte",
                    description: "Smooth espresso with steamed milk.",
                    price: 4.49,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/505168330/photo/cup-of-cafe-latte-with-coffee-beans-and-cinnamon-sticks.jpg?s=612x612&w=0&k=20&c=h7v8kAfWOpRapv6hrDwmmB54DqrGQWxlhP_mTeqTQPA=",
                },
                {
                    restaurantId: 5,
                    name: "Blueberry Muffin",
                    description: "Freshly baked muffin with blueberries.",
                    price: 3.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/478095157/photo/blueberry-muffins.jpg?s=612x612&w=0&k=20&c=bdYN4O2Furch6BAWOLhWmlnaRU5uGaxrpgMgWCeqqdw=",
                },

                // Burger Terminal
                {
                    restaurantId: 6,
                    name: "Classic Cheeseburger",
                    description:
                        "A juicy 100% Angus beef patty with melted cheese.",
                    price: 9.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/467416670/photo/huge-grass-fed-bison-hamburger-with-chips-beer.jpg?s=612x612&w=0&k=20&c=NA5S3gfJYRydMViaUMHz2d7wHuexygVM02xkiaE2p3c=",
                },
                {
                    restaurantId: 6,
                    name: "Bacon Cheeseburger",
                    description:
                        "100% Angus beef patty topped with crispy Benton's bacon.",
                    price: 11.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/1399889993/photo/bacon-cheeseburger-on-a-toasted-bun.jpg?s=612x612&w=0&k=20&c=wh6yoDztVz7EeinrqJuk-nxAJ5UD42Rhg9eQmuXob2g=",
                },
                {
                    restaurantId: 6,
                    name: "Fries",
                    description: "Crispy golden fries with ketchup and ranch.",
                    price: 3.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/614420426/photo/basket-of-french-fries.jpg?s=612x612&w=0&k=20&c=o6IZg_NPJkOaICTa883jd49BwZvvI7wlP6SnjhyxqsI=",
                },

                // Pho Real
                {
                    restaurantId: 7,
                    name: "Beef Pho",
                    description:
                        "Traditional Vietnamese noodle soup with beef.",
                    price: 12.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/535168737/photo/vietnamese-pho-noodle-soup-dish.jpg?s=612x612&w=0&k=20&c=3-p-S7Ugpug95YnKS3qrUHSkKPvfIYDmuyiYlHVhF0M=",
                },
                {
                    restaurantId: 7,
                    name: "Chicken Pho",
                    description: "Classic pho with tender chicken slices.",
                    price: 11.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/2149960806/photo/traditional-vietnamese-soup-pho-vietnamese-cuisine-soup-pho-ga-with-chicken-rice-noodles.jpg?s=612x612&w=0&k=20&c=3Oq97QWE_hm57BT5zTg_itGDukks1f1-wpHAW3xcfb8=",
                },
                {
                    restaurantId: 7,
                    name: "Spring Rolls",
                    description: "Fresh rolls with shrimp and peanut sauce.",
                    price: 6.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/1324861648/photo/vietnamese-cuisine-with-a-variety-of-delicious-flavors.jpg?s=612x612&w=0&k=20&c=N9upjmCbzaKo7o998dUDT7TBtJ42l5ndqH4JMFM8NYc=",
                },

                // The Flying Curry
                {
                    restaurantId: 8,
                    name: "Butter Chicken",
                    description: "Creamy curry with tender chicken pieces.",
                    price: 13.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/1312459972/photo/homemade-indian-butter-chicken-with-rice.jpg?s=612x612&w=0&k=20&c=QJcSuJJuusJh1sWpW-l6BNHVlUlodVwO-gtcRrYgHj8=",
                },
                {
                    restaurantId: 8,
                    name: "Vegetable Curry",
                    description:
                        "A mix of fresh vegetables in a spicy curry sauce.",
                    price: 11.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/1215400520/photo/curried-roasted-eggplant-with-smoked-cardamom-and-coconut-milk.jpg?s=612x612&w=0&k=20&c=x3sxttxsD4skearzDzdhu0Uid097N6En8Ee-CG6Feqo=",
                },
                {
                    restaurantId: 8,
                    name: "Garlic Naan",
                    description: "Soft naan bread with a hint of garlic.",
                    price: 3.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/1298748782/photo/traditional-indian-naan-flatbread.jpg?s=612x612&w=0&k=20&c=x851gawu7ZROI2wMYa28DW2uCdqh9E56prMDIhj4akE=",
                },

                // Poke Paradise
                {
                    restaurantId: 9,
                    name: "Ahi Tuna Bowl",
                    description:
                        "Fresh ahi tuna with rice and tropical toppings.",
                    price: 14.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/694569604/photo/raw-organic-ahi-tuna-poke-bowl.jpg?s=612x612&w=0&k=20&c=T0kl8HrfHl_iUmMOKBJPRtKjtj9pzVMQB50Dx68SVl0=",
                },
                {
                    restaurantId: 9,
                    name: "Salmon Poke Bowl",
                    description: "Salmon with avocado, rice, and sesame seeds.",
                    price: 13.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/1001332318/photo/hawaiian-salmon-fish-poke-bowl-with-rice-radish-cucumber-tomato-sesame-seeds-and-seaweeds.jpg?s=612x612&w=0&k=20&c=Aq1K0UuFKZO3OpcKZPmuo9FHlxnTZmWw2tFpeHAUF3s=",
                },
                {
                    restaurantId: 9,
                    name: "Veggie Poke Bowl",
                    description:
                        "A vegetarian option with tofu and fresh veggies.",
                    price: 12.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/878734076/photo/healthy-organic-tofu-and-rice-buddha-bowl.jpg?s=612x612&w=0&k=20&c=RE8aZvjQEsr9r3x07IO5HWbaB2PW6xJC-7D9TnjSs9g=",
                },

                // Crepe Escape
                {
                    restaurantId: 10,
                    name: "Nutella Crepe",
                    description: "Sweet crepe filled with Nutella and bananas.",
                    price: 8.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/1132230754/photo/tasty-crepe-with-hazelnut-chocolate-spread-and-banana.jpg?s=612x612&w=0&k=20&c=YuS4lqR6iW018g2cpo_a7MMJ0h0OJBdHXDPZUwZauac=",
                },
                {
                    restaurantId: 10,
                    name: "Ham and Cheese Crepe",
                    description: "Savory crepe with ham and melted cheese.",
                    price: 9.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/1611524601/photo/fried-crepe-with-ham-and-cream.jpg?s=612x612&w=0&k=20&c=EuAfDiYTDsxGIKyAwS9yp_aGB5ZISEStOoWYen7EhiI=",
                },
                {
                    restaurantId: 10,
                    name: "Strawberry Crepe",
                    description: "Fresh strawberries with whipped cream.",
                    price: 8.99,
                    available: true,
                    imageUrl:
                        "https://media.istockphoto.com/id/477056522/photo/food-strawberry-crepes.jpg?s=612x612&w=0&k=20&c=YdV4qua0nj5EYQcP0zQHX5yp2CcqaT8LGcxT1-b4NSI=",
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
