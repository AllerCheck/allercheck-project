function Home() {
  return (
    
    <div className="min-h-screen flex flex-col mt-auto">
      <h1 className="text-center font-bold text-4xl mb-6">
        Welcome to AllerCheck
      </h1>

      <div className="flex-1 grid grid-cols-3 gap-2 p-4">
        <div className="bg-blue-100 p-6 text-xl font-bold col-span-2">
          Articles
        </div>
        <div className="bg-green-100 p-6 text-xl font-bold">Wetter</div>
      </div>

      <div className="flex justify-center space-x-4 mb-6">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
          Barcode Scanner
        </button>
        <button className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition">
          Allergy Journal
        </button>
        <button className="bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition">
          Appointments
        </button>
      </div>
    </div>
  );
}

export default Home;
