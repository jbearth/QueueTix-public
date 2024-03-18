import React, { lazy } from 'react';

// project imports
import MainLayout from 'layout/MainLayout';
import Loadable from 'components/Loadable';

// ----------------- General routing -----------------
const App = Loadable(lazy(() => import('pages/Dashboard/App')));
const E_Commerce = Loadable(lazy(() => import('pages/Dashboard/E_Commerce')));

// --------------- Management routing -----------------

// Role User
const UsersList = Loadable(lazy(() => import('pages/Management/User/List')));
// Role Employee
const EmployeeList = Loadable(lazy(() => import('pages/Management/Employee/List')));
const CreateEmployee = Loadable(lazy(() => import('pages/Management/Employee/Create')));
const EditEmployee = Loadable(lazy(() => import('pages/Management/Employee/Edit')));
// Role Manager
const ManagerList = Loadable(lazy(() => import('pages/Management/Manager/List')));
const CreateManager = Loadable(lazy(() => import('pages/Management/Manager/Create')));
const EditManager = Loadable(lazy(() => import('pages/Management/Manager/Edit')));
// Amusementpark
const EditAmusementPark = Loadable(lazy(() => import('pages/Management/AmusementPark/Edit')));
const LocationAmusementPark = Loadable(lazy(() => import('pages/Management/AmusementPark/SetLocation')));
// Rides
const RidesList = Loadable(lazy(() => import('pages/Management/Rides/List')));
const EditRides = Loadable(lazy(() => import('pages/Management/Rides/Edit')));
const CreateRides = Loadable(lazy(() => import('pages/Management/Rides/Create')));
// RoundRides
const RoundrIdesList = Loadable(lazy(() => import('pages/Management/RoundRides/List')));
// const EditPromotion = Loadable(lazy(() => import('pages/Management/Promotion/Edit')));
const CreateRoundRides = Loadable(lazy(() => import('pages/Management/RoundRides/Create')));
// Ticket
const TicketList = Loadable(lazy(() => import('pages/Management/Ticket/List')));
const EditTicket = Loadable(lazy(() => import('pages/Management/Ticket/Edit')));
const FastPassList = Loadable(lazy(() => import('pages/Management/FastPass/List')));
// Promotiom
const PromotionList = Loadable(lazy(() => import('pages/Management/Promotion/List')));
const EditPromotion = Loadable(lazy(() => import('pages/Management/Promotion/Edit')));
const CreatePromotion = Loadable(lazy(() => import('pages/Management/Promotion/Create')));

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/dashboard',
  element: <MainLayout />,
  children: [
    {
      path: '/dashboard',
      element: <App />
    },
    {
      path: 'general',
      children: [
        {
          path: 'app',
          element: <App />
        },
        {
          path: 'e-commerce',
          element: <E_Commerce />
        }
      ]
    },
    {
      path: 'management',
      children: [
        {
          path: 'users',
          children: [
            {
              path: 'list',
              element: <UsersList />
            },
          ]
        },
        {
          path: 'employee',
          children: [
            {
              path: 'list',
              element: <EmployeeList />
            },
            {
              path: 'create',
              element: <CreateEmployee />
            },
            {
              path: 'edit/:id',
              element: <EditEmployee />
            }
          ]
        },
        {
          path: 'manager',
          children: [
            {
              path: 'list',
              element: <ManagerList />
            },
            {
              path: 'create',
              element: <CreateManager />
            },
            {
              path: 'edit/:id',
              element: <EditManager />
            }
          ]
        },
        {
          path: 'amusementpark',
          children: [
            {
              path: 'edit',
              element: <EditAmusementPark />
            },
            {
              path: 'location',
              element: <LocationAmusementPark />
            }
          ]
        },
        {
          path: 'rides',
          children: [
            {
              path: 'list',
              element: <RidesList />
            },
            {
              path: 'create',
              element: <CreateRides />
            },
            {
              path: 'edit/:id',
              element: <EditRides />
            }
          ]
        },
        {
          path: 'roundrides',
          children: [
            {
              path: 'list',
              element: <RoundrIdesList />
            },
            {
              path: 'create',
              element: <CreateRoundRides />
            },
            // {
            //   path: 'edit/:id',
            //   element: <EditRides />
            // }
          ]
        },
        {
          path: 'ticket',
          children: [
            {
              path: 'normal_list',
              element: <TicketList />
            },
            {
              path: 'edit/:id',
              element: <EditTicket />
            },
            {
              path: 'fastpass_list',
              element: <FastPassList />
            }
          ]
        },
        {
          path: 'promotion',
          children: [
            {
              path: 'list',
              element: <PromotionList />
            },
            {
              path: 'create',
              element: <CreatePromotion />
            },
            {
              path: 'edit/:id',
              element: <EditPromotion />
            }
          ]
        },
      ]
    },
  ]
};

export default MainRoutes;
