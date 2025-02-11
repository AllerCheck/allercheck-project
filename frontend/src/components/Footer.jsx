export default function Footer() {
  return (
    <footer className="bg-gray-300 py-2 text-center w-full">
      {/* Main footer content */}

      {/* Menu section */}
      <div className="mt-0">
        <ul className="flex justify-center space-x-6">
      <p className="text-black">
        &copy; {new Date().getFullYear()} AllerCheck. All rights reserved.
      </p>
          <li>
            <a href="/contact" className="text-blue-500 hover:underline">
              Contact
            </a>
          </li>
          <li>
            <a href="/impress" className="text-blue-500 hover:underline">
              Impress
            </a>
          </li>
          <li>
            <a href="/policies" className="text-blue-500 hover:underline">
              Policies
            </a>
          </li>
          <li>
            <a href="/data-protection" className="text-blue-500 hover:underline">
              Data Protection
            </a>
          </li>
        </ul>
      </div>
      

    </footer>
  );
}
