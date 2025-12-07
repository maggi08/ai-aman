<template>
  <div class="rooms-page">
    <!-- Manager Only Access -->
    <div v-if="!isManager" class="access-denied">
      <div class="denied-card">
        <h2>Access Denied</h2>
        <p>Room management is only available for managers.</p>
        <NuxtLink to="/bookings" class="btn btn-primary">
          ← Back to Bookings
        </NuxtLink>
      </div>
    </div>

    <!-- Manager Content -->
    <div v-else class="rooms-container">
      <!-- Header with Title and Create Button -->
      <div class="page-header">
        <h1>Rooms</h1>
        <button @click="openCreateModal" class="btn btn-primary">
          + Create Room
        </button>
      </div>

      <!-- Search/Filter -->
      <div class="filters">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by room name..."
          class="input-search"
        />
      </div>

      <!-- Rooms List -->
      <div class="list-container">
        <div v-if="paginatedRooms.length === 0" class="empty-state">
          <p>📭 No rooms found</p>
        </div>

        <div v-else class="rooms-list">
          <div v-for="room in paginatedRooms" :key="room.id" class="room-item">
            <div class="room-info">
              <div class="room-header">
                <h3>{{ room.name }}</h3>
                <span class="room-id">ID: {{ room.id?.substring(0, 8) || 'N/A' }}</span>
              </div>

              <div class="room-details">
                <div class="detail">
                  <span class="label">Capacity:</span>
                  <span>👥 {{ room.capacity }} people</span>
                </div>
                <div class="detail">
                  <span class="label">Created:</span>
                  <span>{{ formatDate(room.createdAt) }}</span>
                </div>
                <div class="detail">
                  <span class="label">Active Bookings:</span>
                  <span class="badge-count">{{ getActiveBookings(room.id) }}</span>
                </div>
              </div>
            </div>

            <div class="room-actions">
              <button
                @click="openEditModal(room)"
                class="btn btn-small btn-secondary"
              >
                ✏️ Edit
              </button>
              <button
                @click="deleteRoomConfirm(room)"
                class="btn btn-small btn-danger"
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
    </div>

    <!-- Room Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingRoom ? 'Edit Room' : 'Create Room' }}</h3>
          <button @click="closeModal" class="btn-close">×</button>
        </div>

        <div class="modal-body">
          <div class="form-group">
            <label for="room-name">Room Name *</label>
            <input
              v-model="formData.name"
              id="room-name"
              type="text"
              placeholder="e.g., Conference Room A"
              class="input"
            />
          </div>

          <div class="form-group">
            <label for="capacity">Capacity *</label>
            <input
              v-model.number="formData.capacity"
              id="capacity"
              type="number"
              placeholder="e.g., 10"
              min="1"
              class="input"
            />
          </div>

          <div v-if="error" class="error-message">{{ error }}</div>
          <div v-if="success" class="success-message">{{ success }}</div>
        </div>

        <div class="modal-actions">
          <button @click="saveRoom" class="btn btn-primary">
            {{ editingRoom ? 'Update' : 'Create' }}
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

.rooms-page {
  width: 100%;
}

/* Access Denied */
.access-denied {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.denied-card {
  background: white;
  padding: 60px 40px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  max-width: 400px;
}

.denied-card h2 {
  color: #d32f2f;
  margin: 0 0 15px 0;
  font-size: 24px;
}

.denied-card p {
  color: #666;
  margin: 0 0 30px 0;
  font-size: 16px;
}

/* Rooms Container */
.rooms-container {
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

.input-search {
  padding: 10px 15px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  flex: 1;
  max-width: 400px;
}

.input-search:focus {
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

/* Rooms List */
.rooms-list {
  display: flex;
  flex-direction: column;
}

.room-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
  gap: 20px;
}

.room-item:last-child {
  border-bottom: none;
}

.room-item:hover {
  background: #f9f9f9;
}

.room-info {
  flex: 1;
  min-width: 0;
}

.room-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 12px;
}

.room-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
}

.room-id {
  color: #999;
  font-size: 12px;
  background: #f5f5f5;
  padding: 4px 8px;
  border-radius: 4px;
}

.room-details {
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

.badge-count {
  background: #667eea;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-weight: 600;
  display: inline-block;
  font-size: 13px;
}

/* Actions */
.room-actions {
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

  .room-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .room-details {
    grid-template-columns: 1fr;
  }

  .room-actions {
    width: 100%;
  }

  .room-actions .btn {
    flex: 1;
  }

  .denied-card {
    padding: 40px 20px;
  }
}
</style>

<script setup>
const { isManager } = useAuth();
const { rooms: roomsData, getRooms, createRoom: createRoomAPI, deleteRoom: deleteRoomAPI } = useRooms();
const { bookings: bookingsData, getBookings } = useBookings();

const showModal = ref(false);
const editingRoom = ref(null);
const currentPage = ref(1);
const itemsPerPage = 10;
const searchQuery = ref('');

const formData = ref({
  name: '',
  capacity: null,
});

const error = ref('');
const success = ref('');

// Computed
const rooms = computed(() => roomsData.value || []);
const bookings = computed(() => bookingsData.value || []);

const filteredRooms = computed(() => {
  let filtered = rooms.value || [];

  // Ensure filtered is always an array
  if (!Array.isArray(filtered)) {
    filtered = [];
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(r => r.name.toLowerCase().includes(query));
  }

  return filtered;
});

const totalPages = computed(() =>
  Math.ceil(filteredRooms.value.length / itemsPerPage)
);

const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredRooms.value.slice(start, end);
});

// Methods
onMounted(async () => {
  try {
    await getRooms();
    await getBookings();
  } catch (error) {
    console.error('Failed to load data:', error);
  }
});

function openCreateModal() {
  editingRoom.value = null;
  formData.value = {
    name: '',
    capacity: null,
  };
  error.value = '';
  success.value = '';
  showModal.value = true;
}

function openEditModal(room) {
  editingRoom.value = room;
  formData.value = {
    name: room.name,
    capacity: room.capacity,
  };
  error.value = '';
  success.value = '';
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
  editingRoom.value = null;
  formData.value = {
    name: '',
    capacity: null,
  };
}

async function saveRoom() {
  error.value = '';
  success.value = '';

  if (!formData.value.name || !formData.value.capacity) {
    error.value = 'Please fill in all fields';
    return;
  }

  if (formData.value.capacity <= 0) {
    error.value = 'Capacity must be greater than 0';
    return;
  }

  try {
    if (editingRoom.value) {
      // Update room - note: update API might not be implemented yet
      error.value = 'Edit functionality not yet implemented';
      return;
    } else {
      await createRoomAPI(formData.value.name, formData.value.capacity);
      success.value = 'Room created successfully!';
      setTimeout(() => closeModal(), 1500);
    }
  } catch (err) {
    error.value = err.message || 'Failed to save room';
  }
}

function getActiveBookings(roomId) {
  const now = new Date();
  const bookingsList = Array.isArray(bookings.value) ? bookings.value : [];
  return bookingsList.filter(b => {
    return b.roomId === roomId && new Date(b.endTime) > now;
  }).length;
}

async function deleteRoomConfirm(room) {
  if (confirm(`Delete room "${room.name}"? All bookings will be cancelled.`)) {
    try {
      await deleteRoomAPI(room.id);
      success.value = 'Room deleted successfully!';
    } catch (err) {
      error.value = err.message || 'Failed to delete room';
    }
  }
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
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
