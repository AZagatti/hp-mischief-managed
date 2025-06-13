import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('students', 'routes/students.tsx'),
  route('staff', 'routes/staff.tsx'),
  route('character/:id', 'routes/character-detail.tsx'),
  route('characters', 'routes/characters.tsx'),
  route('favorites', 'routes/favorites.tsx'),
] satisfies RouteConfig
