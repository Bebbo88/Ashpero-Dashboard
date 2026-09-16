// Shared MUI DataGrid styling — was previously copy-pasted identically into
// every panel (coupons, offers, overview, products, tips), with orders
// carrying a couple of extra rules on top. One definition here instead.
export const baseDataGridSx = {
  border: 0,
  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#f8fafc",
    borderBottomColor: "#e2e8f0",
  },
  "& .MuiDataGrid-cell": {
    borderBottomColor: "#eef2ff",
  },
};
