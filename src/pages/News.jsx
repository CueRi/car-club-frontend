import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import { createApiClient, handleApiError } from "../utils/apiUtils";
import { formatDate } from "../utils/dateUtils";
import { truncateText } from "../utils/truncateTextUtils";

const NewsCard = ({ news, navigate }) => {
  return (
    <div className="bg-white text-black rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
      <img
        src={news.image}
        alt={news.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-yellow-500 font-semibold">{news.category}</span>
          <span className="text-gray-600 text-sm">{formatDate(news.date)}</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{news.title}</h3>
        <p className="text-gray-700 mb-4">
          {truncateText(news.description, 110)}
        </p>
        <button
          className="bg-yellow-500 text-black py-2 px-6 rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
          onClick={() => news.id && navigate(`/news/${news.id}`)}
        >
          Read More
        </button>
      </div>
    </div>
  );
};

const NewsPage = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const api = createApiClient(navigate);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await api.get("/news");
        if (Array.isArray(response.data)) {
          setNews(response.data);
        } else {
          setError("Unexpected data format");
        }
      } catch (error) {
        setError(handleApiError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-8xl font-bold text-yellow-500 mb-10 font-[Antonio]">
            LATEST NEWS
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {news.map((item) => (
                <NewsCard key={item.id} news={item} navigate={navigate} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

NewsCard.propTypes = {
  news: PropTypes.shape({
    id: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
  navigate: PropTypes.func.isRequired,
};

export default NewsPage;
