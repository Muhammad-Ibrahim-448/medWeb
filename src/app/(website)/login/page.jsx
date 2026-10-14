import LoginClient from './LoginClient';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Sign In | Shoaib Jewellers',
  description: 'Sign in to your Shoaib Jewellers account',
};

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const redirect = params?.redirect || null;

  return <LoginClient redirect={redirect} />;
}