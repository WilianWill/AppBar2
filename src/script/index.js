/* Recuperar elementos do DOM */
const prodName = document.querySelector("#prod-name");
const prodPrice = document.querySelector("#prod-price");
const addProdBtn = document.querySelector("#adicionar");
const showItemsBtn = document.querySelector("#showItems");

class Tabela {
    constructor() {
        this.items = this.loaditems();
        this.updateTable();
    }

    loaditems() {
        const items = JSON.parse(localStorage.getItem("items"));
        return items ? items : [];
    }

    saveItems() {
        localStorage.setItem("items", JSON.stringify(this.items));
    }

    addItem() {
        const itemName = prodName.value.toLowerCase().trim();
        const itemPrice = parseFloat(prodPrice.value);


        if (itemName && !isNaN(itemPrice)) {
            const newItem = {
                id: this.items.length + 1,
                name: itemName,
                price: itemPrice.toFixed(2),
            };

            this.items.push(newItem);
            this.saveItems();
            alert("Produto cadastrado com sucesso!");

            this.updateTable();
            this.clearFields();


        } else {
            alert("Preencha todos os campos corretamente.");
        }
    }

    updateTable() {
        const tBody = document.querySelector(".tBody");
        tBody.innerHTML = "";
        this.items.forEach((item) => {
            const row = document.createElement("tr");

            const idCel = document.createElement("td");
            const nameCel = document.createElement("td");
            const priceCel = document.createElement("td");
            const actionCel = document.createElement("td");



            idCel.textContent = item.id;
            nameCel.textContent = item.name;
            priceCel.textContent = `R$ ${item.price}`;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Excluir";
            deleteBtn.classList.add("delete");
            deleteBtn.addEventListener("click", () => {
                this.deleteItem(item.id);
            });

            actionCel.appendChild(deleteBtn);

            row.appendChild(idCel);
            row.appendChild(nameCel);
            row.appendChild(priceCel);
            row.appendChild(actionCel);


            tBody.appendChild(row);
        });
    }

    clearFields() {
        prodName.value = "";
        prodPrice.value = "";
    }

    showItems() {
        this.items = this.loaditems();
        if (this.items.length === 0) {
            alert("Nenhum item cadastrado.");
        } else {
            this.updateTable();
        }
    }

    deleteItem(id) {
        this.items = this.items.filter((item) => item.id !== id);

        this.saveItems();
        this.updateTable();
    }
    /* funcao para imprimir */
    printTable() {

        const printWindow = window.open("", "_blank");

        const style = `
        <style>
            table {
                width: 100%;
                border-collapse: collapse;
            }
            th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
                font-weight: bold;
            }
            h1 {
                text-align: center;
                font-family: Arial, sans-serif;
            }
        </style>
    `;

        const content = `
        <h1>Lista de Produtos</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Preço</th>
                </tr>
            </thead>
            <tbody>
                ${this.items.map(item => `
                    <tr>
                        <td>${item.id}</td>
                        <td>${item.name}</td>
                        <td>R$ ${item.price}</td>
                    </tr>
                `).join("")}
            </tbody>
        </table>
    `;
        printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Imprimir Tabela</title>
            ${style}
        </head>
        <body>
            ${content}
        </body>
        </html>
    `);

        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }

}

const tabela = new Tabela();
addProdBtn.addEventListener("click", (e) => {
    e.preventDefault();
    tabela.addItem();
});

showItemsBtn.addEventListener("click", () => {
    tabela.showItems();
});

const printBtn = document.querySelector("#print-btn");

printBtn.addEventListener("click", () => {
    tabela.printTable();
});
