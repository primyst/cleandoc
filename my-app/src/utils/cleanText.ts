import { cleanTextFree } from './cleanTextFree'
import { cleanTextPro } from './cleanTextPro'

/**
 * Determines which cleaning logic to use based on user plan.
 * Automatically falls back to Free version if Pro cleaning fails.
 * 
 * @param input - The text to clean
 * @param plan - 'free' or 'pro'
 * @returns cleaned and formatted text
 */
export function cleanTextByPlan(input: string, plan: 'free' | 'pro'): string {
  if (!input) return ''

  try {
    const cleaned =
      plan === 'pro' ? cleanTextPro(input) : cleanTextFree(input)

    // Safety check — ensure we return something valid
    if (!cleaned || cleaned.trim().length === 0) {
      console.warn('Cleaner returned empty result, using fallback.')
      return cleanTextFree(input)
    }

    return cleaned
  } catch (error) {
    console.error('Cleaner failed — falling back to Free:', error)
    return cleanTextFree(input)
  }
}