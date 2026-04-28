import { apiFetch } from './client'

export type NutritionData = {
  height: number
  weight: number
  bodyFatRate?: number
  skeletalMuscleMass?: number
  dietPurpose: string
  activityType: string
  weeklyExerciseCount: number
  exerciseIntensity: string
  dailyMealCount: number
  dailySnackCount: number
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
