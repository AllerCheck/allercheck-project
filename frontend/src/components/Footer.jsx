export default function Footer() {
  return (
    <footer className="bg-gray-800 py-4 text-center sticky bottom-0 w-full">
      <p className="text-white">
        &copy; {new Date().getFullYear()} Allercheck. All rights reserved.
      </p>
    </footer>
  );
}
