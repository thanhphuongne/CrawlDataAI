import { JwtLoginView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Welcome to Q-scoring!',
};

export default function LoginPage() {
  return <JwtLoginView />;
}
