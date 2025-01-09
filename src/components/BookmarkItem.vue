<template>
    <div class="bookmark-item" @mouseenter="showEditButton = true" @mouseleave="showEditButton = false">
        <button v-if="bookmark.backgroundText && bookmark.backgroundText.length > 0" class="bookmark-button"
            @click="openUrl" :style="{ backgroundColor: bookmark.backgroundColor }" type="button">{{
                bookmark.backgroundText
            }}</button>
        <button v-else class="bookmark-button" @click="openUrl"
            :style="{ backgroundImage: 'url(' + bookmark.backgroundIcon + ')' }" type="button">
        </button>
        <div class="bookmark-name">{{ props.bookmark.name }}</div>

        <button v-show="showEditButton" class="edit-button" @click="showModal" type="button">
            <img src="/images/edit.svg" />
        </button>
    </div>

    <!-- 编辑书签弹窗 -->
    <Teleport to="body">
        <div class="modal" v-if="modalVisible">
            <div class="modal-overlay" @click="modalVisible = false">
                <div class="modal-content" @click.stop>
                    <header>编辑书签</header>
                    <main>
                        <form ref="formField">
                            <label>网站名称&ensp;&ensp;<input type="text" name="name" placflexeholder=" 图标下方文字"
                                    :value="bookmark.name"></label>
                            <br />
                            <label>网站链接&ensp;&ensp;<input type="text" name="url" v-model="urlTemp"></label>
                            <br />
                            <div style="display: flex; flex-direction: row; gap: 10px;">
                                <!-- 图标 -->
                                <div style="flex: 1; border: 1px solid #ccc; padding: 10px;">
                                    <label>背景图&ensp;
                                        <input type=" text" name="backgroundIcon" placeholder="网址或base64图片"
                                            v-model="backgroundIconTemp"></label>
                                    <br />
                                    <button @click.prevent="howToUseBackgroundIcon" style="color: red;">用前必看</button>
                                    &ensp;
                                    <input type="file" accept="image/*" @change="localBackgroundIconChange"
                                        style="width: 150px;" title="从本地上传" />
                                    <br />
                                    预览&ensp;&ensp;
                                    <img :src="backgroundIconTemp" @error="imgError"
                                        style="width: 64px; height: 64px; border-radius: 15px; box-shadow: 5px 5px 10px rgba(0, 0, 0, 0.3);">
                                </div>
                                <div style="display: flex; align-items: center;">
                                    <h3>或</h3>
                                </div>
                                <!-- 纯色 -->
                                <div style="flex: 1; border: 1px solid #ccc; padding: 10px;">
                                    <label>背景色&ensp;<input type="color" name="backgroundColor"
                                            :value="bookmark.backgroundColor" style="flex:none; width: 30px;"></label>
                                    <br />
                                    <label>背景文本&ensp;<input type="text" name="backgroundText" placeholder=" 显示在背景色上的文字"
                                            :value="bookmark.backgroundText"></label>
                                    <br />
                                    <span style="color: red;">若输入背景文本, 背景图将失效</span>
                                </div>
                            </div>
                        </form>
                    </main>
                    <footer>
                        <button class="modal-delete-button" @click="deleteBookmark">删除</button>
                        &ensp;&ensp;
                        <button class="modal-add-button" @click="saveBookmark">保存</button>
                        &ensp;&ensp;
                        <button class="modal-cancel-button"
                            @click="modalVisible = false; formField.reset(); urlTemp = ''; backgroundIconTemp = ''">取消</button>
                    </footer>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="js">
import { ref, watch } from 'vue'
import debounce from 'lodash/debounce'
import { useBookmarkContainerStore } from '@/stores/bookmarkContainer'
defineOptions({
    name: 'BookmarkItem'
})
const props = defineProps({
    openInNewTab: Boolean,
    bookmark: Object
})

const bookmarkContainerStore = useBookmarkContainerStore()
const showEditButton = ref(false)
const modalVisible = ref(false)
const urlTemp = ref(props.bookmark.url)
const backgroundIconTemp = ref(props.bookmark.backgroundIcon)
const formField = ref()

function openUrl() {
    window.open(props.bookmark.url, props.openInNewTab ? '_blank' : '_self')
}

