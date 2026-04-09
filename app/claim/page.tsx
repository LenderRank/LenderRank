'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

type LoanOfficer = {
  id: string
  name: string
  company: string | null
  city: string | null
  state: string | null
  initials: string | null
  avatar_color: string | null
  nmls_id: string | null
  is_claimed: boolean
}

type Step = 'lookup' | 'found' | 'not_found' | 'waitlist_sent'

function ClaimContent() {
  const [step, setStep] = useState<Step>('lookup')
  const [nmls, setNmls] = useState('')
  const [officer, setOfficer] = useState<LoanOfficer | null>(null)
  const [waitlistEmail, setWaitlistEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLookup = async () => {
    if (!nmls.trim()) {
      setError('Please enter your NMLS ID')
      return
    }
    setLoading(true)
    setError('')

    const { data, error: lookupError } = await supabase
      .from('loan_officers')
      .select('id, name, company, city, state, initials, avatar_color, nmls_id, is_claimed')
      .eq('nmls_id', nmls.trim())
      .maybeSingle()

    setLoading(false)

    if (lookupError) {
      setError('Something went wrong. Please try again.')
      return
    }

    if (data) {
      setOfficer(data)
      setStep('found')
    } else {
      setStep('not_found')
    }
  }

  const handleWaitlist = async () => {
    if (!waitlistEmail.trim()) {
      setError('Please enter your email address')
      return
    }
    setLoading(true)
    setError('')

    const { error: insertError } = await supabase
      .from('claim_waitlist')
      .insert({ email: waitlistEmail.trim(), nmls_id_entered: nmls.trim() })

    setLoading(false)

    if (insertError) {
      setError('Something went wrong. Please try again.')
      return
    }

    setStep('waitlist_sent')
  }

  if (step === 'found' && officer) {
    const alreadyClaimed = officer.is_claimed
    const nmlsForUrl = encodeURIComponent(officer.nmls_id || nmls)

    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <button
          onClick={() => { setStep('lookup'); setOfficer(null); setError('') }}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-8 flex items-center gap-1"
        >
          ← Back
        </button>

        <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-md mb-6">
          Profile found
        </span>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
          Is this you?
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
          We found this profile for NMLS #{officer.nmls_id}.{' '}
          {alreadyClaimed ? 'This profile has already been claimed.' : 'Create an account or sign in to claim it.'}
        </p>

        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0 ${officer.avatar_color || 'bg-gray-100 text-gray-600'}`}>
              {officer.initials || '??'}
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white text-lg">{officer.name}</p>
              {officer.company && (
                <p className="text-sm text-gray-500 dark:text-gray-400">{officer.company}</p>
              )}
              {(officer.city || officer.state) && (
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {[officer.city, officer.state].filter(Boolean).join(', ')}
                </p>
              )}
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">NMLS #{officer.nmls_id}</p>
            </div>
          </div>
        </div>

        {alreadyClaimed ? (
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm px-4 py-3 rounded-lg">
            This profile has already been claimed by another account. If you believe this is an error, please contact us.
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/sign-up?nmls=${nmlsForUrl}`}
              className="bg-green-800 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-green-700 text-center"
            >
              Create account to claim
            </Link>
            <Link
              href={`/sign-in?nmls=${nmlsForUrl}`}
              className="border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-8 py-3 rounded-lg text-sm font-medium hover:border-green-300 hover:text-green-800 dark:hover:border-green-500 dark:hover:text-green-400 text-center"
            >
              I already have an account
            </Link>
          </div>
        )}
      </div>
    )
  }

  if (step === 'not_found') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <button
          onClick={() => { setStep('lookup'); setError('') }}
          className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-8 flex items-center gap-1"
        >
          ← Back
        </button>

        <span className="inline-block bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-medium px-3 py-1 rounded-md mb-6">
          Not in system yet
        </span>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          We don&apos;t have your profile yet
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-8">
          No profile was found for NMLS #{nmls}. We&apos;re actively adding loan officers — enter your email and we&apos;ll notify you as soon as your profile is ready to claim.
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <input
            type="email"
            placeholder="your@email.com"
            value={waitlistEmail}
            onChange={(e) => setWaitlistEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleWaitlist()}
            className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <button
            onClick={handleWaitlist}
            disabled={loading}
            className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${loading ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500' : 'bg-green-800 text-white hover:bg-green-700'}`}
          >
            {loading ? 'Saving...' : 'Notify me'}
          </button>
        </div>
      </div>
    )
  }

  if (step === 'waitlist_sent') {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 flex items-center justify-center text-2xl mx-auto mb-4">
          ✓
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          You&apos;re on the list
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">
          We&apos;ll email{' '}
          <strong className="text-gray-700 dark:text-gray-300">{waitlistEmail}</strong>{' '}
          as soon as your profile is ready to claim.
        </p>
      </div>
    )
  }

  // Step 1: NMLS lookup
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-md mb-6">
        For loan officers
      </span>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
        Claim your free profile
      </h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-10 max-w-md mx-auto">
        Get ranked on LenderRep, collect verified reviews from your clients, and win more business. Enter your NMLS ID to find your profile.
      </p>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 text-sm px-4 py-3 rounded-lg mb-6 max-w-sm mx-auto text-left">
          {error}
        </div>
      )}

      <div className="flex gap-3 max-w-sm mx-auto">
        <input
          type="text"
          placeholder="Your NMLS ID (e.g. 123456)"
          value={nmls}
          onChange={(e) => setNmls(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
          className="flex-1 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <button
          onClick={handleLookup}
          disabled={loading}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${loading ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500' : 'bg-green-800 text-white hover:bg-green-700'}`}
        >
          {loading ? 'Looking up...' : 'Find profile'}
        </button>
      </div>
    </div>
  )
}

export default function ClaimPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 font-sans flex flex-col">
      <Navbar />
      <div className="flex-1">
        <Suspense fallback={<div className="max-w-2xl mx-auto px-6 py-16" />}>
          <ClaimContent />
        </Suspense>
      </div>
      <Footer />
    </main>
  )
}
