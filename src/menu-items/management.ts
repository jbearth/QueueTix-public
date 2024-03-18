import { MenuItemProps } from "./MenuItemsType";

// ==============================|| Management Menu Item ||============================== //

const management: MenuItemProps = {
  id: 'management',
  title: 'Management',
  type: 'group',
  children: [
    {
      id: 'manage_users',
      title: 'User',
      type: 'collapse',
      icon: "solar:user-circle-bold-duotone",
      children: [
        {
          id: 'list',
          title: 'List',
          label: 'List Users',
          type: 'item',
          url: '/dashboard/management/users/list',
          breadcrumbs: true
        },
      ]
    },
    {
      id: 'manage_employee',
      title: 'Employee',
      type: 'collapse',
      icon: "clarity:employee-solid",
      children: [
        {
          id: 'list_employee',
          title: 'List',
          label: 'List Employee',
          type: 'item',
          url: '/dashboard/management/employee/list',
          breadcrumbs: true
        },
        {
          id: 'create_employee',
          title: 'Create',
          label: 'Create a new Employee',
          type: 'item',
          url: '/dashboard/management/employee/create',
          breadcrumbs: true
        },
      ]
    },
    {
      id: 'manage_manager',
      title: 'Manager',
      type: 'collapse',
      icon: "mingcute:user-star-fill",
      children: [
        {
          id: 'list_manager',
          title: 'List',
          label: 'List Manager',
          type: 'item',
          url: '/dashboard/management/manager/list',
          breadcrumbs: true
        },
        {
          id: 'create_manager',
          title: 'Create',
          label: 'Create a new Manager',
          type: 'item',
          url: '/dashboard/management/manager/create',
          breadcrumbs: true
        },
      ]
    },
    {
      id: 'manage_amusementpark',
      title: 'Amusement Park',
      type: 'collapse',
      icon: "guidance:amusement-park",
      children: [
        {
          id: 'edit_amusementpark',
          title: 'Edit',
          type: 'item',
          url: '/dashboard/management/amusementpark/edit',
          breadcrumbs: true
        },
      ]
    },
    {
      id: 'manage_rides',
      title: 'Rides',
      type: 'collapse',
      icon: "map:amusement-park",
      children: [
        {
          id: 'list_rides',
          title: 'List',
          type: 'item',
          url: '/dashboard/management/rides/list',
          breadcrumbs: true
        },
        {
          id: 'create_rides',
          title: 'Create',
          type: 'item',
          url: '/dashboard/management/rides/create',
          breadcrumbs: true
        },
      ]
    },
    {
      id: 'manage_roundrides',
      title: 'Round Rides',
      type: 'collapse',
      icon: "solar:alarm-add-bold-duotone",
      children: [
        {
          id: 'list_roundrides',
          title: 'List',
          type: 'item',
          url: '/dashboard/management/roundrides/list',
          breadcrumbs: true
        },
        {
          id: 'create_roundrides',
          title: 'Create',
          type: 'item',
          url: '/dashboard/management/roundrides/create',
          breadcrumbs: true
        },
      ]
    },
    {
      id: 'manage_ticket',
      title: 'Ticket',
      type: 'collapse',
      icon: "solar:ticker-star-bold-duotone",
      children: [
        {
          id: 'normal_list_ticket',
          title: 'List Ticket Normal',
          type: 'item',
          url: '/dashboard/management/ticket/normal_list',
          breadcrumbs: true
        },
        {
          id: 'fastpass_ticket',
          title: 'List_FastPass',
          type: 'item',
          url: '/dashboard/management/ticket/fastpass_list',
          breadcrumbs: true
        },
      ]
    },
    {
      id: 'manage_promotion',
      title: 'Promotion',
      type: 'collapse',
      icon: "solar:ticket-sale-bold-duotone",
      children: [
        {
          id: 'list_promotion',
          title: 'List',
          type: 'item',
          url: '/dashboard/management/promotion/list',
          breadcrumbs: true
        },
        {
          id: 'create_promotion',
          title: 'Create',
          type: 'item',
          url: '/dashboard/management/promotion/create',
          breadcrumbs: true
        },
      ]
    },
  ]
};

export default management;
