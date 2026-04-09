import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-700 px-6 py-5 flex justify-between items-center">
      <Link href="/" className="text-green-800 dark:text-green-400 font-bold" style={{ fontFamily: 'Georgia, serif' }}>LenderRep</Link>
      <span className="text-xs text-gray-400 dark:text-gray-500">License information sourced from NMLS Consumer Access. LenderRep is not affiliated with or endorsed by the Nationwide Multistate Licensing System.</span>
    </footer>
  )
}
