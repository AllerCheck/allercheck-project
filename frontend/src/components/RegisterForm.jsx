function RegisterForm() {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <form className="bg-white p-6 rounded-lg shadow-md w-80">
          <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>
  
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="text"
            id="email"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
  
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          />
  
          <label htmlFor="retype-password" className="block text-sm font-medium text-gray-700">
            Re-type Password
          </label>
          <input
            type="password"
            id="retype-password"
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
  
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
          >
            Register
          </button>
        </form>
      </div>
    );
  }
  
  export default RegisterForm;
  