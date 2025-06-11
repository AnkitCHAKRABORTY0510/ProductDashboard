import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  IconButton,
} from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useTheme } from "@mui/material/styles";
import { useEffect, useState } from "react";
import Header from "../../components/Header";
import { tokens } from "../../theme";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Products = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [products, setProducts] = useState([]);
  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: "",
    category: "",
    brand: "",
    price: "",
    stock: "",
    rating: "",
  });
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
  const savedProducts = localStorage.getItem("products");

  if (savedProducts) {
    setProducts(JSON.parse(savedProducts));
  } else {
    fetchProducts();
  }
}, []);


const fetchProducts = async () => {
  try {
    const response = await fetch("https://dummyjson.com/products?limit=100");
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch products");
    }

    const processed = data.products.map((product) => ({
      ...product,
      stockStatus: product.stock < 10 ? "Low Stock" : "In Stock",
    }));

    setProducts(processed);
    localStorage.setItem("products", JSON.stringify(processed));
  } catch (error) {
    console.error("Error fetching products:", error.message);
  }
};

// Then call this inside useEffect
useEffect(() => {
  const savedProducts = localStorage.getItem("products");

  if (savedProducts) {
    setProducts(JSON.parse(savedProducts));
  } else {
    fetchProducts();
  }
}, []);


  const handleCellEditCommit = (params) => {
    const { id, field, value } = params;

    setProducts((prev) => {
      const updated = prev.map((product) => {
        if (product.id !== id) return product;

        let newValue = value;
        if (["price", "stock", "rating"].includes(field)) {
          newValue = field === "stock" ? parseInt(value) : parseFloat(value);
        }

        const updatedProduct = {
          ...product,
          [field]: newValue,
        };

        if (field === "stock") {
          updatedProduct.stockStatus =
            newValue < 10 ? "Low Stock" : "In Stock";
        }

        return updatedProduct;
      });

      localStorage.setItem("products", JSON.stringify(updated));
      return updated;
    });
  };

  const handleAddProduct = () => {
    const newId = products.length
      ? Math.max(...products.map((p) => p.id)) + 1
      : 1;

    const created = {
      ...newProduct,
      id: newId,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      rating: parseFloat(newProduct.rating),
      stockStatus:
        parseInt(newProduct.stock) < 10 ? "Low Stock" : "In Stock",
    };

    const updatedProducts = [...products, created];
    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));

    setNewProduct({
      title: "",
      category: "",
      brand: "",
      price: "",
      stock: "",
      rating: "",
    });

    setOpenAdd(false);
  };

  const handleEditProductSave = () => {
    const updatedProducts = products.map((p) =>
      p.id === editProduct.id
        ? {
            ...editProduct,
            price: parseFloat(editProduct.price),
            stock: parseInt(editProduct.stock),
            rating: parseFloat(editProduct.rating),
            stockStatus:
              parseInt(editProduct.stock) < 10 ? "Low Stock" : "In Stock",
          }
        : p
    );

    setProducts(updatedProducts);
    localStorage.setItem("products", JSON.stringify(updatedProducts));
    setEditProduct(null);
    setOpenEdit(false);
  };

  const handleDeleteProduct = (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    localStorage.setItem("products", JSON.stringify(updated));
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.3 },
    { field: "title", headerName: "Title", flex: 1, editable: false },
    { field: "category", headerName: "Category", flex: 1, editable: false },
    { field: "brand", headerName: "Brand", flex: 1, editable: true },
    { field: "price", headerName: "Price", flex: 0.5, editable: true },
    { field: "stock", headerName: "Stock", flex: 0.5, editable: true },
    { field: "rating", headerName: "Rating", flex: 0.5, editable: true },
    { field: "stockStatus", headerName: "Stock Status", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.7,
      renderCell: (params) => (
        <Box display="flex" gap={1}>
          <IconButton
            color="primary"
            onClick={() => {
              setEditProduct(params.row);
              setOpenEdit(true);
            }}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            onClick={() => handleDeleteProduct(params.row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Box m="20px">
      <Header title="PRODUCTS" subtitle="Manage Your Product Inventory" />

      <Box textAlign="right" mb={2}>
        <Button variant="contained" color="secondary" onClick={() => setOpenAdd(true)}>
          Add New Product
        </Button>
      </Box>

      <Box
        height="70vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none" },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: colors.blueAccent[700],
            borderBottom: "none",
          },
          "& .MuiDataGrid-virtualScroller": {
            backgroundColor: colors.primary[400],
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: colors.blueAccent[700],
            borderTop: "none",
          },
          "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid
          rows={products}
          columns={columns}
          components={{ Toolbar: GridToolbar }}
          onCellEditCommit={handleCellEditCommit}
        />
      </Box>

      {/* Add Product Dialog */}
      <Dialog open={openAdd} onClose={() => setOpenAdd(false)}>
        <DialogTitle>Add New Product</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {["title", "category", "brand", "price", "stock", "rating"].map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              value={newProduct[field]}
              onChange={(e) =>
                setNewProduct({ ...newProduct, [field]: e.target.value })
              }
              type={["price", "stock", "rating"].includes(field) ? "number" : "text"}
              required
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAdd(false)}>Cancel</Button>
          <Button onClick={handleAddProduct} variant="contained">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          {editProduct &&
            ["title", "category", "brand", "price", "stock", "rating"].map((field) => (
              <TextField
                key={field}
                label={field.charAt(0).toUpperCase() + field.slice(1)}
                value={editProduct[field]}
                onChange={(e) =>
                  setEditProduct({ ...editProduct, [field]: e.target.value })
                }
                type={["price", "stock", "rating"].includes(field) ? "number" : "text"}
              />
            ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEditProductSave} variant="contained">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Products;
