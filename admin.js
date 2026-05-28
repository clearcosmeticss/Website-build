// Admin Panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
    generateTimeSlots();
    generateWeeklyAvailability();
    loadBookings();
    updateDashboardStats();
});

// Initialize admin panel
function initializeAdmin() {
    // Tab switching
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
        });
    });

    // Set today's date in availability date picker
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('availability-date').value = today;

    // Add event listeners
    document.getElementById('availability-date').addEventListener('change', generateTimeSlots);
    document.getElementById('clinic-availability-select').addEventListener('change', function() {
        generateTimeSlots();
        generateWeeklyAvailability();
    });

    document.getElementById('booking-filter').addEventListener('change', loadBookings);
}

// Show specific admin section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.admin-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show selected section
    document.getElementById(sectionName).classList.add('active');

    // Update active tab
    document.querySelectorAll('.admin-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
}

// Generate time slots for availability management
function generateTimeSlots() {
    const container = document.getElementById('time-slot-manager');
    const selectedDate = document.getElementById('availability-date').value;
    const selectedClinic = document.getElementById('clinic-availability-select').value;

    container.innerHTML = '';

    // Generate slots from 9 AM to 5 PM
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;

            const slotBtn = document.createElement('button');
            slotBtn.className = 'time-slot-btn';
            slotBtn.textContent = timeStr;
            slotBtn.dataset.time = timeStr;

            // Check if this slot is currently available (mock data)
            if (isSlotAvailable(selectedDate, timeStr, selectedClinic)) {
                slotBtn.classList.add('enabled');
            }

            slotBtn.addEventListener('click', function() {
                this.classList.toggle('enabled');
            });

            container.appendChild(slotBtn);
        }
    }
}

// Check if a time slot is available (mock function)
function isSlotAvailable(date, time, clinic) {
    // Mock availability data - in real app this would come from database
    const mockAvailability = {
        dublin: {
            '2024-10-17': ['09:00', '09:30', '10:00', '14:00', '14:30', '15:00'],
            '2024-10-18': ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00']
        },
        marbella: {
            '2024-10-17': ['10:00', '10:30', '11:00', '15:00', '15:30', '16:00'],
            '2024-10-18': ['10:00', '11:00', '12:00', '14:00', '15:00', '16:00', '17:00']
        }
    };

    return mockAvailability[clinic] &&
           mockAvailability[clinic][date] &&
           mockAvailability[clinic][date].includes(time);
}

// Generate weekly availability overview
function generateWeeklyAvailability() {
    const container = document.getElementById('weekly-availability');
    const selectedClinic = document.getElementById('clinic-availability-select').value;

    container.innerHTML = '';

    const today = new Date();
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        const dayElement = document.createElement('div');
        dayElement.className = 'availability-day';

        const dayStr = weekDays[date.getDay()];
        const dateStr = date.getDate();

        // Mock availability status
        const availableSlots = Math.floor(Math.random() * 16); // 0-15 slots
        let status = 'unavailable';

        if (availableSlots > 10) {
            status = 'available';
        } else if (availableSlots > 5) {
            status = 'partial';
        }

        if (availableSlots > 0) {
            dayElement.classList.add(status);
        }

        dayElement.innerHTML = `
            <div><strong>${dayStr}</strong></div>
            <div>${dateStr}</div>
            <div><small>${availableSlots} slots</small></div>
        `;

        dayElement.addEventListener('click', function() {
            const clickedDate = date.toISOString().split('T')[0];
            document.getElementById('availability-date').value = clickedDate;
            generateTimeSlots();
        });

        container.appendChild(dayElement);
    }
}

// Save availability changes
function saveAvailability() {
    const selectedDate = document.getElementById('availability-date').value;
    const selectedClinic = document.getElementById('clinic-availability-select').value;
    const enabledSlots = Array.from(document.querySelectorAll('.time-slot-btn.enabled'))
                             .map(btn => btn.dataset.time);

    console.log('Saving availability:', {
        date: selectedDate,
        clinic: selectedClinic,
        slots: enabledSlots
    });

    // In real app, this would send data to backend
    alert(`Availability saved for ${selectedClinic} clinic on ${selectedDate}`);

    // Refresh weekly overview
    generateWeeklyAvailability();
}

