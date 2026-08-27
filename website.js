const products = [
  {
    id:1,
    name:"Garlic Hip Firming Cream",
    category:"bodycare",
    price:6000,
    image:"images/firming.jpeg",
    description:"Body-care product shown in the supplied product photo. Follow the manufacturer's label and directions."
  },
  {
    id:2,
    name:"Hormone Balance Tea",
    category:"tea",
    price:8500,
    image:"images/hormonaltea.jpeg",
    description:"Herbal tea shown in the supplied product photo. Review the label, ingredients and usage instructions before use."
  },
  {
    id:3,
    name:"Herbal Hip & Butt Tea",
    category:"tea",
    price:7500,
    image:"images/enlargement.jpeg",
    description:"Herbal tea product shown in the supplied photo, Check the ingredients and serving information on the package."
  },
  {
    id:4,
    name:"Women's Probiotic Gummies",
    category: "supplement",
    price:12000,
    image:"image/probiotic.jpeg",
    description:"Women's probiotic gummy product shown in the supplied product photo. Check the ingredient and serving information on the package."
  },
  {
    id:5,
    name:"Cranberry Feminine Care",
    category:"feminine",
    price:3500,
    image:"images/cranberry.jpeg",
    description:"Cranberry feminine-care product shown in the supplied products photo. Follow the package instructions and applicable product guidance."
  }
];

const categoryNames = {
  all:"All",
  feminine:"Feminine Care",
  tea:"Tea & Herbal",
  supplement:"Supplements",
  bodycare:"Body Care"
};

let cart = JSON.parse(localStorage.getItem("janikCart")  || "[]");

const productGrid = document.getElementById("productGrid");
const cartPanel = document.getElementById("cartPanel");
const overlay = document.getElementById("overlay");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartToal");
const cartCount = document.getElementById("cartCount");
const productModal = document.getElementById("productModal");
const modalBody = document.getElementById("modalBody");


function formatMoney(amount){
  return new Intl.NumberFormat("en-NG",{
    style:"currency",
    currency:"NGN",
    maximumFractionDigits:0
  }).format(amount);
}

function displayProducts(category="all"){
  productGrid.innerHTML = "";

  const list = category==="all"
  ? products
  : products.filter(p => p.category===category);

  list.forEach(products=>{
    const card=document.createElement("article");
    card.className="product-card";

    card.innerHTML=`
    <div class="product-image">
    <img src="${product.image}" alt="${product.name}" loading"lazy>
    </div>

    <div class="product-info">
    <span class="product-category">${categoryNames[product.category]}</span>
    <h3>${product.name}</h3>
    <p>${product.description}</p>

    <div class="price-row">
    <span class="price">${formatMoney(product.price)}</span>

    <button class="add-btn"
    onclick="addToCart(${product.id})"
    aria-label="Add ${product.name} to cart">+</button>
    </div>
    `;

    productGrid.appendChild(card);
  });
}

document.querySelectorAll("filter").forEach(button=>{
  button.addEventListener("click",()=>{
    document.querySelectorAll(".filter").forEach(b=>b.classList.remove("active"));
    button.classList.add("active");
    displayProducts(button.dataset.category);
  });
});

function addToCart(productId){
  const product=products.find(p=>p.id===productId);
  if(!product)return;

  const existing=cart.find(item=>item.id===productId);

  if(existing){
    existing.quantity++;
  }else{
    cart.push({...product,quantity:1});
  }

  saveCart();
  openCart();
}

function removeFromCart(productId){
  cart=cart.filter(item=>item.id!==productId);
  saveCart();
}

function changeQuantity(productId,amount){
  const item=cart.find(p=>p.id===productId);
  if(!item)return;

  item.quantity+=amount;

  if(item.quantity<=0){
    removeFromCart(productId);
  }else{
    saveCart();
  }
}

function saveCart(){
  localStorage.setItem("janikCart",JSON.stringify(cart));
  renderCart();
}

function renderCart(){
  cartItems.innerHTML="";

  if(cart.length===0){
    cartItems.innerHTML=`<p class="empty-cart">Your cart is empty.</p>`;
  }

  let total=0;
  let count=0;

  cart.forEach(item=>{
    total+=item.price*item.quantity;
    count+=item.quantity;

    const div=document.createElement("div");
    div.className="cart-item";

    div.innerHTML=`
    <div class="cart-item-image">
    <img src="${item.image}" alt="${item.name}">
    </div>

    <div>
    <strong>${item.name}</strong>
    <div>${formatMoney(item.price)}</div>

    <div class="quantity">
          <button onclick="changeQuantity(${item.id},-1)">−</button>
          <span>${item.quantity}</span>
          <button onclick="changeQuantity(${item.id},1)">+</button>
        </div>
      </div>

      <button
        onclick="removeFromCart(${item.id})"
        style="border:0;background:none"
        aria-label="Remove ${item.name}">
        🗑️
      </button>
    `;

    cartItems.appendChild(div);
  });

  cartTotal.textContent=formatMoney(total);
  cartCount.textContent=count;
}

