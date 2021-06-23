<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button default-href="/"></ion-back-button>
                </ion-buttons>

                <ion-title v-if='loading'>{{$route.params.asset}}</ion-title>
                <ion-title v-else>{{info.name}}</ion-title>
            </ion-toolbar>
            <ion-progress-bar v-if='loading' type="indeterminate"></ion-progress-bar>
        </ion-header>

        <ion-content v-if='!loading'>
            <ion-item>
                <ion-label>{{info.name}}:</ion-label>
            </ion-item>
            <ion-item>
                <ion-label>Prix 1 {{info.symbol}}:</ion-label>
                <ion-label>{{info['market_data']['price_usd']}}$</ion-label>
            </ion-item>
            <ion-item>
                <ion-label>Volume (24H):</ion-label>
                <ion-label>{{info['market_data']['real_volume_last_24_hours']}} USD</ion-label>
            </ion-item>

            <Chart :name='info.name' :height="500" :series="series"/>

            <ion-item>
                <ion-label>Période:</ion-label>
                <ion-button fill="clear" @click='loadTimeseries(new Date(zoom.start), new Date(zoom.end))'>Charger</ion-button>
                <ion-button fill='clear' color='danger' @click='initTimeseries()'>Rénitialiser</ion-button>
            </ion-item>
            <ion-item>
                <ion-label>Départ:</ion-label>
                <ion-datetime v-model='zoom.start' min='2015' :max="currentDate()" display-format="DD/MM/YYYY" display-timezone="utc"/>
            </ion-item>
            <ion-item v-if='zoom.start.length > 0'>
                <ion-label>Fin:</ion-label>
                <ion-datetime v-model='zoom.end' :min='getMinEndDate()' :max="currentDate()" display-format="DD/MM/YYYY" display-timezone="utc"/>
            </ion-item>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {IonItem, IonLabel, IonDatetime, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonProgressBar} from '@ionic/vue';

import Chart from '../components/Chart.vue';
import axios from 'axios';
import dateFormat from 'dateformat';

export default defineComponent({
    components: {IonItem, IonLabel, IonDatetime, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonBackButton, IonButtons, IonProgressBar, Chart},
    data: () => ({
        loading: true,
        info: {} as any,
        series: [] as any[],
        news: {} as any,
        zoom: {
            start: '',
            end: '',
        },
        updateIntervale: null as NodeJS.Timeout|null,
    }),
    methods: {
        async loadTimeseries(start?: Date, end?: Date) {
            let _start: number;
            let _end: number;

            if(start) {
                _start = start.getTime();
            }
            else {
                _start = new Date('2015-01-01').getTime();
            }

            if(end) {
                _end = end.getTime();
            }
            else {
                _end = Date.now();
            }

            const result = await axios.get(`https://data.messari.io/api/v1/assets/${this.$route.params.asset}/metrics/price/time-series?start=${_start}&end=${_end}&columns=timestamp,open,high,low,close`);
            this.series = [
                {
                    data: result.data.data.values.map((value: any[]) => {return {y: Number(value[1]).toFixed(2), x: new Date(value[0]).getTime()}}),
                    name: 'open'
                },
                {
                    data: result.data.data.values.map((value: any[]) => {return {y: Number(value[2]).toFixed(2), x: new Date(value[0]).getTime()}}),
                    name: 'hight'
                },
                {
                    data: result.data.data.values.map((value: any[]) => {return {y: Number(value[3]).toFixed(2), x: new Date(value[0]).getTime()}}),
                    name: 'low'
                },
                {
                    data: result.data.data.values.map((value: any[]) => {return {y: Number(value[4]).toFixed(2), x: new Date(value[0]).getTime()}}),
                    name: 'close'
                },
            ];
        },
        async getMetricAsset() {
            const result = await axios.get(`https://data.messari.io/api/v1/assets/${this.$route.params.asset}/metrics`);
            this.info = result.data.data;
        },
        currentDate() {
            return dateFormat(Date.now(), 'yyyy-mm-dd');
        },
        getMinEndDate() {
            return dateFormat(new Date(this.zoom.start), 'yyyy-mm-dd');
        },
        async initTimeseries() {
            this.zoom = {end: '', start: ''};
            await this.loadTimeseries();
        },
        async loadAllData() {
            await this.loadTimeseries(new Date(this.zoom.start), new Date(this.zoom.end));
            await this.getMetricAsset();
        }
    },
    async mounted() {
        const currentDate = new Date();
        this.zoom.end = dateFormat(currentDate, 'yyyy-mm-dd');
        this.zoom.start = dateFormat(new Date().setMonth(currentDate.getMonth()-1), 'yyyy-mm-dd');

        this.loadAllData();

        this.updateIntervale = setInterval(async () => {
            await this.loadAllData();
        }, 300000);

        this.loading = false;

        console.log(this.info);
    },
    beforeUnmount() {
        clearInterval(this.updateIntervale as NodeJS.Timeout);
        this.updateIntervale = null;
    }
})
</script>
