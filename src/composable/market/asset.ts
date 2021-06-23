import {useAxios} from '@vue-composable/axios';
import { onMounted } from 'vue';

export const getMarketAsset = () => {
    const { data, status } = useAxios('https://data.messari.io/api/v2/assets?limit=50', {
        method: 'GET'
    });

    return {
        data,
        status,
    }
}