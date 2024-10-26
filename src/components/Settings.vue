<template>
    <Teleport to="body">
        <div class="settings-bar">
            <button class="settings-button" @click="showModal" type="button">
                <img src="/images/setting.svg" alt="设置" />
            </button>
        </div>
    </Teleport>
    <Teleport to="body">
        <div class="modal" v-if="modalVisible">
            <div class="modal-overlay" @click="saveAndHideModal">
                <div class="modal-content" @click.stop>
                    <nav>
                        <p style="margin: 20px 20px 18px 20px;font-weight: 600;">设置中心</p>
                        <ul>
                            <li @click="changePage(0)" :class="pageIndex === 0 ? 'active' : ''">搜索引擎</li>
                            <li @click="changePage(1)" :class="pageIndex === 1 ? 'active' : ''">书签栏</li>
                            <li @click="changePage(2)" :class="pageIndex === 2 ? 'active' : ''">背景</li>
                            <li @click="changePage(3)" :class="pageIndex === 3 ? 'active' : ''">其他</li>
                        </ul>
                    </nav>
                    <div class="page-content">
                        <!-- 页面一 搜索引擎 -->
                        <div v-show="pageIndex === 0" class="page">
                            <header>
                                <p>搜索引擎</p>
                            </header>
                            <main>
                                <form ref="searchEngineForm">
                                    <label>在新标签页中搜索&ensp;&ensp;<input type="checkbox"
                                            v-model="searchEngineContainerStore.searchEngineSettings.openInNewTab" /></label>
                                    <br />
                                    <label>每行搜索引擎个数&ensp;&ensp;<input type="number" min="1" max="4" style="width: 30px;"
                                            v-model="searchEngineContainerStore.searchEngineSettings.gridColumnCount" /></label>
                                    <br />
                                    <p>拖动搜索引擎排序</p>
                                    <ul class="search-engine-list">
                                        <li v-for="(engine, index) in searchEngineContainerStore?.searchEngineSettings.searchEngineList"
                                            :key="engine.id" draggable="true" @dragstart="dragStart(index)"
                                            @dragover="allowDrop" @drop="drop(index)" class="engine-item"><input
                                                type="checkbox" v-model="engine.used" />
                                            {{ engine.name }}
                                        </li>
                                    </ul>
                                </form>
                            </main>
                            <footer></footer>
                        </div>
                        <!-- 页面二 书签 -->
                        <div v-show="pageIndex === 1" class="page">
                            <header>
                                <p>书签栏</p>
                            </header>
                            <main>
                                <form ref="bookmarkForm">
                                    <label>在新标签页中打开链接<input type="checkbox"
                                            v-model="bookmarkContainerStore.bookmarkSettings.openInNewTab"></label>
                                    <br />
                                    <!-- <DisplayBookmarkObj :bookmarkObj="bookmarkFromBrowser" /> -->
                                </form>
                            </main>
                            <footer>
                            </footer>
                        </div>
                        <!-- 页面三 背景 -->
                        <div v-show="pageIndex === 2" class="page">
                            <header>
                                <p>背景</p>
                            </header>
                            <main>
                                <form ref="backgroundForm">
                                    <label>每次打开页面随机背景<input type="checkbox"
                                            v-model="backgroundStore.backgroundSettings.randomBackground"></label>
                                    <br />
                                    <p>背景图片列表&ensp;
                                        <button @click.prevent="addBackground">添加</button>&ensp;
                                        <button @click.prevent="removeBackground">删除</button>&ensp;
                                        <button @click.prevent="howToUseBackground" style="color: red;">用前必看</button>
                                    </p>
                                    <ul>
                                        <li
                                            v-for="(background, index) in backgroundStore.backgroundSettings.backgroundList">
                                            <input type="checkbox" v-model="background.used" />
                                            ({{ index + 1 }})&ensp;&ensp;{{ background.path }}
                                        </li>
                                    </ul>
                                    <label style="width: 100%; display: flex;">
                                        不随机时的背景图片路径或网址
                                        <input type="text"
                                            v-model="backgroundStore.backgroundSettings.defaultBackgroundPath"
                                            style="flex: 1;" />
                                    </label>
                                </form>
                            </main>
                            <footer></footer>
                        </div>
                        <!-- 页面四 其他 -->
                        <div v-show="pageIndex === 3" class="page">
                            <header>
                                <p>其他</p>
                            </header>
                            <main>
                                <button @click="exportSettings">导出配置到剪切板</button>&ensp;&ensp;
                                <button @click="importSettings">从剪切板导入配置</button>
                                <br />
                                <br />
                                <button @click="clearSettings" style="color: red;">清除所有配置</button>
                                <br />
                                <!-- <button @click="exportSettingsAsFile">{{ $t('settings.otherPage.exportAsFile')
                                    }}></button>
                                <button ref="importSettingsFromFileField" @click="importSettingsFromFile">{{
                                    $t('settings.otherPage.importFromFile')
                                    }}</button>
                                <br /> -->
                                <p>欢迎加入QQ群一起讨论~</p>
                                <img src="/images/qqGroup.jpg" style="width: 300px;" />
                            </main>
                            <footer></footer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="js">
