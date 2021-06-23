<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Favoris</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content>
            <p>Ici ça sera le marché mis en fav des crypto</p>
        </ion-content>
    </ion-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';

export default defineComponent({
    name: 'favorite',
    components: { IonPage, IonHeader, IonToolbar, IonTitle, IonContent }
})
</script>
