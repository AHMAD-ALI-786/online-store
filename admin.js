
/**
 *          "Situation"                                                            "Return"
 * LocalStorage mein data nahi hai                                              empty array	[]
 * Data ha ab, lakin array format mein nahi hai	                                throw error             
 * Data available and valid array hai                                          	products array
 * 
 * catch ma phr error ko handle kr lo,empty array return kr ka                  empty array	[]
 */
let  products = (function getData() {
  try {
    const savedData = localStorage.getItem("products");

    if (savedData === null) {
      return [];
    }

    const products = JSON.parse(savedData);

    if (!Array.isArray(products)) {
      throw new Error("Products data must be an array.");
    }

    return products;

  } catch (error) {
    console.error("Failed to get products:", error);
    return [];
  }
})();



/**
 * Display aur Row Creation Logic
 *
 * display()
 * 1. Table body ko khali karo taake duplicate rows na banein.
 * 2. ab jitna products a rhi utni bar hm create_tr_HTML() ko call kra ga, wo hma ak tr bna kr return kra ga
 * 3. hm ab us tr ko tabel ka andr dal da ga
 *
 * create_tr_HTML()
 * 1. Aik naya <tr> element banao.
 * 2. Product ka data uski innerHTML mein set karo.
 * 3. Mukammal <tr> element ko return kar do.
 *
 * Humne Do Alag Functions Kyun Banaye?
 *
 * Pehle jab bhi naya product add hota tha, hum display() ko dobara
 * call karte thay. Is se table ki tamam purani rows delete hoti thin
 * aur phir har existing product ki row dobara create hoti thi.
 *
 * Yeh unnecessary DOM operations hain, kyun ke humein sirf aik naya
 * product display karna hota hai, tamam purane products dobara nahi.
 *
 * Is liye humne row creation aur table rendering ko alag kar diya:
 *
 * - Page Load: display() tamam existing products ki rows banata hai.
 * - New Product Add: create_tr_HTML() sirf naye product ki row banata
 *   hai, jise seedha table body mein append kar diya jata hai.
 *
 * Performance Note:
 * Is approach se har naye product par tamam purani DOM rows dobara
 * create karne ki zaroorat nahi rehti.
 *
 * Lekin agar products ki tadaad bohat zyada ho, to pagination ya
 * virtualization bhi use karni chahiye, kyun ke aik hi waqt mein
 * millions of rows render karna phir bhi performance ko slow karega.
 */
function display(products)
{
  
  let tbody = document.querySelector('#tbody');
  tbody.innerHTML = ""; 

 
  for(const product of products)
  {
    tbody.appendChild(
      create_tr_HTML(product)
    );
  }
}  display(products);

function create_tr_HTML(product){
  let tr=document.createElement('tr');
  tr.classList.add("product-list");

  tr.innerHTML=`
                <td>${product.id}</td>
                <td>${product.image_src}</td>
                <td>${product.image_alt}</td>
                <td>${product.badge}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.newPrice}</td>
                <td>${product.oldPrice}</td>
                <td class="product-actions">
                  <svg
                    class="edit"  data-id="${product.id}"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                  >
                    <path
                      d="M441 58.9L453.1 71c9.4 9.4 9.4 24.6 0 33.9L424 134.1 377.9 88 407 58.9c9.4-9.4 24.6-9.4 33.9 0zM209.8 256.2L344 121.9 390.1 168 255.8 302.2c-2.9 2.9-6.5 5-10.4 6.1l-58.5 16.7 16.7-58.5c1.1-3.9 3.2-7.5 6.1-10.4zM373.1 25L175.8 222.2c-8.7 8.7-15 19.4-18.3 31.1l-28.6 100c-2.4 8.4-.1 17.4 6.1 23.6s15.2 8.5 23.6 6.1l100-28.6c11.8-3.4 22.5-9.7 31.1-18.3L487 138.9c28.1-28.1 28.1-73.7 0-101.8L474.9 25C446.8-3.1 401.2-3.1 373.1 25zM88 64C39.4 64 0 103.4 0 152L0 424c0 48.6 39.4 88 88 88l272 0c48.6 0 88-39.4 88-88l0-112c0-13.3-10.7-24-24-24s-24 10.7-24 24l0 112c0 22.1-17.9 40-40 40L88 464c-22.1 0-40-17.9-40-40l0-272c0-22.1 17.9-40 40-40l112 0c13.3 0 24-10.7 24-24s-10.7-24-24-24L88 64z"
                    />
                  </svg>
                  <svg
                    class="delete"  data-id="${product.id}"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 448 512"
                  >
                    <path
                      d="M136.7 5.9L128 32 32 32C14.3 32 0 46.3 0 64S14.3 96 32 96l384 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-96 0-8.7-26.1C306.9-7.2 294.7-16 280.9-16L167.1-16c-13.8 0-26 8.8-30.4 21.9zM416 144L32 144 53.1 467.1C54.7 492.4 75.7 512 101 512L347 512c25.3 0 46.3-19.6 47.9-44.9L416 144z"
                    />
                  </svg>
                </td>
                `;

  
  return tr;    
}



