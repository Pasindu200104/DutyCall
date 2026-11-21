// A small footer shown at the bottom of every page.
export default function Footer() {
  return (
    <footer className="border-t border-gray-200 px-4 py-4 text-center text-xs text-gray-500 sm:px-6">
      © {new Date().getFullYear()} DutyCall. Built with React, TypeScript and Tailwind CSS.
    </footer>
  );
}
