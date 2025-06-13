import { generateCharacterId } from '../utils'

export interface Character {
  id: string
  name: string
  image?: string
  species: string
  house?: string
  actor: string
  wand?: {
    wood?: string
    core?: string
    length?: string
  }
  alive?: boolean
  wizard?: boolean
  hogwartsStudent: boolean
  hogwartsStaff: boolean
}

export interface CharacterDetail extends Character {
  dateOfBirth?: string
  ancestry?: string
  eyeColour?: string
  hairColour?: string
  patronus?: string
  alternate_names?: string[]
}

const API_BASE_URL = 'https://hp-api.onrender.com/api'

export const getAllCharacters = async (): Promise<Character[]> => {
  const response = await fetch(`${API_BASE_URL}/characters`)
  if (!response.ok) {
    throw new Error('Failed to fetch characters')
  }
  const data: Character[] = await response.json()
  return data.map(char => ({
    ...char,
    id: generateCharacterId(char),
  }))
}

export const getStudents = async (): Promise<Character[]> => {
  const response = await fetch(`${API_BASE_URL}/characters/students`)
  if (!response.ok) {
    throw new Error('Failed to fetch students')
  }
  const data: Character[] = await response.json()
  return data.map(char => ({
    ...char,
    id: generateCharacterId(char),
  }))
}

export const getStaff = async (): Promise<Character[]> => {
  const response = await fetch(`${API_BASE_URL}/characters/staff`)
  if (!response.ok) {
    throw new Error('Failed to fetch staff')
  }
  const data: Character[] = await response.json()
  return data.map(char => ({
    ...char,
    id: generateCharacterId(char),
  }))
}

export const getCharacterById = async (
  id: string,
): Promise<CharacterDetail | null> => {
  const response = await fetch(`${API_BASE_URL}/character/${id}`)
  if (!response.ok) {
    throw new Error(`Failed to fetch character with id ${id}`)
  }
  const data: CharacterDetail[] = await response.json()
  return data[0] || null
}
