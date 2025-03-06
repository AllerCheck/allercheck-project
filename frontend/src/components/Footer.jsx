/* eslint-disable react/prop-types */
import { useState } from "react";

export default function Footer() {
  const [modal, setModal] = useState(null);

  return (
    <footer className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-70 py-2 text-center w-full">
      <div className="mt-0">
        <ul className="flex justify-center space-x-16">
        <p className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600">&copy; {new Date().getFullYear()} AllerCheck. All rights reserved.</p>
          <li>
            <button onClick={() => setModal("contact")} className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 hover:underline cursor-pointer">
              Contact
            </button>
          </li>
          <li>
            <button data-testid="impress" onClick={() => setModal("impress")} className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 hover:underline cursor-pointer">
              Impress
            </button>
          </li>
          <li>
            <button onClick={() => setModal("policies")} className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 hover:underline cursor-pointer">
              Policies
            </button>
          </li>
          <li>
            <button onClick={() => setModal("data-protection")} className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-600 hover:underline cursor-pointer">
              Data Protection
            </button>
          </li>
        </ul>
      </div>

      {/* Modals */}
      {modal === "contact" && (
        <Modal title="Contact" onClose={() => setModal(null)}>
          <p>If you have any questions or need assistance, feel free to reach out to us at:</p>
          <p>Email: support@allercheck.com</p>
          <p>Phone: +49 123 456 789</p>
          <p>Address: Berlin, Germany</p>
        </Modal>
      )}
      {modal === "impress" && (
        <Modal title="Impress" onClose={() => setModal(null)}>
          <p>AllerCheck GmbH</p>
          <p>CEO: John Doe</p>
          <p>Address: Allergy Street 123,</p>
          <p>12345 Berlin, Germany</p>
          <p>Commercial Register: HRB 987654</p>
        </Modal>
      )}
      {modal === "policies" && (
        <Modal title="Policies" onClose={() => setModal(null)}>
          <p>Our policies ensure a safe and secure experience for all users.</p>
          <ul>
            <li>Terms of Service</li>
            <li>Refund Policy</li>
            <li>Usage Guidelines</li>
          </ul>
        </Modal>
      )}
      {modal === "data-protection" && (
        <Modal title="Data Protection" onClose={() => setModal(null)}>
          <p>We are committed to protecting your personal data.</p>
          <p>Learn more about how we handle and secure your information.</p>
        </Modal>
      )}
    </footer>
  );
}

function Modal({ title, children, onClose }) {
  return (
    <div className="fixed inset-0 bg-white/30 flex justify-center items-center">
      <div className="bg-white bg-opacity-95 p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-2 text-yellow-600">{title}</h2>
        <div>{children}</div>
        <button onClick={onClose} className="mt-4 bg-gray-600 hover:bg-gradient-to-r from-yellow-300 to-yellow-600 hover:text-red-500 hover:font-bold text-white px-4 py-2 rounded">
          Close
        </button>
      </div>
    </div>
  );
}
