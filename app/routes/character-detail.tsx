import { ArrowLeft, Heart, Shield, Skull, Sparkles, User } from 'lucide-react'
import { Link, Navigate, redirect } from 'react-router'
import { useShallow } from 'zustand/shallow'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Separator } from '~/components/ui/separator'
import { HOUSES } from '~/lib/api'
import {
  characterDetailLoader,
  useCharacterDetailQuery,
} from '~/lib/api/queries'
import { useUserStore } from '~/lib/stores'
import { cn, getInitials } from '~/lib/utils'
import type { Route } from './+types/character-detail'

export const loader = characterDetailLoader

const houseColorMap: { [key: string]: string } = {
  Gryffindor: 'var(--color-gryffindor-500)',
  Slytherin: 'var(--color-slytherin-500)',
  Hufflepuff: 'var(--color-hufflepuff-400)',
  Ravenclaw: 'var(--color-ravenclaw-500)',
}

export function meta({ data }: Route.MetaArgs) {
  return [
    { title: `${data?.name} | Details` },
    { name: 'description', content: `Details for ${data?.name}.` },
  ]
}

export default function CharacterDetailPage() {
  const { data: character } = useCharacterDetailQuery()

  const { isFavorite, toggleFavorite } = useUserStore(
    useShallow(state => ({
      isFavorite: state.isFavorite,
      toggleFavorite: state.toggleFavorite,
      favoriteCharacterIds: state.favoriteCharacterIds,
    })),
  )

  if (!character) {
    return <Navigate to="/" />
  }

  const isCharacterFavorite = isFavorite(character.id)

  const houseInfo = HOUSES.find(h => h.name === character.house)

  return (
    <>
      <div className="mb-8">
        <Button
          asChild
          variant="outline"
          className="border-stone-600 text-stone-300 hover:text-white hover:bg-stone-700">
          <Link to={-1 as any}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card className="magical-card relative overflow-hidden text-center">
            {character.house && (
              <div
                className="absolute left-0 right-0 top-0 h-1.5"
                style={{
                  backgroundColor:
                    houseColorMap[character.house] || 'transparent',
                }}
              />
            )}
            <CardContent className="pt-6">
              <div className="relative mx-auto w-fit">
                <Avatar className="h-32 w-32 border-4 border-stone-600 shadow-xl">
                  <AvatarImage src={character.image} alt={character.name} />
                  <AvatarFallback className="bg-stone-700 text-2xl font-bold text-magical-gold">
                    {getInitials(character.name)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  onClick={() => toggleFavorite(character.id)}
                  className={cn(
                    'absolute right-0 top-0 h-9 w-9 rounded-full border-2 border-stone-500 bg-stone-800/80 backdrop-blur-sm hover:bg-stone-700',
                    isCharacterFavorite ? 'text-red-400' : 'text-stone-300',
                  )}>
                  <Heart
                    className={cn(
                      'h-5 w-5',
                      isCharacterFavorite && 'fill-current',
                    )}
                  />
                  <span className="sr-only">Toggle Favorite</span>
                </Button>
              </div>
              <CardTitle className="mt-4 text-3xl font-magical text-magical-gold">
                {character.name}
              </CardTitle>
              {character.alternate_names &&
                character.alternate_names.length > 0 && (
                  <CardDescription className="text-stone-400">
                    "{character.alternate_names.join(', ')}"
                  </CardDescription>
                )}
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                <Badge
                  variant="outline"
                  className="border-stone-600 text-stone-300">
                  {character.species}
                </Badge>
                {character.house && houseInfo && (
                  <Badge
                    className={cn(
                      'border-transparent',
                      houseInfo.colorClass,
                      houseInfo.textColor,
                    )}>
                    {character.house}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={
                    character.alive
                      ? 'border-green-600/40 bg-green-900/30 text-green-300'
                      : 'border-red-600/40 bg-red-900/30 text-red-300'
                  }>
                  {character.alive ? (
                    <Shield className="mr-1 h-3 w-3" />
                  ) : (
                    <Skull className="mr-1 h-3 w-3" />
                  )}
                  {character.alive ? 'Alive' : 'Deceased'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-8 lg:col-span-2">
          <Card className="magical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-400">Portrayed by</span>
                <span className="text-stone-100">{character.actor}</span>
              </div>
              <Separator className="bg-stone-700/50" />
              <div className="flex justify-between">
                <span className="text-stone-400">Date of Birth</span>
                <span className="text-stone-100">{character.dateOfBirth}</span>
              </div>
              <Separator className="bg-stone-700/50" />
              <div className="flex justify-between">
                <span className="text-stone-400">Ancestry</span>
                <span className="text-stone-100 capitalize">
                  {character.ancestry}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="magical-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Sparkles className="h-5 w-5" />
                Magical Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-stone-400">Wand</span>
                <span className="text-stone-100 text-right">
                  {character.wand?.length ? `${character.wand?.length}"` : ''}{' '}
                  {character.wand?.wood ? `${character.wand?.wood},` : ''}
                  {character.wand?.core ? `${character.wand?.core}` : ''}
                </span>
              </div>
              <Separator className="bg-stone-700/50" />
              <div className="flex justify-between">
                <span className="text-stone-400">Patronus</span>
                <span className="text-stone-100 capitalize">
                  {character.patronus}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
