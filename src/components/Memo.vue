<template>
    <textarea ref="textareaRef" v-model="memo" placeholder="备忘录"></textarea>
</template>

<script setup lang="js">
import { ref, watch, onMounted, onBeforeUnmount } from 'vue';
import debounce from 'lodash/debounce'

const memo = ref('');
const textareaRef = ref(null);

memo.value = localStorage.getItem('memo') || '';

const saveMemoDebounced = debounce(() => {
    localStorage.setItem('memo', memo.value);
}, 1000 * 5)

function resetHeight() {
    textareaRef.value.style.height = 'auto'; // 重置高度以获取正确的 scrollHeight
    const newHeight = textareaRef.value.scrollHeight;
    textareaRef.value.style.height = newHeight + 'px';
}

watch(() => memo.value, () => {
    resetHeight()
    saveMemoDebounced()
})

onMounted(() => {
    resetHeight()
})
// 组件卸载或页面关闭时保存备忘录
onBeforeUnmount(() => {
    saveMemoDebounced.flush()
})
window.addEventListener('beforeunload', () => {
    saveMemoDebounced.flush()
});
</script>

<style scoped>
textarea {
    width: 100%;
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: 10px;
    padding: 10px;
    font-size: 200%;
    font-weight: bold;
    outline: none;
}
</style>