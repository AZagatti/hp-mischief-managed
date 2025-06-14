import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  selectedHouse: string | null
  favoriteCharacterIds: string[]
  setSelectedHouse: (house: string | null) => void
  toggleFavorite: (characterId: string) => void
  isFavorite: (characterId: string) => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      selectedHouse: null,
      favoriteCharacterIds: [],
      setSelectedHouse: house => set({ selectedHouse: house }),
      isFavorite: characterId => {
        return get().favoriteCharacterIds.includes(characterId)
      },
      toggleFavorite: characterId => {
        const isAlreadyFavorite = get().isFavorite(characterId)
        if (isAlreadyFavorite) {
          set(state => ({
            favoriteCharacterIds: state.favoriteCharacterIds.filter(
              id => id !== characterId,
            ),
          }))
        } else {
          set(state => ({
            favoriteCharacterIds: [...state.favoriteCharacterIds, characterId],
          }))
        }
      },
    }),
    {
      name: 'harry-potter-user-storage',
    },
  ),
)
