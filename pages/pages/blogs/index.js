import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import axios from "axios";
import Link from "next/link";

const BlogsPage = () => {
  let emptyProduct = {
    id: null,
    name: "",
    image: null,
    description: "",
    category: null,
    price: 0,
    quantity: 0,
    rating: 0,
    inventoryStatus: "INSTOCK",
  };

  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const [product, setProduct] = useState(emptyProduct);
  const [submitted, setSubmitted] = useState(false);
  const [productDialog, setProductDialog] = useState(false);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      await axios
        .get("https://express-mongodb-api-server.onrender.com/api/blogs")
        .then((res) => setBlogs(res.data));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const rightToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label="New"
          icon="pi pi-plus"
          severity="primary"
          onClick={openNew}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplate = () => {
    return (
      <>
        <Button
          icon="pi pi-search"
          severity="help"
          rounded
          className="mr-2"
          onClick={() => alert("View blog")}
        />
        <Button
          icon="pi pi-pencil"
          severity="success"
          rounded
          className="mr-2"
          onClick={() => alert("Edit blog")}
        />
        <Button
          icon="pi pi-trash"
          severity="danger"
          rounded
          onClick={() => alert("Remove Blog")}
        />
      </>
    );
  };

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const productDialogFooter = (
    <>
        <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
        <Button label="Save" icon="pi pi-check" text onClick={hideDialog} />
    </>
);

  useEffect(() => {
    fetchBlogs();
  }, []);

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Blogs Post</h5>
          <Toolbar className="mb-4" right={rightToolbarTemplate}></Toolbar>
          <DataTable
            className="p-datatable-gridlines"
            value={blogs}
            dataKey="_id"
            rows={10}
            paginator
            loading={loading}
            // rowsPerPageOptions={[5, 10, 25]}
            // paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            // currentPageReportTemplate="Showing {first} to {last} of {totalRecords} blogs"
          >
            <Column field="title" header="Title" sortable />
            <Column field="content" header="Content" sortable />
            <Column field="author" header="Author" sortable />
            <Column field="createdAt" header="Created" sortable />
            <Column
              header="Actions"
              body={actionBodyTemplate}
              headerStyle={{ width: "13rem" }}
            ></Column>
          </DataTable>

          <Dialog
            visible={productDialog}
            style={{ width: "450px" }}
            header="Blog Post Details"
            modal
            className="p-fluid"
            onHide={hideDialog}
            footer={productDialogFooter}
          >
            <div className="field">
              <label htmlFor="name">Name</label>
              <InputText />
            </div>
            <div className="field">
              <label htmlFor="description">Description</label>
              <InputTextarea
                required
                rows={3}
                cols={20}
              />
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
