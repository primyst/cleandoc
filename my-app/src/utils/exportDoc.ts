import { exportDocFree } from './exportDocFree'
import { exportDocPro } from './exportDocPro'

/**
 * Exports DOCX according to user plan.
 * Automatically falls back to Free if Pro export fails.
 */
export async function exportDocByPlan(
  text: string,
  plan: 'free' | 'pro',
  username?: string
) {
  if (!text) return

  try {
    if (plan === 'pro') {
      await exportDocPro(text, username)
    } else {
      await exportDocFree(text)
    }
  } catch (err) {
    console.error('Export failed, using Free version as fallback:', err)
    await exportDocFree(text)
  }
}