import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getInitials = (name: string = '') => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export const generateCharacterId = (character: {
  id?: string
  name: string
}) => {
  return character.id || character.name.toLowerCase().replace(/\s+/g, '-')
}
