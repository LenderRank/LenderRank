import Link from 'next/link'
import Navbar from './components/Navbar'

export default function Home() {
  return (
    <main className="min-h-screen bg-white font-sans">
      <Navbar />

      {/* Hero */}
      <section className="bg-green-50 px-6 py-16 text-center border-b border-gray-100">
        <span className="inline-block bg-green-200 text-green-900 text-xs font-medium px-3 py-1 rounded-md mb-4">Based on verified client reviews</span>
        <h1 className="text-4xl font-bold text-green-950 mb-3" style={{fontFamily: 'Georgia, serif'}}>Find a top-rated loan officer<br/>near you</h1>
        <p className="text-green-800 text-base mb-8">Real reviews from real clients. Only licensed, NMLS-verified loan officers.</p>
        <div className="flex max-w-xl mx-auto bg-white rounded-xl border border-gray-200 overflow-hidden mb-4">
          <input type="text" placeholder="City, ZIP code, or name..." className="flex-1 px-4 py-3 text-sm outline-none text-gray-700"/>
          <button className="bg-green-800 text-white px-5 py-3 text-sm font-medium hover:bg-green-700">Search</button>
        </div>
        <div className="flex justify-center gap-5 flex-wrap text-green-800 text-xs">
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>NMLS verified only</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>Verified client reviews</span>
          <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>Free to search</span>
        </div>
      </section>

      {/* Top Rated */}
      <section className="px-6 py-10">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="text-2xl font-bold text-gray-900" style={{fontFamily: 'Georgia, serif'}}>Top rated in Raleigh, NC</h2>
          <Link href="/loan-officers/raleigh-nc" className="text-sm text-green-800">See all →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {initials:'SJ', name:'Sarah Johnson', company:'Pinnacle Mortgage', rating:'4.9', reviews:48, color:'bg-green-100 text-green-900', specialty:'FHA, VA, Conventional'},
            {initials:'MC', name:'Mark Chen', company:'Atlantic Home Loans', rating:'4.8', reviews:31, color:'bg-teal-100 text-teal-900', specialty:'Jumbo, Conventional'},
            {initials:'DP', name:'Diana Patel', company:'Cardinal Home Lending', rating:'4.8', reviews:27, color:'bg-orange-100 text-orange-900', specialty:'First-time buyer specialist'},
            {initials:'TR', name:'Tom Rivera', company:'Triangle Mortgage Group', rating:'4.7', reviews:19, color:'bg-amber-100 text-amber-900', specialty:'VA, Reverse Mortgage'},
          ].map((lo) => (
            <div key={lo.name} className="bg-white border border-gray-100 rounded-xl p-4 hover:border-gray-200 cursor-pointer relative">
              <button className="absolute top-3 right-3 w-7 h-7 rounded-full border border-gray-200 bg-gray-50 text-gray-400 text-xs flex items-center justify-center hover:bg-green-50 hover:border-green-300 hover:text-green-700">♡</button>
              <div className="flex items-center gap-3 mb-3 pr-8">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${lo.color}`}>{lo.initials}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{lo.name}</p>
                  <p className="text-xs text-gray-500">{lo.company}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 text-xs bg-green-50 text-green-800 px-2 py-0.5 rounded-md mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 inline-block"></span>NMLS Verified
              </span>
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm font-medium text-gray-900">{lo.rating}</span>
                <span className="text-amber-500 text-xs">★★★★★</span>
                <span className="text-xs text-gray-400">{lo.reviews} reviews</span>
              </div>
              <p className="text-xs text-gray-400 pt-2 border-t border-gray-100">Raleigh, NC · {lo.specialty}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="border-t border-gray-100 mx-6"/>

      {/* Browse by State */}
      <section className="px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-5" style={{fontFamily: 'Georgia, serif'}}>Browse by state</h2>
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
            <div key={s.name} className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 flex justify-between items-center text-sm hover:border-green-300 cursor-pointer">
              <span className="text-gray-800">{s.name}</span>
              <span className="text-gray-400 text-xs">{s.count}</span>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="bg-gray-50 border-t border-b border-gray-100 px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8" style={{fontFamily: 'Georgia, serif'}}>How LenderRep works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            {n:'1', title:'Search your area', desc:'Enter your city or ZIP code to find licensed loan officers near you'},
            {n:'2', title:'Compare and save', desc:'Read verified reviews, save your favorites, and compare side by side'},
            {n:'3', title:'Choose the best', desc:'Connect directly with a top-rated loan officer in your area'},
          ].map((step) => (
            <div key={step.n} className="text-center">
              <div className="w-9 h-9 rounded-full bg-green-100 text-green-900 flex items-center justify-center text-sm font-medium mx-auto mb-3">{step.n}</div>
              <p className="text-sm font-medium text-gray-900 mb-1">{step.title}</p>
              <p className="text-xs text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Loan Officer CTA */}
      <section className="px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{fontFamily: 'Georgia, serif'}}>Are you a loan officer?</h2>
        <p className="text-sm text-gray-500 mb-6">Get ranked. Collect verified reviews. Win more clients.</p>
        <Link href="/claim" className="inline-block bg-green-800 text-white px-7 py-3 rounded-lg text-sm font-medium hover:bg-green-700">Claim your free profile</Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-6 py-5 flex justify-between items-center">
        <span className="text-green-800 font-bold" style={{fontFamily: 'Georgia, serif'}}>LenderRep</span>
        <span className="text-xs text-gray-400">Not affiliated with NMLS or any government agency</span>
      </footer>
    </main>
  )
}