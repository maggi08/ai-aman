export const useRooms = () => {
  const rooms = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getRooms = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch('/api/rooms');
      // Ensure data is always an array
      rooms.value = Array.isArray(data) ? data : [];
      return rooms.value;
    } catch (err: any) {
      error.value = err.data?.message || err.message;
      // Don't throw - keep rooms as empty array so filtering doesn't break
      rooms.value = [];
      console.error('Failed to fetch rooms:', err);
    } finally {
      loading.value = false;
    }
  };

  const getRoom = async (roomId: string) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch(`/api/rooms/${roomId}`);
      return data;
    } catch (err: any) {
      error.value = err.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const createRoom = async (name: string, capacity: number) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch('/api/rooms', {
        method: 'POST',
        body: { name, capacity },
      });

      if (data && (data as any).id) {
        rooms.value.push(data);
      }
      return data;
    } catch (err: any) {
      error.value = err.data?.message || err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateRoom = async (roomId: string, updates: { name?: string; capacity?: number }) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch(`/api/rooms/${roomId}`, {
        method: 'PATCH',
        body: updates,
      });

      const index = rooms.value.findIndex((r) => r.id === roomId);
      if (index !== -1) {
        rooms.value[index] = data;
      }
      return data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteRoom = async (roomId: string) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`/api/rooms/${roomId}`, {
        method: 'DELETE',
      });

      rooms.value = rooms.value.filter((r) => r.id !== roomId);
      return true;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    rooms: readonly(rooms),
    loading: readonly(loading),
    error: readonly(error),
    getRooms,
    getRoom,
    createRoom,
    updateRoom,
    deleteRoom,
  };
};
