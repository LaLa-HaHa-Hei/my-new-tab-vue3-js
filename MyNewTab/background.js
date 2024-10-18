chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "GET_REQUEST") {
        axios.get(request.url)
            .then(response => {
                sendResponse({ data: response.data });
            })
            .catch(error => {
                sendResponse({ error: error.message });
            });
        return true; // 表示将异步响应
    }
});

chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.set({ 'singleNewTabEnabled': false })
})

// 监听标签页创建事件，决定是否只保留一个新标签页
chrome.tabs.onCreated.addListener(async function (tab) {
    const singleNewTabEnabled = (await chrome.storage.local.get('singleNewTabEnabled')).singleNewTabEnabled === true ? true : false
    if (singleNewTabEnabled === false) {
        return
    }
    const newTabUrl1 = "chrome://newtab/";
    const newTabUrl2 = "edge://newtab/";
    if (tab.pendingUrl === newTabUrl1 || tab.pendingUrl === newTabUrl2) {
        chrome.tabs.query({ currentWindow: true }, function (tabs) {
            let newTabExists = null;
            // 遍历所有标签页，找到已经存在的新标签页
            for (let i = 0; i < tabs.length - 1; i++) {
                if (tabs[i].url === newTabUrl1 || tabs[i].url === newTabUrl2) {
                    newTabExists = tabs[i];
                    break;
                }
            }
            // 如果有新标签页，关闭当前新标签页
            if (newTabExists) {
                chrome.tabs.update(newTabExists.id, { active: true });
                chrome.tabs.remove(tab.id); // 关闭当前标签页
            }
        });
    }
})
