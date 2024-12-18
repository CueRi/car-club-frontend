import { useState, useEffect } from "react";
import { createApiClient, handleApiError } from "../utils/apiUtils";
import { formatDate } from "../utils/dateUtils";

export default function EventsSection() {
  const [events, setEvents] = useState([]);
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

        const sortedEvents = response.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setEvents(sortedEvents);
        setLoading(false);
      } catch (err) {
        setError(handleApiError(err));
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const handleSaveToGoogleCalendar = (event) => {
    const startDateTime = new Date(event.date)
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0] + "Z";
    const endDateTime = new Date(
      new Date(event.date).getTime() + 60 * 60 * 1000
    )
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0] + "Z";

    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      event.title
    )}&details=${encodeURIComponent(
      event.description
    )}&location=${encodeURIComponent(
      event.venue
    )}&dates=${startDateTime}/${endDateTime}`;

    window.open(calendarUrl, "_blank");
  };

  const isPastEvent = (date) => new Date(date) < new Date();

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (events.length === 0) {
    return <div>No events available</div>;
  }

  return (
    <section className="relative bg-black text-white py-16 min-h-screen flex items-center justify-center overflow-hidden">
      

      <div className="container mx-auto relative z-10 px-4">
        <h2 className="text-4xl md:text-8xl font-bold mb-10 text-yellow-500">
          LATEST HAPPENINGS
        </h2>

        <div className="flex flex-col gap-8">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-gray-500 bg-opacity-75 p-8 rounded-lg shadow-md flex flex-col lg:flex-row items-center gap-8"
            >
              <div className="relative w-full lg:w-1/3 max-w-sm">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>

              <div className="flex flex-col gap-4 lg:w-2/3">
                <h3 className="text-2xl text-yellow-500 font-semibold">{event.title}</h3>
                <p>{event.description}</p>
                <p className="text-yellow-500 font-semibold">Venue: {event.venue}</p>
                <p className="text-yellow-500 font-semibold">Time: {event.time}</p>
                <p className="text-yellow-500 font-semibold">Date: {formatDate(event.date)}</p>
                <div className="mt-4">
                  <button
                    onClick={() => handleSaveToGoogleCalendar(event)}
                    disabled={isPastEvent(event.date)}
                    className={`py-2 px-6 rounded-lg font-semibold text-lg ${
                      isPastEvent(event.date)
                        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                        : "bg-black text-yellow-500"
                    }`}
                  >
                    {isPastEvent(event.date) ? "EVENT PASSED" : "REMIND ME"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
