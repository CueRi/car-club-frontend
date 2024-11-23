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

  const handleRemindMe = async () => {
    const currentEvent = events[currentIndex];
    try {
      const event = {
        summary: currentEvent.title,
        description: currentEvent.description,
        location: currentEvent.venue,
        start: {
          dateTime: new Date(currentEvent.date + "T" + currentEvent.time).toISOString(),
          timeZone: "UTC",
        },
        end: {
          dateTime: new Date(new Date(currentEvent.date + "T" + currentEvent.time).getTime() + 3600000).toISOString(), // 1-hour event
          timeZone: "UTC",
        },
      };

      // Assuming you have an API for Google Calendar integration
      await api.post("/google-calendar/events", event, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Event has been added to your Google Calendar!");
    } catch (err) {
      alert("Failed to add event to Google Calendar. Please try again.");
    }
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
    <section className="relative bg-black text-white py-16 min-h-screen flex items-center justify-center overflow-hidden">
      <img
        src="/images/background/events.jpg"
        alt="Events Background"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />

      <div className="container mx-auto relative z-10 px-4">
        <h2 className="text-4xl md:text-8xl font-bold mb-10 text-yellow-500 text-center">
          LATEST HAPPENINGS
        </h2>

        <div className="w-full max-w-3xl mx-auto bg-gray-500 bg-opacity-75 p-6 md:p-8 rounded-lg shadow-md flex flex-col items-center">
          <div className="relative w-full max-w-sm mx-auto mb-4">
            <img
              src={currentEvent.image}
              alt={currentEvent.title}
              className="w-full h-full object-cover rounded-lg aspect-square"
            />
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-2xl font-semibold">{currentEvent.title}</h3>
            <p>{currentEvent.description}</p>
            <p>Venue: {currentEvent.venue}</p>
            <p>Time: {currentEvent.time}</p>
            <p className="text-yellow-500 font-bold">
              Date: {formatDate(currentEvent.date)}
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={handlePrevious}
              className="inline-block bg-black text-yellow-500 py-2 px-6 rounded-lg font-semibold text-lg md:text-2xl"
            >
              PREVIOUS
            </button>

            <button
              onClick={handleRemindMe}
              className="inline-block bg-black text-yellow-500 py-2 px-6 rounded-lg font-semibold text-lg md:text-2xl"
            >
              REMIND ME
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
