export const useAuth = () => {
  const user = useSupabaseUser()
  const client = useSupabaseClient()
  const router = useRouter()
  const userRole = ref<string | null>(null)

  const loadUserRole = async () => {
    if (!user.value) return null

    try {
      // Get user metadata which contains the role
      const {
        data: {user: authUser},
      } = await client.auth.getUser()
      userRole.value = authUser?.user_metadata?.role || null
      return userRole.value
    } catch (error) {
      console.error('Error loading user role:', error)
      return null
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const {data, error} = await client.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      await loadUserRole()
      await router.push('/bookings')
      return data
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (
    email: string,
    password: string,
    role: 'employee' | 'manager'
  ) => {
    try {
      const {data, error} = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
          },
        },
      })

      if (error) throw error
      userRole.value = role
      await router.push('/bookings')
      return data
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = async () => {
    try {
      const {error} = await client.auth.signOut()
      if (error) throw error
      userRole.value = null
      await router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  }

  const isAuthenticated = computed(() => !!user.value)
  const isManager = computed(() => userRole.value === 'manager')
  const isEmployee = computed(() => userRole.value === 'employee')

  onMounted(() => {
    if (user.value) {
      loadUserRole()
    }
  })

  return {
    user: readonly(user),
    userRole: readonly(userRole),
    isAuthenticated,
    isManager,
    isEmployee,
    login,
    register,
    logout,
    loadUserRole,
  }
}
