// ----------------------------------------------------------------------

/* แปลงหน่วย rem เป็น px */
export function remToPx(value: string) {
  return Math.round(parseFloat(value) * 16);
}

/* แปลงหน่วย px เป็น rem */
export function pxToRem(value: number) {
  return `${value / 16}rem`;
}

/* ความยืนหยุดของขนาด Font ต่อขนาดของหน้าจอ */
export function responsiveFontSizes({ sm, md, lg }: any) {
  return {
    '@media (min-width:600px)': {
      fontSize: pxToRem(sm),
    },
    '@media (min-width:900px)': {
      fontSize: pxToRem(md),
    },
    '@media (min-width:1200px)': {
      fontSize: pxToRem(lg),
    },
  };
}

// ----------------------------------------------------------------------

interface ThemeTypographyProps {
  readonly [x: string]: string;
  defaultFont?: any;
  grey500?: any;
  grey900?: any;
}

/* theme กำหนดรูปแบบข้อความ */
export default function themeTypography(colors: ThemeTypographyProps) {
  return {
    fontFamily: 'Sarabun-Regular',
    h1: {
      color: colors?.defaultFont,
      fontWeight: 800,
      fontSize: pxToRem(32),
      ...responsiveFontSizes({ sm: 31, md: 32, lg: 33 }),
    },
    h2: {
      color: colors?.defaultFont,
      fontWeight: 700,
      fontSize: pxToRem(28),
      ...responsiveFontSizes({ sm: 27, md: 28, lg: 29 }),
    },
    h3: {
      color: colors?.defaultFont,
      fontSize: pxToRem(24),
      ...responsiveFontSizes({ sm: 23, md: 24, lg: 25 }),
    },
    h4: {
      color: colors?.defaultFont,
      fontSize: pxToRem(20),
      ...responsiveFontSizes({ sm: 19, md: 20, lg: 21 }),
    },
    h5: {
      color: colors?.defaultFont,
      fontSize: pxToRem(16),
      ...responsiveFontSizes({ sm: 15, md: 16, lg: 17 }),
    },
    h6: {
      color: colors?.defaultFont,
      fontSize: pxToRem(14),
      ...responsiveFontSizes({ sm: 13, md: 14, lg: 15 }),
    },
    h7: {
      color: colors?.defaultFont,
      fontSize: pxToRem(12),
      ...responsiveFontSizes({ sm: 11, md: 12, lg: 13 }),
    },
    h8: {
      color: colors?.defaultFont,
      fontSize: pxToRem(10),
      ...responsiveFontSizes({ sm: 9, md: 10, lg: 11 }),
    },
    h9: {
      color: colors?.defaultFont,
      fontSize: pxToRem(8),
      ...responsiveFontSizes({ sm: 7, md: 8, lg: 9 }),
    },
    subtitle1: {
      fontFamily: 'Sarabun-Medium',
      lineHeight: 1.5,
      fontSize: pxToRem(16),
    },
    subtitle2: {
      fontFamily: 'Sarabun-Medium',
      lineHeight: 22 / 14,
      fontSize: pxToRem(14),
    },
    body1: {
      lineHeight: 1.5,
      fontSize: pxToRem(16),
    },
    body2: {
      lineHeight: 22 / 14,
      fontSize: pxToRem(14),
    },
    caption: {
      lineHeight: 1.5,
      fontSize: pxToRem(12),
    },
    overline: {
      fontWeight: 700,
      lineHeight: 1.5,
      fontSize: pxToRem(12),
      textTransform: 'uppercase',
    },
    button: {
      fontWeight: 700,
      lineHeight: 24 / 14,
      fontSize: pxToRem(14),
      textTransform: 'capitalize',
    },
    fontItemLeftDrawerSelect: {
      fontSize: pxToRem(14),
      ...responsiveFontSizes({ sm: 13, md: 14, lg: 15 }),
      fontFamily: 'Sarabun-SemiBold',
      textAlign: 'center',
    },
    subItemDrawerClose: {
      fontSize: '0.6875rem',
      fontFamily: 'Sarabun-Medium',
    },
    subItemDrawerSelect: {
      fontSize: '0.7875rem',
      fontFamily: 'Sarabun-SemiBold',
    },
    customInput: {
      '& > label': {
        top: 23,
        left: 0,
        color: colors.grey500,
        '&[data-shrink="false"]': {
          top: 5
        }
      },
      '& > div > input': {
        // padding: '30.5px 14px 11.5px !important'
      },
      '& legend': {
        display: 'none'
      },
      '& fieldset': {
        top: 0
      }
    },
    mainContent: {
      width: '100%',
      minHeight: 'calc(100vh - 88px)',
      flexGrow: 1,
      padding: '20px',
      marginTop: '88px',
      marginRight: '20px',
    },
    menuCaption: {
      fontSize: '0.875rem',
      fontFamily: 'Sarabun-SemiBold',
      color: colors?.grey900,
      padding: 0,
      textTransform: 'capitalize',
    },
    subMenuCaption: {
      fontSize: '0.6875rem',
      fontFamily: 'Sarabun-Medium',
      color: colors?.grey500,
      textTransform: 'capitalize'
    },
    commonAvatar: {
      cursor: 'pointer',
      borderRadius: '8px'
    },
    smallAvatar: {
      width: '22px',
      height: '22px',
      fontSize: '1rem'
    },
    mediumAvatar: {
      width: '34px',
      height: '34px',
      fontSize: '1.2rem',
      // margin: '30px'
    },
    largeAvatar: {
      width: '44px',
      height: '44px',
      fontSize: '1.5rem'
    }
  };
}