/**
 * 1. jb add-product btn pr click ho to form show kr do
 * 2. jb form ka cancel btn pr click ho to form hide kr do
 * 3. or phr form ki value bi reset kr do, clear kr do
 *    or form ki value bi rest kr do clear kr do
 *    bilfrz mana edit pr click kya or form open howa, 
 *    by default us form ma already us product ki value likhi thi
 *    ab ma submit kya bgair hi cancel kr dya 
 *    lakin us ka andr value whi pri rha gi 
 *    thats why form clear kr do , jb wo cancel click kra
 */
const addButton = document.getElementById("add-btn");
const productForm = document.getElementsByClassName("product-form")[0];
const form_cancel_btn = document.querySelector("#form-cancel-btn");

addButton.addEventListener("click", (e) => {

  e.stopPropagation(); 
  productForm.classList.remove("hidden");

});

form_cancel_btn.addEventListener(
  "click", (e)=>{

    e.stopPropagation();

    productForm.classList.add('hidden');
    productForm.reset();   

    row_edit_id = null;
    row_edit = null;
    edit_product = null;

  }
);



/** 
 * --> 1. data read, form ki input elements ko access kro
 * jb form submit ho to 
 * 
 * ==================new product module================================== 
 * --> 2. object create, form ka input element ki value jo user na di un ka obj bna do 
 *         2.1 jo optional inputs thi un ko handel kro
 * --> 3. obj ko get kya howa data ma push kr do, means data update kr do
 * --> 4. ab updated data ko storage ma dal do 
 * --> 5. tabel ki body ko access kya
 * --> 5.1. create_tr_HTML() ko apna crete kya howa product-obj  or product array ki length as a argument di
 * --> 5.2. us na hma tr di, or hm na usa tabel ki body ma append child kr dya.
 * ==================edit product module==================================
 * --> 6. form ka input element ki values sa,jo user na di ha, old values ko override kr do 
 * --> 7. local storage ma data update kr do
 * --> 8. ak new row create kro edit product ki
 * --> 9. ab usa tabel ki old row sa replace kr do bs
 * --> 10. ab variables ko null asign kr do again,
 *   
 * --> 6. product form ka andr user na jo value di ab usa reset kr do , khali kr do
 * --> 7. phr end pr kam pura hona ka bad form hide kr da plz
 *
 * */
  const image_srcInput = document.querySelector("#img-src");
  const image_altInput = document.querySelector("#img-alt");
  const badgeInput = document.querySelector("#badge");
  const categoryInput = document.querySelector("#category");
  const nameInput = document.querySelector("#name");
  const oldPriceInput = document.querySelector("#old-price");
  const newPriceInput = document.querySelector("#new-price");

