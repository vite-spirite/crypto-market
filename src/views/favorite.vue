<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Favoris</ion-title>
            </ion-toolbar>
            <ion-progress-bar v-if='loading' type="indeterminate"></ion-progress-bar>
        </ion-header>
        <ion-content v-if='!loading && !cryptos.length'>
            <ion-text>Vous n'avez aucun favoris.</ion-text>
        </ion-content>
        <ion-content v-if='!loading && cryptos.length > 0'>
            <crypto-block v-for='crypto in cryptos' :key='crypto.id' :asset="crypto.symbol" :name="crypto.name" :currentUsdPrice='crypto.market_data.price_usd' :lastHourUsd="crypto.market_data.percent_change_eth_last_1_hour"/>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonText, IonProgressBar } from '@ionic/vue';
import {store} from '@/composable/storage';

import CryptoBlock from '@/components/CryptoBlock.vue';
import axios from 'axios';

export default defineComponent({
    name: 'favorite',
    components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, CryptoBlock, IonText, IonProgressBar },
    data: () => ({
        loading: true,
        cryptos: [] as any[],
    }),
    setup() {
        return {
            ...store(),
        }
    },
    methods: {
        async loadFavorites() {
            try {
                this.loading = true;

                const favorites = await this.getFavorites();
                const promises: Promise<any>[] = [];
                if(favorites) {

                    favorites.forEach(favorite => {
                        promises.push(axios.get(`https://data.messari.io/api/v1/assets/${favorite}/metrics/market-data`));
                    });

                }

                const data = await Promise.all(promises);
                this.cryptos = data.map(value => value.data.data);
                this.loading = false;
            }
            catch(error) {
                setTimeout(() => {
                    this.loadFavorites();
                }, 20000);
            }
        }
    },
    async mounted() {
        await this.loadFavorites();
    },
    watch: {
        async favoriteUpdated() {
            await this.loadFavorites();
        }
    }
})
</script>
