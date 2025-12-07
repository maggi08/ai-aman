export const useBookings = () => {
  const client = useSupabaseClient();
  const bookings = ref<any[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createBooking = async (roomId: string, startTime: Date, endTime: Date) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch('/api/bookings', {
        method: 'POST',
        body: {
          roomId,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
        },
      });

      if (data && (data as any).id) {
        bookings.value.push(data);
      }
      return data;
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to create booking';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deleteBooking = async (bookingId: string) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });

      bookings.value = bookings.value.filter((b) => b.id !== bookingId);
      return true;
    } catch (err: any) {
      error.value = err.data?.message || err.message || 'Failed to delete booking';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getBookings = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await $fetch('/api/bookings');
      // Ensure data is always an array
      bookings.value = Array.isArray(data) ? data : [];
      return bookings.value;
    } catch (err: any) {
      error.value = err.data?.message || err.message;
      // Don't throw - keep bookings as empty array so filtering doesn't break
      bookings.value = [];
      console.error('Failed to fetch bookings:', err);
    } finally {
      loading.value = false;
    }
  };

  const subscribeToBookings = (roomId?: string) => {
    const channel = client.channel('bookings');

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bookings',
          ...(roomId && { filter: `roomId=eq.${roomId}` }),
        },
        (payload: any) => {
          if (payload.eventType === 'INSERT') {
            bookings.value.push(payload.new);
          } else if (payload.eventType === 'UPDATE') {
            const index = bookings.value.findIndex((b) => b.id === payload.new.id);
            if (index !== -1) {
              bookings.value[index] = payload.new;
            }
          } else if (payload.eventType === 'DELETE') {
            bookings.value = bookings.value.filter((b) => b.id !== payload.old.id);
          }
        }
      )
      .subscribe();

    return () => channel.unsubscribe();
  };

  return {
    bookings: readonly(bookings),
    loading: readonly(loading),
    error: readonly(error),
    createBooking,
    deleteBooking,
    getBookings,
    subscribeToBookings,
  };
};