productForm.addEventListener("submit", (e) => {

  e.preventDefault(); 
  e.stopPropagation(); 

  if(row_edit_id === null )
  {
  
  const product_obj = {

    id: crypto.randomUUID(), 

    image_src: image_srcInput.value.trim(),   
    image_alt: image_altInput.value.trim(), 

    badge: badgeInput.value=== "" ? null : badgeInput.value.trim(),

    category: categoryInput.value.trim(), 
    name: nameInput.value.trim(),

    oldPrice: oldPriceInput.value === ""  ? null : Number(oldPriceInput.value),  

    newPrice: Number(newPriceInput.value),

  };

  
  products.push(product_obj); 

  
  localStorage.setItem("products", JSON.stringify(products)); 


  let tbody = document.querySelector('#tbody');
  tbody.appendChild(
    create_tr_HTML(product_obj)
  );

  }
  else if(row_edit_id !== null)
  { 

    edit_product.image_src = image_srcInput.value.trim();   
    edit_product.image_alt = image_altInput.value.trim();
    edit_product.badge = (badgeInput.value === "") ? null : badgeInput.value.trim();
    edit_product.category =  categoryInput.value.trim();
    edit_product.name = nameInput.value.trim();
    edit_product.oldPrice = (oldPriceInput.value === "")  ? null : Number(oldPriceInput.value); 
    edit_product.newPrice = Number(newPriceInput.value);

    localStorage.setItem("products", JSON.stringify(products));
    
    const update_row = create_tr_HTML(edit_product);

    row_edit.replaceWith(update_row);

    row_edit_id = null;
    row_edit = null;
    edit_product = null;
    
  }

  productForm.reset();   
  productForm.classList.add("hidden"); 

}); 



/**
 * tabel ki body pr jb click ho to chk kro kis pr howa ha ?
 * 1. agr delete icon pr howa ha to, 
 * 2. pop up ko show kr do , or row_del_id and row_del ko wo current target wali row asign kr da
 * 
 * 3. agr click edit icon pr howa ha ?
 * 4. form ko show kr do
 * 5. row_edit_id ko and row_edit ko target row and product id asign kr do
 * 6. phr wo product find kr lo row_edit_id sa by using find() function
 * 7. ab form ki inputs values ma whi product ki values by default brh do
 * 
 */
let tbody = document.querySelector('#tbody');

let popup = document.querySelector('.popup');
let cancel_btn= document.querySelector('.cancel-btn');
let delete_btn= document.querySelector('.delete-btn');

let row_edit_id = null;
let row_edit = null;

let row_del_id = null;
let row_del = null; 

let edit_product = null;

tbody.addEventListener(

  'click', (e)=>{

        if(e.target.classList.contains("delete"))
        {
          popup.classList.remove('hidden');
          row_del_id = e.target.getAttribute('data-id');
          row_del =  e.target.closest('tr');
        }
        else if(e.target.classList.contains("edit"))
        {
          productForm.classList.remove("hidden");
          row_edit_id = e.target.getAttribute("data-id");
          row_edit =  e.target.closest('tr');

          edit_product = products.find(
            (product)=>{
              return (product.id === row_edit_id);
            }
          );

          image_srcInput.value = edit_product.image_src
          image_altInput.value = edit_product.image_alt;
          badgeInput.value = edit_product.badge;
          categoryInput.value = edit_product.category;
          nameInput.value = edit_product.name;
          oldPriceInput.value = edit_product.oldPrice;
          newPriceInput.value = edit_product.newPrice;

        }

  }
);



/**
 * Delete Pop-up open ha, or is pr event-listner lgaya ha
 * 1. agr user pop-up ma cancel-btn pr click kra da, to popup ma "hide" class add kr da.
 * 2. or row_del_id and row_id ko null asign kr da
 * 
 * 3. agr user pop-up ma delete-btn pr click kr da, to
 *  --> ak new-products-array bnao jis ma wo "product" na ho, jo user na del ki (by using array method -> .filter())
 *  --> ab us new-products-array ko, old-products-array sa "override" kr da 
 *  --> ab local-storage ma products set kr da (update kr da)
 *  --> ab tabel ma sa bi, row ko del kr da, by remove() function
 *  --> end pr popup ma "hidden" class add kr da 
 *  --> del_id and del_row wala variable ko again null kr da,
 */
