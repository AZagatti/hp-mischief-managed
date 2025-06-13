import { Link } from 'react-router'

import { cn, getInitials } from '~/lib/utils'
import { useUserStore } from '~/lib/stores'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Heart, Sparkles, User, Wand2 } from 'lucide-react'
import { useShallow } from 'zustand/shallow'

type Character = {
  id: string
  name: string
  image?: string
  species: string
  house?: string
  actor: string
  wand?: {
    wood?: string
  }
}

interface CharacterCardProps {
  character: Character
}

export const CharacterCard = ({ character }: CharacterCardProps) => {
  const { isFavorite, toggleFavorite } = useUserStore(
    useShallow(state => ({
      isFavorite: state.isFavorite,
      toggleFavorite: state.toggleFavorite,
      favoriteCharacterIds: state.favoriteCharacterIds,
    })),
  )
  const isCharacterFavorite = isFavorite(character.id)
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(character.id)
  }

  const houseColorMap: { [key: string]: string } = {
    Gryffindor: 'var(--color-gryffindor-500)',
    Slytherin: 'var(--color-slytherin-500)',
    Hufflepuff: 'var(--color-hufflepuff-400)',
    Ravenclaw: 'var(--color-ravenclaw-500)',
  }

  return (
    <Card
      className={cn(
        'magical-card group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-magical-gold/20',
      )}>
      {character.house && (
        <div
          className="absolute left-0 right-0 top-0 h-1"
          style={{
            backgroundColor: houseColorMap[character.house] || 'transparent',
          }}
        />
      )}

      <CardHeader className="pb-3">
        <div className="flex min-w-0 items-start justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-3">
            <Avatar className="h-12 w-12 border-2 border-stone-600">
              <AvatarImage src={character.image || ''} alt={character.name} />
              <AvatarFallback className="bg-stone-700 font-semibold text-magical-gold">
                {getInitials(character.name)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <CardTitle className="truncate text-lg text-stone-100">
                {character.name}
              </CardTitle>
              <CardDescription className="capitalize text-stone-400">
                {character.species}
              </CardDescription>
            </div>
          </div>

          <Button
            onClick={handleFavoriteToggle}
            variant="ghost"
            size="icon"
            className={cn(
              'h-8 w-8 shrink-0',
              isCharacterFavorite
                ? 'text-red-400 hover:text-red-300'
                : 'text-stone-500 hover:text-red-400',
            )}>
            <Heart
              className={cn('h-4 w-4', isCharacterFavorite && 'fill-current')}
            />
            <span className="sr-only">Toggle Favorite</span>
          </Button>
        </div>

        {character.house && (
          <div className="flex pt-2">
            <Badge
              style={{
                backgroundImage: `linear-gradient(to right, ${houseColorMap[character.house]}, oklch(from ${houseColorMap[character.house]} l c h / 60%))`,
                color: character.house === 'Hufflepuff' ? 'black' : 'white',
                borderWidth: 0,
              }}>
              <Sparkles className="mr-1 h-3 w-3" />
              {character.house}
            </Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2 text-sm">
          {character.actor && (
            <div className="flex items-center gap-2 text-stone-300">
              <User className="h-4 w-4 text-stone-500" />
              <span>Portrayed by {character.actor}</span>
            </div>
          )}
          {character.wand?.wood && (
            <div className="flex items-center gap-2 text-stone-300">
              <Wand2 className="h-4 w-4 text-stone-500" />
              <span>Wand: {character.wand.wood}</span>
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-stone-700/50">
          <Link to={`/character/${character.id}`} prefetch="intent">
            <Button
              variant="outline"
              className="w-full border-stone-600 text-stone-300 hover:border-magical-gold hover:text-magical-gold">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
