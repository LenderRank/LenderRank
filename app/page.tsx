import Link from 'next/link'
import Form from 'next/form'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { supabase } from './lib/supabase'

export default async function Home() {
  const { data: topOfficers } = await supabase
    .from('loan_officers')
    .select('id, name, slug, company, city, state, initials, avatar_color, avg_rating, review_count, specialties')
    .order('ranking_score', { ascending: false })
    .limit(4)

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      <Navbar />

      {/* Hero */}
      <section className="bg-green-50 dark:bg-gray-800 px-6 py-16 text-center border-b border-gray-100 dark:border-gray-700">
        <span className="inline-block bg-green-200 dark:bg-green-900/50 text-green-900 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-md mb-4">Based on verified client reviews</span>
        <h1 className="text-4xl font-bold text-green-950 dark:text-white mb-3" style={{fontFamily: 'Georgia, serif'}}>Find a top-rated loan officer<br/>near you</h1>
        <p className="text-green-800 dark:text-green-300 text-base mb-8">Real reviews from real clients. Only licensed, NMLS-verified loan officers.</p>
        <Form action="/search" className="flex max-w-xl mx-auto bg-white dark:bg-gray-700 rounded-xl border border-gray-200 dark:border-gray-600 overflow-hidden mb-4">
          <input type="text" name="q" placeholder="City, ZIP code, or name..." className="flex-1 px-4 py-3 text-sm outline-none text-gray-700 dark:text-gray-200 bg-transparent placeholder:text-gray-400 dark:placeholder:text-gray-500"/>
          <button type="submit" className="bg-green-800 text-white px-5 py-3 text-sm font-medium hover:bg-green-700">Search</button>
        </Form>
        <div className="flex justify-center gap-5 flex-wrap text-green-800 dark:text-green-400 text-xs">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>NMLS verified only</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>Verified client reviews</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>Free to search</span>
        </div>
      </section>

      {/* Top Rated */}
      <section className="px-6 py-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{fontFamily: 'Georgia, serif'}}>Top rated in Raleigh, NC</h2>
          <Link href="/loan-officers/raleigh-nc" className="text-sm text-green-800 dark:text-green-400">See all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {(topOfficers ?? []).map((lo) => (
            <Link key={lo.id} href={`/loan-officers/${lo.slug}`} className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4 hover:border-gray-200 dark:hover:border-gray-600 cursor-pointer relative block">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${lo.avatar_color}`}>{lo.initials}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{lo.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{lo.company}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-2 py-0.5 rounded-md mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>NMLS Verified
              </span>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-medium text-gray-900 dark:text-white">{lo.avg_rating}</span>
                <span className="text-amber-500 text-xs">★★★★★</span>
                <span className="text-xs text-gray-400 dark:text-gray-500">{lo.review_count} reviews</span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 pt-2 border-t border-gray-100 dark:border-gray-700">{lo.city}, {lo.state} · {lo.specialties?.slice(0, 2).join(', ')}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-100 dark:border-gray-700 mx-6"/>

      {/* Browse by State */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-5" style={{fontFamily: 'Georgia, serif'}}>Browse by state</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {[
            {name:'North Carolina', count:'2,841'},
            {name:'Texas', count:'8,102'},
            {name:'Florida', count:'7,340'},
            {name:'California', count:'12,190'},
            {name:'Georgia', count:'3,412'},
            {name:'Arizona', count:'2,987'},
            {name:'Tennessee', count:'2,104'},
            {name:'Colorado', count:'3,210'},
          ].map((s) => (
            <div key={s.name} className="bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-lg px-4 py-3 flex justify-between items-center text-sm hover:border-green-300 dark:hover:border-green-700 cursor-pointer">
              <span className="text-gray-800 dark:text-gray-200">{s.name}</span>
              <span className="text-gray-400 dark:text-gray-500 text-xs">{s.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 dark:bg-gray-800 border-t border-b border-gray-100 dark:border-gray-700 px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8" style={{fontFamily: 'Georgia, serif'}}>How LenderRep works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            {n:'1', title:'Search your area', desc:'Enter your city or ZIP code to find licensed loan officers near you'},
            {n:'2', title:'Compare and save', desc:'Read verified reviews, save your favorites, and compare side by side'},
            {n:'3', title:'Choose the best', desc:'Connect directly with a top-rated loan officer in your area'},
          ].map((step) => (
            <div key={step.n} className="text-center">
              <div className="w-9 h-9 rounded-full bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-300 flex items-center justify-center text-sm font-medium mx-auto mb-3">{step.n}</div>
              <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{step.title}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Loan Officer CTA */}
      <section className="px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2" style={{fontFamily: 'Georgia, serif'}}>Are you a loan officer?</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">Get ranked. Collect verified reviews. Win more clients.</p>
        <Link href="/claim" className="inline-block bg-green-800 text-white px-7 py-3 rounded-lg text-sm font-medium hover:bg-green-700">Claim your free profile</Link>
      </section>

      <Footer />
    </main>
  )
}
