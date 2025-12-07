<template>
    <div class="login-container">
        <div class="login-card">
            <h1 class="title">Welcome Back</h1>

            <form @submit.prevent="handleLogin" class="form">
                <input
                    v-model="email"
                    type="text"
                    placeholder="Email"
                    class="input"
                />
                <input
                    v-model="password"
                    type="password"
                    placeholder="Password"
                    class="input"
                />

                <div v-if="errorMessage" class="error-message">
                    {{ errorMessage }}
                </div>

                <button class="btn" :disabled="isLoading">
                    {{ isLoading ? 'Loading...' : 'Login' }}
                </button>
            </form>

            <p class="register-link">
                Don't have an account?
                <router-link to="/register">Register</router-link>
            </p>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: #f3f4f6;
    padding: 20px;
}

.login-card {
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

.register-link {
    margin-top: 16px;
    font-size: 14px;
    color: #666;
}

.register-link a {
    color: #6366f1;
    text-decoration: none;
    font-weight: 600;
}

.register-link a:hover {
    text-decoration: underline;
}
</style>

<script setup>
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

const { login, user } = useAuth()
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

async function handleLogin() {
    errorMessage.value = ''
    isLoading.value = true

    try {
        await login(email.value, password.value)
    } catch (error) {
        errorMessage.value = error.message || 'Login failed'
    } finally {
        isLoading.value = false
    }
}
</script>
