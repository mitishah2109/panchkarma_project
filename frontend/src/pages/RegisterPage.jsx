import AuthLayout from '@/components/layout/AuthLayout';
import RegisterForm from '@/features/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join your clinic's Panchakarma workspace"
    >
      <RegisterForm />
    </AuthLayout>
  );
}
