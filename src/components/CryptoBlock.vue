<template>
    <div class='crypto-wrapper' @click='clickWrapper()'>
        <div class='crypto'>
            <div class='crypto-info'>
                <ion-button fill="clear" @click.stop="clickFavorite()">
                    <ion-icon v-if='!favorite' :icon='starOutline'></ion-icon>
                    <ion-icon v-else :icon='star'></ion-icon>
                </ion-button>

                <ion-title size="large">{{name}}</ion-title>
            </div>
            <div class='currency'>
                <ion-text>{{fixeNumber(currentUsdPrice, 2)}} USD</ion-text>
                <ion-text v-if='lastHourUsd' :color='(lastHourUsd > 0) ? ("success") : ("danger")'>{{fixeNumber(lastHourUsd, 3)}} USD</ion-text>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import {IonText, IonTitle, IonIcon, IonButton} from '@ionic/vue'
import {starOutline, star} from 'ionicons/icons'

import {store} from '@/composable/storage';

export default defineComponent({
    name: 'CryptoBlock',
    components: {IonText, IonTitle, IonIcon, IonButton},
    props: {
        name: {
            type: String as PropType<string>,
            required: true,
        },
        currentUsdPrice: {
            type: Number as PropType<number>,
            required: true,
        },
        lastHourUsd: {
            type: Number as PropType<number>,
            default: 0,
            required: false
        },
        asset: {
            type: String as PropType<string>,
            required: true,
        }
    },
    setup() {
        const {isFavorite, addFavorite, deleteFavorite} = store();

        return {
            starOutline,
            star,
            isFavorite, 
            addFavorite, 
            deleteFavorite
        }
    },
    methods: {
        fixeNumber(number: number, digit: number): string {
            return number.toFixed(digit);
        },
        clickWrapper(): void {
            this.$router.push(`/market/asset/${this.asset}`);
        },
        async clickFavorite(): Promise<void> {
            if(this.favorite) {
                await this.deleteFavorite(this.asset);
                this.favorite = false;
            }
            else {
                await this.addFavorite(this.asset);
                this.favorite = true;
            }
        },
    },
    data: () => ({
        favorite: false,
    }),
    async mounted() {
        this.favorite = await this.isFavorite(this.asset);
    },
})
</script>

<style scoped>
.crypto-wrapper {
    margin: .5rem 1rem;
    padding: 1rem;

    background: rgba(24, 24, 24, .5);
    border-radius: 16px;
    cursor: pointer;
}
.crypto-wrapper .crypto {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}
.crypto-wrapper .crypto .currency {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-end;

    text-align: right;
}
.crypto-wrapper .crypto .currency * {
    padding: 5px;
}
.crypto-wrapper .crypto .crypto-info {
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
}
</style>
