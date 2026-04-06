'use client'

import Link from 'next/link'
import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function SignUp() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('homebuyer')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignUp = async () => {
    if (!firstName || !lastName || !email || !password) {
      setError('Please fill in all fields')
      return
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id: data.user.id,
          email,
          first_name: firstName,
          last_name: lastName,
          role,
        })

      if (profileError) {
        console.error('Profile error:', profileError)
      }
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gray-50 font-sans flex flex-col">
        <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
          <Link href="/" className="text-2xl font-bold text-green-800" style={{fontFamily: 'Georgia, serif'}}>LenderRep</Link>
        </nav>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="bg-white border border-gray-100 rounded-2xl p-8 w-full max-w-md text-center">
            <div className="w-14 h-14 rounded-full bg-green-100 text-green-800 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Georgia, serif'}}>Check your email!</h1>
            <p className="text-sm text-gray-500 mb-6">We sent a confirmation link to <strong>{email}</strong>. Click the link to activate your account.</p>
            <Link href="/sign-in" className="block w-full bg-green-800 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 text-center">
              Go to sign in
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white">
        <Link href="/" className="text-2xl font-bold text-green-800" style={{fontFamily: 'Georgia, serif'}}>LenderRep</Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white border border-gray-100 rounded-2xl p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{fontFamily: 'Georgia, serif'}}>Create your account</h1>
          <p className="text-sm text-gray-500 mb-6">Free forever. No credit card required.</p>

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-700 text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">First name</label>
                <input
                  type="text"
                  placeholder="Jane"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1.5">Last name</label>
                <input
                  type="text"
                  placeholder="Smith"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Email address</label>
              <input
                type="email"
                placeholder="you@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700"
              />
              <p className="text-xs text-gray-400 mt-1">Minimum 8 characters</p>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1.5">I am a...</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setRole('homebuyer')}
                  className={`border-2 rounded-lg py-2.5 text-sm font-medium transition-all ${role === 'homebuyer' ? 'border-green-800 bg-green-50 text-green-800' : 'border-gray-200 text-gray-600 hover:border-green-300'}`}
                >
                  Homebuyer
                </button>
                <button
                  onClick={() => setRole('loan_officer')}
                  className={`border-2 rounded-lg py-2.5 text-sm font-medium transition-all ${role === 'loan_officer' ? 'border-green-800 bg-green-50 text-green-800' : 'border-gray-200 text-gray-600 hover:border-green-300'}`}
                >
                  Loan Officer
                </button>
              </div>
            </div>

            <button
              onClick={handleSignUp}
              disabled={loading}
              className={`w-full py-2.5 rounded-lg text-sm font-medium mt-2 transition-all ${loading ? 'bg-gray-100 text-gray-400' : 'bg-green-800 text-white hover:bg-green-700'}`}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-green-800 hover:underline">Terms of Use</Link>
            {' '}and{' '}
            <Link href="/privacy" className="text-green-800 hover:underline">Privacy Policy</Link>
          </p>

          <div className="relative my-6">
            <div className="border-t border-gray-100"></div>
            <span className="absolute left-1/2 -translate-x-1/2 -top-2.5 bg-white px-3 text-xs text-gray-400">or</span>
          </div>

          <p className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-green-800 font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>

      <footer className="border-t border-gray-100 px-6 py-4 text-center">
        <span className="text-xs text-gray-400">Not affiliated with NMLS or any government agency</span>
      </footer>
    </main>
  )
}