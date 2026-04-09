import Link from 'next/link'
import Navbar from '../components/Navbar'
import { supabase } from '../lib/supabase'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q = '' } = await searchParams
  const query = q.trim()

  let results: any[] = []

  if (query) {
    const { data } = await supabase
      .from('loan_officers')
      .select('id, name, slug, company, city, state, initials, avatar_color, avg_rating, review_count, specialties, is_verified')
      .or(`name.ilike.%${query}%,city.ilike.%${query}%,state.ilike.%${query}%`)
      .order('ranking_score', { ascending: false })

    results = data ?? []
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            {query ? `Search results for "${query}"` : 'Search loan officers'}
          </h1>
          {query && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {results.length} {results.length === 1 ? 'loan officer' : 'loan officers'} found
            </p>
          )}
        </div>

        {/* Search bar */}
        <form action="/search" method="GET" className="flex bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden mb-8">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="City, state, or name..."
            autoFocus
            className="flex-1 px-4 py-3 text-sm outline-none text-gray-700 dark:text-gray-200 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          <button type="submit" className="bg-green-800 text-white px-5 py-3 text-sm font-medium hover:bg-green-700">
            Search
          </button>
        </form>

        {/* Results */}
        {query && results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-500 text-sm mb-2">No loan officers found for "{query}"</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">Try a different city or name</p>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-3">
            {results.map((lo) => (
              <Link key={lo.id} href={`/loan-officers/${lo.slug}`}>
                <div className="border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-xl p-5 hover:border-green-200 dark:hover:border-green-700 hover:shadow-sm cursor-pointer flex gap-4 items-center transition-all">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${lo.avatar_color}`}>
                    {lo.initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{lo.name}</p>
                      {lo.is_verified && (
                        <span className="text-xs bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-1.5 py-0.5 rounded">Verified</span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{lo.company} · {lo.city}, {lo.state}</p>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {lo.specialties?.slice(0, 3).map((s: string) => (
                        <span key={s} className="text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-600">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{lo.avg_rating} ★</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{lo.review_count} reviews</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!query && (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-500 text-sm">Enter a city, state, or name above to find loan officers</p>
          </div>
        )}
      </div>
    </main>
  )
}
