import { Link } from "react-router-dom";

const SearchPage = () => {
  return (
    <div className="max-h-screen flex flex-col items-center justify-center px-4">
      <img
        src="/Trip-rafiki.svg"
        alt="Travel illustration"
        className="w-72 md:w-96 mb-6"
      />

      <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
        Coming Soon
      </h1>

      <p className="text-gray-600 text-center max-w-md mb-6">
        We’re preparing something exciting to help you discover destinations
        better.
      </p>

      <Link
        to="/recommendations"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
      >
        Return to Recommendations
      </Link>
    </div>
  );
};

export default SearchPage;
