export const typographyVariants = {
  brandTitle: {
    fontSize: 38,
    lineHeight: 1,
    letterSpacing: '-0.03em',
    fontWeight: 800,
  },
  pageTitle: {
    fontSize: 22,
    lineHeight: 1.1,
    fontWeight: 700,
  },
  sectionTitle: {
    fontSize: 15,
    lineHeight: 1.3,
    fontWeight: 800,
  },
  body: {
    fontSize: 14,
    lineHeight: 1.4,
    fontWeight: 400,
  },
  bodyStrong: {
    fontSize: 14,
    lineHeight: 1.4,
    fontWeight: 700,
  },
  label: {
    fontSize: 12,
    lineHeight: 1.2,
    fontWeight: 700,
  },
} as const

export const typographyWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
} as const

export type TypographyVariant = keyof typeof typographyVariants
export type TypographyWeight = keyof typeof typographyWeights
