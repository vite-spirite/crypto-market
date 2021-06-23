<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Marché</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-progress-bar v-if='status !== 200' type="indeterminate"></ion-progress-bar>
        <ion-content v-else>
            <crypto-block v-for="crypto in data.data" :key='crypto.id' :asset="crypto.symbol" :name="crypto.name" :currentUsdPrice="crypto.metrics.market_data.price_usd" :lastHourUsd="crypto.metrics.market_data.percent_change_usd_last_1_hour"/>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonProgressBar } from '@ionic/vue';

import {getMarketAsset} from '@/composable/market/asset';
import CryptoBlock from '@/components/CryptoBlock.vue';

export default defineComponent({
    name: 'market',
    components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonProgressBar, CryptoBlock },
    setup() {
        const asset = getMarketAsset();
        return {
            ...asset
        }
    },
})
</script>
