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
    <Clock />
    <SearchEngineContainer />
    <Meno />
    <BookmarkContainer />
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

/* 不知道为啥会影响子组件Clock.vue的样式，先除以二，待修复 */
:deep(.clock) {
  margin-top: 50px;
}

:deep(.search-engine-container) {
  margin-top: 20px;
}

:deep(.memo) {
  margin: 10px 15% 0 15%;
}

:deep(.bookmark-container) {
  margin-top: 20px;
  margin-bottom: 20px;
  flex: 1;
  overflow: hidden;
}
</style>
