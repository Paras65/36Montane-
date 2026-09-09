

function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-6">
        <div className="container mx-auto text-center">
          <p>&copy; 2025 36 Montane Adventure Camping. All rights reserved.</p>
          <p>Follow us on:
            <a href="https://www.instagram.com" className="ml-4 hover:underline">Instagram</a> |
            <a href="https://www.facebook.com" className="ml-4 hover:underline">Facebook</a> |
            <a href="/admin" className="ml-4 text-emerald-400 hover:text-emerald-300 hover:underline">Admin Portal</a>
          </p>
        </div>
      </footer>
  );
}

export default Footer;