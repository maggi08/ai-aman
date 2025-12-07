<template>
  <div class="bookings-page">
    <!-- Header with Title and Create Button -->
    <div class="page-header">
      <h1>Bookings</h1>
      <button @click="openCreateModal" class="btn btn-primary">
        + Create Booking
      </button>
    </div>

    <!-- Filters (Manager only) -->
    <div class="filters">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search by room name or user..."
        class="input-search"
      />
      <select v-if="isManager" v-model="filterRole" class="input-select">
        <option value="">All Bookings</option>
        <option value="own">My Bookings</option>
      </select>
    </div>

    <!-- Bookings List -->
    <div class="list-container">
      <div v-if="paginatedBookings.length === 0" class="empty-state">
        <p>📭 No bookings found</p>
      </div>

      <div v-else class="bookings-list">
        <div v-for="booking in paginatedBookings" :key="booking.id" class="booking-item">
          <div class="booking-info">
            <div class="booking-header">
              <h3>{{ booking.room?.name }}</h3>
              <span class="booking-id">ID: {{ booking.id.substring(0, 8) }}</span>
            </div>

            <div class="booking-details">
              <div class="detail">
                <span class="label">Start:</span>
                <span>{{ formatDateTime(booking.startTime) }}</span>
              </div>
              <div class="detail">
                <span class="label">End:</span>
                <span>{{ formatDateTime(booking.endTime) }}</span>
              </div>
              <div class="detail">
                <span class="label">Duration:</span>
                <span>{{ calculateDuration(booking.startTime, booking.endTime) }}</span>
              </div>
              <div v-if="isManager" class="detail">
                <span class="label">Booked by:</span>
                <span>{{ booking.userId }}</span>
              </div>
            </div>
          </div>

          <div class="booking-actions">
            <button
              @click="openEditModal(booking)"
              :disabled="!canEditBooking(booking)"
              class="btn btn-small btn-secondary"
              :title="!canEditBooking(booking) ? 'Cannot edit past bookings' : ''"
            >
              ✏️ Edit
            </button>
            <button
              @click="deleteBookingConfirm(booking)"
              :disabled="!canDeleteBooking(booking)"
              class="btn btn-small btn-danger"
              :title="!canDeleteBooking(booking) ? 'Cannot delete past bookings' : ''"
            >
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        @click="previousPage"
        :disabled="currentPage === 1"
        class="btn btn-small"
      >
        ← Previous
      </button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button
        @click="nextPage"
        :disabled="currentPage === totalPages"
        class="btn btn-small"
      >
        Next →
      </button>
    </div>

    <!-- Booking Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingBooking ? 'Edit Booking' : 'Create Booking' }}</h3>
          <button @click="closeModal" class="btn-close">×</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label for="room-select">Room *</label>
            <select v-model="formData.roomId" id="room-select" class="input">
              <option value="">Select a room</option>
              <option v-for="room in rooms" :key="room.id" :value="room.id">
                {{ room.name }} (Capacity: {{ room.capacity }})
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="start-time">Start Time *</label>
            <input
              v-model="formData.startTime"
              id="start-time"
              type="datetime-local"
              class="input"
            />
          </div>

          <div class="form-group">
            <label for="end-time">End Time *</label>
            <input
              v-model="formData.endTime"
              id="end-time"
              type="datetime-local"
              class="input"
            />
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>
          <div v-if="success" class="success-message">{{ success }}</div>
        </div>

        <div class="modal-actions">
          <button @click="saveBooking" class="btn btn-primary">
            {{ editingBooking ? 'Update' : 'Create' }}
          </button>
          <button @click="closeModal" class="btn btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  box-sizing: border-box;
}

.bookings-page {
  width: 100%;
}

/* Page Header */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0;
  color: #333;
  font-size: 32px;
}

/* Filters */
.filters {
  display: flex;
  gap: 15px;
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.input-search,
.input-select {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
}

.input-search {
  flex: 1;
  max-width: 400px;
}

.input-select {
  min-width: 150px;
}

.input-search:focus,
.input-select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

/* List Container */
.list-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 30px;
  min-height: 300px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #999;
  font-size: 16px;
}

/* Bookings List */
.bookings-list {
  display: flex;
  flex-direction: column;
}

.booking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  gap: 20px;
}

.booking-item:last-child {
  border-bottom: none;
}

.booking-item:hover {
  background: #f9f9f9;
}

.booking-info {
  flex: 1;
  min-width: 0;
}

.booking-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
}

