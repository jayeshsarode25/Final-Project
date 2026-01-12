import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-950 px-4 text-center">
      <h1 className="text-9xl font-extrabold text-gray-100">404</h1>

      <p className="mt-4 text-2xl font-semibold text-gray-700">
        Page Not Found
      </p>

      <p className="mt-2 max-w-md text-gray-500">
        Sorry, the page you are looking for doesn’t exist or has been moved.
      </p>

      <Link
        to="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
