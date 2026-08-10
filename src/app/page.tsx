import MainLayout from "@/components/layout/MainLayout";

export default function HomePage(){
  return(
    <MainLayout>
      <h1 className="text-3xl font-bold">
        Client Understanding Dashboard
      </h1>

      <p className="mt-4 text-gray-600">
        Welcome to the AI Audit Planning Platform
      </p>
    </MainLayout>
  );
}