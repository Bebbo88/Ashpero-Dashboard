import { formatCurrency, formatDateTime } from "../../../utils/formatters";

export const recentOrdersColumns = [
  {
    field: "customerName",
    headerName: "Customer",
    flex: 1.1,
    minWidth: 130
  },
  {
    field: "totalPrice",
    headerName: "Total",
    flex: 0.8,
    minWidth: 110,
    valueFormatter: (value) => formatCurrency(value)
  },
  {
    field: "paymentStatus",
    headerName: "Payment",
    flex: 0.8,
    minWidth: 100
  },
  {
    field: "orderStatus",
    headerName: "Order",
    flex: 0.9,
    minWidth: 100
  },
  {
    field: "createdAt",
    headerName: "Created",
    flex: 1.2,
    minWidth: 160,
    valueFormatter: (value) => formatDateTime(value)
  }
];
