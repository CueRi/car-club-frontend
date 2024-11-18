import { useState, useEffect } from "react";
import { createApiClient, handleApiError } from "../utils/apiUtils";
import { formatDate } from "../utils/dateUtils";

export default function EventsSection() {
  const [events, setEvents] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const api = createApiClient();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setEvents(response.data);
        setLoading(false);
      } catch (err) {
        setError(handleApiError(err));
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (events.length === 0) {
    return <div>No events available</div>;
  }

  const currentEvent = events[currentIndex];

  return (
    <section className="relative bg-black text-white py-16 h-auto md:h-screen">
      <img
        src="/images/background/events.jpg"
        alt="Events Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      <div className="container mx-auto relative z-10 px-4">
        <h2 className="text-4xl md:text-8xl font-bold mb-10 text-yellow-500">
          LATEST HAPPENINGS
        </h2>

        <div className="w-full max-w-3xl mx-auto bg-gray-500 bg-opacity-75 p-8 rounded-lg shadow-md">
          <div className="relative w-full max-w-[100%] mx-auto aspect-[16/9] mb-4">
            <img
              src={currentEvent.image}
              alt={currentEvent.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <h3 className="text-2xl font-semibold mb-2">{currentEvent.title}</h3>
          <p className="mb-4">{currentEvent.description}</p>
          <p className="text-yellow-500 font-bold">
            {formatDate(currentEvent.date)}
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handlePrevious}
              className="inline-block bg-black text-yellow-500 py-2 px-6 rounded-lg font-semibold text-lg md:text-2xl"
            >
              PREVIOUS
            </button>
            <button
              onClick={handleNext}
              className="inline-block bg-black text-yellow-500 py-2 px-6 rounded-lg font-semibold text-lg md:text-2xl"
            >
              NEXT
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
