export default function Footer() {
  return (
    <footer className="bg-gray-300 py-4 text-center sticky bottom-0 w-full">
      <p className="text-black">
        &copy; {new Date().getFullYear()} Allercheck. All rights reserved.
      </p>
    </footer>
  );
}
