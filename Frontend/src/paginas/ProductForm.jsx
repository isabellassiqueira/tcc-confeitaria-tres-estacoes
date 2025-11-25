// ProductForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./ProductForm.css";

const API = "http://localhost:3000/api/products"; // ajuste se necessário

export default function ProductForm({ onUpload, productToEdit, onFinishEdit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [tipo, setTipo] = useState("bolos");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  // Quando productToEdit muda -> preenche o formulário
  useEffect(() => {
    if (productToEdit) {
      setName(productToEdit.name || "");
      setDescription(productToEdit.description || "");
      setPrice(productToEdit.price != null ? String(productToEdit.price) : "");
      setTipo(productToEdit.tipo || "bolos");
      setImagePreview(
        productToEdit.image ? `http://localhost:3000${productToEdit.image}` : null
      );
      setImageFile(null); // manter existente até o usuário escolher outra
    } else {
      // limpa o formulário quando não estiver editando
      resetForm();
    }
  }, [productToEdit]);

  const resetForm = () => {
    setName("");
    setDescription("");
    setPrice("");
    setTipo("bolos");
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validações básicas
    if (!name.trim()) return alert("Nome é obrigatório.");
    if (!price || isNaN(Number(price))) return alert("Preço inválido.");

    setLoading(true);

    try {
      // se backend aceita multipart/form-data -> usamos FormData
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", Number(price));
      formData.append("tipo", tipo);

      // só anexa imagem se o usuário selecionou uma nova
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (productToEdit && productToEdit.id) {
        // EDITAR -> PUT (ou PATCH, dependendo do backend)
        // se seu backend espera JSON em vez de FormData, ajuste isto
        await axios.put(`${API}/${productToEdit.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Produto atualizado com sucesso!");
        if (onFinishEdit) onFinishEdit();
      } else {
        // CRIAR -> POST
        await axios.post(API, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        alert("Produto cadastrado com sucesso!");
      }

      // atualiza lista externa
      if (onUpload) await onUpload();

      // limpa form apenas se não estiver mais editando
      if (!productToEdit) resetForm();
    } catch (err) {
      console.error("Erro ao salvar produto:", err);
      alert("Erro ao salvar produto. Veja console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
      <label>
        Nome
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <label>
        Descrição
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
        />
      </label>

      <label>
        Preço
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          type="number"
          step="0.01"
        />
      </label>

      <label>
        Tipo
        <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
          <option value="bolos">Bolos</option>
          <option value="doces">Doces</option>
          <option value="salgados">Salgados</option>
          <option value="bebidas">Bebidas</option>
          <option value="especial">Especial</option>
        </select>
      </label>

      <label>
        Imagem (opcional)
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </label>

      {imagePreview && (
        <div style={{ marginTop: 8 }}>
          <img
            src={imagePreview}
            alt="preview"
            style={{ width: 120, height: 80, objectFit: "cover", borderRadius: 8 }}
          />
        </div>
      )}

<div style={{ marginTop: 12 }}>
  <button type="submit" disabled={loading}>
    {loading ? "Salvando..." : productToEdit ? "Salvar alterações" : "Cadastrar"}
  </button>

  {productToEdit && (
    <button
      type="button"
      style={{ marginLeft: 8 }}
      onClick={() => {
        resetForm();
        if (onFinishEdit) onFinishEdit();
      }}
    >
      Cancelar
    </button>
  )}
</div>

    </form>
  );
}
