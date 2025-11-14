<nav className="flex-1 p-4">
  <ul className="space-y-2">
    {[
      { name: 'Dashboard', href: '/' },
      { name: 'NIN Verification', href: '/services/nin' },
      { name: 'NIN With Phone', href: '/services/nin-with-phone' },
      { name: 'CAC Services', href: '/services/cac' },
      { name: 'BVN Verification', href: '/services/bvn-verify' },
      { name: 'IPE Clearance (Instant)', href: '/services/ipe-clearance' },
      { name: 'Validation (Instant)', href: '/services/validation' },
      { name: 'Personalization', href: '/services/personalization' },
      { name: 'BVN Retrieval', href: '/services/bvn-retrieval' },
      { name: 'Self Service Unlink', href: '/services/self-service-unlink' },
      { name: 'Modifications', href: '/services/modifications' },
      { name: 'Birth Attestation', href: '/services/birth-attestation' },
      { name: 'TIN Certificate', href: '/services/tin' },
      { name: 'Newspaper Pub.', href: '/services/newspaper-pub' },
      { name: 'Slips History', href: '/history' },
      { name: 'Wallet Summary', href: '/wallet' },
    ].map((item) => (
      <li key={item.href}>
        <Link
          href={item.href}
          className="flex items-center px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
        >
          {item.name}
        </Link>
      </li>
    ))}
  </ul>
</nav>