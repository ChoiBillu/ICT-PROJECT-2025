// Toggle Navigation
function toggleNav() {
    var nav = document.getElementById("mySidenav");
    nav.classList.toggle('open');
}

// Close Navigation when link is clicked
function closeNav() {
    var nav = document.getElementById("mySidenav");
    nav.classList.remove('open');
}

// Tracking Simulation
function trackShipment() {
    const id = document.getElementById('trackId').value;
    if(id) {
        alert(`TRACKING DETAILS FOR: ${id}\n\nStatus: In Transit\nLocation: Sukkur Bypass\nDriver: Ahmed Khan\nETA: 8 Hours`);
    } else {
        alert("Please enter a valid Tracking ID");
    }
}

// --- NEW SMART CALCULATOR LOGIC ---

// Helper: Show/Hide Inputs based on Service Selection
function updateFormInputs() {
    const service = document.getElementById('service-type').value;
    const distanceInput = document.getElementById('calc-distance').parentElement;
    const weightInput = document.getElementById('calc-weight').parentElement;
    const monthsInput = document.getElementById('calc-months').parentElement;

    // Default: Show Distance/Weight, Hide Months
    distanceInput.style.display = "block";
    weightInput.style.display = "block";
    monthsInput.style.display = "none";

    // If Warehousing is selected
    if (service.startsWith('warehouse')) {
        distanceInput.style.display = "none";
        weightInput.style.display = "none";
        monthsInput.style.display = "block";
    }
    // If Express City is selected (No distance needed usually, flat rate + weight)
    else if (service === 'express-city') {
        distanceInput.style.display = "none"; // optional: hide distance if flat rate
    }
}

function calculateCost() {
    // 1. Get Values
    const service = document.getElementById('service-type').value;
    
    // Use parseFloat to handle decimals, || 0 to handle empty inputs
    const distance = parseFloat(document.getElementById('calc-distance').value) || 0;
    const weight = parseFloat(document.getElementById('calc-weight').value) || 0;
    const months = parseFloat(document.getElementById('calc-months').value) || 0;

    // Check for negative numbers
    if (distance < 0 || weight < 0 || months < 0) {
        alert("Values cannot be negative!");
        return;
    }

    let baseCost = 0;

    // 2. Logic based on Service Type
    
    // --- HEAVY TRANSPORT LOGIC ---
    if (service === 'heavy') {
        if (distance === 0) { alert("Please enter distance"); return; }
        
        // Rates from heavy-transport.html
        let rate = 50; 
        
        if (weight > 40) {
            alert("For loads above 40 tons, please contact us for a custom quote.");
            return;
        } else if (weight > 25) {
            rate = 100;
        } else if (weight > 10) {
            rate = 75;
        } else {
            rate = 50;
        }
        
        baseCost = distance * rate;
    } 
    
    // --- EXPRESS DELIVERY LOGIC ---
    else if (service === 'express-city') {
        // From express-delivery.html: Rs. 500 flat rate (up to 5kg)
        baseCost = 500;
        if (weight > 5) {
            // Add slight extra for weight above 5kg
            baseCost += (weight - 5) * 50; 
        }
    } 
    else if (service === 'express-inter') {
        // From express-delivery.html: Starts at Rs. 1,200
        if (distance === 0) { alert("Please enter distance"); return; }
        baseCost = 1200 + (distance * 5); 
    }

    // --- WAREHOUSING LOGIC ---
    else if (service.startsWith('warehouse')) {
        if (months === 0) { alert("Please enter duration in months"); return; }
        
        // Rates from warehousing.html
        let monthlyRate = 0;
        if (service === 'warehouse-small') {
            monthlyRate = 2000;
        } else if (service === 'warehouse-med') {
            monthlyRate = 8000;
        } else if (service === 'warehouse-large') {
            monthlyRate = 25000;
        }
        
        baseCost = monthlyRate * months;
    }

    // 3. Calculate Tax (16%)
    let tax = baseCost * 0.16;
    let total = baseCost + tax;

    // 4. Update the Screen
    document.getElementById('res-base').innerText = "Rs. " + Math.round(baseCost).toLocaleString();
    document.getElementById('res-tax').innerText = "Rs. " + Math.round(tax).toLocaleString();
    
    const totalDisplay = document.getElementById('res-total');
    totalDisplay.style.opacity = 0;
    setTimeout(() => {
        totalDisplay.innerText = "Rs. " + Math.round(total).toLocaleString();
        totalDisplay.style.opacity = 1;
    }, 200);
}