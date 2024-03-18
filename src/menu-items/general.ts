import { MenuItemProps } from "./MenuItemsType";

// ==============================|| General Menu Item ||============================== //

const general: MenuItemProps = {
  id: 'general',
  title: 'general',
  type: 'group',
  children: [
    {
      id: 'app',
      title: 'App',
      type: 'item',
      icon: "material-symbols:speed-rounded",
      url: '/dashboard/general/app',
      breadcrumbs: false
    },
    // {
    //   id: 'e-commerce',
    //   title: 'E-Commerce',
    //   type: 'item',
    //   icon: "solar:cart-4-bold-duotone",
    //   url: '/dashboard/general/e-commerce',
    //   breadcrumbs: false
    // },
    // {
    //   id: 'analytics',
    //   title: 'Analytics',
    //   type: 'item',
    //   icon: "solar:pie-chart-2-bold-duotone",
    //   url: '/dashboard/general/analytics',
    //   breadcrumbs: false
    // },
  ]
};

export default general;
