import { getQueryParam } from '../../utils/browser'

const Home = () => import('../../components/Home')

export default [
  {
    path: '/',
    name: 'home',
    component: Home,
    props: () => {
      const target = getQueryParam('target')

      return {
        isPreview: target === 'inlinedialog'
      }
    }
  }
]
