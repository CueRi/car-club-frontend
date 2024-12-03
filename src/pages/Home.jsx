import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { createApiClient, handleApiError } from "../utils/apiUtils";
import { formatDate } from "../utils/dateUtils";

export default function Home() {
  const [events, setEvents] = useState([]);
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {events.slice(0, 2).map((event, index) => (
                  <div
                    key={index}
                    className="w-full bg-gray-800 bg-opacity-90 p-8 rounded-lg shadow-md"
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-xs mx-auto aspect-square mb-6 flex justify-center items-center">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      <h3 className="text-2xl font-semibold mb-2 text-center">
                        {event.title}
                      </h3>
                      <p className="mb-4 text-center">{event.description}</p>
                      <p className="text-yellow-500 font-bold text-center">
                        {formatDate(event.date)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-center mt-8">
                <Link
                  to="/events"
                  className="bg-yellow-500 text-black py-3 px-8 rounded-full font-semibold text-lg hover:bg-yellow-600 transition-all"
                >
                  SHOW MORE EVENTS
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center text-yellow-500">
              <p>No events available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      <section className="relative py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-8xl font-bold mb-10 text-yellow-500">
            MEMBER&apos;S CAR OF THE MONTH
          </h2>
          {carOfTheMonth ? (
            <div className="flex justify-center">
              <div className="bg-gray-900 p-10 rounded-xl shadow-xl w-full max-w-3xl">
                <div className="mb-6 overflow-hidden rounded-lg flex justify-center">
                  <img
                    src={carOfTheMonth.image}
                    alt={carOfTheMonth.title}
                    className="w-full h-auto rounded-lg"
                    style={{
                      maxHeight: "400px",
                      maxWidth: "100%",
                    }}
                  />
                </div>

                <h3 className="text-3xl font-bold text-center text-yellow-400 mb-4">
                  {carOfTheMonth.title}
                </h3>

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
