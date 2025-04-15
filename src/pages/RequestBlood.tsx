
import RequestForm from "@/components/blood/RequestForm";
import MainLayout from "@/components/layout/MainLayout";

const RequestBlood = () => {
  return (
    <MainLayout>
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Request Blood Donation</h1>
          <RequestForm />
        </div>
      </div>
    </MainLayout>
  );
};

export default RequestBlood;
