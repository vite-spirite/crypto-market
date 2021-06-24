<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Marché</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-progress-bar v-if='loading' type="indeterminate"></ion-progress-bar>
        <ion-content v-else>
            <crypto-block v-for="crypto in data.data" :key='crypto.id' :asset="crypto.symbol" :name="crypto.name" :currentUsdPrice="crypto.metrics.market_data.price_usd" :lastHourUsd="crypto.metrics.market_data.percent_change_usd_last_1_hour"/>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonProgressBar } from '@ionic/vue';

import CryptoBlock from '@/components/CryptoBlock.vue';

import axios from 'axios';

export default defineComponent({
    name: 'market',
    components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonProgressBar, CryptoBlock },
    data: () => ({
        loading: true,
        data: {},
    }),

    async mounted() {
        this.loading = true;
        this.data = (await axios.get('https://data.messari.io/api/v2/assets?limit=50')).data;
        this.loading = false;
    }
})
</script>
