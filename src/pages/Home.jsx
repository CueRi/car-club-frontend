import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createApiClient, handleApiError } from "../utils/apiUtils";
import { formatDate } from "../utils/dateUtils";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [carOfTheMonth, setCarOfTheMonth] = useState(null);
  const api = createApiClient();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get("/events");
        if (Array.isArray(response.data)) {
          setEvents(response.data);
        } else {
          setError("Unexpected data format");
        }
      } catch (error) {
        setError(handleApiError(error));
      } finally {
        setLoading(false);
      }
    };

    const fetchCarOfTheMonth = async () => {
      try {
        const response = await api.get(
          "/news/category/MEMBER'S CAR OF THE MONTH"
        );
        setCarOfTheMonth(response.data);
      } catch (error) {
        setError(handleApiError(error));
      }
    };

    fetchEvents();
    fetchCarOfTheMonth();
  }, []);

  const handlePrevEvent = () => {
    setCurrentEventIndex((prev) => (prev === 0 ? events.length - 1 : prev - 1));
  };

  const handleNextEvent = () => {
    setCurrentEventIndex((prev) => (prev === events.length - 1 ? 0 : prev + 1));
  };

  return (
    <main className="bg-black text-white">
      <section className="relative py-16 h-screen">
        <div className="absolute inset-0 bg-[url('/images/background/about.jpg')] opacity-40 bg-cover bg-center bg-no-repeat" />
        <div className="container mx-auto relative z-10 px-4">
          <h2 className="text-4xl md:text-8xl font-bold mb-10 text-yellow-500 font-[Antonio]">
            ABOUT THE CLUB
          </h2>
          <p className="max-w-4xl text-lg md:text-2xl mb-8">
            Sunway Car Enthusiast Club brings together car lovers at Sunway
            University, hosting events and activities to celebrate automotive
            culture, innovation, and community.
          </p>
          <Link
            to="/about"
            className="inline-block bg-black text-yellow-500 py-2 px-6 rounded-lg font-semibold text-lg md:text-2xl"
          >
            READ MORE
          </Link>
        </div>
      </section>

      <section className="relative py-16">
        <div className="absolute inset-0 bg-[url('/images/placeholder/bg2.jpg')] opacity-40" />
        <div className="container mx-auto relative z-10 px-4">
          <h2 className="text-4xl md:text-8xl font-bold mb-10 text-yellow-500">
            LATEST HAPPENINGS
          </h2>

          {loading ? (
            <div className="text-center">
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">
              <p>{error}</p>
            </div>
          ) : events.length > 0 ? (
            <div className="w-full max-w-4xl mx-auto bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-md">
              <div className="relative flex items-center justify-between gap-8">
                <button
                  onClick={handlePrevEvent}
                  className="bg-yellow-500 text-black p-4 rounded-full hover:bg-yellow-600 transition duration-300"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <div className="w-full flex flex-col items-center">
                  <div className="relative w-full h-96 mb-6">
                    <img
                      src={events[currentEventIndex].image}
                      alt={events[currentEventIndex].title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-semibold mb-2">
                    {events[currentEventIndex].title}
                  </h3>
                  <p className="mb-4 text-center">
                    {events[currentEventIndex].description}
                  </p>
                  <p className="text-yellow-500 font-bold">
                    {formatDate(events[currentEventIndex].date)}
                  </p>
                </div>
                <button
                  onClick={handleNextEvent}
                  className="bg-yellow-500 text-black p-4 rounded-full hover:bg-yellow-600 transition duration-300"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center text-yellow-500">
              <p>No events available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-5xl md:text-9xl font-bold mb-16 text-yellow-500 text-center">
            MEMBER&apos;S CAR OF THE MONTH
          </h2>
          {carOfTheMonth ? (
            <div className="flex justify-center">
              <div className="bg-gray-900 p-10 rounded-xl shadow-xl w-full max-w-3xl">
                <div className="mb-6 overflow-hidden rounded-lg">
                  <img
                    src={carOfTheMonth.image}
                    alt={carOfTheMonth.title}
                    className="w-full h-auto rounded-lg object-cover"
                    style={{ maxHeight: "300px" }}
                  />
                </div>

                <h3 className="text-3xl font-bold text-center text-yellow-400 mb-4">
                  {carOfTheMonth.title}
                </h3>

                <p className="text-lg text-center text-gray-300 mb-6 leading-relaxed">
                  {carOfTheMonth.description}
                </p>

                <p className="text-md text-center text-yellow-500 font-medium mb-6">
                  {formatDate(carOfTheMonth.date)}
                </p>

                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <Link
                    to="/news"
                    className="bg-yellow-500 text-black py-3 px-8 rounded-full font-semibold text-lg hover:bg-yellow-600 transition-all"
                  >
                    READ MORE NEWS
                  </Link>

                  <a
                    href="https://forms.gle/hMYLU5n8q2LysDux5"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 text-yellow-400 py-3 px-8 rounded-full font-semibold text-lg hover:bg-gray-600 transition-all"
                  >
                    CAR REVIEW SUBMISSION FORM
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-yellow-500">
              <p>No car of the month data available.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