// Load bookings based on filter
function loadBookings() {
    const filter = document.getElementById('booking-filter').value;
    const container = document.getElementById('bookings-list');

    // Mock booking data
    const mockBookings = [
        {
            id: 1,
            name: 'Sarah Johnson',
            email: 'sarah@email.com',
            phone: '+353 1 234 5678',
            treatment: 'Anti-Wrinkle Treatment',
            clinic: 'Dublin',
            date: '2024-10-17',
            time: '14:30',
            status: 'confirmed',
            amount: '€250'
        },
        {
            id: 2,
            name: 'Mike O\'Connor',
            email: 'mike@email.com',
            phone: '+353 1 234 5679',
            treatment: 'Consultation',
            clinic: 'Dublin',
            date: '2024-10-17',
            time: '16:00',
            status: 'pending',
            amount: '€0'
        },
        {
            id: 3,
            name: 'Emma Walsh',
            email: 'emma@email.com',
            phone: '+34 123 456 789',
            treatment: 'Dermal Fillers',
            clinic: 'Marbella',
            date: '2024-10-18',
            time: '10:00',
            status: 'confirmed',
            amount: '€450'
        },
        {
            id: 4,
            name: 'John Smith',
            email: 'john@email.com',
            phone: '+353 1 234 5680',
            treatment: 'Skin Boosters',
            clinic: 'Dublin',
            date: '2024-10-19',
            time: '11:30',
            status: 'cancelled',
            amount: '€350'
        }
    ];

    // Filter bookings based on selection
    let filteredBookings = mockBookings;
    const today = new Date().toISOString().split('T')[0];

    switch (filter) {
        case 'today':
            filteredBookings = mockBookings.filter(booking => booking.date === today);
            break;
        case 'week':
            const weekFromNow = new Date();
            weekFromNow.setDate(weekFromNow.getDate() + 7);
            filteredBookings = mockBookings.filter(booking =>
                new Date(booking.date) <= weekFromNow
            );
            break;
        case 'pending':
            filteredBookings = mockBookings.filter(booking => booking.status === 'pending');
            break;
    }

    // Render bookings
    container.innerHTML = filteredBookings.map(booking => `
        <div class="booking-item">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <h4>${booking.name}</h4>
                    <p><strong>${booking.treatment}</strong> - ${booking.clinic} Clinic</p>
                    <p>📅 ${formatDate(booking.date)} at ${booking.time}</p>
                    <p>📧 ${booking.email} | 📱 ${booking.phone}</p>
                    <p><strong>Amount:</strong> ${booking.amount}</p>
                </div>
                <div style="text-align: right;">
                    <span class="booking-status ${booking.status}">${capitalizeFirst(booking.status)}</span>
                    <div style="margin-top: 1rem;">
                        <button class="btn btn-secondary" onclick="editBooking(${booking.id})">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn" style="color: #dc3545; margin-left: 0.5rem;" onclick="cancelBooking(${booking.id})">
                            <i class="fas fa-times"></i> Cancel
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Update dashboard statistics
function updateDashboardStats() {
    // Mock data - in real app this would come from backend
    document.getElementById('today-bookings').textContent = '12';
    document.getElementById('week-bookings').textContent = '84';
    document.getElementById('month-revenue').textContent = '€18,450';
    document.getElementById('pending-bookings').textContent = '5';
}

// Utility functions
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    });
}

function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Booking management functions
function editBooking(bookingId) {
    console.log('Editing booking:', bookingId);
    alert(`Edit booking #${bookingId} functionality would open a modal/form here`);
}

function cancelBooking(bookingId) {
    if (confirm('Are you sure you want to cancel this booking?')) {
        console.log('Cancelling booking:', bookingId);
        alert(`Booking #${bookingId} has been cancelled`);
        loadBookings(); // Refresh the list
    }
}

function exportBookings() {
    console.log('Exporting bookings...');

    // Mock CSV export
    const csvContent = `Name,Email,Treatment,Clinic,Date,Time,Status,Amount
Sarah Johnson,sarah@email.com,Anti-Wrinkle Treatment,Dublin,2024-10-17,14:30,confirmed,€250
Mike O'Connor,mike@email.com,Consultation,Dublin,2024-10-17,16:00,pending,€0
Emma Walsh,emma@email.com,Dermal Fillers,Marbella,2024-10-18,10:00,confirmed,€450`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bookings_export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
}

// Practitioner management functions
function addPractitioner() {
    const name = prompt('Enter practitioner name:');
    const specialization = prompt('Enter specialization:');
    const clinic = prompt('Enter clinic (Dublin/Marbella):');

    if (name && specialization && clinic) {
        console.log('Adding practitioner:', { name, specialization, clinic });
        alert(`Practitioner ${name} added successfully`);
        // In real app, would refresh the practitioner list
    }
}

function editPractitioner(practitionerId) {
    console.log('Editing practitioner:', practitionerId);
    alert(`Edit practitioner #${practitionerId} functionality would open a modal/form here`);
}

function deletePractitioner(practitionerId) {
    if (confirm('Are you sure you want to delete this practitioner?')) {
        console.log('Deleting practitioner:', practitionerId);
        alert(`Practitioner #${practitionerId} has been deleted`);
        // In real app, would refresh the practitioner list
    }
}

// Make functions globally accessible
window.showSection = showSection;
window.saveAvailability = saveAvailability;
window.editBooking = editBooking;
window.cancelBooking = cancelBooking;
window.exportBookings = exportBookings;
window.addPractitioner = addPractitioner;
window.editPractitioner = editPractitioner;
window.deletePractitioner = deletePractitioner;