
import RegisterForm from "@/components/auth/RegisterForm";
import MainLayout from "@/components/layout/MainLayout";

const Register = () => {
  return (
    <MainLayout>
      <div className="min-h-[calc(100vh-64px-300px)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <RegisterForm />
      </div>
    </MainLayout>
  );
};

export default Register;
