import { LegalPage } from '@/pages/LegalPage'
import { LEGAL_PRIVACY } from '@/data/siteData'

export default function PrivacyPage() {
  return <LegalPage document={LEGAL_PRIVACY} path="/privacy" breadcrumbLabel="Privacy Policy" />
}
