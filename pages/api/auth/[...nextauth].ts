import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GithubProvider from "next-auth/providers/github";
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
        name: 'Custom Login',
        credentials: {
            email: { label: 'Correo:', type: 'email', placeholder: 'correo@google.com' },
            password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' },
        },
        async authorize(credentials) {
            console.log({credentials})
            // return { name: 'Vitoko', email: 'vitoko@google.com', role: 'admin' };
            
            return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
        }
    }),

    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // ...add more providers here
  ],

  // Custom Pages
  pages: {
      signIn: '/auth/login',
      newUser: '/auth/register',
  },

  // Callbacks
  jwt: {
      // secret: process.env.JWT_SECRET_SEED, // deprecated
  },
  session: {
    maxAge: 2592000, // 30 días
    strategy: 'jwt',
    updateAge: 86400, // cada día
  },

  callbacks: {

    async jwt({ token, account, user }) {
        // console.log({ token, account, user });

        if (account) {
            token.accessToken = account.access_token;

            switch (account.type) {
                case 'oauth':
                    token.user = await dbUsers.oAuthToDbUser(user?.email || '', user?.name || '');
                    break;
                case 'credentials':
                    token.user = user;
                    break;
            }
        }

        return token;
    },

    async session({ session, token, user }) {
        // console.log({ session, token, user });

        session.accessToken = token.accessToken;
        session.user = token.user as any;

        return session;
    }
  }
});