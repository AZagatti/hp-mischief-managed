import {
  Castle,
  ChevronDown,
  GraduationCap,
  Heart,
  Home,
  Sparkles,
  UserCheck,
  Users,
} from 'lucide-react'
import { Link, useLocation } from 'react-router'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import { HOUSES } from '~/lib/api'
import { useUserStore } from '~/lib/stores'
import { useShallow } from 'zustand/shallow'
import { cn } from '~/lib/utils'

export const Navigation = () => {
  const location = useLocation()
  const { selectedHouse, setSelectedHouse, favoriteCharacterIds } =
    useUserStore(
      useShallow(state => ({
        selectedHouse: state.selectedHouse,
        setSelectedHouse: state.setSelectedHouse,
        favoriteCharacterIds: state.favoriteCharacterIds,
      })),
    )

  const navItems = [
    { path: '/', label: 'Home', icon: <Home className="h-4 w-4" /> },
    {
      path: '/characters',
      label: 'All Characters',
      icon: <Users className="h-4 w-4" />,
    },
    {
      path: '/students',
      label: 'Students',
      icon: <GraduationCap className="h-4 w-4" />,
    },
    { path: '/staff', label: 'Staff', icon: <UserCheck className="h-4 w-4" /> },
  ]

  const houseInfo = HOUSES.find(h => h.name === selectedHouse)
  const isActive = (path: string) => location.pathname === path
  const hasFavorites = favoriteCharacterIds.length > 0

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-stone-700/50 magical-card">
      <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
        <Link to="/" className="flex flex-shrink-0 items-center gap-2">
          <div className="relative">
            <Castle className="h-8 w-8 text-magical-gold" />
            <Sparkles className="absolute -right-1 -top-1 h-4 w-4 text-magical-gold" />
          </div>
          <div className="hidden lg:block">
            <h1 className="whitespace-nowrap text-xl font-bold font-magical text-magical-gold">
              Mischief Managed
            </h1>
            <p className="whitespace-nowrap text-xs text-stone-400 -mt-1">
              Harry Potter Characters
            </p>
          </div>
        </Link>

        <div className="hidden flex-1 items-center justify-center md:flex">
          <div className="flex items-center gap-1">
            {navItems.map(item => (
              <Link key={item.path} to={item.path}>
                <Button
                  variant={isActive(item.path) ? 'default' : 'ghost'}
                  size="sm"
                  className={`flex items-center gap-2 ${
                    isActive(item.path)
                      ? 'bg-magical-gold text-magical-dark hover:bg-magical-gold/90'
                      : 'text-stone-300 hover:text-magical-gold hover:bg-stone-800/50'
                  }`}>
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center justify-end gap-2">
          <Link to="/favorites">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'relative hover:bg-stone-800/50',
                hasFavorites ? 'text-red-400' : 'text-stone-300',
              )}>
              <Heart
                className={cn('h-5 w-5', hasFavorites && 'fill-current')}
              />
              <span className="sr-only">Favorites</span>
              {hasFavorites && (
                <Badge className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 p-0.5 text-xs text-white">
                  {favoriteCharacterIds.length}
                </Badge>
              )}
            </Button>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                style={
                  houseInfo
                    ? {
                        backgroundImage: `linear-gradient(to right, var(${houseInfo.from}), var(${houseInfo.to}))`,
                      }
                    : {}
                }
                className={`items-center gap-2 border-stone-600 ${
                  selectedHouse && houseInfo
                    ? `border-transparent text-white`
                    : 'text-stone-300 hover:border-magical-gold hover:text-magical-gold'
                }`}>
                <Castle className="h-4 w-4" />
                <span className="hidden md:inline">
                  {selectedHouse || 'Choose House'}
                </span>
                <ChevronDown className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 magical-card border-stone-700">
              {HOUSES.map(house => (
                <DropdownMenuItem
                  key={house.name}
                  onClick={() => setSelectedHouse(house.name)}
                  style={{
                    backgroundImage: `linear-gradient(to right, var(${house.from}), var(${house.to}))`,
                  }}
                  className="cursor-pointer text-white focus:text-white hover:opacity-90 focus:opacity-90">
                  <span className="font-semibold">{house.name}</span>
                </DropdownMenuItem>
              ))}
              {selectedHouse && (
                <>
                  <div className="my-1 border-t border-stone-700" />
                  <DropdownMenuItem
                    onClick={() => setSelectedHouse('')}
                    className="cursor-pointer text-stone-400 hover:text-stone-200 focus:text-stone-200">
                    Clear Selection
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-stone-300 hover:text-magical-gold">
                  <Users className="h-5 w-5" />
                  <span className="sr-only">Menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="magical-card border-stone-700">
                {navItems.map(item => (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link
                      to={item.path}
                      className="flex cursor-pointer items-center gap-2 text-stone-300 hover:text-magical-gold focus:text-magical-gold">
                      {item.icon}
                      {item.label}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  )
}
