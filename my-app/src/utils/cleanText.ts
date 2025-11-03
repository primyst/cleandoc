import { cleanTextFree } from './cleanTextFree'
import { cleanTextPro } from './cleanTextPro'

/**
 * Determines which cleaning logic to use based on user plan.
 * @param input - The text to clean
 * @param plan - 'free' or 'pro'
 */
export function cleanTextByPlan(input: string, plan: 'free' | 'pro'): string {
  if (!input) return ''
  return plan === 'pro' ? cleanTextPro(input) : cleanTextFree(input)
}