popup.addEventListener(    

  'click',(e)=>{   

    if(e.target === cancel_btn)       
      {        
        popup.classList.add('hidden');       
      }        
      else if(e.target === delete_btn)       
        {
          const new_products = products.filter(
            (product)=>{
              return (product.id !== row_del_id);
            }
          );    

          products = new_products;
          
          localStorage.setItem('products',JSON.stringify(products));

          row_del.remove();

          popup.classList.add('hidden'); 

        }  

        row_del_id = null;
        row_del = null; 
            
      }
);




/**
 * --> buttons wgara ko access kr lo
 * --> ak variable bi declare kr do 
 * --> phla asc ma sort kr do 
 * --> or phr usa display functions ko pas kr do, wo purana rows hta kr new rowa create kr da ga
 * --> isi tra so on baki bi
 */
let current_price = document.querySelector("#current_price_thead");
let click_current_price = 1;

current_price.addEventListener(
  'click', (e)=>{

    old_price.innerText = 'old price ▲▼';
    Name.innerText = 'name price ▲▼';

    if( click_current_price === 1 )
    {
    let asc_sort_products = products.toSorted(
      (a,b)=>{
        return a.newPrice - b.newPrice;
      }
    );

    current_price.innerText = 'current price ▲';
    display(asc_sort_products);

    click_current_price = 2;
    }
    else if( click_current_price === 2 )
    {
      let dec_sort_products = products.toSorted(
        (a,b)=>{
          return b.newPrice - a.newPrice;
        }
      );

      current_price.innerText = 'current price ▼';
      display(dec_sort_products);

      click_current_price = 3;
    }
    else if( click_current_price === 3 )
    {

      current_price.innerText = 'current price ▲▼';
      display(products);

      click_current_price = 1;
    }
    
  }
);



let old_price = document.querySelector("#old_price_thead");
let click_old_price = 1;

old_price.addEventListener(
  'click', (e)=>{

    current_price.innerText = 'current price ▲▼';
    Name.innerText = 'name ▲▼';

    if( click_old_price === 1 )
    {
    let asc_sort_products = products.toSorted(
      (a,b)=>{
        return a.oldPrice - b.oldPrice;
      }
    );

    old_price.innerText = 'old price ▲';
    display(asc_sort_products);

    click_old_price = 2;
    }
    else if( click_old_price === 2 )
    {
      let dec_sort_products = products.toSorted(
        (a,b)=>{
          return b.oldPrice - a.oldPrice;
        }
      );

      old_price.innerText = 'old price ▼';
      display(dec_sort_products);

      click_old_price = 3;
    }
    else if( click_old_price === 3 )
    {

      old_price.innerText = 'old price ▲▼';
      display(products);

      click_old_price = 1;
    }
    
  }
);



let Name = document.querySelector("#name_thead");
let click_name = 1;

Name.addEventListener(
  'click', (e)=>{

    current_price.innerText = 'current price ▲▼';
    old_price.innerText = 'old price ▲▼';

    if( click_name === 1 )
    {
    let asc_sort_products = products.toSorted(
      (a,b)=>{
        return a.name.localeCompare(b.name, "en") ;
      }
    );

    Name.innerText = 'name ▲';
    display(asc_sort_products);

    click_name = 2;
    }
    else if( click_name === 2 )
    {
      let dec_sort_products = products.toSorted(
        (a,b)=>{
          return b.name.localeCompare(a.name, "en");
        }
      );

      Name.innerText = 'name ▼';
      display(dec_sort_products);

      click_name = 3;
    }
    else if( click_name === 3 )
    {

      Name.innerText = 'name ▲▼';
      display(products);

      click_name = 1;
    }
    
  }
);



/**
 * 
 */
let search_bar = document.querySelector("#search_bar");
