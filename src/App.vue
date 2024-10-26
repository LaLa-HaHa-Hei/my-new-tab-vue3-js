<script setup lang="js">
import Background from './components/Background.vue'
import Clock from './components/Clock.vue'
import SearchEngineContainer from './components/SearchEngineContainer.vue'
import Meno from './components/Memo.vue'
import BookmarkContainer from './components/BookmarkContainer.vue'
import Settings from './components/Settings.vue'
</script>

<template>
  <Background />
  <main>
    <div style="margin-top: 50px;">
      <Clock />
    </div>
    <div style="margin-top: 20px;">
      <SearchEngineContainer />
    </div>
    <div style="margin: 10px 11% 0 11%;">
      <Meno />
    </div>
    <div style="margin-top: 20px;margin-bottom: 20px;flex: 1;overflow: hidden;">
      <BookmarkContainer />
    </div>
  </main>
  <Settings />
</template>

<style scoped>
main {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>
