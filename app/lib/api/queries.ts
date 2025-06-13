import { QueryClient, useQuery } from '@tanstack/react-query'
import {
  getAllCharacters,
  getCharacterById,
  getStaff,
  getStudents,
  type Character,
  type CharacterDetail,
} from './characters'
import { redirect, useLoaderData, useParams } from 'react-router'

export const queryClient = new QueryClient()

export const allCharactersQuery = {
  queryKey: ['characters', 'all'],
  queryFn: getAllCharacters,
  staleTime: Infinity,
}

export const allCharactersLoader = async () => {
  const allCharacters = await queryClient.ensureQueryData(allCharactersQuery)

  const students = allCharacters.filter(c => c.hogwartsStudent)
  const staff = allCharacters.filter(c => c.hogwartsStaff)

  queryClient.setQueryData(studentsQuery.queryKey, students)
  queryClient.setQueryData(staffQuery.queryKey, staff)

  return allCharacters
}

export const useAllCharactersQuery = () => useQuery(allCharactersQuery)

export const studentsQuery = {
  queryKey: ['characters', 'students'],
  queryFn: getStudents,
  staleTime: Infinity,
}

export const studentsLoader = () => {
  return queryClient.ensureQueryData(studentsQuery)
}
export const useStudentsQuery = () => {
  const initialData = useLoaderData() as Character[]
  return useQuery({ ...studentsQuery, initialData })
}

export const staffQuery = {
  queryKey: ['characters', 'staff'],
  queryFn: getStaff,
  staleTime: Infinity,
}

export const staffLoader = () => {
  return queryClient.ensureQueryData(staffQuery)
}

export const useStaffQuery = () => {
  const initialData = useLoaderData() as Character[]
  return useQuery({ ...staffQuery, initialData })
}

export const characterDetailQuery = (id: string) => ({
  queryKey: ['characters', 'detail', id],
  queryFn: () => getCharacterById(id),
  staleTime: Infinity,
})

export const characterDetailLoader = async ({
  params,
}: {
  params: { id?: string }
}) => {
  if (!params.id) {
    return redirect('/')
  }
  return queryClient.ensureQueryData(characterDetailQuery(params.id))
}

export const useCharacterDetailQuery = () => {
  const initialData = useLoaderData() as CharacterDetail
  const { id } = useParams()

  return useQuery({
    ...characterDetailQuery(id!),
    initialData: initialData,
  })
}
