const container = document.getElementById("featuredProducts");

function displayProducts() {
  if (!container) return;

  container.innerHTML = "";

  products.forEach(product => {
    container.innerHTML += `
      <div class="product">
        <img src="${product.image}" />
        <h3>${product.name}</h3>
        <p>Rs. ${product.price}</p>
        <button onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;
  });
}

window.onload = displayProducts;