'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

import { GenderOptions } from '@/constants'
import { createUser } from '@/lib/actions/patient.actions'
import { UserFormValidation } from '@/lib/validation'
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { FormFieldType } from './PatientForm'
import { Form, FormControl } from '../ui/form'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'

export function RegisterForm({ user }: { user: User }) {
  const router = useRouter()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    setIsLoading(true)

    try {
      const userData = { name, email, phone }

      const user = await createUser(userData)

      if (user) {
        router.push(`/patients/${user.$id}/register`)
      }
    } catch (error) {
      console.log(error)
    }

    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form
        className='flex-1 space-y-12'
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <section className='space-y-4'>
          <h1 className='header'>Welcome 👋</h1>
          <p className='text-dark-700'>Let us know more about yourself.</p>
        </section>

        <section className='space-y-6'>
          <div className='mb-9 space-y-1'>
            <h2 className='sub-header'>Personal Information</h2>
          </div>

          {/* NAME */}
          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name='name'
            label='Full Name'
            placeholder='John Doe'
            iconSrc='/assets/icons/user.svg'
            iconAlt='user'
          />

          {/* EMAIL & PHONE */}
          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='email'
              label='Email Address'
              placeholder='johndoe@gmail.com'
              iconSrc='/assets/icons/email.svg'
              iconAlt='email'
            />

            <CustomFormField
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name='phone'
              label='Phone Number'
              placeholder='(555) 123-4567'
            />
          </div>

          {/* BirthDate & Gender */}
          <div className='flex flex-col gap-6 xl:flex-row'>
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name='birthDate'
              label='Date of Birth'
            />

            <CustomFormField
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name='gender'
              label='Gender'
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className='flex h-11 gap-6 xl:justify-between'
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {GenderOptions.map((option, i) => (
                      <div key={option + i} className='radio-group'>
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className='cursor-pointer'>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>
        </section>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  )
}
