import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { createApiClient, handleApiError } from "../utils/apiUtils";
import { Loader2 } from "lucide-react";
import { formatDate } from "../utils/dateUtils";

const NewsDetailPage = () => {
  const { id } = useParams();
  const [newsItem, setNewsItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const api = createApiClient();

  useEffect(() => {
    const fetchNewsItem = async () => {
      try {
        const response = await api.get(`/news/${id}`);
        setNewsItem(response.data);
      } catch (error) {
        setError(handleApiError(error));
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItem();
  }, [id]);

  return (
    <main className="min-h-screen bg-black">
      <section className="py-20">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 text-yellow-500 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">
              {error}
            </div>
          ) : (
            <div className="bg-white text-black rounded-lg p-6">
              <div className="flex justify-center mb-6">
                <img
                  src={newsItem.image}
                  alt={newsItem.title}
                  className="w-full max-w-3xl h-auto object-contain rounded-lg shadow-md"
                />
              </div>
              <h3 className="text-3xl font-bold mt-4">{newsItem.title}</h3>
              <p className="text-gray-500 mt-2">{formatDate(newsItem.date)}</p>
              <p className="text-gray-700 mt-6 leading-relaxed">
                {newsItem.description}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default NewsDetailPage;
