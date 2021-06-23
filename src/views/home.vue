<template>
    <ion-page>
        <ion-tabs>
            <ion-tab-bar slot="bottom">

                <ion-tab-button tab="market" href="/market">
                    <ion-icon :icon="analyticsOutline"></ion-icon>
                    <ion-label>Marché</ion-label>
                </ion-tab-button>

                <ion-tab-button tab="favorite" href="/favorite">
                    <ion-icon :icon="starOutline"></ion-icon>
                    <ion-label>Favoris</ion-label>
                </ion-tab-button>


            </ion-tab-bar>
        </ion-tabs>
    </ion-page>
</template>

<script lang="ts">
import { loadingController } from '@ionic/vue';
import { IonIcon, IonTabBar, IonTabButton, IonTabs, IonPage, IonLabel } from '@ionic/vue';

import { defineComponent } from 'vue'

import {connectionStatus} from '@/composable/connectionChecker';

import {analyticsOutline, starOutline} from 'ionicons/icons'

type homeData = {
    loader: HTMLIonLoadingElement|undefined;
}

export default defineComponent({
    name: "home",
    components: { IonIcon, IonTabBar, IonTabButton, IonTabs, IonPage, IonLabel },
    data: (): homeData => ({
        loader: undefined,
    }),
    setup() {
        const connection = connectionStatus();
        return {
            isConnected: connection,
            analyticsOutline,
            starOutline
        }
    },
    methods: {
        async showLoader(text?: string|undefined) {
            this.loader = await loadingController.create({
                backdropDismiss: false,
                translucent: true,
                spinner: 'dots',
                showBackdrop: true,
                message: text
            });

            await this.loader.present()
        },
        async closeLoader() {
            (this.loader as HTMLIonLoadingElement).dismiss();
            this.loader = undefined;
        }
    }, 
    watch: {
        isConnected(value) {
            if(!value) {
                this.showLoader(`Connexion internet perdu`);
            }
            else {
                if(this.loader) {
                    this.closeLoader();
                }
            }
        }
    }
})
</script>