<template>
    <div class="clock">
        <div class="time">{{ formattedDateTime.hour }}:{{ formattedDateTime.minute }}</div>
        <div class="date">{{ formattedDateTime.month }}月{{ formattedDateTime.day }}日</div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
defineOptions({
    name: 'Clock'
})

const refreshInterval = 1000 * 10 // 10秒刷新一次

const currentDate = ref(new Date())
// 计算格式化的时间和日期
const formattedDateTime = computed(() => ({
    month: currentDate.value.getMonth() + 1,
    day: currentDate.value.getDate(),
    hour: String(currentDate.value.getHours()).padStart(2, '0'),
    minute: String(currentDate.value.getMinutes()).padStart(2, '0')
}))

let timeInterval
// 更新当前时间
onMounted(() => {
    timeInterval = setInterval(() => {
        currentDate.value = new Date()
    }, refreshInterval)
})

onUnmounted(() => {
    clearInterval(timeInterval)
})
</script>

<style scoped>
.clock {
    text-align: center;
    color: white;
}

.time {
    font-size: 400%;
    font-weight: 500;
    margin: 0;
}

.date {
    font-size: 100%;
    font-weight: 400;
    margin: 10px 0 0 0;
}
</style>