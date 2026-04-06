import Link from 'next/link'
import { supabase } from '../../lib/supabase'

export default async function LoanOfficerProfile({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const { data: lo } = await supabase
    .from('loan_officers')
    .select('*')
    .eq('slug', slug)
    .single()

  const { data: reviews } = await supabase
    .from('reviews')
    .select('*')
    .eq('loan_officer_id', lo?.id)
    .eq('is_approved', true)
    .order('created_at', { ascending: false })

  if (!lo) {
    return (
      <main className="min-h-screen bg-white font-sans flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Loan officer not found</h1>
          <Link href="/" className="text-green-800 text-sm">Back to home</Link>
        </div>
      </main>
    )
  }

  const colorMap: Record<string, string> = {
    SJ: 'bg-green-100 text-green-900',
    MC: 'bg-teal-100 text-teal-900',
    DP: 'bg-orange-100 text-orange-900',
    TR: 'bg-amber-100 text-amber-900',
  }

  return (
    <main className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
        <Link href="/" className="text-2xl font-bold text-green-800" style={{fontFamily: 'Georgia, serif'}}>LenderRep</Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-gray-500">
          <Link href="/" className="hover:text-green-800">Find a loan officer</Link>
          <Link href="/states" className="hover:text-green-800">Browse by state</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/sign-in" className="text-sm text-green-800 font-medium">Sign in</Link>
          <Link href="/claim" className="text-sm bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700">Claim your profile</Link>
        </div>
      </nav>

      {/* Breadcrumb */}
      <div className="px-6 py-3 text-xs text-gray-400 border-b border-gray-100">
        <Link href="/" className="hover:text-green-800">Home</Link>
        <span className="mx-2">›</span>
        <Link href={`/loan-officers/${lo.city.toLowerCase().replace(' ', '-')}-${lo.state.toLowerCase()}`} className="hover:text-green-800">{lo.city}, {lo.state}</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">{lo.name}</span>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Profile Header */}
        <div className="flex flex-col sm:flex-row gap-6 mb-8 pb-8 border-b border-gray-100">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0 ${colorMap[lo.initials] || 'bg-gray-100 text-gray-600'}`}>
            {lo.initials}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1" style={{fontFamily: 'Georgia, serif'}}>{lo.name}</h1>
                <p className="text-gray-500 text-sm mb-2">{lo.company} · {lo.city}, {lo.state}</p>
                <span className="inline-flex items-center gap-1.5 text-xs bg-green-50 text-green-800 px-2 py-1 rounded-md">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>
                  NMLS #{lo.nmls_id} Verified
                </span>
              </div>
              <div className="flex gap-2">
                <button className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:border-green-300 hover:text-green-800">♡ Save</button>
                <button className="text-sm bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700">Contact</button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{lo.avg_rating}</p>
            <p className="text-amber-500 text-sm">★★★★★</p>
            <p className="text-xs text-gray-500 mt-1">Average rating</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{lo.review_count}</p>
            <p className="text-xs text-gray-500 mt-1">Verified reviews</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{lo.years_experience}</p>
            <p className="text-xs text-gray-500 mt-1">Years experience</p>
          </div>
        </div>

        {/* Specialties */}
        <div className="mb-8">
          <h2 className="text-sm font-medium text-gray-500 mb-2">Specialties</h2>
          <div className="flex gap-2 flex-wrap">
            {lo.specialties?.map((s: string) => (
              <span key={s} className="text-xs bg-green-50 text-green-800 px-3 py-1 rounded-full border border-green-100">{s}</span>
            ))}
          </div>
        </div>

        {/* Bio */}
        <div className="mb-10 pb-8 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-3" style={{fontFamily: 'Georgia, serif'}}>About</h2>
          <p className="text-sm text-gray-600 leading-relaxed">{lo.bio}</p>
        </div>

        {/* Reviews */}
        <div className="mb-10">
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900" style={{fontFamily: 'Georgia, serif'}}>
              Client Reviews ({lo.review_count})
            </h2>
            <Link href={`/leave-review?officer=${lo.slug}`} className="text-sm bg-green-800 text-white px-4 py-2 rounded-lg hover:bg-green-700">
              Leave a Review
            </Link>
          </div>

          {reviews && reviews.length > 0 ? (
            <div className="space-y-5">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-100 rounded-xl p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{review.reviewer_name}</p>
                      <p className="text-xs text-gray-400">{review.city}, {review.state} · {new Date(review.created_at).toLocaleDateString('en-US', {month: 'long', year: 'numeric'})}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-amber-500 text-sm">{'★'.repeat(review.rating)}</p>
                      <span className="text-xs text-gray-400">{review.loan_type}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed mb-3">{review.review_text}</p>
                  {review.is_confirmed ? (
                    <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-800 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>
                      Transaction confirmed by loan officer
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md">
                      Submitted with NMLS #{review.nmls_submitted}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-gray-100 rounded-xl p-8 text-center">
              <p className="text-gray-400 text-sm mb-3">No reviews yet</p>
              <Link href={`/leave-review?officer=${lo.slug}`} className="text-sm text-green-800 font-medium">Be the first to leave a review →</Link>
            </div>
          )}
        </div>

        {/* Leave a Review CTA */}
        <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
          <h3 className="text-base font-bold text-gray-900 mb-1" style={{fontFamily: 'Georgia, serif'}}>Worked with {lo.name}?</h3>
          <p className="text-sm text-gray-500 mb-4">Share your experience to help other homebuyers make the right choice.</p>
          <Link href={`/leave-review?officer=${lo.slug}`} className="inline-block bg-green-800 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-green-700">
            Leave a Review
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-5 flex justify-between items-center mt-10">
        <Link href="/" className="text-green-800 font-bold" style={{fontFamily: 'Georgia, serif'}}>LenderRep</Link>
        <span className="text-xs text-gray-400">Not affiliated with NMLS or any government agency</span>
      </footer>
    </main>
  )
}