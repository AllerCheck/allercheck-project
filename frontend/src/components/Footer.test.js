import { render, screen, fireEvent } from "@testing-library/react";
import Footer from "../src/components/Footer";
import { expect, test } from "vitest";

test("Footer enthält AllerCheck Copyright", () => {
  render(<Footer />);
  expect(screen.getByText(/AllerCheck. All rights reserved./i)).toBeInTheDocument();
});

test("Öffnet und schließt das Contact-Modal", () => {
  render(<Footer />);
  
  // Modal sollte anfangs nicht sichtbar sein
  expect(screen.queryByText(/If you have any questions/i)).not.toBeInTheDocument();

  // Klicke auf Contact
  fireEvent.click(screen.getByText("Contact"));

  // Modal sollte erscheinen
  expect(screen.getByText(/If you have any questions/i)).toBeInTheDocument();

  // Klicke auf Close
  fireEvent.click(screen.getByText("Close"));

  // Modal sollte wieder verschwinden
  expect(screen.queryByText(/If you have any questions/i)).not.toBeInTheDocument();
});

test("Öffnet und schließt das Impress-Modal", () => {
  render(<Footer />);

  fireEvent.click(screen.getByText("Impress"));
  expect(screen.getByText("AllerCheck GmbH")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));
  expect(screen.queryByText("AllerCheck GmbH")).not.toBeInTheDocument();
});

test("Öffnet und schließt das Policies-Modal", () => {
  render(<Footer />);

  fireEvent.click(screen.getByText("Policies"));
  expect(screen.getByText("Our policies ensure a safe and secure experience for all users.")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));
  expect(screen.queryByText("Our policies ensure a safe and secure experience for all users.")).not.toBeInTheDocument();
});

test("Öffnet und schließt das Data Protection-Modal", () => {
  render(<Footer />);

  fireEvent.click(screen.getByText("Data Protection"));
  expect(screen.getByText("We are committed to protecting your personal data.")).toBeInTheDocument();

  fireEvent.click(screen.getByText("Close"));
  expect(screen.queryByText("We are committed to protecting your personal data.")).not.toBeInTheDocument();
});
