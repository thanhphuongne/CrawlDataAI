import { Configuration, DefinePlugin } from 'webpack';
import { config } from 'dotenv';

config();

export default {
  plugins: [
    new DefinePlugin({
      $ENV: {
        API_URL: JSON.stringify(process.env.API_URL),
      },
    }),
  ],
} as Configuration;
