<template>
    <div class="register-container">
        <div class="register-card">
            <h1 class="title">Create Account</h1>

            <form @submit.prevent="handleSignUp" class="form">
                <input
                    v-model="email"
                    type="email"
                    placeholder="Email"
                    class="input"
                    required
                />
                <input
                    v-model="password"
                    type="password"
                    placeholder="Password"
                    class="input"
                    required
                />
                <input
                    v-model="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    class="input"
                    required
                />

                <select v-model="role" class="input">
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                </select>

                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </div>

                <button type="submit" class="btn" :disabled="isLoading">
                    {{ isLoading ? 'Creating Account...' : 'Register' }}
                </button>
            </form>

            <p class="login-link">
                Already have an account?
                <router-link to="/login">Login</router-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
.register-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f3f4f6;
    padding: 20px;
}

.register-card {
    background: white;
    padding: 32px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 380px;
    text-align: center;
}

.title {
    font-size: 26px;
    margin-bottom: 20px;
    font-weight: 600;
    color: #111827;
}

.form {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.input {
    padding: 12px 14px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 15px;
    transition: 0.2s;
}

.input:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.btn {
    padding: 12px;
    background: #6366f1;
    color: white;
    font-size: 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: 0.2s;
}

.btn:hover {
    background: #4f46e5;
}

.btn:active {
    transform: scale(0.97);
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.error-message {
    color: #ef4444;
    font-size: 14px;
    padding: 10px;
    background: #fee2e2;
    border-radius: 8px;
    margin-bottom: 10px;
}

.login-link {
    margin-top: 16px;
    font-size: 14px;
    color: #666;
}

.login-link a {
    color: #6366f1;
    text-decoration: none;
    font-weight: 600;
}

.login-link a:hover {
    text-decoration: underline;
}
</style>

<script setup>
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const role = ref('employee')
const errorMessage = ref('')
const isLoading = ref(false)

const { register, user } = useAuth()
const router = useRouter()

// Redirect if already logged in
watch(
    user,
    (newUser) => {
        if (newUser) {
            router.push('/bookings')
        }
    },
    { immediate: true }
)

async function handleSignUp() {
    errorMessage.value = ''

    if (!email.value || !password.value || !confirmPassword.value) {
        errorMessage.value = 'All fields are required'
        return
    }

    if (password.value !== confirmPassword.value) {
        errorMessage.value = 'Passwords do not match'
        return
    }

    if (password.value.length < 6) {
        errorMessage.value = 'Password must be at least 6 characters'
        return
    }

    isLoading.value = true

    try {
        await register(email.value, password.value, role.value)
    } catch (error) {
        errorMessage.value = error.message || 'Registration failed'
    } finally {
        isLoading.value = false
    }
}
</script>