import { ref, shallowRef } from 'vue'
import { useBookmarkContainerStore } from '@/stores/bookmarkContainer'
import { useSearchEngineContainerStore } from '@/stores/searchEngineContainer'
import { useBackgroundStore } from '@/stores/background'
defineOptions({
    name: 'Settings'
})

const bookmarkContainerStore = useBookmarkContainerStore()
const searchEngineContainerStore = useSearchEngineContainerStore()
const backgroundStore = useBackgroundStore()
const bookmarkFromBrowser = ref()
// const importSettingsFromFileField = ref()

const modalVisible = ref(false)
const pageIndex = shallowRef(0)

function showModal() {
    pageIndex.value = 0;
    bookmarkFromBrowser.value = {}
    modalVisible.value = true
}
function hideModal() {
    modalVisible.value = false
    bookmarkFromBrowser.value = {}
}

// 搜索引擎拖动排序
const draggingIndex = ref(-1)
function changePage(index) {
    pageIndex.value = index
}
const dragStart = (index) => {
    draggingIndex.value = index;
}

const allowDrop = (e) => {
    e.preventDefault();
}

const drop = (index) => {
    const draggedItem = searchEngineContainerStore.searchEngineSettings.searchEngineList.splice(draggingIndex.value, 1)[0];
    searchEngineContainerStore.searchEngineSettings.searchEngineList.splice(index, 0, draggedItem);
    draggingIndex.value = -1;
}

// 背景图片
function addBackground() {
    const imgPath = prompt('请输入背景图片网址')
    if (imgPath) {
        backgroundStore.backgroundSettings.backgroundList.push({
            path: imgPath,
            used: true
        })
    }
}
// 删除背景图片
function removeBackground() {
    const index = prompt('请输入要删除的背景图片前面的序号')
    if (index) {
        const indexNum = parseInt(index) - 1
        backgroundStore.backgroundSettings.backgroundList.splice(indexNum, 1)
    }
}
// 背景图片使用说明
function howToUseBackground() {
    alert('由于浏览器安全限制，无法直接访问本地图片路径，所以添加图片时只能输入网址。\n如果您对电脑的使用比较熟悉，可以将图片放入本扩展目录对应版本文件夹的\"newtab\\images\\background\"中，然后就可以添加本地图片了。\nedge扩展目录一般在C:\\Users\\用户名\\AppData\\Local\\Microsoft\\Edge\\User Data\\Default\\Extensions\nchrome一般在C:\\Users\\mjcgc\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\n然后上网查询如何判断哪个是本扩展的目录即可')
}
// 保存并隐藏模态框
function saveAndHideModal() {
    localStorage.setItem('bookmarkSettings', JSON.stringify(bookmarkContainerStore.bookmarkSettings))
    localStorage.setItem('searchEngineSettings', JSON.stringify(searchEngineContainerStore.searchEngineSettings))
    localStorage.setItem('backgroundSettings', JSON.stringify(backgroundStore.backgroundSettings))
    hideModal()
}

// 导出设置
function exportSettings() {
    const settings = {
        bookmarkSettings: bookmarkContainerStore.bookmarkSettings,
        searchEngineSettings: searchEngineContainerStore.searchEngineSettings,
        backgroundSettings: backgroundStore.backgroundSettings
    }
    const settingsStr = JSON.stringify(settings)
    try {
        navigator.clipboard.writeText(settingsStr)
        alert('成功')
    }
    catch (e) {
        alert(`失败\n${e.message}`)
    }
}

