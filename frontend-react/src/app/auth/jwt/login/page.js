import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Sign in to continue to Q-Scoring',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
