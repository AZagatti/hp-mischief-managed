import { Search, UserCheck } from 'lucide-react'
import { CharacterCard } from '~/lib/components'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import type { Route } from './+types/students'
import { staffLoader, useStaffQuery } from '~/lib/api/queries'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { Skeleton } from '~/components/ui/skeleton'
import { useDebouncedCallback } from '~/lib/hooks/use-debounce-callback'

export const loader = staffLoader

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Hogwarts Staff' },
    {
      name: 'description',
      content: 'A list of all staff members at Hogwarts.',
    },
  ]
}

export default function StudentsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { data: staff = [], isLoading } = useStaffQuery()

  const searchFilter = searchParams.get('search')

  const filteredStaff = useMemo(() => {
    if (!searchFilter) {
      return staff
    }
    return staff.filter(member =>
      member.name.toLowerCase().includes(searchFilter.toLowerCase()),
    )
  }, [staff, searchFilter])

  const handleSearchChange = useDebouncedCallback((value: string) => {
    const newParams = new URLSearchParams(searchParams)
    if (value) {
      newParams.set('search', value)
    } else {
      newParams.delete('search')
    }
    setSearchParams(newParams, { replace: true })
  })

  return (
    <>
      <div className="mb-8">
        <div className="mb-4 flex items-center gap-3">
          <UserCheck className="h-8 w-8 text-magical-gold" />
          <div>
            <h1 className="text-3xl font-bold font-magical text-magical-gold">
              Hogwarts Staff
            </h1>
            <p className="text-stone-300">
              Meet the dedicated faculty and staff of Hogwarts
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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-500" />
            <Input
              placeholder="Search staff by name..."
              className="bg-stone-800 pl-10 text-white placeholder:text-stone-400"
              defaultValue={searchFilter || ''}
              onChange={e => handleSearchChange(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-64 rounded-lg" />
            ))
          : filteredStaff.map(member => (
              <CharacterCard key={member.id} character={member} />
            ))}
      </div>
    </>
  )
}
