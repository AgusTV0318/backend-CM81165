// Esperar a que socket.io esté listo
document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  document.getElementById("addProductForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const product = {
      title: document.getElementById("title").value,
      description: document.getElementById("description").value,
      code: document.getElementById("code").value,
      price: parseFloat(document.getElementById("price").value),
      stock: parseInt(document.getElementById("stock").value),
      category: document.getElementById("category").value,
    };

    socket.emit("addProduct", product);
    e.target.reset();
  });

  window.deleteProduct = function (id) {
    if (confirm("¿Estás seguro de eliminar este producto?")) {
      socket.emit("deleteProduct", id);
    }
  };

  socket.on("updateProducts", (products) => {
    const productsList = document.getElementById("productsList");

    if (products.length === 0) {
      productsList.innerHTML =
        '<p class="no-products">No hay productos disponibles.</p>';
      return;
    }

    productsList.innerHTML = products
      .map(
        (product) => `
          <div class="product-card" data-id="${product.id}">
              <h3>${product.title}</h3>
              <p class="description">${product.description}</p>
              <p class="price">Precio: $${product.price}</p>
              <p class="stock">Stock: ${product.stock}</p>
              <p class="category">Categoría: ${product.category}</p>
              <p class="code">Código: ${product.code}</p>
              <button class="delete-btn" onclick="deleteProduct(${product.id})">
                  Eliminar
              </button>
          </div>
      `
      )
      .join("");
  });

  socket.on("error", (message) => {
    alert(`Error: ${message}`);
  });

  socket.on("success", (message) => {
    console.log("Éxito:", message);
  });
});
