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
                        path: './images/backgrounds/LakeCabin.png'
                    },
                    {
                        used: true,
                        path: './images/backgrounds/Dai.png',
                    }
                ],
                currentBackgroundPath: '',
                defaultBackgroundPath: './images/backgrounds/Dai.png'
            }
        }
    }
})
