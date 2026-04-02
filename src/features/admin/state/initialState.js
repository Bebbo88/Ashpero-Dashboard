const initialState = {
  snapshotStatus: "idle",
  mutationStatus: "idle",
  snapshotLastFetchedAt: 0,
  snapshotToken: "",
  error: "",
  lastMessage: "",
  dashboard: {
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalActiveOffers: 0,
    lowStockProducts: 0
  },
  inventory: [],
  orders: [],
  selectedOrderDetails: null,
  orderDetailsStatus: "idle",
  orderDetailsById: {},
  orderDetailsFetchedAtById: {},
  offers: [],
  coupons: [],
  tips: [],
  products: [],
  content: {
    heroImages: [],
    banners: [],
    spotlightImages: []
  }
};

export default initialState;
