import { useState, useEffect } from "react";
import { createApiClient, handleApiError } from "../utils/apiUtils";

const API_URL = import.meta.env.VITE_CAR_CLUB_URL;

export default function Gallery() {
  const [galleryData, setGalleryData] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoScrolling, setAutoScrolling] = useState(true);
  const api = createApiClient();

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await api.get(`${API_URL}/galleries`);
        setGalleryData(response.data);
      } catch (error) {
        console.error("Failed to load gallery:", error);
        setError(handleApiError(error));
      } finally {
        setIsLoading(false);
      }
    };

    fetchGallery();
  }, [api]);

  const stopAutoScrolling = () => {
    setAutoScrolling(false);
  };

  const startAutoScrolling = () => {
    setAutoScrolling(true);
  };

  const handleNext = (eventIndex) => {
    setCurrentImageIndex((prevState) => {
      const totalImages = galleryData[eventIndex].images.length;
      const newIndex =
        prevState[eventIndex] === totalImages - 1
          ? 0
          : prevState[eventIndex] + 1;
      return { ...prevState, [eventIndex]: newIndex };
    });
  };

  const handlePrevious = (eventIndex) => {
    setCurrentImageIndex((prevState) => {
      const totalImages = galleryData[eventIndex].images.length;
      const newIndex =
        prevState[eventIndex] === 0
          ? totalImages - 1
          : prevState[eventIndex] - 1;
      return { ...prevState, [eventIndex]: newIndex };
    });
  };

  useEffect(() => {
    if (!autoScrolling) return;

    const intervals = galleryData.map((_, eventIndex) =>
      setInterval(() => handleNext(eventIndex), 5000)
    );

    return () => intervals.forEach((interval) => clearInterval(interval));
  }, [galleryData, autoScrolling]);

  return (
    <main className="min-h-screen bg-black">
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-8xl font-bold text-yellow-500 mb-10 font-[Antonio]">
            GALLERY
          </h1>

          <p className="text-white text-xs md:text-lg mb-10">
            <strong>Instagram: </strong>
            <a
              href="https://instagram.com/sunwaycarclub"
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-yellow-500 hover:text-yellow-400 transition-colors"
            >
              @sunwaycarclub
            </a>
          </p>

          {isLoading ? (
            <div className="text-white text-center py-20">
              Loading gallery...
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-20">{error}</div>
          ) : (
            <div className="space-y-12">
              {galleryData.map((event, eventIndex) => {
                if (!Object.hasOwn(currentImageIndex, eventIndex)) {
                  setCurrentImageIndex((prevState) => ({
                    ...prevState,
                    [eventIndex]: 0,
                  }));
                }

                return (
                  <div
                    key={eventIndex}
                    className="mb-12"
                    onMouseEnter={stopAutoScrolling}
                    onMouseLeave={startAutoScrolling}
                  >
                    <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 text-center font-[Antonio]">
                      {event.event}
                    </h2>

                    <p className="text-center text-sm md:text-lg mb-8 text-white">
                      {event.description}
                    </p>

                    <div className="relative overflow-hidden">
                      <div
                        className="flex transition-transform duration-700 ease-in-out"
                        style={{
                          transform: `translateX(-${
                            currentImageIndex[eventIndex] * 100
                          }%)`,
                        }}
                      >
                        {event.images.map((imageUrl, imageIndex) => (
                          <div
                            key={imageIndex}
                            className="w-full flex-shrink-0"
                            style={{ width: "100%" }}
                          >
                            <img
                              src={imageUrl}
                              alt={`${event.event} - Image ${imageIndex + 1}`}
                              className="w-full h-[200px] sm:h-[300px] md:h-[400px] object-cover rounded-lg shadow-lg"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Controls */}
                    <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
                      <button
                        onClick={() => handlePrevious(eventIndex)}
                        className="bg-yellow-500 text-black p-3 md:p-4 rounded-full hover:bg-yellow-600 transition duration-300"
                      >
                        &#9664;
                      </button>
                    </div>
                    <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
                      <button
                        onClick={() => handleNext(eventIndex)}
                        className="bg-yellow-500 text-black p-3 md:p-4 rounded-full hover:bg-yellow-600 transition duration-300"
                      >
                        &#9654;
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
