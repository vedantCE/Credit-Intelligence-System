// Navigation function
// Navigation function
function navigate(page) {
    document.querySelectorAll('section').forEach(sec => sec.classList.add('hidden'));
    const target = document.querySelector(`.${page}`);

    if (target) {
        target.classList.remove('hidden');
    } else {
        document.querySelector('.error-404').classList.remove('hidden');
    }

    // Show #intro only when navigating to 'landing'
    const introSection = document.getElementById('intro');
    if (page === 'landing') {
        introSection.style.display = 'flex';  // Make it visible again
    } else {
        introSection.style.display = 'none';
    }
}



// Toggle approved loan display
function toggleApprovedLoan() {
    const checkbox = document.getElementById("loanApprovalCheck");
    const loanAmountDisplay = document.getElementById("approvedLoanAmount");

    if (checkbox.checked) {
        loanAmountDisplay.style.display = "block";
    } else {
        loanAmountDisplay.style.display = "none";
    }
}

// Customer data storage
let customerData = [];

// Initialize on page load
document.addEventListener("DOMContentLoaded", function () {
    generateCustomerData();
    
    // Check if user is logged in
    if (localStorage.getItem("bankId")) {
        document.getElementById('bankName').textContent = localStorage.getItem("bankName");
        document.getElementById('bankId').textContent = localStorage.getItem("bankId");
        document.getElementById('bankEmail').textContent = localStorage.getItem("bankEmail");
        navigate('dashboard');
    }
});

