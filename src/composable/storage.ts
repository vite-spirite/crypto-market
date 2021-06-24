import {Storage} from '@capacitor/storage';
import { inject, InjectionKey, Ref, provide } from 'vue';
import { ref } from 'vue';
const FAVORITE_KEY = 'FAVORITE';

type storeType = {
    getFavorites: () => Promise<string[]|undefined>;
    addFavorite: (symbol: string) => Promise<boolean>;
    deleteFavorite: (symbol: string) => Promise<boolean>;
    isFavorite: (symbol: string) => Promise<boolean>;
    favoriteUpdated: Ref<boolean>;
}

const injectionKey: InjectionKey<storeType> = Symbol('StoreModule');

export const provideStore = (): storeType => {
    const favoriteUpdated = ref(false);
    
    const saveFavorite = async (favorites: string[]): Promise<void> => {
        await Storage.set({key: FAVORITE_KEY, value: JSON.stringify(favorites)});
    }

    const getFavorites = async (): Promise<string[]|undefined> => {
        const favorites = await Storage.get({key: FAVORITE_KEY});
        favoriteUpdated.value = false;

        if(favorites.value) {
            return JSON.parse(favorites.value);
        }
        else {
            return undefined;
        }
    }

    const addFavorite = async (symbol: string): Promise<boolean> => {
        const favorite = await getFavorites();

        if(favorite) {
            if(favorite.find((fav) => fav === symbol)) {
                return false;
            }
        }

        const _set = [symbol];
        if(favorite) {
            _set.push(...favorite);
        }

        favoriteUpdated.value = true;
        saveFavorite(_set);
        return true;
    }

    const deleteFavorite = async (symbol: string): Promise<boolean> => {
        const favorite = await getFavorites();

        if(!favorite) {
            return false;
        }

        const _index = favorite.findIndex((value) => value === symbol);
        if(_index > -1) {
            favorite.splice(_index, 1);
        }
        favoriteUpdated.value = true;
        await saveFavorite(favorite);
        return true;
    }

    const isFavorite = async (symbol: string): Promise<boolean> => {
        const favorites = await getFavorites();

        if(!favorites) {
            return false;
        }

        const _is = favorites.findIndex((value) => value === symbol);
        return (_is > -1) ? (true) : (false);
    }

    const data: storeType = {
        deleteFavorite,
        getFavorites,
        addFavorite,
        isFavorite,
        favoriteUpdated
    }

    provide(injectionKey, data);
    return data;
}

export const store = (): storeType => {
    const store = inject(injectionKey);

    if(!store) {
        return provideStore();
    }

    return store;
}