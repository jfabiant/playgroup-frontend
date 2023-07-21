"use client"

import Image from "next/image";
import styles from "./page.module.css";
import {useEffect, useState} from "react"

class FormDataClass {
  constructor(public id:string|null,
    public name:string, public description:string, public image: File|null){}
}

class Product {
  constructor(public id:number,
    public name:string, public description:string, public image: string,
    public createdAt:string, public updatedAt:string){}
}

export default function Home() {

  const [formData, setFormData] = useState<FormDataClass>({
    id: null,
    name:"",
    description: "",
    image: null
  })

  const [productList, setProductList] = useState<Product[]>([])

  useEffect(()=>{
    getProducts();
  },[])

  const getProducts = async () => {
    const res = await fetch("http://localhost:5000/products", {
      method: "GET"
    })
    const data = await res.json()
    setProductList(data);
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.type === "file"){
      if(e.target.files){
        setFormData({
          ...formData,
          image: e.target.files[0]
        })
      }
    }else{
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      })
    }
    
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if(formData.id){
        // Edit
        const fd = new FormData()
    fd.append("file", formData.image)

    const res = await fetch("http://localhost:5000/uploader", {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    await fetch(`http://localhost:5000/products/${formData.id}`,{
      method: "PATCH",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name:formData.name,
        description:formData.description,
        image: data.filename
      })
    })
      }else{
        const fd = new FormData()
    fd.append("file", formData.image)

    const res = await fetch("http://localhost:5000/uploader", {
      method: "POST",
      body: fd
    });

    const data = await res.json();

    await fetch("http://localhost:5000/products",{
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name:formData.name,
        description:formData.description,
        image: data.filename
      })
    })
      }

      cleanFields()
    getProducts();
    } catch (e) {
      console.error(e);
    }

  }

  const cleanFields = () => {
    setFormData({
      id: null,
    name:"",
    description: "",
    image: null
    })
  }

  const editButton = async (id:number) => {
    const res = await fetch(`http://localhost:5000/products/${id}`, {
      method: "GET"
    })
    const data = await res.json()
    setFormData(data);
  }

  const deleteButton = async (id:number) => {
    await fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE"
    })
    getProducts();
  }

  return (
    <main className="container">
      <h2 className="text-center mt-4">Playgroup Product CRUD</h2>

      <div className="card mt-4">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label
                htmlFor="name"
                className="form-label"
              >Nombre de producto:</label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                placeholder="Ingrese el nombre del producto"
                value={formData.name}
                onChange={handleInput}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="desc"
                className="form-label"
              >Descripción de producto:</label>
              <input
                type="text"
                className="form-control"
                id="description"
                name="description"
                placeholder="Ingrese la descripcion del producto"
                value={formData.description}
                onChange={handleInput}
              />
            </div>
            <div className="mb-3">
              <label
                htmlFor="image"
                className="form-label"
              >Imagen de producto:</label>
              <input
                type="file"
                className="form-control"
                id="image"
                name="image"
                placeholder="Ingrese la imagen del producto"
                onChange={handleInput}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
            <button type="button" className="btn btn-default" onClick={cleanFields}>Limpiar campos</button>
          </form>
        </div>
      </div>
      <br />
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Nombre</th>
            <th scope="col">Descripcion</th>
            <th scope="col">Imagen</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {
            productList.map(p => <tr key={p.id}>
              <th scope="row">{p.id}</th>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td><Image src={`http://localhost:5000/uploader/${p.image}`} alt={p.name} width={140} height={100} /></td>
              <td><button className="btn btn-warning mr-2" onClick={()=>editButton(p.id)}>Editar</button>
              <button className="btn btn-danger" onClick={()=>deleteButton(p.id)}>Eliminar</button></td>
            </tr>)
          }
        </tbody>
      </table>
    </main>
  );
}
