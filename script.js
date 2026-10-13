let parkingData = [];
let totalCollection = 0;
let slots = 10;
function createSlots() {
    let slotContainer = document.getElementById("slotContainer");
    let parkingSlot = document.getElementById("parkingSlot");
    slotContainer.innerHTML = "";
    parkingSlot.innerHTML = '<option value="">Select Parking Slot</option>';
    for (let i = 1; i <= slots; i++) {
        let car = parkingData.find(function(item) {
            return item.slot == i && item.status == "Parked";
        });
        let slotBox = document.createElement("div");
        slotBox.className = "slot";
        if (car) {
            slotBox.classList.add("occupied");
            slotBox.innerHTML = `
                <h3>Slot ${i}</h3>
                <p>🚗 ${car.vehicle}</p>
            `;
        } else {
            slotBox.innerHTML = `
                <h3>Slot ${i}</h3>
                <p>Available</p>
            `;
            parkingSlot.innerHTML += `
                <option value="${i}">Slot ${i}</option>
            `;
        }
        slotContainer.appendChild(slotBox);
    }
}
function parkVehicle() {
    let vehicle = document.getElementById("vehicleNumber").value;
    let type = document.getElementById("vehicleType").value;
    let slot = document.getElementById("parkingSlot").value;
    if (vehicle == "" || type == "" || slot == "") {
        alert("Please fill all details");
        return;
    }
    let alreadyParked = parkingData.find(function(item) {
        return item.vehicle == vehicle && item.status == "Parked";
    });
    if (alreadyParked) {
        alert("This vehicle is already parked");
        return;
    }
    let selectedSlot = parkingData.find(function(item) {
        return item.slot == slot && item.status == "Parked";
    });
    if (selectedSlot) {
        alert("This slot is already occupied");
        return;
    }
    let entryTime = new Date();
    let ticketId = "PK" + Math.floor(1000 + Math.random() * 9000);
    let car = {
        vehicle: vehicle,
        type: type,
        slot: slot,
        entryTime: entryTime,
        ticketId: ticketId,
        status: "Parked",
        fee: 0,
        duration: 0
    };
    parkingData.push(car);
    document.getElementById("billId").innerText = ticketId;
    document.getElementById("billVehicle").innerText = vehicle;
    document.getElementById("billType").innerText = type;
    document.getElementById("billSlot").innerText = "Slot " + slot;
    document.getElementById("billEntryTime").innerText = entryTime.toLocaleString();
    if (type == "4 Wheeler") {
        document.getElementById("billRate").innerText = "2 hrs ₹50 | 5 hrs ₹80 | Above 5 hrs ₹120";
    } else {
        document.getElementById("billRate").innerText = "2 hrs ₹25 | 5 hrs ₹40 | Above 5 hrs ₹60";
    }
    document.getElementById("parkingBill").style.display = "block";
    document.getElementById("vehicleNumber").value = "";
    document.getElementById("vehicleType").value = "";
    document.getElementById("parkingSlot").value = "";
    updateDashboard();
    alert("Vehicle parked successfully!");
}
function calculateFee(type, hours) {
    if (type == "4 Wheeler") {
        if (hours <= 2) {
            return 50;
        } else if (hours <= 5) {
            return 80;
        } else {
            return 120;
        }
    } else {
        if (hours <= 2) {
            return 25;
        } else if (hours <= 5) {
            return 40;
        } else {
            return 60;
        }
    }
}
function exitVehicle(index) {
    let car = parkingData[index];
    let exitTime = new Date();
    let difference = exitTime - car.entryTime;
    let hours = difference / (1000 * 60 * 60);
    let displayHours = Math.floor(hours);
    let displayMinutes = Math.floor((hours - displayHours) * 60);
    if (displayHours == 0 && displayMinutes == 0) {
        displayMinutes = 1;
    }
    let feeHours = hours;
    if (feeHours < 1) {
        feeHours = 1;
    }
    let fee = calculateFee(car.type, feeHours);
    car.status = "Exited";
    car.exitTime = exitTime;
    car.fee = fee;
    car.duration = displayHours + " hrs " + displayMinutes + " mins";
    totalCollection = totalCollection + fee;
    document.getElementById("exitId").innerText = car.ticketId;
    document.getElementById("exitVehicle").innerText = car.vehicle;
    document.getElementById("exitType").innerText = car.type;
    document.getElementById("exitSlot").innerText = "Slot " + car.slot;
    document.getElementById("exitEntry").innerText = car.entryTime.toLocaleString();
    document.getElementById("exitTime").innerText = exitTime.toLocaleString();
    document.getElementById("exitDuration").innerText = car.duration;
    if (car.type == "4 Wheeler") {
        document.getElementById("exitRate").innerText = "₹50 / ₹80 / ₹120";
    } else {
        document.getElementById("exitRate").innerText = "₹25 / ₹40 / ₹60";
    }
    document.getElementById("exitAmount").innerText = fee;
    document.getElementById("exitBill").style.display = "flex";
    updateDashboard();
}
function displayHistory() {
    let table = document.getElementById("historyTable");
    table.innerHTML = "";
    parkingData.forEach(function(car, index) {
        let action = "";
        if (car.status == "Parked") {
            action = `
                <button class="exit-btn" onclick="exitVehicle(${index})">
                    Vehicle Exit
                </button>
            `;
        } else {
            action = "Completed";
        }
        let duration = car.duration == 0 ? "-" : car.duration;
        let fee = car.fee == 0 ? "-" : "₹" + car.fee;
        table.innerHTML += `
            <tr>
                <td>${car.vehicle}</td>
                <td>${car.type}</td>
                <td>Slot ${car.slot}</td>
                <td>${car.entryTime.toLocaleTimeString()}</td>
                <td>${duration}</td>
                <td>${fee}</td>
                <td class="status">${car.status}</td>
                <td>${action}</td>
            </tr>
        `;
    });
}
function updateDashboard() {
    let occupied = parkingData.filter(function(item) {
        return item.status == "Parked";
    }).length;
    let available = slots - occupied;
    document.getElementById("totalSlots").innerText = slots;
    document.getElementById("availableSlots").innerText = available;
    document.getElementById("occupiedSlots").innerText = occupied;
    document.getElementById("collection").innerText = totalCollection;
    createSlots();
    displayHistory();
}
function showSection(sectionName) {
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("parking").style.display = "none";
    document.getElementById("history").style.display = "none";
    if (sectionName == "dashboard") {
        document.getElementById("dashboard").style.display = "block";
    }
    if (sectionName == "parking") {
        document.getElementById("parking").style.display = "block";
    }
    if (sectionName == "history") {
        document.getElementById("history").style.display = "block";
    }
}
function printBill() {
    window.print();
}
function closeBill() {
    document.getElementById("exitBill").style.display = "none";
}
createSlots();
updateDashboard();