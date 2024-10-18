<template>
    <Teleport to="body">
        <img :src="backgroundStore.backgroundSettings.currentBackgroundPath" alt="" />
    </Teleport>
</template>

<script setup lang="js">
import { useBackgroundStore } from "@/stores/background"
defineOptions({
    name: "BackGround"
})

const backgroundStore = useBackgroundStore()

// 获取数据
const backgroundSettings = localStorage.getItem('backgroundSettings')
if (backgroundSettings) {
    backgroundStore.backgroundSettings = JSON.parse(backgroundSettings)
}
else {
    backgroundStore.backgroundSettings = backgroundStore.defaultBackgroundSettings
    localStorage.setItem('backgroundSettings', JSON.stringify(backgroundStore.backgroundSettings))
    console.log('加载默认背景配置')
}
// 设置背景
if (backgroundStore.backgroundSettings.randomBackground) {
    backgroundStore.backgroundSettings.currentBackgroundPath = backgroundStore.defaultBackgroundSettings.defaultBackgroundPath
    const usedList = backgroundStore.backgroundSettings.backgroundList.filter(item => item.used)
    const randomIndex = Math.floor(Math.random() * usedList.length)
    backgroundStore.backgroundSettings.currentBackgroundPath = usedList[randomIndex].path
}
else {
    backgroundStore.backgroundSettings.currentBackgroundPath = backgroundStore.backgroundSettings.defaultBackgroundPath
}
</script>

<style scoped>
img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    object-fit: cover;
}
</style>