function openCart(){
  cartPanel.classList.add("active");
  overlay.classList.add("active");
}

function closeCart(){
  cartPanel.classList.remove("active");
  overlay.classList.remove("active");
}

document.getElementById("cartBtn").addEventListener("click",openCart);
document.getElementById("closeCart").addEventListener("click",closeCart);
overlay.addEventListener("click",closeCart);

document.getElementById("whatsappCheckout").addEventListener("click",()=>{
  if(!cart.length){
    alert("Your cart is empty.");
    return;
  }

  const phone="09077416867";

  let message="Hello Janik Feminine Care! I would like to order:%0A%0A";
  let total=0;

  cart.forEach(item=>{
    const subtotal=item.price*item.quantity;
    total+=subtotal;
    message+=`• ${item.name} x${item.quantity} - ${formatMoney(subtotal)}%0A`;
  });

  message+=`%0ATotal: ${formatMoney(total)}%0A`;
  message+="%0APlease send me payment and delivery details.";

  window.open(`https://wa.me/${phone}?text=${message}`,"_blank");
});

function showProduct(productId){
  const product=products.find(p=>p.id===productId);
  if(!product)return;

  modalBody.innerHTML=`
    <div class="modal-product">

      <div class="product-image">
        <img src="${product.image}" alt="${product.name}">
      </div>

      <span class="product-category">${categoryNames[product.category]}</span>

      <h2>${product.name}</h2>

      <p style="margin:15px 0">${product.description}</p>

      <h3>${formatMoney(product.price)}</h3>

      <button class="btn primary"
        style="margin-top:20px"
        onclick="addToCart(${product.id});closeProductModal()">
        Add to Cart
      </button>
    </div>
  `;
  productModal.classList.add("active");
}

function closeProductModal(){
  productModal.classList.remove("active");
}

document.getElementById("closeModal").addEventListener("click", closeProductModal);

productModal.addEventListener("click",event => {
  if (event.target === productModal) {
    closeProductModal();
  }
});

document.getElementById("menuBtn").addEventListener("click",()=>{
  document.getElementById("navMenu").classList.toggle("active");
});

document.querySelectorAll("#navMenu a").forEach(link=>{
  link.addEventListener("click",()=>{
    document.getElementById("navMenu").classList.remove("active");
  });
});

const reviews=[
  {
    text:"The website is easy to use and I love being able to see the products before ordering.",
    name:"— Ada, Lagos"
  },
  {
    text:"The ordering experience feels private, simple and professional.",
    name:"— Chioma, Abuja"
  },
  {
    text:"The product gallery makes it much easier to choose what I want.",
    name:"— Amaka, Port Harcourt"
  }
];

let reviewIndex=0;

function displayReview(){
  document.getElementById("reviewText").textContent=`"${reviews[reviewIndex].text}"`;
  document.getElementById("reviewName").textContent=reviews[reviewIndex].name;
}

document.getElementById("nextReview").addEventListener("click",()=>{
  reviewIndex=(reviewIndex+1)%reviews.length;
  displayReview();
});

document.getElementById("prevReview").addEventListener("click",()=>{
  reviewIndex=(reviewIndex-1+reviews.length)%reviews.length;
  displayReview();
});

setInterval(()=>{
  reviewIndex=(reviewIndex+1)%reviews.length;
  displayReview();
},6000);

document.querySelectorAll(".faq-question").forEach(question=>{
  question.addEventListener("click",()=>{
    const item=question.parentElement;

    document.querySelectorAll(".faq-item").forEach(other=>{
      if(other!==item)other.classList.remove("open");
    });

    item.classList.toggle("open");
  });
});
document.getElementById("contactForm").addEventListener("submit",event=>{
  event.preventDefault();

  const name=document.getElementById("customerName").value.trim();

  if(!name){
    alert("Please enter your name.");
    return;
  }

  alert(`Thank you ${name}! Your message has been received.`);
  event.target.reset();
});

displayProducts();
renderCart();
displayReview();