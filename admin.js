// Minimal admin.js to add products at runtime
(function(){
    function $(id){ return document.getElementById(id); }

    function renderAdminProducts(){
        const container = $('adminProducts');
        if(!container) return;
        container.innerHTML = '';
        const list = window.products || [];
        list.forEach(p => {
            const el = document.createElement('div');
            el.className = 'product-card';
            el.innerHTML = `
                <img src="${p.image||''}" alt="${p.name}">
                <h4>${p.name}</h4>
                <p>Rs. ${p.price}</p>
                <p class="small">${p.category}</p>
            `;
            container.appendChild(el);
        });
    }

    function addProduct(){
        const name = $('productName').value.trim();
        const price = Number($('productPrice').value) || 0;
        const category = $('productCategory').value || 'Other';
        const image = $('productImage').value.trim() || 'https://via.placeholder.com/200?text=No+Image';
        if(!name || !price) return alert('Please provide name and price');
        const list = window.products || [];
        const maxId = list.reduce((m,it)=> Math.max(m, it.id||0), 0);
        const prod = { id: maxId+1, name, price, category, image };
        list.push(prod);
        // store override so other pages can read
        try{ localStorage.setItem('products_override', JSON.stringify(list)); }catch(e){}
        window.products = list;
        renderAdminProducts();
        alert('Product added (in-memory).');
    }

    document.addEventListener('DOMContentLoaded', ()=>{
        // if there's an override in localStorage, merge it
        try{
            const stored = localStorage.getItem('products_override');
            if(stored){ window.products = JSON.parse(stored); }
        }catch(e){}

        const btn = $('addProductBtn');
        if(btn) btn.addEventListener('click', addProduct);
        renderAdminProducts();
    });
})();
