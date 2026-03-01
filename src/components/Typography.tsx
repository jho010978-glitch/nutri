import type { ComponentPropsWithoutRef, CSSProperties, ElementType, ReactNode } from 'react'
import {
  typographyVariants,
  typographyWeights,
  type TypographyVariant,
  type TypographyWeight,
} from '../tokens/typography'

type TypographyOwnProps<T extends ElementType> = {
  as?: T
  variant?: TypographyVariant
  weight?: TypographyWeight
  color?: string
  className?: string
  style?: CSSProperties
  children: ReactNode
}

type TypographyProps<T extends ElementType> = TypographyOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TypographyOwnProps<T>>

export const Typography = <T extends ElementType = 'span'>({
  as,
  variant = 'body',
  weight,
  color,
  style,
  children,
  ...rest
}: TypographyProps<T>) => {
  const Component = as ?? 'span'
  const variantStyle = typographyVariants[variant]

  const mergedStyle: CSSProperties = {
    fontSize: variantStyle.fontSize,
    lineHeight: variantStyle.lineHeight,
    letterSpacing: 'letterSpacing' in variantStyle ? variantStyle.letterSpacing : undefined,
    fontWeight: weight ? typographyWeights[weight] : variantStyle.fontWeight,
    color,
    ...style,
  }

  return (
    <Component style={mergedStyle} {...rest}>
      {children}
    </Component>
  )
}
