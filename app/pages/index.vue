<template>
  <div class="flex justify-center items-center h-screen">
    <Suspense>
      <LazyUpload />
      <template #fallback>
        Loading...
      </template>
    </Suspense>
  </div>
</template>
