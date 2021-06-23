import { Network } from '@capacitor/network'

import { onMounted, Ref, ref } from "vue";

export const connectionStatus = (): Ref<boolean> => {
    const isConnected = ref(false);

    Network.addListener('networkStatusChange', (connectionStatus) => {
        isConnected.value = connectionStatus.connected;
    });

    onMounted(async () => {
        isConnected.value = (await Network.getStatus()).connected;
    });

    return isConnected;
}