// Generate sample customer data for admin panel
function generateCustomerData() {
    const customerNames = ["Aarav", "Vivaan", "Diya", "Ishaan", "Neha", "Aryan", "Kavya", "Rohan", "Sanya", "Tanish",
        "Anika", "Kabir", "Mihir", "Suhana", "Reyansh", "Zoya", "Harshit", "Meera", "Dev", "Pihu",
        "Nishant", "Simran", "Varun", "Nidhi", "Raghav", "Aisha", "Kunal", "Swati", "Yash", "Tia",
        "Siddharth", "Priya", "Krishna", "Aditi", "Manish", "Shreya", "Gaurav", "Payal", "Rahul", "Sneha",
        "Vikram", "Dhruv", "Bhavya", "Arnav", "Charvi", "Samar", "Ritika", "Atharv", "Mahima", "Rudra"];

    const tableBody = document.querySelector("#customerTable tbody");
    const currentDate = new Date().toLocaleDateString();
    document.getElementById("currentDate").innerText = currentDate;

    // Clear existing data
    tableBody.innerHTML = "";

    for (let i = 0; i < 50; i++) {
        const name = customerNames[Math.floor(Math.random() * customerNames.length)];
        const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000); // Random 10-digit number
        const loanAmount = Math.floor(50000 + Math.random() * 950000); // Loan between 50,000 and 1,000,000
        const creditScore = Math.floor(300 + Math.random() * 700); // Credit score between 300 and 1000
        let approvedLoan;

        if (creditScore >= 750) {
            approvedLoan = loanAmount; // Full loan approved
        } else if (creditScore >= 600) {
            approvedLoan = Math.round(loanAmount * 0.75); // 75% approved
        } else if (creditScore >= 450) {
            approvedLoan = Math.round(loanAmount * 0.50); // 50% approved
        } else {
            approvedLoan = Math.round(loanAmount * 0.25); // 25% approved
        }

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${name}</td>
            <td>${accountNumber}</td>
            <td>₹${loanAmount.toLocaleString()}</td>
            <td class="${creditScore < 400 ? 'high-risk' : ''}">${creditScore}</td>
            <td>₹${approvedLoan.toLocaleString()}</td>
        `;

        tableBody.appendChild(row);
        
        // Store data for later use
        customerData.push({ name, accountNumber, loanAmount, creditScore, approvedLoan });
    }
}

// Handle credit card operations for Customer Credit page
function addCreditCard() {
    let container = document.getElementById("credit-cards");
    let newCard = document.createElement("div");
    newCard.classList.add("credit-card");
    newCard.innerHTML = `
        <select class="bank-name">
            <option value="">Select Bank</option>
            <option value="HDFC">HDFC</option>
            <option value="SBI">SBI</option>
            <option value="ICICI">ICICI</option>
            <option value="Axis Bank">Axis Bank</option>
        </select>
        <select class="card-type">
            <option value="">Select Card Type</option>
            <option value="Platinum">Platinum</option>
            <option value="Gold">Gold</option>
            <option value="Silver">Silver</option>
        </select>
    `;
    container.appendChild(newCard);
}

// Calculate credit scores from multiple cards
function calculateTotalScore() {
    let rows = document.querySelectorAll(".credit-card");
    let tableBody = document.querySelector("#credit-score-table tbody");
    let experianTotal = 0, equifaxTotal = 0, transunionTotal = 0, cibilTotal = 0;
    tableBody.innerHTML = "";

    rows.forEach(row => {
        let bank = row.querySelector(".bank-name").value;
        let type = row.querySelector(".card-type").value;
        if (!bank || !type) return;

        let experian = Math.floor(600 + Math.random() * 200);
        let equifax = Math.floor(600 + Math.random() * 200);
        let transunion = Math.floor(600 + Math.random() * 200);
        let cibil = Math.floor(600 + Math.random() * 200);

        experianTotal += experian;
        equifaxTotal += equifax;
        transunionTotal += transunion;
        cibilTotal += cibil;

        let tr = `
            <tr>
                <td>${bank}</td>
                <td>${type}</td>
                <td>${experian}</td>
                <td>${equifax}</td>
                <td>${transunion}</td>
                <td>${cibil}</td>
            </tr>
        `;
        tableBody.innerHTML += tr;
    });

    document.getElementById("experian-total").textContent = experianTotal;
    document.getElementById("equifax-total").textContent = equifaxTotal;
    document.getElementById("transunion-total").textContent = transunionTotal;
    document.getElementById("cibil-total").textContent = cibilTotal;
    document.getElementById("credit-score-table").classList.remove("hidden");
}

// Calculate loan eligibility
function calculateLoanEligibility() {
    const requestedLoan = parseInt(document.getElementById('loanAmountRequest').value);
    if (isNaN(requestedLoan) || requestedLoan <= 0) {
        alert("Please enter a valid loan amount.");
        return;
    }

    // Define bureaus and their scores
    let bureaus = {
        CIBIL: Math.floor(Math.random() * 600) + 300,
        CRIF: Math.floor(Math.random() * 600) + 300,
        EQUIFAX: Math.floor(Math.random() * 600) + 300,
        EXPERIAN: Math.floor(Math.random() * 600) + 300
    };

    // Randomly shut down between 0 and 3 servers
    let serversToShutDown = Math.floor(Math.random() * 4);
    let bureauNames = Object.keys(bureaus);
    let downBureaus = [];

    for (let i = 0; i < serversToShutDown; i++) {
        let index = Math.floor(Math.random() * bureauNames.length);
        downBureaus.push(bureauNames[index]);
        delete bureaus[bureauNames[index]]; // Remove from calculation
        bureauNames.splice(index, 1);
    }

    let finalCreditScore = 0;
    let approvedLoan = 0;
    let riskLevel = "";
    let riskColor = "gray";

    if (Object.keys(bureaus).length === 0) {
        // If all servers are down, use default values
        finalCreditScore = 300;
        approvedLoan = 0;
        riskLevel = "Unknown Risk";
        document.getElementById('serverNotice').innerText = "⚠ All bureau servers are down. Default credit score applied.";
    } else {
        // Adjust weight dynamically
        let weightage = {
            CIBIL: 0.4,
            CRIF: 0.2,
            EQUIFAX: 0.2,
            EXPERIAN: 0.2
        };

        let activeBureaus = Object.keys(bureaus);
        let totalWeight = activeBureaus.reduce((sum, bureau) => sum + weightage[bureau], 0);

        // Calculate weighted credit score
        activeBureaus.forEach(bureau => {
            finalCreditScore += bureaus[bureau] * (weightage[bureau] / totalWeight);
        });

        finalCreditScore = Math.round(finalCreditScore);

        // Determine loan approval
        if (finalCreditScore >= 750) {
            approvedLoan = requestedLoan;
            riskLevel = "Low Risk";
            riskColor = "green";
        } else if (finalCreditScore >= 600) {
            approvedLoan = Math.round(requestedLoan * 0.75);
            riskLevel = "Moderate Risk";
            riskColor = "yellow";
        } else if (finalCreditScore >= 450) {
            approvedLoan = Math.round(requestedLoan * 0.50);
            riskLevel = "High Risk";
            riskColor = "orange";
        } else {
            approvedLoan = Math.round(requestedLoan * 0.25);
            riskLevel = "Very High Risk";
            riskColor = "red";
        }
    }

    // Display results
    document.getElementById('experianScore').innerText = bureaus.EXPERIAN ?? "Server Down";
    document.getElementById('equifaxScore').innerText = bureaus.EQUIFAX ?? "Server Down";
    document.getElementById('transUnionScore').innerText = bureaus.CRIF ?? "Server Down";
    document.getElementById('creditScore').innerText = finalCreditScore;
    document.getElementById('approvedLoanAmount').innerText = approvedLoan;
    document.getElementById('riskFactor').innerText = riskLevel;
    
    // Set risk indicator color
    let riskIndicator = document.getElementById('riskIndicator');
    riskIndicator.style.backgroundColor = riskColor;

    // Show which servers are down
    if (downBureaus.length > 0) {
        document.getElementById('serverNotice').innerText = `⚠ The following bureaus are down: ${downBureaus.join(", ")}. Their scores are not included.`;
    } else {
        document.getElementById('serverNotice').innerText = "✅ All credit bureaus are active.";
    }

    document.getElementById('loanResult').classList.remove('hidden');
    document.getElementById('approveLoanCheckbox').classList.remove('hidden');
}

// Generate PDF report
function downloadCreditReport() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Loan Eligibility Report", 60, 15);

    const loanCustomerName = document.getElementById("loanCustomerName").value || "N/A";
    const loanCustomerAccount = document.getElementById("loanCustomerAccount").value || "N/A";
    const loanAmountRequest = document.getElementById("loanAmountRequest").value || "N/A";

    const experianScore = document.getElementById("experianScore").innerText;
    const equifaxScore = document.getElementById("equifaxScore").innerText;
    const transUnionScore = document.getElementById("transUnionScore").innerText;
    const creditScore = document.getElementById("creditScore").innerText;
    const approvedLoanAmount = document.getElementById("approvedLoanAmount").innerText;
    const riskFactor = document.getElementById("riskFactor").innerText;
    const serverNotice = document.getElementById("serverNotice").innerText || "All bureau servers are active.";

    // Define table data
    const tableData = [
        ["Customer Name", loanCustomerName],
        ["Account Number", loanCustomerAccount],
        ["Applied Loan (₹)", loanAmountRequest],
        ["Experian Score", experianScore],
        ["Equifax Score", equifaxScore],
        ["TransUnion Score", transUnionScore],
        ["Final Credit Score", creditScore],
        ["Approved Loan (₹)", approvedLoanAmount],
        ["Risk Factor", riskFactor]
    ];

    // Display warning if a credit bureau server is down
    if (serverNotice.includes("down")) {
        doc.setFontSize(12);
        doc.setTextColor(255, 0, 0); // Red color for warning
        doc.text(`⚠ ${serverNotice}`, 20, 30);
        doc.setTextColor(0, 0, 0); // Reset text color
    }

    // Generate a table with the data
    doc.autoTable({
        startY: serverNotice.includes("down") ? 40 : 30,
        head: [["Field", "Value"]],
        body: tableData,
        theme: "grid",
        styles: { fontSize: 12, cellPadding: 3 }
    });

    // Add Bank Manager Signature
    doc.text("_", 20, doc.autoTable.previous.finalY + 20);
    doc.text("Bank Manager Signature", 20, doc.autoTable.previous.finalY + 30);

    doc.save("Loan_Report.pdf");
}

// Handle login
function login() {
    const bankName = "Your Bank";
    const bankId = document.getElementById('login-bank-id').value;
    const bankEmail = document.getElementById('login-bank-email').value;

    if (bankId && bankEmail) {
        localStorage.setItem("bankName", bankName);
        localStorage.setItem("bankId", bankId);
        localStorage.setItem("bankEmail", bankEmail);
        navigate('dashboard');
    } else {
        alert("Please enter valid login details.");
    }
}

// Handle signup
function signup() {
    const bankName = document.getElementById('signup-bank-name').value;
    const bankEmail = document.getElementById('signup-bank-email').value;
    const passkey = document.getElementById('signup-bank-passkey').value;
    const confirmPasskey = document.getElementById('signup-confirm-passkey').value;

    if (!bankName || !bankEmail || !passkey || !confirmPasskey) {
        alert("Please fill in all fields.");
        return;
    }

    if (passkey !== confirmPasskey) {
        alert("Passkeys do not match!");
        return;
    }

    alert(`Signup Successful for ${bankName}!`);
    navigate('login');
}

// Toggle customer search form
function showCustomerSearch() {
    let form = document.getElementById('customerSearchForm');
    if (form.classList.contains('hidden')) {
        form.classList.remove('hidden');
    } else {
        form.classList.add('hidden');
    }
}

// Search customer
function searchCustomer() {
    const name = document.getElementById('customerName').value;
    const account = document.getElementById('customerAccount').value;
    const loanId = document.getElementById('loanId').value;
    const amount = document.getElementById('loanAmount').value;

    if (name && account && loanId && amount) {
        alert(`Searching for customer:\nName: ${name}\nAccount: ${account}\nLoan ID: ${loanId}\nLoan Amount: ${amount}`);
    } else {
        alert("Please enter all customer details.");
    }
}

// Connect to credit bureau
function connectBureau(name) {
    alert(`${name} connected successfully!`);
}