const Dashboard = () => import('../../containers/Dashboard')
const ViewBasicDashboard = () => import('../../components/dashboard/ViewBasicDashboard')
const ViewAdvancedDashboard = () => import('../../components/dashboard/ViewAdvancedDashboard')

export default [
  {
    path: '/dashboard',
    component: Dashboard,
    children: [
      {
        path: '',
        name: 'dashboard:view',
        component: ViewAdvancedDashboard
      },
      {
        path: 'preview',
        name: 'dashboard:preview',
        component: ViewBasicDashboard
      },
    ]
  }
]
