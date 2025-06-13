import type { Route } from './+types/students'
import { CharacterCard } from '~/lib/components'
import { GraduationCap, Search } from 'lucide-react'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '~/components/ui/select'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { HOUSES } from '~/lib/api'
import { Badge } from '~/components/ui/badge'
import { cn } from '~/lib/utils'
import { useSearchParams } from 'react-router'
import { studentsLoader, useStudentsQuery } from '~/lib/api/queries'
import { useMemo } from 'react'
import { Skeleton } from '~/components/ui/skeleton'
import { useDebouncedCallback } from '~/lib/hooks/use-debounce-callback'

export const loader = studentsLoader

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Hogwarts Students' },
    { name: 'description', content: 'A list of all students at Hogwarts.' },
  ]
}

export default function StudentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: students = [], isLoading } = useStudentsQuery()

  const searchFilter = searchParams.get('search')
  const houseFilter = searchParams.get('house')

  const studentsByHouse = useMemo(() => {
    return students.reduce(
      (acc, student) => {
        if (!student.house) return acc
        acc[student.house] = (acc[student.house] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
  }, [students])

  const filteredStudents = useMemo(() => {
    if (!searchFilter && !houseFilter) {
      return students
    }
    return students.filter(student => {
      const searchMatch = searchFilter
        ? student.name.toLowerCase().includes(searchFilter.toLowerCase())
        : true
      const houseMatch = houseFilter ? student.house === houseFilter : true
      return searchMatch && houseMatch
    })
  }, [students, searchFilter, houseFilter])

  const handleSearchChange = useDebouncedCallback((value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set('search', value)
    } else {
      newParams.delete('search')
    }
    setSearchParams(newParams, { replace: true })
  })

  const handleHouseChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value && value !== 'all') {
      newParams.set('house', value)
    } else {
      newParams.delete('house')
    }
    setSearchParams(newParams, { replace: true })
  }

  return (
    <>
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <GraduationCap className="h-8 w-8 text-magical-gold" />
          <div>
            <h1 className="text-3xl font-bold font-magical text-magical-gold">
              Hogwarts Students
            </h1>
            <p className="text-stone-300">
              Discover the students who walked the halls of Hogwarts
            </p>
          </div>
        </div>
      </div>

      <Card className="magical-card mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Search className="h-5 w-5" />
            Find Students
          </CardTitle>
          <CardDescription className="text-stone-300">
            Search and filter through Hogwarts students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
              <Input
                placeholder="Search by name..."
                className="bg-stone-800 pl-10 text-white placeholder:text-stone-400"
                defaultValue={searchFilter || ''}
                onChange={e => handleSearchChange(e.target.value)}
              />
            </div>

            <Select
              defaultValue={houseFilter || 'all'}
              onValueChange={handleHouseChange}>
              <SelectTrigger className="bg-stone-800 text-white">
                <SelectValue placeholder="Filter by House" />
              </SelectTrigger>
              <SelectContent className="magical-card border-stone-700 text-stone-200">
                <SelectItem value="all">All Houses</SelectItem>
                {HOUSES.map(house => (
                  <SelectItem
                    key={house.name}
                    value={house.name}
                    className="focus:bg-stone-700 focus:text-stone-100">
                    <div className="flex w-full items-center justify-between">
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
                        {studentsByHouse[house.name] || 0}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))
          : filteredStudents.map(student => (
              <CharacterCard key={student.id} character={student} />
            ))}
      </div>
    </>
  )
}