// 输入网址后，猜测图片url
watch(urlTemp, debounce((newVal) => {
    try {
        //如果是data:开头的图片，则不进行处理
        if (backgroundIconTemp.value.startsWith('data:'))
            return
        const parsedUrl = new URL(newVal)
        backgroundIconTemp.value = `${parsedUrl.origin}/favicon.ico`
    }
    catch (e) {
    }
}, 400))
// 猜测网站图标，如果不是ico格式，则改为png格式
function imgError(event) {
    if (backgroundIconTemp.value.endsWith('ico')) {
        backgroundIconTemp.value = backgroundIconTemp.value.replace(/ico$/, 'png')
    }
    else if (backgroundIconTemp.value.endsWith('png')) {
        backgroundIconTemp.value = backgroundIconTemp.value.replace(/png$/, 'svg')
    }
}
// 使用帮助
function howToUseBackgroundIcon() {
    alert('输入网址后会自动猜测网站图标，但是不建议直接使用！\n直接使用网址作为图标将导致每次打开页面都会重新请求图标，效率很低！\n建议右键图片，点 “另存为”，下载图标后点击 “选择文件”选择下载的图标，正常显示并添加书签后即可删除下载的图标')
}
// 若本地上传本地图标，转为base64格式放入图片地址区
function localBackgroundIconChange(event) {
    const file = event.target.files[0]
    if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
            if (e && e.target && e.target.result && typeof e.target.result === 'string')
                backgroundIconTemp.value = e.target.result
        }
        reader.readAsDataURL(file)
    }
}

function saveBookmark() {
    modalVisible.value = false
    const formData = new FormData(formField.value)
    const newBookmark = {
        id: `${Date.now()}`,
        name: formData.get('name'),
        url: formData.get('url'),
        backgroundIcon: formData.get('backgroundIcon'),
        backgroundColor: formData.get('backgroundColor'),
        backgroundText: formData.get('backgroundText'),
    }
    const index = bookmarkContainerStore.bookmarkSettings.bookmarkList.findIndex(item => item.id === props.bookmark.id)
    bookmarkContainerStore.bookmarkSettings.bookmarkList[index] = newBookmark
    localStorage.setItem('bookmarkSettings', JSON.stringify(bookmarkContainerStore.bookmarkSettings))
    console.log('修改书签成功')
    formField.value.reset()
    // reset无法清楚绑定的值，需要手动清空
    urlTemp.value = ''
    backgroundIconTemp.value = ''
}

function deleteBookmark() {
    const userChoice = confirm('确定要删除吗')
    if (userChoice) {
        const index = bookmarkContainerStore.bookmarkSettings.bookmarkList.findIndex(item => item.id === props.bookmark.id)
        bookmarkContainerStore.bookmarkSettings.bookmarkList.splice(index, 1)
        localStorage.setItem('bookmarkSettings', JSON.stringify(bookmarkContainerStore.bookmarkSettings))
    }
}

function showModal() {
    modalVisible.value = true
    urlTemp.value = props.bookmark.url
    backgroundIconTemp.value = props.bookmark.backgroundIcon
}

</script>

<style scoped>
.bookmark-item {
    position: relative;
    display: flex;
    flex-direction: column;
    /* 交叉轴方向 */
    align-items: center;
    /* 主轴方向 */
    /* justify-content: flex-end; */
}

.bookmark-item>.bookmark-button {
    cursor: pointer;
    border: none;
    /* width: 64px;
    height: 64px; */
    border-radius: 12px;
    font-size: 130%;
    font-weight: 600;
    text-align: center;
    color: white;
    background-size: cover;
    background-repeat: no-repeat;
    /* background-position: center; */
}

@media (max-width: 699px) {
    .bookmark-item>.bookmark-button {
        width: 50px;
        height: 50px;
    }

    .modal-content {
        width: 95%;
        top: 5%;
    }
}

@media (min-width: 700px) {
    .bookmark-item>.bookmark-button {
        width: 64px;
        height: 64px;
    }

    .modal-content {
        width: 70%;
        top: 15%;
    }
}

.bookmark-name {
    white-space: nowrap;
    color: white;
}

.edit-button {
    position: absolute;
    height: 20px;
    width: 20px;
    top: 0px;
    right: 0;
    padding: 2px;
    background-color: transparent;
    border: none;
    font-weight: bold;
    font-size: 150%;
    color: gray;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: 5px;
}

.edit-button:hover {
    background-color: rgba(255, 255, 255, 0.3);
}

.edit-button img {
    height: 13px;
    width: 13px;
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
    left: 50%;
    transform: translateX(-50%);
    height: 440px;
    background-color: white;
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.modal-content>header {
    font-size: 150%;
    font-weight: bold;
    margin-top: 20px;
    padding-left: 30px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ccc;
}

.modal-content>main {
    flex: 1;
    padding: 15px 30px 5px 30px;
    overflow: auto;
}

.modal-content>main form {
    display: flex;
    flex-direction: column;
}

.modal-content>main form label {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 25px;
    align-items: center;
}

.modal-content>main label>input {
    flex: 1;
    height: 100%;
}

.modal-content>footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 15px;
    padding-right: 30px;
    padding-bottom: 20px;
}
</style>