<template>
  <header class="app-header">
    <div class="header-content">
      <!-- Logo/Brand -->
      <div class="logo-section">
        <h1 class="logo">Meeting Room Booking</h1>
      </div>

      <!-- Navigation Menu -->
      <nav class="nav-menu">
        <NuxtLink
          to="/bookings"
          class="nav-link"
          :class="{active: route.path === '/bookings'}"
        >
          📅 Bookings
        </NuxtLink>
        <NuxtLink to="/rooms" class="nav-link" :class="{active: route.path === '/rooms'}">
          🏢 Rooms
        </NuxtLink>
      </nav>

      <!-- User Menu -->
      <div class="user-menu">
        <button @click="toggleDropdown" class="user-button">
          <span class="user-email">{{ user?.email }}</span>
          <span class="user-role-badge" :class="userRole">{{ userRole }}</span>
          <span class="dropdown-arrow">▼</span>
        </button>

        <!-- Dropdown Menu -->
        <div v-if="showDropdown" class="dropdown-menu" @click.stop>
          <div class="dropdown-item user-info">
            <div class="email">{{ user?.email }}</div>
            <div v-if="userRole" class="role">
              {{ userRole.charAt(0).toUpperCase() + userRole.slice(1) }}
            </div>
          </div>
          <div class="dropdown-divider"></div>
          <button @click="handleLogout" class="dropdown-item logout-btn">
            🚪 Logout
          </button>
        </div>
      </div>
    </div>

    <!-- Dropdown Overlay (close on outside click) -->
    <div v-if="showDropdown" class="dropdown-overlay" @click="showDropdown = false"></div>
  </header>
</template>

<style scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  gap: 40px;
}

.logo-section {
  flex-shrink: 0;
}

.logo {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  gap: 30px;
  flex: 1;
  margin: 0 20px;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 6px;
  transition: all 0.2s;
  position: relative;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.15);
}

.nav-link.active {
  background: rgba(255, 255, 255, 0.25);
  border-bottom: 3px solid white;
}

/* User Menu */
.user-menu {
  position: relative;
  flex-shrink: 0;
}

.user-button {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.user-button:hover {
  background: rgba(255, 255, 255, 0.25);
}

.user-email {
  max-width: 150px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.user-role-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(255, 255, 255, 0.3);
}

.user-role-badge.manager {
  background: rgba(255, 107, 107, 0.8);
}

.user-role-badge.employee {
  background: rgba(78, 205, 196, 0.8);
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.2s;
}

.user-button[aria-expanded='true'] .dropdown-arrow {
  transform: rotate(180deg);
}

/* Dropdown Menu */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  min-width: 200px;
  z-index: 1000;
  overflow: hidden;
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  padding: 12px 16px;
  cursor: pointer;
  color: #333;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  font-size: 14px;
  transition: background 0.2s;
}

.dropdown-item:hover {
  background: #f5f5f5;
}

.user-info {
  cursor: default;
  padding: 12px 16px;
}

.user-info .email {
  font-weight: 600;
  color: #333;
  word-break: break-all;
}

.user-info .role {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}

.dropdown-divider {
  height: 1px;
  background: #e0e0e0;
  margin: 8px 0;
}

.logout-btn {
  color: #d32f2f;
  font-weight: 500;
}

.logout-btn:hover {
  background: #ffebee;
}

.dropdown-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    gap: 20px;
    padding: 0 12px;
    height: 60px;
  }

  .logo {
    font-size: 18px;
  }

  .nav-menu {
    gap: 15px;
    margin: 0 10px;
  }

  .nav-link {
    font-size: 14px;
    padding: 6px 12px;
  }

  .user-email {
    max-width: 80px;
  }

  .dropdown-menu {
    min-width: 180px;
  }
}
</style>

<script setup>
import {onClickOutside} from '@vueuse/core'
const {user, userRole, logout} = useAuth()
const route = useRoute()
const showDropdown = ref(false)

function toggleDropdown() {
  showDropdown.value = !showDropdown.value
}

async function handleLogout() {
  showDropdown.value = false
  await logout()
}

// Close dropdown when clicking outside
const closeDropdown = () => {
  showDropdown.value = false
}

onMounted(() => {
  onClickOutside(ref(document.querySelector('.user-menu')), closeDropdown)
})
</script>
