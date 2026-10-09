import { siteData } from '@/data/siteData'

export interface HeroSlideDefault {
  src: string
  alt: string
  description: string
}

export interface HomeHeroDefault {
  badge: string
  titleBefore: string
  titleAccent: string
  titleAfter: string
  slides: HeroSlideDefault[]
}

export const DEFAULT_HOME_HERO: HomeHeroDefault = siteData.hero
