import { supabase } from "@/lib/supabaseClient"

export async function uploadFile(file: Blob, filename: string, userId: string) {
  const { data, error } = await supabase.storage
    .from("documents")
    .upload(`${userId}/${filename}`, file, {
      cacheControl: "3600",
      upsert: true,
    })

  if (error) throw error
  const { publicUrl } = supabase.storage.from("documents").getPublicUrl(`${userId}/${filename}`)
  return publicUrl
}