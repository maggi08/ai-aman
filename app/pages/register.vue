<template>
  <div class="register-container">
    <div class="register-card">
      <h1 class="title">Create Account</h1>

      <form @submit.prevent="signUp" class="form">
        <input v-model="email" type="text" placeholder="Email" class="input" />
        <input v-model="password" type="password" placeholder="Password" class="input" />

        <select v-model="role" class="input">
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>

        <button type="submit" class="btn">Register</button>
      </form>
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
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
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
  box-shadow: 0 0 0 3px rgba(99,102,241,0.15);
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
</style>


<script setup>
const client = useSupabaseClient();

const email = ref("");
const password = ref("");
const role = ref("employee");

async function signUp() {
  try {
    const { data, error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
      options: {
        data: {
          role: role.value
        }
      }
    });

    if (error) throw error;
    console.log("User created:", data);

  } catch (err) {
    console.log("Sign up error:", err.message);
  }
}
</script>
