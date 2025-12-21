export const tabsData = [
  {
    id: 1,
    name: "ImageView Inn",
    description:
      "Enjoy a cozy stay with scenic views at ImageView Inn, complete with all modern amenities.",
    price: 4576.0,
    rating: 4.9,
    location: "401 Platte River Rd, Gothenburg, United States",
    image: require("../../../assets/display/food1.jpg"),
    quantity: 0,
    categoryId: "1",
    keywords: ["salmon", "grilled", "fish", "lemon"],
    available: true,
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    discount: "10%",
    type: "menuItem",
  },
  {
    id: 2,
    name: "Snack Box",
    description:
      "Snack Box - Original, Medium French Fries, Small Coleslaw, Pepsi Can (330 ML).",
    price: 136.0,
    rating: 4.8,
    location: "Downtown Cairo, Egypt",
    image: require("../../../assets/display/food.jpg"),
    quantity: 0,
    categoryId: "1",

    keywords: ["snack", "fries", "coleslaw", "pepsi"],
    available: true,
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    type: "menuItem",
  },
  {
    id: 3,
    name: "Snack Box2",
    description:
      "Snack Box - Original, Medium French Fries, Small Coleslaw, Pepsi Can (330 ML).",
    price: 136.0,
    rating: 4.8,
    categoryId: "1",

    location: "Downtown Cairo, Egypt",
    image: require("../../../assets/display/food.jpg"),
    quantity: 0,
    keywords: ["snack", "fries", "coleslaw", "pepsi", "meal"],
    available: true,
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    type: "menuItem",
  },
  {
    id: 4,
    name: "Snack Box3",
    description:
      "Snack Box - Original, Medium French Fries, Small Coleslaw, Pepsi Can (330 ML).",
    price: 136.0,
    categoryId: "1",

    rating: 4.8,
    location: "Downtown Cairo, Egypt",
    image: require("../../../assets/display/food.jpg"),
    quantity: 0,
    keywords: ["snack", "fries", "pepsi", "fast food"],
    available: true,
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    type: "menuItem",
  },
  {
    id: 5,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqg_OBzcVDnKHv1d3hyVk_WlCo43pzit4CJQ&usqp=CAU",
    name: "Icecream",
    quantity: 0,
    categoryId: "1",
    description:
      "Snack Box - Original, Medium French Fries, Small Coleslaw, Pepsi Can(330 ML)",
    price: 136.0,
    keywords: ["ice cream", "dessert", "sweet", "summer"],
    available: true,
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    type: "menuItem",
  },

  {
    id: 7,
    name: "Discounted Stay",
    description:
      "Enjoy luxurious stays with amazing discounts at prime locations.",
    price: 3000.0,
    rating: 4.7,
    categoryId: "2",
    location: "El Gouna, Red Sea, Egypt",
    image: require("../../../assets/display/image28.png"),
    quantity: 0,
    keywords: ["discount", "luxury", "stay", "vacation"],
    available: true,
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    type: "menuItem",
  },

  {
    id: 8,
    name: "King's Suite",
    categoryId: "3",

    description:
      "A royal suite experience with exclusive amenities and breathtaking views.",
    price: 12000.0,
    rating: 4.9,
    location: "Aswan, Egypt",
    image: require("../../../assets/display/food1.jpg"),
    quantity: 0,
    keywords: ["king", "suite", "luxury", "royal"],
    available: true,
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    type: "menuItem",
  },

  {
    id: 9,
    name: "National Park Retreat",
    description:
      "Explore nature at its best with a stay amidst the lush greenery of national parks.",
    price: 5800.0,
    categoryId: "4",
    type: "menuItem",
    rating: 4.6,
    location: "Wadi El Gemal National Park, Egypt",
    image: require("../../../assets/display/image16.png"),
    quantity: 0,
    keywords: ["nature", "park", "retreat", "vacation"],
    available: true,
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
  },
  {
    attributes: {
      dashboardFormSchemaID: "ad9fbe73-1ef5-45fb-afec-901276f740e2",
      schemaType: "attributes",
      idField: "",
      dashboardFormSchemaInfoDTOView: {
        dashboardFormSchemaID: "ad9fbe73-1ef5-45fb-afec-901276f740e1",
        schemaHeader: "Groups",
        addingHeader: "Add Group",
        editingHeader: "Edit Group",
      },
      dashboardFormSchemaParameters: [
        {
          dashboardFormSchemaParameterID:
            "568b28c8-a5d4-43a2-a303-da319b91276b",
          dashboardFormSchemaID: "ad9fbe73-1ef5-45fb-afec-901276f740e1",
          isEnable: false,
          parameterType: "select",
          parameterField: "type",
          parameterTitel: "Type Name",
          isIDField: false,
          values: ["margherita", "calories"],
          lookupID: null,
          lookupReturnField: null,
          lookupDisplayField: null,
          indexNumber: 0,
        },
        {
          dashboardFormSchemaParameterID:
            "b7aad2c8-c766-4dc0-8bbd-eec1e13e6a24",
          dashboardFormSchemaID: "ad9fbe73-1ef5-45fb-afec-901276f740e1",
          isEnable: true,
          parameterType: "select",
          parameterField: "size",
          parameterTitel: "Size",
          isIDField: false,
          values: ["small", "medium", "large"],
          lookupID: null,
          lookupReturnField: null,
          lookupDisplayField: null,
          indexNumber: 1,
        },
      ],
      isMainSchema: true,
      dataSourceName: "",
      projectProxyRoute: "BrandingMart",
      propertyName: null,
      indexNumber: 0,
    },
    id: 10,
    name: "pizza margherita small",
    type: "menuItemsGroup",
    description:
      "Explore nature at its best with a stay amidst the lush greenery of national parks.",
    price: 5800.0,
    categoryId: "1",
    rating: 4.6,
    location: "Wadi El Gemal National Park, Egypt",
    image: require("../../../assets/display/image16.png"),
    quantity: 0,
    keywords: ["nature", "park", "retreat", "vacation"],
    attribute: { size: "small", type: "margherita" },

    available: true,
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    items: [
      {
        id: 10,
        name: "pizza margherita small",
        type: "menuItemsGroup",
        description:
          "Explore nature at its best with a stay amidst the lush greenery of national parks.",
        price: 5800.0,
        categoryId: "1",
        rating: 4.6,
        location: "Wadi El Gemal National Park, Egypt",
        image: require("../../../assets/display/image16.png"),
        quantity: 0,
        keywords: ["nature", "park", "retreat", "vacation"],
        attribute: { size: "small", type: "margherita" },

        available: true,
        createdAt: "2025-01-25T10:00:00Z",
        updatedAt: "2025-01-25T10:00:00Z",
      },
      {
        id: 10,
        name: "pizza margherita large",
        type: "menuItemsGroup",
        description:
          "Explore nature at its best with a stay amidst the lush greenery of national parks.",
        price: 500.0,
        categoryId: "4",
        rating: 4.6,
        location: "Wadi El Gemal National Park, Egypt",
        image: require("../../../assets/display/image22.png"),
        quantity: 0,
        keywords: ["nature", "park", "retreat", "vacation"],
        available: true,
        attribute: { size: "large", type: "margherita" },
        createdAt: "2025-01-25T10:00:00Z",
        updatedAt: "2025-01-25T10:00:00Z",
      },
      {
        id: 10,
        name: "pizza margherita medium",
        type: "menuItemsGroup",
        description:
          "Explore nature at its best with a stay amidst the lush greenery of national parks.",
        price: 5900.0,
        categoryId: "4",
        rating: 4.6,
        location: "Wadi El Gemal National Park, Egypt",
        image: require("../../../assets/display/image19.png"),
        quantity: 0,
        keywords: ["nature", "park", "retreat", "vacation"],
        available: true,
        createdAt: "2025-01-25T10:00:00Z",
        updatedAt: "2025-01-25T10:00:00Z",
        attribute: { size: "medium", type: "margherita" },
      },
      {
        id: 10,
        name: "pizza calories small",
        type: "menuItemsGroup",
        description:
          "Explore nature at its best with a stay amidst the lush greenery of national parks.",
        price: 5100.0,
        categoryId: "4",
        rating: 4.6,
        location: "Wadi El Gemal National Park, Egypt",
        image: require("../../../assets/display/image17.png"),
        quantity: 0,
        keywords: ["nature", "park", "retreat", "vacation"],
        available: true,
        createdAt: "2025-01-25T10:00:00Z",
        updatedAt: "2025-01-25T10:00:00Z",
        attribute: { size: "small", type: "calories" },
      },
    ],
  },
];
export const tabs = [
  {
    title: "Picks for you",
    id: "1",
    description: "Contains all main course dishes.",
    keywords: ["main course", "dinner", "meal"],
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
  },
  {
    id: "2",
    description: "Contains all main course dishes.",
    keywords: ["main course", "dinner", "meal"],
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    title: "Discount",
  },
  {
    id: "3",
    description: "Contains all main course dishes.",
    keywords: ["main course", "dinner", "meal"],
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    title: "New king",
  },
  {
    id: "4",
    description: "Contains all main course dishes.",
    keywords: ["main course", "dinner", "meal"],
    createdAt: "2025-01-25T10:00:00Z",
    updatedAt: "2025-01-25T10:00:00Z",
    title: "National Parks",
  },
];
export const menuItemType = [
  {
    id: "0",
    name: "menuItem",
  },
  {
    id: "1",
    name: "menuItemsGroup",
  },
];
export const initCompanyRows = [
  {
    nodeMenuItemID: "prop-001",
    sku: "NC-APT-165",
    price: 2800000,
    discount: 200000,
    priceAfterDiscount: 2600000,

    attributes: [
      { id: 0, value: "Apartment" },
      { id: 1, value: "3 Bedrooms" },
      { id: 2, value: "2 Bathrooms" },
      { id: 3, value: "165 m²" },
    ],

    isFav: false,
    isActive: true,
    isAvailable: true,

    rate: 4.6,
    rating: 4.6,
    verified: true,

    companyItemImage:
      "https://www.nawy.com/blog/wp-content/uploads/2022/12/%D8%B9%D9%82%D8%A7%D8%B1%D8%A7%D8%AA-%D9%84%D9%84%D8%A8%D9%8A%D8%B9-%D9%81%D9%8A-%D8%A7%D9%84%D8%B4%D9%8A%D8%AE-%D8%B2%D8%A7%D9%8A%D8%AF.png",

    menuItemName: "Apartment in New Cairo",
    companyName: "Palm Hills Developments",

    propertyType: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 165,

    location: "New Cairo, Egypt",
    viewers: 124,

    pricePlans: [
      {
        name: "Standard Plan",
        price: "EGP 2,600,000",
        area: 165,
        paymentPlan: "10% downpayment - 7 years installments",
        deliveryDate: "2027",
      },
    ],
  },

  {
    nodeMenuItemID: "prop-002",
    sku: "SZ-VIL-240",
    price: 5200000,
    discount: 300000,
    priceAfterDiscount: 4900000,

    attributes: [
      { id: 0, value: "Villa" },
      { id: 1, value: "4 Bedrooms" },
      { id: 2, value: "4 Bathrooms" },
      { id: 3, value: "240 m²" },
    ],

    isFav: true,
    isActive: true,
    isAvailable: true,

    rate: 4.9,
    rating: 4.9,
    verified: true,

    companyItemImage: "https://www.ecoprops.co.za/images/slide-1.jpg",

    menuItemName: "Standalone Villa in Sheikh Zayed",
    companyName: "Sodic",

    propertyType: "Villa",
    bedrooms: 4,
    bathrooms: 4,
    area: 240,

    location: "Sheikh Zayed, Egypt",
    viewers: 312,

    pricePlans: [
      {
        name: "Premium Plan",
        price: "EGP 4,900,000",
        area: 240,
        paymentPlan: "15% downpayment - 8 years installments",
        deliveryDate: "2028",
      },
    ],
  },

  {
    nodeMenuItemID: "prop-003",
    sku: "OCT-DUP-190",
    price: 3600000,
    discount: 150000,
    priceAfterDiscount: 3450000,

    attributes: [
      { id: 0, value: "Duplex" },
      { id: 1, value: "3 Bedrooms" },
      { id: 2, value: "3 Bathrooms" },
      { id: 3, value: "190 m²" },
    ],

    isFav: false,
    isActive: true,
    isAvailable: false,

    rate: 4.2,
    rating: 4.2,
    verified: false,

    companyItemImage:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c",

    menuItemName: "Duplex in 6th of October",
    companyName: "Mountain View",

    propertyType: "Duplex",
    bedrooms: 3,
    bathrooms: 3,
    area: 190,

    location: "6th of October, Egypt",
    viewers: 89,

    pricePlans: [
      {
        name: "Flexible Plan",
        price: "EGP 3,450,000",
        area: 190,
        paymentPlan: "5% downpayment - 9 years installments",
        deliveryDate: "2026",
      },
    ],
  },
];
