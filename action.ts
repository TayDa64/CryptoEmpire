'use server'

export async function submitEmail(formData: FormData) {
  await new Promise(resolve => setTimeout(resolve, 1000))

  const email = formData.get('email')
  
  if (email === null) {
    return {
      success: false,
      message: 'Email is required'
    }
  }

  return {
    success: true,
    message: `Email ${email} submitted successfully!`
  }
}

