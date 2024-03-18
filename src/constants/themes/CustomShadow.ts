// material-ui
import { alpha } from '@mui/material/styles';
import colors from 'assets/scss/_themes-vars.module.scss';

// ----------------------------------------------------------------------

const color = colors?.grey500;

export default function themeCustomShadows() {
  const transparent = alpha(color, 0.16);
  return {
    z1: `0 1px 2px 0 ${transparent}`,
    z2: `0 2px 4px 0 ${transparent}`,
    z3: `0 3px 6px 0 ${transparent}`,
    z4: `0 4px 8px 0 ${transparent}`,
    z5: `0 5px 10px 0 ${transparent}`,
    z6: `0 6px 12px 0 ${transparent}`,
    z7: `0 7px 14px 0 ${transparent}`,
    z8: `0 8px 16px 0 ${transparent}`,
    z9: `0 9px 18px 0 ${transparent}`,
    z10: `0 10px 20px 0 ${transparent}`,
    z11: `0 11px 22px 0 ${transparent}`,
    z12: `0 12px 24px -4px ${transparent}`,
    z16: `0 16px 32px -4px ${transparent}`,
    z20: `0 20px 40px -4px ${transparent}`,
    z24: `0 24px 48px 0 ${transparent}`,
    //
    primary: `0 8px 16px 0 ${alpha(colors?.primaryMain, 0.24)}`,
    info: `0 8px 16px 0 ${alpha(colors?.infoCustomMain, 0.24)}`,
    secondary: `0 8px 16px 0 ${alpha(colors?.secondaryMain, 0.24)}`,
    success: `0 8px 16px 0 ${alpha(colors?.successCustomMain, 0.24)}`,
    warning: `0 8px 16px 0 ${alpha(colors?.warningCustomMain, 0.24)}`,
    error: `0 8px 16px 0 ${alpha(colors?.errorCustomMain, 0.24)}`,
    //
    card: `0 0px 2px 0px ${alpha(color, 0.2)}, 0 12px 24px -4px ${alpha(color, 0.3)}`,
    dialog: `-40px 40px 80px -8px ${alpha(color, 0.24)}`,
    dropdown: `0 0 2px 0 ${alpha(color, 0.24)}, -20px 20px 40px -4px ${alpha(color, 0.24)}`,
  };
}
