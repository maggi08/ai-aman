<template>
  <div class="min-h-screen bg-slate-900 text-white p-5">
    <h1 class="text-4xl font-bold text-cyan-500">Instruments</h1>
    <form @submit.prevent="createInstrument" class="flex gap-2 mt-2 text-white">
      <input type="text" v-model="instrumentEmoji" placeholder="Emoji" class="bg-slate-800 p-2 rounded-md text-black">
      <input type="text" v-model="instrumentName" placeholder="Instrument Name" class="bg-slate-800 p-2 rounded-md text-white">
      <button type="submit" class="bg-cyan-500 text-white p-2 rounded-md">Add</button>
    </form>
    <ul class="list-disc ml-5 text-xl mt-4">
      <li v-for="instrument in instruments" :key="instrument.id">{{ instrument?.emoji }} {{ instrument.name }} <Icon name="material-symbols:restore-from-trash-sharp" class="cursor-pointer" @click="deleteInstrument(instrument.id)"/></li>
    </ul>
  </div>
</template>


<script setup>
const client = useSupabaseClient()
const instruments = ref([])
const instrumentName = ref('' )
const instrumentEmoji = ref('')

const createInstrument = async () => {
  const { data, error } = await client.from('instruments').insert({
    name: instrumentName.value,
    emoji: instrumentEmoji.value
  }).select().single()
  instruments.value.push(data)
  if(error) throw error
  instrumentName.value = ''
  instrumentEmoji.value = ''
}

const deleteInstrument = async (id) => {
  instruments.value = instruments.value.filter(instrument => instrument.id !== id)
  await client.from('instruments').delete().eq('id', id)
}

onMounted(async () => {
  const { data, error } = await client.from('instruments').select()
  instruments.value = data
  console.log(useRuntimeConfig().public)
})
</script>