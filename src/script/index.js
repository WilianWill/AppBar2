
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
        // Criar uma tabela temporária para o PDF
        const tabelaTemp = document.createElement("table");
        tabelaTemp.style.width = "100%"; // Centralizar a tabela
        tabelaTemp.style.textAlign = "left"; // Centralizar o texto
        tabelaTemp.style.borderCollapse = "collapse"; // Melhorar layout
        tabelaTemp.innerHTML = `
        <thead>
            <tr>
                <th style="border: 1px solid black; padding: 8px;">Nome</th>
                <th style="border: 1px solid black; padding: 8px;">Valor</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;

        // Selecionar as linhas da tabela original
        document.querySelectorAll(".table tr").forEach((row, index) => {
            if (index === 0) return; // Pular o cabeçalho original

            const nome = row.querySelector("td:nth-child(2)"); // 2ª coluna: Nome
            const valor = row.querySelector("td:nth-child(3)"); // 3ª coluna: Valor

            if (nome && valor) {
                const newRow = document.createElement("tr");
                newRow.innerHTML = `
                <td style="border: 1px solid black; padding: 8px;">${nome.textContent}</td>
                <td style="border: 1px solid black; padding: 8px;">${valor.textContent}</td>
            `;
                tabelaTemp.querySelector("tbody").appendChild(newRow);
            }
        });

        // Configurações do html2pdf
        const options = {
            margin: [10, 10, 10, 10],
            filename: "tabela.pdf",
            html2canvas: { scale: 2 },
            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        // Gerar o PDF a partir da tabela temporária
        html2pdf().set(options).from(tabelaTemp).save();
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

printBtn.addEventListener("click", (e) => {
    e.preventDefault();
    if (!tabela.items.length) {
        alert("Nenhum item cadastrado.");
        return;
    }
    tabela.printTable();
});
