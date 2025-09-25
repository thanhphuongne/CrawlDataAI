import { JwtRegisterView } from 'src/sections/auth/jwt';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'Register Q-scoring account',
};

export default function RegisterPage() {
  return <JwtRegisterView />;
}
