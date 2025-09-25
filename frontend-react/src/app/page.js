// import { HomeView } from 'src/sections/homebk/view';
import { HomeListView } from 'src/sections/home/view';
// ----------------------------------------------------------------------

const TITLE = 'Q-Scoring'
const DESCRIPTION = 'QAI Scoring ranking'
const IMG_URL = 'https://quynhon.ai/quynhonAI.png'

export const metadata = {
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: IMG_URL,
        width: 800,
        height: 600,
        alt: 'Awesome Page Image',
      },
    ],
  },
  twitter: {
    title: TITLE,
    description: DESCRIPTION,
    images: [IMG_URL],
  },
};

export default function HomePage() {
  return <HomeListView showBreadcrumbs />;
}
