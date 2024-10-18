import { defineStore } from 'pinia'

export const useBackgroundStore = defineStore('background', {
    state: () => {
        return {
            backgroundSettings: {
                randomBackground: true,
                backgroundList: [],
                currentBackgroundPath: '',
                defaultBackgroundPath: ''
            },
            defaultBackgroundSettings: {
                randomBackground: true,
                backgroundList: [
                    {
                        used: true,
                        path: './images/backgrounds/湖心小屋.png'
                    },
                    {
                        used: true,
                        path: './images/backgrounds/黛.png',
                    }
                ],
                currentBackgroundPath: '',
                defaultBackgroundPath: './images/backgrounds/黛.png'
            }
        }
    }
})
