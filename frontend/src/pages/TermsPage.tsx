import { LegalPage } from '@/pages/LegalPage'
import { LEGAL_TERMS } from '@/data/siteData'

export default function TermsPage() {
  return <LegalPage document={LEGAL_TERMS} path="/terms" breadcrumbLabel="Terms & Conditions" />
}
