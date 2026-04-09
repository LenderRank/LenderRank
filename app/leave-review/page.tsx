'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter, useSearchParams } from 'next/navigation'
import Footer from '../components/Footer'

const steps = ['Confirm', 'Verify', 'Review', 'Done']

export default function LeaveReview() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const officerSlug = searchParams.get('officer') || 'sarah-johnson'

  const [step, setStep] = useState(1)
  const [checked, setChecked] = useState({ closed: false, honest: false, libel: false })
  const [nmls, setNmls] = useState('')
  const [rating, setRating] = useState(0)
  const [hovered, setHovered] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [loanType, setLoanType] = useState('')
  const [closingDate, setClosingDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [officer, setOfficer] = useState<any>(null)
  const [user, setUser] = useState<any>(null)

  const allChecked = checked.closed && checked.honest && checked.libel
  const reviewReady = rating > 0 && reviewText.length >= 20 && loanType && closingDate

  useEffect(() => {
    const fetchData = async () => {
      const { data: officerData } = await supabase
        .from('loan_officers')
        .select('*')
        .eq('slug', officerSlug)
        .single()
      if (officerData) setOfficer(officerData)

      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) setUser(session.user)
    }
    fetchData()
  }, [officerSlug])

  const handleSubmit = async () => {
    if (!user) {
      router.push('/sign-in')
      return
    }
    if (!officer) return
    setLoading(true)
    setError('')

    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', user.id)
      .single()

    const reviewerName = profile
      ? `${profile.first_name} ${profile.last_name?.charAt(0)}.`
      : 'Anonymous'

    const { error: reviewError } = await supabase
      .from('reviews')
      .insert({
        loan_officer_id: officer.id,
        reviewer_id: user.id,
        reviewer_name: reviewerName,
        rating,
        review_text: reviewText,
        loan_type: loanType,
        closing_date: closingDate,
        nmls_submitted: nmls,
        is_approved: false,
        is_confirmed: false,
      })

    if (reviewError) {
      setError('Something went wrong. Please try again.')
      setLoading(false)
      return
    }

    setStep(4)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans flex flex-col">
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
        <Link href="/" className="text-2xl font-bold text-green-800 dark:text-green-400" style={{fontFamily: 'Georgia, serif'}}>LenderRep</Link>
      </nav>

      <div className="flex-1 flex items-start justify-center px-6 py-10">
        <div className="w-full max-w-lg">

          {/* Progress */}
          <div className="flex items-center justify-between mb-8">
            {steps.map((s, i) => (
              <div key={s} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${step > i + 1 ? 'bg-green-800 text-white' : step === i + 1 ? 'bg-green-800 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                    {step > i + 1 ? '✓' : i + 1}
                  </div>
                  <span className={`text-xs mt-1 ${step === i + 1 ? 'text-green-800 dark:text-green-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>{s}</span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > i + 1 ? 'bg-green-800' : 'bg-gray-100 dark:bg-gray-700'}`}></div>
                )}
              </div>
            ))}
          </div>

          {/* Officer Card */}
          <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 mb-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 text-green-900 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {officer?.initials || '??'}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{officer?.name || 'Loading...'}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{officer?.company} · {officer?.city}, {officer?.state}</p>
            </div>
          </div>

          {/* Step 1 — Confirm */}
          {step === 1 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1" style={{fontFamily: 'Georgia, serif'}}>Before you write your review</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Please confirm the following before continuing.</p>

              <div className="space-y-4 mb-6">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={checked.closed} onChange={() => setChecked(c => ({...c, closed: !c.closed}))} className="mt-0.5 accent-green-800 w-4 h-4 flex-shrink-0"/>
                  <span className="text-sm text-gray-700 dark:text-gray-300">I have closed a loan with this loan officer and this review is based on that direct experience.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={checked.honest} onChange={() => setChecked(c => ({...c, honest: !c.honest}))} className="mt-0.5 accent-green-800 w-4 h-4 flex-shrink-0"/>
                  <span className="text-sm text-gray-700 dark:text-gray-300">This review is honest, accurate, and reflects my genuine personal experience.</span>
                </label>
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked={checked.libel} onChange={() => setChecked(c => ({...c, libel: !c.libel}))} className="mt-0.5 accent-green-800 w-4 h-4 flex-shrink-0"/>
                  <span className="text-sm text-gray-700 dark:text-gray-300">I understand that submitting false or misleading statements about a licensed professional may constitute libel and could expose me to legal liability.</span>
                </label>
              </div>

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-6">
                <p className="text-xs text-gray-400 dark:text-gray-400 leading-relaxed">LenderRep reserves the right to remove reviews that violate our review policy. False statements made about named individuals may constitute defamation under applicable law.</p>
              </div>

              {!user && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg p-3 mb-4">
                  <p className="text-xs text-amber-700 dark:text-amber-400">You need to <Link href="/sign-in" className="font-medium underline">sign in</Link> or <Link href="/sign-up" className="font-medium underline">create a free account</Link> to leave a review.</p>
                </div>
              )}

              <button
                onClick={() => allChecked && setStep(2)}
                className={`w-full py-2.5 rounded-lg text-sm font-medium transition-all ${allChecked ? 'bg-green-800 text-white hover:bg-green-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}
              >
                Continue to verification →
              </button>
            </div>
          )}

          {/* Step 2 — Verify */}
          {step === 2 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1" style={{fontFamily: 'Georgia, serif'}}>Verify your transaction</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Enter the loan officer's NMLS ID to verify your transaction.</p>

              <div className="mb-6">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">NMLS ID</label>
                <input
                  type="text"
                  placeholder="e.g. 123456"
                  value={nmls}
                  onChange={(e) => setNmls(e.target.value)}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700"
                />
                {officer && <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Expected: {officer.nmls_id} for {officer.name}</p>}
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-3 mb-6">
                <p className="text-xs text-green-800 dark:text-green-400 leading-relaxed">The loan officer will be notified of your review and given the opportunity to confirm the transaction.</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-2.5 rounded-lg text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500">Back</button>
                <button
                  onClick={() => nmls.length > 3 && setStep(3)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${nmls.length > 3 ? 'bg-green-800 text-white hover:bg-green-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}
                >
                  Continue →
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Write Review */}
          {step === 3 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-6">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1" style={{fontFamily: 'Georgia, serif'}}>Write your review</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Share your experience to help other homebuyers.</p>

              <div className="mb-5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-2">Overall rating</label>
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <button key={star} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(0)} onClick={() => setRating(star)} className={`text-3xl transition-all ${star <= (hovered || rating) ? 'text-amber-400' : 'text-gray-200 dark:text-gray-600'}`}>★</button>
                  ))}
                </div>
                {rating > 0 && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{['','Poor','Fair','Good','Very good','Excellent'][rating]}</p>}
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">Loan type</label>
                <select value={loanType} onChange={(e) => setLoanType(e.target.value)} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700">
                  <option value="">Select loan type...</option>
                  <option>Conventional</option>
                  <option>FHA</option>
                  <option>VA</option>
                  <option>Jumbo</option>
                  <option>USDA</option>
                  <option>Reverse Mortgage</option>
                  <option>Refinance</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">Approximate closing date</label>
                <select value={closingDate} onChange={(e) => setClosingDate(e.target.value)} className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700">
                  <option value="">Select month/year...</option>
                  <option>April 2026</option>
                  <option>March 2026</option>
                  <option>February 2026</option>
                  <option>January 2026</option>
                  <option>December 2025</option>
                  <option>November 2025</option>
                  <option>October 2025</option>
                  <option>September 2025</option>
                  <option>August 2025</option>
                </select>
              </div>

              <div className="mb-5">
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 block mb-1.5">Your review</label>
                <textarea
                  placeholder="Share your experience working with this loan officer..."
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2.5 text-sm outline-none focus:border-green-400 text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                />
                <p className={`text-xs mt-1 ${reviewText.length < 20 ? 'text-gray-400 dark:text-gray-500' : 'text-green-700 dark:text-green-400'}`}>
                  {reviewText.length < 20 ? `${20 - reviewText.length} more characters needed` : `${reviewText.length} characters ✓`}
                </p>
              </div>

              {error && <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-700 dark:text-red-400 text-xs px-4 py-3 rounded-lg mb-4">{error}</div>}

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 py-2.5 rounded-lg text-sm border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-500">Back</button>
                <button
                  onClick={() => reviewReady && handleSubmit()}
                  disabled={loading}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${reviewReady && !loading ? 'bg-green-800 text-white hover:bg-green-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'}`}
                >
                  {loading ? 'Submitting...' : 'Submit review →'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4 — Done */}
          {step === 4 && (
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl p-8 text-center">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2" style={{fontFamily: 'Georgia, serif'}}>Review submitted!</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Thank you for sharing your experience.</p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mb-6 leading-relaxed">Your review is pending approval. The loan officer has been notified and may confirm the transaction.</p>

              <div className="bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg p-4 mb-6 text-left">
                <p className="text-xs text-green-800 dark:text-green-400 font-medium mb-1">What happens next?</p>
                <ul className="text-xs text-green-700 dark:text-green-500 space-y-1">
                  <li>· Our team will review your submission</li>
                  <li>· The loan officer will be notified</li>
                  <li>· Your review will appear once approved</li>
                </ul>
              </div>

              <Link href={`/loan-officers/${officerSlug}`} className="block w-full bg-green-800 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 mb-3">
                Back to profile
              </Link>
              <Link href="/" className="block w-full border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 py-2.5 rounded-lg text-sm hover:border-gray-300 dark:hover:border-gray-500">
                Back to home
              </Link>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </main>
  )
}
