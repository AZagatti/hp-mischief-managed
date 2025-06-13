import type { Route } from './+types/home'
import { Link } from 'react-router'
import { Card, CardContent } from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
import { Users, GraduationCap, UserCheck, Castle } from 'lucide-react'
import { allCharactersLoader, useAllCharactersQuery } from '~/lib/api/queries'

export const loader = allCharactersLoader

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Mischief Managed | Harry Potter' },
    {
      name: 'description',
      content: 'Explore the magical world of Harry Potter characters.',
    },
  ]
}

export default function HomePage() {
  const { data: allCharacters = [], isLoading } = useAllCharactersQuery()

  const students = allCharacters.filter(c => c.hogwartsStudent) || []
  const staff = allCharacters.filter(c => c.hogwartsStaff) || []

  return (
    <>
      <div className="text-center mb-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Castle className="h-16 w-16 text-magical-gold mr-4" />
            <div>
              <h1 className="text-4xl md:text-6xl font-bold font-magical text-magical-gold mb-2">
                Mischief Managed
              </h1>
              <p className="text-xl text-stone-300">
                Explore the magical world of Harry Potter characters
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Link to="/characters">
              <Card className="magical-card hover:shadow-xl hover:shadow-magical-gold/20 transition-all duration-300 cursor-pointer group">
                <CardContent className="flex items-center p-6">
                  <Users className="h-8 w-8 text-magical-gold mr-4" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">
                      {isLoading ? (
                        <Skeleton className="h-6 w-12 bg-stone-700" />
                      ) : (
                        allCharacters.length
                      )}
                    </div>
                    <div className="text-stone-400 group-hover:text-stone-300 transition-colors">
                      All Characters
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/students">
              <Card className="magical-card hover:shadow-xl hover:shadow-magical-gold/20 transition-all duration-300 cursor-pointer group">
                <CardContent className="flex items-center p-6">
                  <GraduationCap className="h-8 w-8 text-magical-gold mr-4" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">
                      {isLoading ? (
                        <Skeleton className="h-6 w-12 bg-stone-700" />
                      ) : (
                        students.length
                      )}
                    </div>
                    <div className="text-stone-400 group-hover:text-stone-300 transition-colors">
                      Students
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/staff">
              <Card className="magical-card hover:shadow-xl hover:shadow-magical-gold/20 transition-all duration-300 cursor-pointer group">
                <CardContent className="flex items-center p-6">
                  <UserCheck className="h-8 w-8 text-magical-gold mr-4" />
                  <div className="text-left">
                    <div className="text-2xl font-bold text-white">
                      {isLoading ? (
                        <Skeleton className="h-6 w-12 bg-stone-700" />
                      ) : (
                        staff.length
                      )}
                    </div>
                    <div className="text-stone-400 group-hover:text-stone-300 transition-colors">
                      Staff
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
