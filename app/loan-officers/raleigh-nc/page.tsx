import Link from 'next/link'

const officers = [
  {
    slug: 'sarah-johnson',
    initials: 'SJ',
    name: 'Sarah Johnson',
    company: 'Pinnacle Mortgage',
    rating: 4.9,
    reviews: 48,
    experience: 12,
    specialties: ['FHA', 'VA', 'Conventional'],
    color: 'bg-green-100 text-green-900',
  },
  {
    slug: 'mark-chen',
    initials: 'MC',
    name: 'Mark Chen',
    company: 'Atlantic Home Loans',
    rating: 4.8,
    reviews: 31,
    experience: 8,
    specialties: ['Jumbo', 'Conventional'],
    color: 'bg-teal-100 text-teal-900',
  },
  {
    slug: 'diana-patel',
    initials: 'DP',
    name: 'Diana Patel',
    company: 'Cardinal Home Lending',
    rating: 4.8,
    reviews: 27,
    experience: 6,
    specialties: ['FHA', 'First-time buyer'],
    color: 'bg-orange-100 text-orange-900',
  },
  {
    slug: 'tom-rivera',
    initials: 'TR',
    name: 'Tom Rivera',
    company: 'Triangle Mortgage Group',
    rating: 4.7,
    reviews: 19,
    experience: 15,
    specialties: ['VA', 'Reverse Mortgage'],
    color: 'bg-amber-100 text-amber-900',
  },
]

export default function RaleighPage() {
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
        <Link href="/states" className="hover:text-green-800">Browse by state</Link>
        <span className="mx-2">›</span>
        <Link href="/states/north-carolina" className="hover:text-green-800">North Carolina</Link>
        <span className="mx-2">›</span>
        <span className="text-gray-600">Raleigh</span>
      </div>

      {/* Hero */}
      <section className="bg-green-50 px-6 py-12 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs text-green-800 font-medium mb-2">North Carolina · Raleigh</p>
          <h1 className="text-3xl font-bold text-green-950 mb-3" style={{fontFamily: 'Georgia, serif'}}>
            Top-Rated Loan Officers in Raleigh, NC
          </h1>
          <p className="text-green-800 text-sm mb-6 max-w-xl">
            Browse and compare the highest-rated licensed loan officers in Raleigh based on verified client reviews. All officers are NMLS verified.
          </p>
          <div className="flex flex-wrap gap-4 text-xs text-green-800">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>{officers.length} loan officers listed</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>All NMLS verified</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>Ranked by verified reviews</span>
          </div>
        </div>
      </section>

      {/* Filters */}
      <div className="px-6 py-4 border-b border-gray-100 bg-white">
        <div className="max-w-4xl mx-auto flex gap-2 flex-wrap">
          <span className="text-xs text-gray-500 self-center mr-1">Filter by:</span>
          {['All', 'FHA', 'VA', 'Conventional', 'Jumbo', 'First-time buyer', 'Reverse Mortgage'].map((f) => (
            <button key={f} className={`text-xs px-3 py-1.5 rounded-full border ${f === 'All' ? 'bg-green-800 text-white border-green-800' : 'border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-800'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Officer List */}
      <section className="px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {officers.map((lo, index) => (
            <Link href={`/loan-officers/${lo.slug}`} key={lo.slug}>
              <div className="border border-gray-100 rounded-xl p-5 hover:border-green-200 hover:shadow-sm cursor-pointer flex gap-4 items-start transition-all">
                {/* Rank */}
                <div className="text-lg font-bold text-gray-200 w-6 text-center flex-shrink-0 mt-1">
                  {index + 1}
                </div>

                {/* Avatar */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${lo.color}`}>
                  {lo.initials}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-base font-bold text-gray-900">{lo.name}</h2>
                      <p className="text-xs text-gray-500 mb-2">{lo.company} · Raleigh, NC</p>
                      <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-800 px-2 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>
                        NMLS Verified
                      </span>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="flex items-center gap-1 justify-end mb-1">
                        <span className="text-base font-bold text-gray-900">{lo.rating}</span>
                        <span className="text-amber-500 text-sm">★★★★★</span>
                      </div>
                      <p className="text-xs text-gray-400">{lo.reviews} reviews</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
                    <div className="flex gap-1.5 flex-wrap">
                      {lo.specialties.map((s) => (
                        <span key={s} className="text-xs bg-gray-50 text-gray-600 px-2 py-0.5 rounded-full border border-gray-100">{s}</span>
                      ))}
                      <span className="text-xs text-gray-400">{lo.experience} yrs exp</span>
                    </div>
                    <span className="text-xs text-green-800 font-medium">View profile →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SEO Content Block */}
      <section className="px-6 py-10 border-t border-gray-100 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-bold text-gray-900 mb-4" style={{fontFamily: 'Georgia, serif'}}>Finding a Loan Officer in Raleigh, NC</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-3">
            Raleigh is one of the fastest-growing housing markets in the Southeast. With a competitive market and rising home prices, having the right loan officer can make the difference between winning and losing a home.
          </p>
          <p className="text-sm text-gray-600 leading-relaxed">
            LenderRep lists only licensed, NMLS-verified loan officers in Raleigh. Every review is submitted by a verified client and ranked based on real transaction experience — so you can find the best loan officer for your situation with confidence.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-5 flex justify-between items-center">
        <Link href="/" className="text-green-800 font-bold" style={{fontFamily: 'Georgia, serif'}}>LenderRep</Link>
        <span className="text-xs text-gray-400">Not affiliated with NMLS or any government agency</span>
      </footer>
    </main>
  )
}