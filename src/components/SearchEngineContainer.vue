<template>
    <div class="search-engine-container"
        :style="{ gridTemplateColumns: `repeat(${searchEngineContainerStore.searchEngineSettings.gridColumnCount}, 1fr)` }">
        <template v-for="searchEngine in searchEngineContainerStore.searchEngineSettings.searchEngineList">
            <SearchEngineItem v-if="searchEngine.used" :key="searchEngine.id"
                :openInNewTab="searchEngineContainerStore.searchEngineSettings.openInNewTab"
                :searchEngine="searchEngine" :getSearchSuggestions="bingSearchSuggestions" />
        </template>
    </div>
</template>

<script setup lang="js">
import SearchEngineItem from './SearchEngineItem.vue'
import axios from 'axios'
import { useSearchEngineContainerStore } from '@/stores/searchEngineContainer'
defineOptions({
    name: 'SearchEngineContainer',
})

async function bingSearchSuggestions(keyword) {
    // 请求太频繁将暂时无法获取数据，所有用了try
    if (!keyword)
        return []
    try {
        const url = `https://api.bing.com/qsonhs.aspx` //https://sg1.api.bing.com/qsonhs.aspx?q=${keyword}
        const response = await axios.get(url, {
            withCredentials: false, // 禁用第三方 Cookie
            params: {
                q: keyword
            }
        })
        const vsSuggestions = []
        const asSuggestions = []
        response.data.AS.Results.forEach((result) => {
            if (result.Type === 'VS')
                vsSuggestions.push(...result.Suggests.map((s) => s.Txt))
            else if (result.Type === "AS") {
                asSuggestions.push(...result.Suggests.map((s) => s.Txt));
            }
        })
        const suggestions = [];
        const maxLength = Math.max(vsSuggestions.length, asSuggestions.length)
        for (let i = 0; i < maxLength; i++) {
            if (i < vsSuggestions.length)
                suggestions.push(vsSuggestions[i])
            if (i < asSuggestions.length)
                suggestions.push(asSuggestions[i])
        }
        return suggestions
    }
    catch (error) {
        console.log(`一般是请求太频繁导致获取数据失败:  ${error.message}`)
        return []
    }
}

const searchEngineContainerStore = useSearchEngineContainerStore()

const searchEngineSettings = localStorage.getItem('searchEngineSettings')
if (searchEngineSettings) {
    searchEngineContainerStore.searchEngineSettings = JSON.parse(searchEngineSettings)
}
else {
    searchEngineContainerStore.searchEngineSettings = searchEngineContainerStore.defaultSearchEngineSettings
    localStorage.setItem('searchEngineSettings', JSON.stringify(searchEngineContainerStore.searchEngineSettings))
    console.log('默认搜索引擎配置')
}
</script>

<style scoped>
.search-engine-container {
    display: grid;
    gap: 2px 5px;
    margin-left: 5%;
    margin-right: 5%;
}

@media (max-width: 999px) {
    .search-engine-container {
        margin-left: 5%;
        margin-right: 5%;
    }
}

@media (min-width: 1000px) and (max-width: 1499px) {
    .search-engine-container {
        margin-left: 10%;
        margin-right: 10%;
    }
}

@media (min-width: 1500px) {
    .search-engine-container {
        margin-left: 15%;
        margin-right: 15%;
    }
}
</style>