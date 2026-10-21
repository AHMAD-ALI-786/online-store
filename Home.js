function cartcount() {
  let nbr = 0;
  let CartCount = document.getElementById("cart-count");
  CartCount.innerText = nbr;

  const AddCart = document.querySelectorAll(".product-card-cart-btn");

  /**
   * Avoid getElementById here: IDs must be unique in the DOM, so it would only
   * target the first product card button and ignore all subsequent ones.
   * const AddCart = document.getElementById('add-cart');
   *
   * Use querySelectorAll to select all cart buttons (returns a NodeList),
   * then loop through each button to attach an individual click listener.
   */

  AddCart.forEach((parameter) => {
    parameter.addEventListener("click", (e) => {
      e.stopPropagation();
      ++nbr;
      CartCount.innerText = nbr;
    });
  });
}

function getProducts() {

  const savedData = localStorage.getItem("products"); // LocalStorage se data liya

  if (!savedData) {
    return [];   // Agar data nahi hai, toh khali array return kar do
  }

  const parsedData = JSON.parse(savedData); // Data ko parse kiya

  // Check kiya ke parse hone ke baad data asal mein array hai ya nahi ?
  return Array.isArray(parsedData) ? parsedData : [];
}

function createProduct(product) {
  
  // 1.
  let li = document.createElement("li");    // new list element create kro
  li.classList.add("product-card");         // is ma class add kr do


  /** 2. Optional inputs ko handle "badge and old price"
   * Optional chizo ko handle krna ka lya, like "badge and old price"
   * agr wo user da to thk, phr bna do html tag us ka, wrna mt bnao
   * agr user null da or hm tag bna da to wha null print ho ga, kio ka us ki value user na di nai or is lya hm na usa null bna dya tha.
   */
  const badge = product.badge
    ? `<span class="product-card-badge"> ${product.badge}</span>`
    : "";

  const oldPrice = product.oldPrice !== null
      ? `<span class="product-card-price-old">PKR ${product.oldPrice}</span>`
      : "";



  // 3. li ka andr inner HTML likha--template
  li.innerHTML = `
            <a href="#" class="product-card-link">

              <div class="product-card-media">

                <img class="product-card-media-img"  src="${product.image_src}"alt="${product.image_alt}" loading="lazy" />
                ${badge} 

              </div>

              <div class="product-card-body">

                <p class="product-card-category"> ${product.category} </p>
                <h3 class="product-card-name"> ${product.name} </h3>
                <div class="product-card-price">
                  <span class="product-card-price-current">PKR ${product.newPrice}</span>
                  ${oldPrice}  
                </div>

              </div>

            </a>

            <button type="button" class="product-card-cart-btn"> Add to cart </button>
          `;


  // 4. phr ab is li ko ul ka andr dala        
  let ul = document.querySelector(".product-grid");
  ul.appendChild(li);

}



(async function () {
  let products = await getProducts();   // 1. products Storage sa get kro 

  for (let product of products)        // for ....of loop hi asynchronous ko support krta ha is lya isa use kya
    {
    await createProduct(product);      // 2. ak ak kr ka product card bnao
    }

  await cartcount();                  // 3. jb card bn jai phr, un ka add cart btns ko access kr ka save kr lo, click hona pr cart count increase kra

})();
