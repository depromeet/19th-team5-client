import { type RecipeVariants, recipe } from '@vanilla-extract/recipes';
import { color, typography } from '@/styles/token';

export const button = recipe({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: 0,
    border: 'none',
    whiteSpace: 'nowrap',
    cursor: 'pointer',
    selectors: {
      '&:disabled': {
        background: color.neutral[100],
        color: color.neutral[400],
        boxShadow: 'none',
        cursor: 'not-allowed',
      },
    },
  },
  variants: {
    variant: {
      primary: { background: color.neutral[900], color: color.neutral[0] },
      secondary: { background: color.neutral[100], color: color.neutral[900] },
      danger: { background: color.danger[500], color: color.neutral[0] },
      outline: {
        background: color.neutral[0],
        color: color.neutral[900],
        boxShadow: `inset 0 0 0 1px ${color.neutral[300]}`,
      },
      text: { background: 'transparent', color: color.primary[500] },
    },
    size: {
      large: {
        ...typography.bodyMStrong,
        paddingBlock: '16px',
        paddingInline: '24px',
        borderRadius: '14px',
      },
      medium: {
        ...typography.bodySStrong,
        paddingBlock: '12px',
        paddingInline: '16px',
        borderRadius: '12px',
      },
      small: {
        ...typography.bodySStrong,
        paddingBlock: '6px',
        paddingInline: '12px',
        borderRadius: '8px',
      },
    },
    display: {
      inline: { display: 'inline-flex' },
      block: { display: 'flex', width: '100%' },
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
    display: 'inline',
  },
});

export type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;
