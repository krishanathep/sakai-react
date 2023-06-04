import React,{useState,useEffect} from "react";
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import axios from 'axios'
import Link from "next/link";

const BlogsPage = () => {
    const [blogs,setBlogs]=useState([])
    const [loading,setLoading]=useState(false)

    const fetchBlogs = async() => {
        try {
            setLoading(true)
            await axios.get('https://express-mongodb-api-server.onrender.com/api/blogs')
            .then((res)=>setBlogs(res.data))
        } catch(error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        fetchBlogs()
    },[])

  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Blogs Post</h5>
          <DataTable
            className="p-datatable-gridlines"
            value={blogs}
            dataKey="_id" 
            rows={10}
            paginator
            loading={loading}
          >
            <Column field="title" header="Title" sortable/>
            <Column field="content" header="Content" sortable/>
            <Column field="author" header="Author" sortable/>
            <Column field="createdAt" header="Created" sortable/>
          </DataTable>
        </div>
      </div>
    </div>
  );
};

export default BlogsPage;
