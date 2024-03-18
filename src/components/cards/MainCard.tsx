import React, { forwardRef } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Card, CardContent, CardHeader, Divider, Typography, SxProps } from '@mui/material';

interface MainCardProps {
  children?: React.ReactNode,
  content?: boolean,
  contentSX?: SxProps,
  headerSX?: SxProps,
  divider?: boolean,
  darkTitle?: boolean,
  sx?: SxProps,
  title?: (string | object) & React.ReactNode,
  subheader?: (string | object) & React.ReactNode,
  elevation?: number
}

// ==============================|| CUSTOM MAIN CARD ||============================== //

const MainCard = forwardRef(
  (
    {
      children,
      content = true,
      contentSX = {},
      headerSX = {},
      divider = false,
      darkTitle = false,
      subheader,
      sx = {},
      title,
      elevation
    }: MainCardProps,
    ref: any
  ) => {
    const theme: any = useTheme();
    return (
      <Card
        ref={ref}
        elevation={elevation}
        sx={{ ...sx, '&:last- ': { p: 0, m: 0 }, boxShadow: theme.customShadows.card }}
      >
        {/* card header and action */}
        {title && (
          <CardHeader
            sx={headerSX}
            title={darkTitle ? <Typography variant="h3">{title}</Typography> : title}
            subheader={subheader}
          />
        )}

        {/* content & header divider */}
        {divider && <Divider />}

        {/* card content */}
        {content && (
          <CardContent sx={{ ...contentSX }}>
            {children}
          </CardContent>
        )}
        {!content && children}
      </Card>
    )
  }
)

export default MainCard;
