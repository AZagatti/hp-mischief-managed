import { useMemo } from 'react'
import type { Route } from './+types/favorites'
import { allCharactersLoader, useAllCharactersQuery } from '~/lib/api/queries'
import { useUserStore } from '~/lib/stores/user'

import { CharacterCard } from '~/lib/components/character-card'
import { Heart } from 'lucide-react'

export const loader = allCharactersLoader

export function meta({}: Route.MetaArgs) {
  return [{ title: 'Favorite Characters' }]
}

export default function FavoritesPage() {
  const { data: allCharacters = [] } = useAllCharactersQuery()
  const favoriteCharacterIds = useUserStore(state => state.favoriteCharacterIds)

  const favoriteCharacters = useMemo(() => {
    return allCharacters.filter(character =>
      favoriteCharacterIds.includes(character.id),
    )
  }, [allCharacters, favoriteCharacterIds])

  return (
    <>
      <div className="mb-8">
        <h1 className="flex items-center gap-3 text-3xl font-bold font-magical text-magical-gold">
          <Heart className="h-8 w-8" />
          Favorite Characters
        </h1>
      </div>

      {favoriteCharacters.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteCharacters.map(character => (
            <CharacterCard key={character.id} character={character} />
          ))}
        </div>
      ) : (
        <div className="flex h-64 items-center justify-center rounded-lg border-2 border-dashed border-stone-700">
          <p className="text-stone-400">You have no favorite characters yet.</p>
        </div>
      )}
    </>
  )
}
