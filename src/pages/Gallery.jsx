import { useState, useEffect } from "react";
import { createApiClient, handleApiError } from "../utils/apiUtils";

const API_URL = import.meta.env.VITE_CAR_CLUB_URL;

export default function Gallery() {
  const [galleryData, setGalleryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // For full-size image view
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

  const closeModal = () => setSelectedImage(null);

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
              {galleryData.map((event, eventIndex) => (
                <div key={eventIndex} className="mb-12">
                  <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 text-center font-[Antonio]">
                    {event.event}
                  </h2>

                  <p className="text-center text-lg mb-8 text-white">
                    {event.description}
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    {event.images.map((imageUrl, imageIndex) => (
                      <div key={imageIndex} className="w-full">
                        <img
                          src={imageUrl}
                          alt={`${event.event} - Image ${imageIndex + 1}`}
                          className="w-full h-[150px] sm:h-[200px] lg:h-[250px] object-cover rounded-lg transition-all duration-300 hover:scale-105 cursor-pointer"
                          onClick={() => setSelectedImage(imageUrl)} // Open modal
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Modal for full-size image */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          <div className="relative max-w-3xl w-full p-4">
            <img
              src={selectedImage}
              alt="Full-size view"
              className="w-full h-auto rounded-lg"
            />
            <button
              className="absolute top-2 right-2 text-white text-2xl font-bold"
              onClick={closeModal}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
