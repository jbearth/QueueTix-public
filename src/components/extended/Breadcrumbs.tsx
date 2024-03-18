import React, { useState } from 'react';

// material-ui
import MuiBreadcrumbs from '@mui/material/Breadcrumbs';
import { Chip, Stack, Typography, emphasize, styled } from '@mui/material';

// thirds-party
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { sentenceCase } from 'change-case';

// project imports
import { MenuItemProps, ChildrenMenuItems } from 'menu-items/MenuItemsType';
import Iconify from 'components/iconify';

// ==============================|| BREADCRUMBS ||============================== //

type Props = {
  navigation: any,
  title: boolean;
  // All other props
  [x: string]: any;
}

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === 'light'
      ? "#fff"
      : theme.palette.grey[300];
  return {
    backgroundColor,
    height: theme.spacing(4),
    color: theme.palette.text.primary,
    boxShadow: 'inset 0 0 5px rgba(0, 0, 0, 0.2)',
    marginTop: 10,
    paddingInline: 10,
    fontFamily: "Sarabun-Medium",
    '&:hover, &:focus': {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    '&:active': {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },

  }
}) as typeof Chip;


const Breadcrumbs: React.FC<Props> = ({ navigation, title }) => {
  const domainName = " https://84cb-119-76-143-28.ngrok-free.app"
  const [item, setItem] = useState<any>(null);
  const location = useLocation();
  const { id } = useParams();

  // เก็บข้อมูล menu item ที่ตรงกับหน้าที่ผู้ใช้อยู่
  const getCollapseItem = (menu: MenuItemProps, locationPath: string) => {
    menu?.children?.filter((collapse: ChildrenMenuItems) => {
      if (collapse.type && collapse.type === 'collapse') {
        collapse?.children?.map((item: ChildrenMenuItems) => {
          if (item.type && item.type === 'item') {
            const itemurl = item.url?.slice(1).split('/');
            if (itemurl && id && itemurl.find((item) => item === ":id")) {
              itemurl.pop();
              itemurl.push(id);
              locationPath.slice(1) == itemurl.join("/") && setItem(item);
            } else if (locationPath === item.url) {
              setItem(item);
            }
          }
        })
      }
      return false;
    });
  };

  // ให้ตัวอักษรแรกตัวใหญ่ของชื่อ path แต่ละหน้า
  const getPathNameSplit = React.useCallback((item: string, index: number) => {
    const pathSplit = item.slice(1).split('/')[index]
    return sentenceCase(pathSplit)
  }, [])

  // useEffect(() => {
  //   location.pathname == "/dashboard" && navigate("/dashboard/general/app")
  // }, [])

  // เอาข้อมูลเฉพาะที่ menu มี type เป็น group
  React.useEffect(() => {
    if (item !== null) {
      setItem(null)
    }

    getCollapseItem(navigation, location.pathname)
  });

  let breadcrumbContent;

  // main
  if (item && item.breadcrumbs !== false) {
    breadcrumbContent = (
      <Stack direction={"column"} mb={7} pl={3}>
        {title && <Typography variant="h3" fontFamily={"Sarabun-Bold"} gutterBottom>
          {item.label || item.title}
        </Typography>}
        <MuiBreadcrumbs
          aria-label="breadcrumb"
          separator={<Typography fontSize={20} pt={0.6}>•</Typography>}
        >
          <StyledBreadcrumb
            component="a"
            href={`${domainName}/dashboard/general/app`}
            label="Dashboard"
            icon={<Iconify icon="solar:home-bold-duotone" width={15} sx={{ pb: 0.2 }} />}
          />
          <StyledBreadcrumb component="a" label={getPathNameSplit(item.url, 1)} />
          <StyledBreadcrumb component="a" label={getPathNameSplit(item.url, 2)} />
          <StyledBreadcrumb component="a" label={getPathNameSplit(item.url, 3)} />
        </MuiBreadcrumbs>
      </Stack >
    );
  }

  return breadcrumbContent;
};

export default Breadcrumbs;
