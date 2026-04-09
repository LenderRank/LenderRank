'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function AdminDashboard() {
  const router = useRouter()
  const [reviews, setReviews] = useState<any[]>([])
  const [officers, setOfficers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('reviews')
  const [stats, setStats] = useState({ totalOfficers: 0, totalReviews: 0, pendingReviews: 0, totalUsers: 0 })

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/sign-in')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single()

      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL
      const isAuthorized =
        profile?.role === 'loan_officer' ||
        (adminEmail && session.user.email === adminEmail)

      if (!isAuthorized) {
        router.push('/')
        return
      }

      fetchData()
    }
    checkAdmin()
  }, [])

  const fetchData = async () => {
    setLoading(true)

    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('*, loan_officers(name, city, state)')
      .order('created_at', { ascending: false })

    const { data: officersData } = await supabase
      .from('loan_officers')
      .select('*')
      .order('ranking_score', { ascending: false })

    if (reviewsData) setReviews(reviewsData)
    if (officersData) setOfficers(officersData)

    const pending = reviewsData?.filter(r => !r.is_approved).length || 0
    const total = reviewsData?.length || 0

    setStats({
      totalOfficers: officersData?.length || 0,
      totalReviews: total,
      pendingReviews: pending,
      totalUsers: 0,
    })

    setLoading(false)
  }

  const approveReview = async (id: string, officerId: string) => {
    await supabase.from('reviews').update({ is_approved: true }).eq('id', id)

    const { data: approvedReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('loan_officer_id', officerId)
      .eq('is_approved', true)

    if (approvedReviews && approvedReviews.length > 0) {
      const avgRating = approvedReviews.reduce((sum, r) => sum + r.rating, 0) / approvedReviews.length
      const rankingScore = avgRating * Math.log(approvedReviews.length + 1)

      await supabase.from('loan_officers').update({
        avg_rating: Math.round(avgRating * 10) / 10,
        review_count: approvedReviews.length,
        ranking_score: rankingScore,
      }).eq('id', officerId)
    }

    fetchData()
  }

  const rejectReview = async (id: string) => {
    await supabase.from('reviews').delete().eq('id', id)
    fetchData()
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400 dark:text-gray-500 text-sm">Loading dashboard...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans">
      {/* Admin Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-2xl font-bold text-green-800 dark:text-green-400" style={{fontFamily: 'Georgia, serif'}}>LenderRep</Link>
          <span className="text-xs bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 px-2 py-0.5 rounded-md font-medium">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm text-gray-500 dark:text-gray-400 hover:text-green-800 dark:hover:text-green-400">View site</Link>
          <button onClick={() => supabase.auth.signOut().then(() => router.push('/'))} className="text-sm text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">Sign out</button>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Loan officers', value: stats.totalOfficers },
            { label: 'Total reviews', value: stats.totalReviews },
            { label: 'Pending approval', value: stats.pendingReviews, highlight: stats.pendingReviews > 0 },
            { label: 'Cities active', value: 1 },
          ].map((stat) => (
            <div key={stat.label} className={`bg-white dark:bg-gray-800 border rounded-xl p-4 text-center ${stat.highlight ? 'border-amber-200 dark:border-amber-700 bg-amber-50 dark:bg-amber-900/20' : 'border-gray-100 dark:border-gray-700'}`}>
              <p className={`text-2xl font-bold mb-1 ${stat.highlight ? 'text-amber-600 dark:text-amber-400' : 'text-gray-900 dark:text-white'}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg w-fit">
          {['reviews', 'officers'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}
            >
              {tab === 'reviews' ? `Reviews ${stats.pendingReviews > 0 ? `(${stats.pendingReviews} pending)` : ''}` : 'Loan Officers'}
            </button>
          ))}
        </div>

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-8 text-center">
                <p className="text-gray-400 dark:text-gray-500 text-sm">No reviews yet</p>
              </div>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className={`bg-white dark:bg-gray-800 border rounded-xl p-5 ${!review.is_approved ? 'border-amber-200 dark:border-amber-700' : 'border-gray-100 dark:border-gray-700'}`}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">{review.reviewer_name}</p>
                        <span className="text-amber-500 text-sm">{'★'.repeat(review.rating)}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${review.is_approved ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'}`}>
                          {review.is_approved ? 'Approved' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 dark:text-gray-500">
                        For: <span className="font-medium text-gray-600 dark:text-gray-300">{review.loan_officers?.name}</span> · {review.loan_type} · {review.closing_date}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">NMLS submitted: {review.nmls_submitted}</p>
                    </div>
                    <p className="text-xs text-gray-400 dark:text-gray-500 flex-shrink-0">{new Date(review.created_at).toLocaleDateString()}</p>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 bg-gray-50 dark:bg-gray-700 rounded-lg p-3">{review.review_text}</p>

                  {!review.is_approved && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => approveReview(review.id, review.loan_officer_id)}
                        className="flex-1 bg-green-800 text-white py-2 rounded-lg text-sm font-medium hover:bg-green-700"
                      >
                        Approve review
                      </button>
                      <button
                        onClick={() => rejectReview(review.id)}
                        className="flex-1 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 py-2 rounded-lg text-sm hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        Reject & delete
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Officers Tab */}
        {activeTab === 'officers' && (
          <div className="space-y-3">
            {officers.map((lo, index) => (
              <div key={lo.id} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
                <span className="text-lg font-bold text-gray-200 dark:text-gray-600 w-6 text-center">{index + 1}</span>
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-900 flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {lo.initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{lo.name}</p>
                    {lo.is_verified && <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">Verified</span>}
                    {lo.is_claimed && <span className="text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-1.5 py-0.5 rounded">Claimed</span>}
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{lo.company} · {lo.city}, {lo.state} · NMLS #{lo.nmls_id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{lo.avg_rating} ★</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500">{lo.review_count} reviews</p>
                </div>
                <Link href={`/loan-officers/${lo.slug}`} className="text-xs text-green-800 dark:text-green-400 hover:underline ml-2">View →</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
