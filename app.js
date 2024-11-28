
document.addEventListener('DOMContentLoaded', () => {
    // Get references to form inputs
    const amountInput = document.getElementById('amount');
    const dateInput = document.getElementById('date');
    const categoryInput = document.getElementById('category');
    const typeInputs = document.getElementsByName('type');
    const transactionForm = document.getElementById('transaction-form');

    // Load transactions from localStorage
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    // Add Transaction Event
    if (transactionForm) {
        transactionForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const amount = parseFloat(amountInput.value);
            const date = dateInput.value;
            const category = categoryInput.value;
            const type = [...typeInputs].find(input => input.checked)?.value; // Get selected type

            if (!amount || !date || !category || !type) {
                alert('Please fill in all required fields!');
                return;
            }

            // Create a transaction object
            const transaction = {
                id: Date.now(), // Unique ID for each transaction
                amount,
                date,
                category,
                type,
            };

            // Add to transactions array and save to localStorage
            transactions.push(transaction);
            localStorage.setItem('transactions', JSON.stringify(transactions));

            // Clear the form
            transactionForm.reset();

            // Reload the transactions
            displayTransactions();

            // Feedback
            alert('Transaction added successfully!');
        });
    }

    // Display Transactions on the Dashboard
    function displayTransactions() {
        const transactionList = document.querySelector('.transaction-list');
        const balanceElement = document.querySelector('.current-balance');
        const incomeElement = document.querySelector('.income');
        const expenseElement = document.querySelector('.expenses');

        if (!transactionList || !balanceElement || !incomeElement || !expenseElement) return;

        // Clear the table
        transactionList.innerHTML = '';

        let totalIncome = 0;
        let totalExpense = 0;

        // Loop through transactions
        transactions.forEach((transaction, index) => {
            const { id, amount, date, category, type } = transaction;

            // Create a transaction row
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date}</td>
                <td>${category}</td>
                <td class="${type}">${type === 'income' ? '+ ₹' + amount : '- ₹' + amount}</td>
                <td><button class="btn btn-danger btn-sm" onclick="deleteTransaction(${index})">Delete</button></td>
            `;

            // Add row to the table
            transactionList.appendChild(row);

            // Update totals
            if (type === 'income') {
                totalIncome += amount;
            } else {
                totalExpense += amount;
            }
        });

        // Update the dashboard totals
        const totalBalance = totalIncome - totalExpense;
        balanceElement.textContent = `₹${totalBalance.toFixed(2)}`;
        incomeElement.textContent = `₹${totalIncome.toFixed(2)}`;
        expenseElement.textContent = `₹${totalExpense.toFixed(2)}`;
    }

    // Global function to delete a transaction
    window.deleteTransaction = function (index) {
        transactions.splice(index, 1); // Remove the transaction at the given index
        localStorage.setItem('transactions', JSON.stringify(transactions)); // Save the updated array
        displayTransactions(); // Refresh the display
    }

    // Load Transactions on Page Load
    displayTransactions();
});
