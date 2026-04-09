import Link from 'next/link'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function ClaimPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 font-sans">
      <Navbar />

      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 text-xs font-medium px-3 py-1 rounded-md mb-6">For loan officers</span>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4" style={{ fontFamily: 'Georgia, serif' }}>
          Claim your free profile
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-10 max-w-md mx-auto">
          Get ranked on LenderRep, collect verified reviews from your clients, and win more business. Your profile is already here — claim it to take control.
        </p>

        <div className="grid gap-4 text-left mb-10">
          {[
            { n: '1', title: 'Create an account', desc: 'Sign up with your email address and set a password.' },
            { n: '2', title: 'Find your profile', desc: 'Search for your name and NMLS number to locate your existing listing.' },
            { n: '3', title: 'Verify your identity', desc: 'We confirm your NMLS ID to ensure your profile is legitimate.' },
            { n: '4', title: 'Start collecting reviews', desc: 'Share your unique review link with past clients to build your reputation.' },
          ].map((step) => (
            <div key={step.n} className="flex gap-4 bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl p-4">
              <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/40 text-green-900 dark:text-green-300 flex items-center justify-center text-sm font-medium flex-shrink-0">
                {step.n}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-0.5">{step.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/sign-up" className="bg-green-800 text-white px-8 py-3 rounded-lg text-sm font-medium hover:bg-green-700">
            Create your account
          </Link>
          <Link href="/sign-in" className="border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 px-8 py-3 rounded-lg text-sm font-medium hover:border-green-300 hover:text-green-800 dark:hover:border-green-500 dark:hover:text-green-400">
            Already have an account
          </Link>
        </div>
      </div>

      <Footer />
    </main>
  )
}