// 导入设置
async function importSettings() {
    try {
        const settingsStr = await navigator.clipboard.readText()
        const settingsObj = JSON.parse(settingsStr)
        bookmarkContainerStore.bookmarkSettings = settingsObj.bookmarkSettings
        searchEngineContainerStore.searchEngineSettings = settingsObj.searchEngineSettings
        backgroundStore.backgroundSettings = settingsObj.backgroundSettings
        localStorage.setItem('bookmarkSettings', JSON.stringify(bookmarkContainerStore.bookmarkSettings))
        localStorage.setItem('searchEngineSettings', JSON.stringify(searchEngineContainerStore.searchEngineSettings))
        localStorage.setItem('backgroundSettings', JSON.stringify(backgroundStore.backgroundSettings))
        alert('成功')
    }
    catch (e) {
        alert(`失败\n${e.message}`)
    }
}

// 清除所有设置
function clearSettings() {
    const confirmResult = confirm('确定要清除所有设置吗？')
    if (!confirmResult)
        return
    localStorage.clear()
    window.location.reload(true)
}

// async function exportSettingsAsFile() {
//     const settingsStr = await navigator.clipboard.readText()
//     const settingsObj = JSON.parse(settingsStr)

//     // 创建 Blob 对象
//     const blob = new Blob([settingsStr], { type: "text/plain" });

//     // 创建一个指向该 Blob 的 URL
//     const url = URL.createObjectURL(blob);

//     // 创建一个链接元素
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = "settings.txt"; // 指定下载的文件名

//     // 触发下载
//     document.body.appendChild(a);
//     a.click();

//     // 清理 URL 对象
//     URL.revokeObjectURL(url);
//     a.remove();

// }

// async function importSettingsFromFile() {
//     // 创建一个隐藏的文件输入元素
//     importSettingsFromFileField.value.type = "file";
//     importSettingsFromFileField.value.accept = ".txt"; // 限制选择文本文件

//     // 当选择文件后读取内容
//     importSettingsFromFileField.value.addEventListener("change", () => {
//         const file = importSettingsFromFileField.value.files[0];

//         if (!file) {
//             return; // 如果没有选择文件，则退出
//         }

//         const reader = new FileReader();

//         reader.onload = (event) => {
//             try {
//                 const settings = JSON.parse(event.target.result);
//                 console.log("导入的设置:", settings);
//                 document.getElementById("output").textContent = JSON.stringify(settings, null, 2); // 显示导入的设置
//             } catch (error) {
//                 alert("无法解析文件内容，请确保是有效的 JSON 格式！");
//             }
//         };
//         reader.readAsText(file); // 以文本形式读取文件
//     });

//     // 手动触发文件输入的点击事件
//     fileInput.click();
// }
</script>

<style scoped>
ul {
    list-style: none;
}

.settings-bar {
    position: absolute;
    top: 10px;
    right: 20px;
    display: flex;
    flex-direction: row;
}

.language-selector {
    display: flex;
    flex-direction: row;
    align-items: center;
}

.language-selector img {
    width: 25px;
    height: 25px;
}

.settings-button {
    width: 35px;
    height: 35px;
    background-color: transparent;
    border: none;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.settings-button:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.3);
}

.settings-button img {
    width: 27px;
    height: 27px;
}

.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
}

.modal-overlay {
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
    position: absolute;
    top: 15%;
    height: 70%;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    border-radius: 20px;
    display: flex;
    flex-direction: row;
    overflow: hidden;
}

@media (max-width: 699px) {
    .modal-content {
        width: 95%;
    }
}

@media (min-width: 700px) {
    .modal-content {
        width: 70%;
    }
}

.modal-content nav {
    border-right: 1px solid #e5e5e5;
}

.modal-content nav ul {
    display: flex;
    flex-direction: column;
    list-style: none;
    padding: 0;
}


.modal-content nav ul>li {
    padding: 12px 12px 12px 20px;
    cursor: pointer;
}

.modal-content nav ul>li.active {
    color: #0078D4;
    background-color: #DFEFFE;
    border-right: 2px solid #0078D4;
}

.page-content {
    flex: 1;
}

.page {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: auto;
}

.page header {
    font-weight: 600;
    padding: 4px 30px 2px 30px;
    border-bottom: 1px solid #868686;
}

.page main {
    padding: 20px;
    flex: 1;
}

.page main form {
    width: 100%;
    height: 100%;
    overflow: auto;
}

.search-engine-list li {
    border: 1px solid #adadad;
    border-radius: 5px;
    padding: 5px;
    margin: 5px;
}

.page footer {
    display: flex;
    justify-content: flex-end;
    padding: 10px 40px 20px 30px;
}
</style>