.booking-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.booking-id {
  color: #999;
  font-size: 12px;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.booking-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.detail {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.detail .label {
  font-size: 12px;
  color: #999;
  font-weight: 600;
  text-transform: uppercase;
}

.detail span:not(.label) {
  color: #333;
  font-size: 14px;
}

/* Actions */
.booking-actions {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

/* Buttons */
.btn {
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.2s;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover:not(:disabled) {
  background: #d0d0d0;
}

.btn-danger {
  background: #ff6b6b;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background: #ee5a52;
}

.btn-small {
  padding: 8px 12px;
  font-size: 12px;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-bottom: 20px;
}

.page-info {
  color: #666;
  font-weight: 500;
  min-width: 150px;
  text-align: center;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  width: 90%;
  max-width: 500px;
  overflow: hidden;
}

.modal-header {
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  margin: 0;
}

.btn-close {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}

.modal-body {
  padding: 25px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  box-sizing: border-box;
}

.input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.error-message {
  color: #d32f2f;
  background: #ffebee;
  padding: 12px;
  border-radius: 6px;
  margin-top: 10px;
  border-left: 4px solid #d32f2f;
}

.success-message {
  color: #2e7d32;
  background: #e8f5e9;
  padding: 12px;
  border-radius: 6px;
  margin-top: 10px;
  border-left: 4px solid #2e7d32;
}

.modal-actions {
  display: flex;
  gap: 12px;
  padding: 20px;
  background: #f9f9f9;
  border-top: 1px solid #e0e0e0;
}

.modal-actions .btn {
  flex: 1;
}

/* Responsive */
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .page-header button {
    width: 100%;
  }

  .filters {
    flex-direction: column;
  }

  .input-search {
    max-width: 100%;
  }

  .input-select {
    width: 100%;
  }

  .booking-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .booking-details {
    grid-template-columns: 1fr;
  }

  .booking-actions {
    width: 100%;
  }

  .booking-actions .btn {
    flex: 1;
  }
}
</style>

<script setup>
const { user, isManager, isEmployee } = useAuth();
const { bookings: bookingsData, createBooking: createBookingAPI, deleteBooking: deleteBookingAPI, getBookings, subscribeToBookings } = useBookings();
const { rooms: roomsData, getRooms } = useRooms();
const router = useRouter();

// Check authentication
watch(user, (newUser) => {
  if (!newUser) {
    router.push('/login');
  }
}, { immediate: true });

// Data
const showModal = ref(false);
const editingBooking = ref(null);
const currentPage = ref(1);
const itemsPerPage = 10;
const searchQuery = ref('');
const filterRole = ref('');

const formData = ref({
  roomId: '',
  startTime: '',
  endTime: '',
});

const error = ref('');
const success = ref('');

// Computed
const bookings = computed(() => bookingsData.value);
const rooms = computed(() => roomsData.value);

const filteredBookings = computed(() => {
  let filtered = bookings.value || [];

  // Ensure filtered is always an array
  if (!Array.isArray(filtered)) {
    filtered = [];
  }

  // Employees only see their own bookings
  if (isEmployee.value) {
    filtered = filtered.filter(b => b.userId === user.value?.id);
  } else if (filterRole.value === 'own') {
    // Managers can filter to see only their own
    filtered = filtered.filter(b => b.userId === user.value?.id);
  }

  // Filter by search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(b =>
      b.room?.name.toLowerCase().includes(query) ||
      b.userId.toLowerCase().includes(query)
    );
  }

  return filtered;
});

const totalPages = computed(() =>
  Math.ceil(filteredBookings.value.length / itemsPerPage)
);

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredBookings.value.slice(start, end);
});

// Methods
onMounted(async () => {
  try {
    await getRooms();
    await getBookings();
    subscribeToBookings();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
});

function openCreateModal() {
  editingBooking.value = null;
  formData.value = {
    roomId: '',
    startTime: '',
    endTime: '',
  };
  error.value = '';
  success.value = '';
  showModal.value = true;
}

function openEditModal(booking) {
  editingBooking.value = booking;
  formData.value = {
    roomId: booking.roomId,
    startTime: booking.startTime,
    endTime: booking.endTime,
  };
  error.value = '';
  success.value = '';
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingBooking.value = null;
  formData.value = {
    roomId: '',
    startTime: '',
    endTime: '',
  };
}

async function saveBooking() {
  error.value = '';
  success.value = '';

  if (!formData.value.roomId || !formData.value.startTime || !formData.value.endTime) {
    error.value = 'Please fill in all fields';
    return;
  }

  const startTime = new Date(formData.value.startTime);
  const endTime = new Date(formData.value.endTime);

  if (startTime >= endTime) {
    error.value = 'End time must be after start time';
    return;
  }

  try {
    if (editingBooking.value) {
      // Note: Edit functionality would need to be added to the API
      error.value = 'Edit functionality not yet implemented';
      return;
    } else {
      await createBookingAPI(formData.value.roomId, startTime, endTime);
      success.value = 'Booking created successfully!';
      setTimeout(() => closeModal(), 1500);
    }
  } catch (err) {
    error.value = err.message || 'Failed to save booking';
  }
}

function canEditBooking(booking) {
  const now = new Date();
  const bookingStart = new Date(booking.startTime);
  return isManager.value || (booking.userId === user.value?.id && bookingStart > now);
}

function canDeleteBooking(booking) {
  const now = new Date();
  const bookingStart = new Date(booking.startTime);
  if (isEmployee.value && booking.userId !== user.value?.id) return false;
  if (isEmployee.value && bookingStart < now) return false;
  return true;
}

async function deleteBookingConfirm(booking) {
  const room = rooms.value.find(r => r.id === booking.roomId);
  const roomName = room?.name || 'Room';

  if (confirm(`Delete booking for ${roomName}?`)) {
    try {
      await deleteBookingAPI(booking.id);
      success.value = 'Booking deleted successfully!';
    } catch (err) {
      error.value = err.message || 'Failed to delete booking';
    }
  }
}

function calculateDuration(startTime, endTime) {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const minutes = Math.round((end - start) / (1000 * 60));
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
}

function formatDateTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
}
</script>
