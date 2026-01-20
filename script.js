document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const addProductBtn = document.getElementById("add-product");
    const billingForm = document.getElementById("billing-form");
    const billOutput = document.getElementById("bill-output");
    const billDetails = document.getElementById("bill-details");
    const printBillBtn = document.getElementById("print-bill");

    // Add new product row
    addProductBtn.addEventListener("click", () => {
        const productRow = document.createElement("div");
        productRow.classList.add("row", "mb-3", "product-item");
        productRow.innerHTML = `
            <div class="col-md-5">
                <input type="text" class="form-control" placeholder="Product Name" required>
            </div>
            <div class="col-md-3">
                <input type="number" class="form-control" placeholder="Quantity" required>
            </div>
            <div class="col-md-3">
                <input type="number" class="form-control" placeholder="Price" required>
            </div>
            <div class="col-md-1">
                <button type="button" class="btn btn-danger remove-product">X</button>
            </div>
        `;
        productList.appendChild(productRow);
    });

    // Remove product row
    productList.addEventListener("click", (e) => {
        if (e.target.classList.contains("remove-product")) {
            e.target.closest(".product-item").remove();
        }
    });

    // Generate bill
    billingForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const customerName = document.getElementById("customerName").value;
        const customerContact = document.getElementById("customerContact").value;
        const customerAddress = document.getElementById("customerAddress").value; // Capture customer address
        const products = Array.from(productList.querySelectorAll(".product-item")).map((item) => {
            const name = item.querySelector("input[placeholder='Product Name']").value;
            const quantity = parseFloat(item.querySelector("input[placeholder='Quantity']").value);
            const price = parseFloat(item.querySelector("input[placeholder='Price']").value);
            return { name, quantity, price };
        });

        let total = 0;
        let billHTML = `
            <p><strong>Customer Name:</strong> ${customerName}</p>
            <p><strong>Contact:</strong> ${customerContact}</p>
            <p><strong>Address:</strong> ${customerAddress}</p> <!-- Display customer address -->
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Product Name</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
        `;
        products.forEach((product, index) => {
            const productTotal = product.quantity * product.price;
            total += productTotal;
            billHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${product.name}</td>
                    <td>${product.quantity}</td>
                    <td>₹${product.price.toFixed(2)}</td>
                    <td>₹${productTotal.toFixed(2)}</td>
                </tr>
            `;
        });
        billHTML += `
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4" class="text-end"><strong>Grand Total:</strong></td>
                        <td>₹${total.toFixed(2)}</td>
                    </tr>
                </tfoot>
            </table>
        `;
        billDetails.innerHTML = billHTML;
        billOutput.classList.remove("d-none");
    });

    // Print bill
    printBillBtn.addEventListener("click", () => {
        let billNumber = localStorage.getItem("billNumber") || 1;
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString();

        const shopDetails = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1>Neha Electronics</h1>
                    <p class="mb-1"><strong>Address:</strong> Beheramal, Near UCO Bank, Jharsuguda, Odisha, 768201</p>
                    <p class="mb-1"><strong>GSTIN / UIN:</strong> 21DHOPS7687K2ZD</p>
                    <p class="mb-1"><strong>State Name:</strong> Odisha, <strong>Code:</strong> 21</p>
                    <p class="mb-1"><strong>Contact:</strong> +91 9658084808</p>
                    <p class="mb-0"><strong>E-mail:</strong> <a href="mailto:nehaelectronicsjsg@gmail.com" class="text-decoration-none text-primary">nehaelectronicsjsg@gmail.com</a></p>
                </div>
                <div class="text-end">
                    <img src="images/logo.png" alt="Neha Electronics Logo" style="height: 50px; margin-bottom: 10px;">
                    <p class="mb-1"><strong>Bill Number:</strong> NE/25-26/${billNumber}</p>
                    <p class="mb-1"><strong>Date:</strong> ${formattedDate}</p>
                    <p class="mb-1"><strong>Time:</strong> ${formattedTime}</p>
                </div>
            </div>
        `;
        localStorage.setItem("billNumber", parseInt(billNumber) + 1);
        const originalContent = document.body.innerHTML;
        const billContent = document.getElementById("bill-output").innerHTML;
        document.body.innerHTML = shopDetails + billContent;
        window.print();
        document.body.innerHTML = originalContent;
        location.reload(); // Reload to restore original state
    });
});