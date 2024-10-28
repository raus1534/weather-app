import React from "react";

export default function Footer() {
  return (
    <footer className="w-full rounded-xl py-4 bg-gray-800 text-white text-center">
      <p className="text-sm">
        &copy; {new Date().getFullYear()} | <b> {`What's the Weather`} </b> |
        Developed by
        <a
          href="https://github.com/raus1534"
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 hover:underline ml-1"
        >
          Raus
        </a>
      </p>
    </footer>
  );
}
