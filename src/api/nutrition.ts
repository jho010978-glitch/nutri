import { apiFetch } from './client'

export type NutritionData = {
  height: number
  weight: number
  body_fat_rate?: number
  skeletal_muscle_mass?: number
  diet_purpose: string
  activity_type: string
  weekly_exercise_count: number
  exercise_intensity: string
  daily_meal_count: number
  daily_snack_count: number
}

export async function getNutrition(): Promise<NutritionData> {
  return apiFetch<NutritionData>('/users/me/nutrition')
}

export async function postNutrition(data: NutritionData): Promise<void> {
  await apiFetch<void>('/users/me/nutrition', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function putNutrition(data: NutritionData): Promise<void> {
  await apiFetch<void>('/users/me/nutrition', {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}
