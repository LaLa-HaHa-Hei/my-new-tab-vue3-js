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
  <div class="clock">
    <Clock />
  </div>
  <div class="search-engine-container">
    <SearchEngineContainer />
  </div>
  <div class="memo">
    <Meno />
  </div>
  <div class="bookmark-container">
    <BookmarkContainer />
  </div>
  <div class="settings">
    <Settings />
  </div>
</template>

<style scoped>
.clock {
  margin-top: 50px;
}

.search-engine-container {
  margin-top: 20px;
}

.memo {
  margin: 10px 15% 10px 15%;
}

.bookmark-container {
  margin-top: 20px;
  margin-bottom: 20px;
  flex: 1;
  overflow: hidden;
}
</style>
