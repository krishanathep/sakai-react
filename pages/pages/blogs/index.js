import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { useForm } from "react-hook-form";
import axios from "axios";

const BlogsPage = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [blogDialog, setBlogDialog] = useState(false);

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
          label="Create"
          icon="pi pi-plus"
          severity="primary"
          onClick={openNew}
        />
      </React.Fragment>
    );
  };

  const actionBodyTemplate = (params) => {

    const removeBlog = async() => {
        await axios.delete('https://express-mongodb-api-server.onrender.com/api/blogs/'+params._id)
        .then((res)=>{
          fetchBlogs()
          console.log(res)
          alert("ต้องการลบข้อมูล ID :" +params._id)
        })
    };

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
          onClick={removeBlog}
        />
      </>
    );
  };

  const openNew = () => {
    setBlogDialog(true);
  };

  const hideDialog = () => {
    setBlogDialog(false);
    reset({
      title: "",
      content: "",
      author: "",
    });
    clearErrors(["title", "content", "author"]);
  };

  const submitBlog = async (data) => {
    try {
      await axios
        .post("https://express-mongodb-api-server.onrender.com/api/blogs", data)
        .then((res) => {
          console.log(res);
        });
    } catch (error) {
      console.log(error);
    } finally {
      reset({
        title: "",
        content: "",
        author: "",
      });
      setBlogDialog(false);
      fetchBlogs();
    }
  };

  const blogDialogFooter = (
    <>
      <Button
        label="Save"
        icon="pi pi-check"
        onClick={handleSubmit(submitBlog)}
      />
      <Button
        label="Cancel"
        icon="pi pi-times"
        severity="danger"
        onClick={hideDialog}
      />
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
          >
            <Column field="_id" header="ID" sortable />
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
            visible={blogDialog}
            style={{ width: "450px" }}
            header="Blog Post Details"
            modal
            className="p-fluid"
            onHide={hideDialog}
            footer={blogDialogFooter}
          >
            <div className="field">
              <label htmlFor="title">Title</label>
              <InputText {...register("title", { required: true })} />
              {errors.title && (
                <span style={{ color: "red" }}>
                  This title field is required
                </span>
              )}
            </div>
            <div className="field">
              <label htmlFor="content">Content</label>
              <InputTextarea
                {...register("content", { required: true })}
                rows={3}
                cols={20}
              />
            </div>
            {errors.content && (
              <span style={{ color: "red" }}>
                This content field is required
              </span>
            )}
            <div className="field">
              <label htmlFor="author">Author</label>
              <InputText {...register("author", { required: true })} />
            </div>
            {errors.author && (
              <span style={{ color: "red" }}>
                This author field is required
              </span>
            )}
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
