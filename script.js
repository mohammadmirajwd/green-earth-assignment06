
       const categoriesDiv = document.getElementById("categories");
        const plantsContainer = document.getElementById("plants-container");
        const cartList = document.getElementById("cart-list");
        const cartTotal = document.getElementById("cart-total");
        const loading = document.getElementById("loading");

        let cart = [];

        async function loadCategories() {
            try {
                const res = await fetch("https://openapi.programming-hero.com/api/categories");
                const data = await res.json();
                displayCategories(data.categories);
                loadAllPlants();
            } catch (error) {
                console.error("Failed to load categories:", error);
                plantsContainer.innerHTML = "<p class='text-center text-red-500'>Failed to load categories. Please check your network connection.</p>";
            }
        }

        async function loadAllPlants() {
            loading.classList.remove("hidden");
            plantsContainer.innerHTML = "";
            try {
                const res = await fetch("https://openapi.programming-hero.com/api/plants");
                const data = await res.json();
                if (data.plants && data.plants.length > 0) {
                    displayPlants(data.plants);
                } else {
                    plantsContainer.innerHTML = "<p class='text-center text-gray-500'>No plants found at this time.</p>";
                }
            } catch (error) {
                console.error("Failed to load all plants:", error);
                plantsContainer.innerHTML = "<p class='text-center text-red-500'>Failed to load plants. Please check your network connection.</p>";
            }
            loading.classList.add("hidden");
        }

        function displayCategories(categories) {
            categoriesDiv.innerHTML = "";
            const allBtn = document.createElement("button");
            allBtn.className = "btn btn-outline w-full justify-start btn-active";
            allBtn.textContent = "All Plants";
            allBtn.onclick = () => {
                [...categoriesDiv.children].forEach(b => b.classList.remove("btn-active"));
                allBtn.classList.add("btn-active");
                loadAllPlants();
            };
            categoriesDiv.appendChild(allBtn);

            categories.forEach(cat => {
                const btn = document.createElement("button");
                btn.className = "btn btn-outline w-full justify-start";
                btn.textContent = cat.category_name; 
                btn.onclick = () => loadCategoryPlants(cat.id, btn);
                categoriesDiv.appendChild(btn);
            });
        }

        async function loadCategoryPlants(categoryId, activeBtn) {
            [...categoriesDiv.children].forEach(b => b.classList.remove("btn-active"));
            if (activeBtn) {
                activeBtn.classList.add("btn-active");
            }
            loading.classList.remove("hidden");
            plantsContainer.innerHTML = "";
            
            try {
                const res = await fetch(`https://openapi.programming-hero.com/api/category/${categoryId}`);
                const data = await res.json();
                
                if (data.plants && data.plants.length > 0) {
                    displayPlants(data.plants);
                } else {
                    plantsContainer.innerHTML = "<p class='text-center text-gray-500'>No plants found for this category.</p>";
                }
            } catch (error) {
                console.error("Failed to load plants:", error);
                plantsContainer.innerHTML = "<p class='text-center text-red-500'>Failed to load plants. Please check your network connection.</p>";
            }
            loading.classList.add("hidden");
        }

        function displayPlants(plants) {
            plantsContainer.innerHTML = "";
            plants.forEach(plant => {
                const card = document.createElement("div");
                card.className = "card bg-white shadow-lg border flex flex-col";
                card.innerHTML = `
                    <figure><img src="${plant.image}" class="h-40 w-full object-cover"/></figure>
                    <div class="card-body flex flex-col justify-between">
                        <div>
                            <h2 class="card-title cursor-pointer text-green-700 mb-2" onclick="showDetails('${plant.id}')">${plant.name}</h2>
                            <p class="text-sm mb-2">${plant.description.slice(0, 60)}...</p>
                            <p class="text-sm text-gray-500">Category: ${plant.category}</p>
                            <p class="font-semibold mt-2">$${plant.price}</p>
                        </div>
                        <div class="card-actions justify-end mt-4">
                            <button class="btn btn-success btn-sm" onclick="addToCart('${plant.name}', ${plant.price})">Add to Cart</button>
                        </div>
                    </div>`;
                plantsContainer.appendChild(card);
            });
        }

        async function showDetails(id) {
            try {
                const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
                const data = await res.json();
                const plant = data.plants; 
                document.getElementById("modal-title").textContent = plant.name;
                document.getElementById("modal-img").src = plant.image;
                document.getElementById("modal-description").textContent = plant.description;
                document.getElementById("modal-price").textContent = "$" + plant.price;
                document.getElementById("plant-modal").showModal();
            } catch (error) {
                console.error("Failed to load plant details:", error);
                alert("Failed to load plant details. Please check your network connection.");
            }
        }

        function addToCart(name, price) {
            cart.push({ name, price });
            renderCart();
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            renderCart();
        }

        function renderCart() {
            cartList.innerHTML = "";
            let total = 0;
            cart.forEach((item, i) => {
                total += item.price;
                const li = document.createElement("li");
                li.className = "flex justify-between items-center bg-white px-3 py-2 rounded shadow";
                li.innerHTML = `<span>${item.name} - $${item.price}</span><button class='btn btn-xs btn-error' onclick='removeFromCart(${i})'>✖</button>`;
                cartList.appendChild(li);
            });
            cartTotal.textContent = total;
        }

        loadCategories();

