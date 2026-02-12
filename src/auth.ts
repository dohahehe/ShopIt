import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { failedLogin, successLogin } from './app/types/authInterface';

export const authOptions: NextAuthOptions = {
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
            name:'credentials',
            credentials: {
                email: {},
                password: {}
            },
            authorize: async (credentials) => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signin`, {
                    method: 'POST',
                    body: JSON.stringify({
                        email: credentials?.email,
                        password: credentials?.password
                    }),
                    headers: {
                        'Content-type': 'application/json'
                    }
                });

                const payload : failedLogin | successLogin = await res.json()
                console.log(payload);
                
                if ('token' in payload) {
                   return {
                    id: payload.user.email,
                    user: payload.user,
                    token: payload.token
                }
                } else {
                  throw new Error('error signing in!')
                }
            }
        })
    ],
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, 
    },
    callbacks: {
        jwt: ({token, user, trigger, session}) => {
            // Initial sign in
            if(user){
                token.user = user.user
                token.token = user.token
                // console.log("JWT callback - token set:", !!token.token);
            }
            
            // Handle session update from client
            if (trigger === "update" && session) {
                token.user = {
                    ...token.user as any,
                    ...session.user
                }
            }
            
            return token
        },
        session: ({session, token}) => {
            // console.log("Session callback - token from JWT:", !!token.token); 
            session.user = token.user as any
            session.token = token.token as string
            return session
        }, 
        
    }
}