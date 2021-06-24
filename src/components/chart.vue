<template>
    <div class='chart-wrapper'>
        <apexchart id='market' type="area" :height="height" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

import VueApexCharts from "vue3-apexcharts";

export default defineComponent({
    name: 'Chart',
    components: {apexchart: VueApexCharts},
    props: {
        name: {
            required: true,
            type: String as PropType<string>
        },
        height: {
            required: false,
            type: Number as PropType<number>,
            default: 350,
        },
        series: {
            required: true,
            type: Array as PropType<any[]>
        },
    },
    data() {
        return {
            chartOptions: {
                chart: {
                    height: this.height,
                    type: 'area',
                    id: 'market'
                },
                title: {
                    text: this.name,
                    align: 'left'
                },
                tooltip: {
                    theme: 'dark',
                    x: {
                        format: 'dd/MM/yy HH:mm'
                    },
                },
                dataLabels: {
                    enabled: false
                },
                theme: {
                    mode: 'dark'
                },
                strock: {
                    curve: 'smooth',
                },
                xaxis: {
                    type: 'datetime'
                },
                zoom: {
                    type: 'x',
                    enabled: true,
                    autoScaleYaxis: true
                },
            }
        }
    },
})
</script>

