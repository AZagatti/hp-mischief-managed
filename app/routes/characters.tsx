import type { Route } from './+types/characters'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Checkbox } from '~/components/ui/checkbox'
import { Label } from '~/components/ui/label'
import { CharacterCard } from '~/lib/components/character-card'
import { HOUSES } from '~/lib/api'
import { Filter, Search, Users, SortAsc, SortDesc } from 'lucide-react'
import { allCharactersLoader, useAllCharactersQuery } from '~/lib/api/queries'
import { useMemo, useRef } from 'react'
import { useSearchParams } from 'react-router'
import { Skeleton } from '~/components/ui/skeleton'
import { cn } from '~/lib/utils'
import { Badge } from '~/components/ui/badge'
import { useDebouncedCallback } from '~/lib/hooks/use-debounce-callback'

export const loader = allCharactersLoader

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'All Characters' },
    {
      name: 'description',
      content: 'Browse all characters from the Harry Potter universe.',
    },
  ]
}

export default function CharactersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: allCharacters = [], isLoading } = useAllCharactersQuery()
  const inputRef = useRef<HTMLInputElement>(null)

  const searchFilter = searchParams.get('search')
  const houseFilter = searchParams.get('house')
  const sortBy = searchParams.get('sortBy') || 'name'
  const showOnlyAlive = searchParams.get('alive') === 'true'
  const showOnlyWizards = searchParams.get('wizards') === 'true'

  const charactersByHouse = useMemo(() => {
    return allCharacters.reduce(
      (acc, character) => {
        if (!character.house) return acc
        acc[character.house] = (acc[character.house] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [allCharacters])

  const filteredCharacters = useMemo(() => {
    let characters = [...allCharacters]

    if (showOnlyAlive) {
      characters = characters.filter(c => c.alive)
    }
    if (showOnlyWizards) {
      characters = characters.filter(c => c.wizard)
    }

    if (searchFilter || houseFilter) {
      characters = characters.filter(c => {
        const searchMatch = searchFilter
          ? c.name.toLowerCase().includes(searchFilter.toLowerCase())
          : true
        const houseMatch = houseFilter ? c.house === houseFilter : true
        return searchMatch && houseMatch
      })
    }

    characters.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name)
      }
      if (sortBy === 'house') {
        if (a.house && !b.house) return -1
        if (!a.house && b.house) return 1

        return (a.house || '').localeCompare(b.house || '')
      }
      return 0
    })

    return characters
  }, [
    allCharacters,
    searchFilter,
    houseFilter,
    sortBy,
    showOnlyAlive,
    showOnlyWizards,
  ])

  const handleParamChange = (key: string, value: string | null | boolean) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set(key, String(value))
    } else {
      newParams.delete(key)
    }
    setSearchParams(newParams)
  }

  const handleSearchDebounced = useDebouncedCallback((value: string) => {
    handleParamChange('search', value)
  })

  const handleClearAllFilters = () => {
    setSearchParams({})
    inputRef.current!.value = ''
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold font-magical text-magical-gold">
          All Characters
        </h1>
        <p className="text-stone-300">
          Explore all {allCharacters.length} characters from the wizarding world
        </p>
      </div>

      <Card className="magical-card mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
          <CardDescription className="text-stone-300">
            Find the character you're looking for
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
            <Input
              ref={inputRef}
              placeholder="Search by name..."
              className="bg-stone-800 pl-10 text-white placeholder:text-stone-400"
              defaultValue={searchFilter || ''}
              onChange={e => handleSearchDebounced(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-2">
              <Label className="text-stone-300">House</Label>
              <Select
                value={houseFilter || 'all'}
                onValueChange={v =>
                  handleParamChange('house', v === 'all' ? null : v)
                }>
                <SelectTrigger className="bg-stone-800 text-white">
                  <SelectValue placeholder="All Houses" />
                </SelectTrigger>
                <SelectContent className="magical-card border-stone-700 text-stone-200">
                  <SelectItem
                    value="all"
                    className="focus:bg-stone-700 focus:text-stone-100">
                    All Houses
                  </SelectItem>
                  {HOUSES.map(house => (
                    <SelectItem
                      key={house.name}
                      value={house.name}
                      className="focus:bg-stone-700 focus:text-stone-100">
                      <div className="flex items-center gap-2">
                        <div
                          className={cn(
                            'h-2 w-2 rounded-full',
                            house.colorClass,
                          )}
                        />
                        <span>{house.name}</span>
                      </div>
                      <Badge
                        variant="outline"
                        className="ml-2 border-stone-600 text-stone-300 tabular-nums">
                        {charactersByHouse[house.name] || 0}
                      </Badge>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-stone-300">Sort By</Label>
              <Select
                value={sortBy}
                onValueChange={v => handleParamChange('sortBy', v)}>
                <SelectTrigger className="bg-stone-800 text-white">
                  <SelectValue placeholder="Name" />
                </SelectTrigger>
                <SelectContent className="magical-card border-stone-700 text-stone-200">
                  <SelectItem
                    value="name"
                    className="focus:bg-stone-700 focus:text-stone-100">
                    Name
                  </SelectItem>
                  <SelectItem
                    value="house"
                    className="focus:bg-stone-700 focus:text-stone-100">
                    House
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label className="text-stone-300">Quick Filters</Label>
              <div className="space-y-2 pt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="alive"
                    className="border-stone-500 data-[state=checked]:bg-magical-gold data-[state=checked]:text-magical-dark"
                    checked={showOnlyAlive}
                    onCheckedChange={c =>
                      handleParamChange('alive', c.valueOf())
                    }
                  />
                  <Label htmlFor="alive" className="text-stone-300 font-normal">
                    Only alive characters
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="wizards"
                    className="border-stone-500 data-[state=checked]:bg-magical-gold data-[state=checked]:text-magical-dark"
                    checked={showOnlyWizards}
                    onCheckedChange={c =>
                      handleParamChange('wizards', c.valueOf())
                    }
                  />
                  <Label
                    htmlFor="wizards"
                    className="text-stone-300 font-normal">
                    Only wizards
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 justify-end">
              <Button
                variant="outline"
                className="border-stone-600 text-stone-300 hover:text-white hover:bg-stone-700"
                onClick={handleClearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))
          : filteredCharacters.map(character => (
              <CharacterCard key={character.id} character={character} />
            ))}
      </div>
    </>
  )
}
