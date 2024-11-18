import { useState, useEffect } from "react";
import { createApiClient, handleApiError } from "../utils/apiUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function About() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsToShow = 3;

  const api = createApiClient();

  useEffect(() => {
    const loadTeam = async () => {
      try {
        const response = await api.get("/team-members");
        const data = response.data;
        setTeamMembers(data);
      } catch (error) {
        setError(handleApiError(error));
      } finally {
        setLoading(false);
      }
    };

    loadTeam();
  }, []);

  const nextMember = () => {
    setCurrentIndex((prev) => (prev + 1) % teamMembers.length);
  };

  const prevMember = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + teamMembers.length) % teamMembers.length
    );
  };

  const getVisibleMembers = () => {
    if (teamMembers.length === 0) return [];

    const visibleMembers = [];
    for (let i = 0; i < itemsToShow; i++) {
      const index = (currentIndex + i) % teamMembers.length;
      visibleMembers.push(teamMembers[index]);
    }
    return visibleMembers;
  };
  const navigationButtonStyles =
    "absolute top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-400 text-black w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg hover:scale-110";

  return (
    <main className="bg-black text-white">
      <section className="relative py-20">
        <div className="absolute inset-0 bg-[url('/images/background/about.jpg')] opacity-40 bg-cover bg-center bg-no-repeat" />

        <div className="container mx-auto px-4 relative z-10">
          <h2 className="text-4xl md:text-8xl font-bold text-yellow-500 mb-10 font-[Antonio]">
            ABOUT US
          </h2>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto mb-6">
            Welcome to the Sunway Car Enthusiast Club (SCEC), a dynamic
            community of passionate students and alumni from Sunway University
            and College. United by our love for cars and car culture, we aim to
            create a diverse and inclusive environment that fosters awareness of
            the automotive industry, promotes gender equality, and champions
            innovations like electric vehicles.
          </p>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto mb-6">
            Our club organizes a variety of engaging events throughout the year,
            including car meets, kart racing, competitions, and outdoor events.
            We celebrate our shared passion for the automotive world.
          </p>
          <p className="text-lg md:text-2xl max-w-4xl mx-auto">
            Join us as we drive toward a future that embraces innovation,
            inclusivity, and a deep appreciation for all things automotive!
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-8xl font-bold text-yellow-500 mb-10 font-[Antonio]">
            MISSION & VISION
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-10">
            <div className="max-w-sm text-center">
              <div className="text-yellow-500 text-6xl mb-4">🎯</div>
              <p className="text-lg">
                Unite Sunway car enthusiasts to promote automotive culture,
                foster learning, collaboration, and innovation through inclusive
                events, education, and a focus on gender equality and
                sustainability in the evolving car industry.
              </p>
            </div>

            <div className="hidden md:block border-r-2 border-yellow-500 h-64" />

            <div className="max-w-sm text-center">
              <div className="text-yellow-500 text-6xl mb-4">🔭</div>
              <p className="text-lg">
                Be a leading platform at Sunway University, inspiring a diverse
                car enthusiast community, promoting automotive advancements, and
                supporting a more inclusive, sustainable global car culture.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-8xl font-bold text-yellow-500 mb-10 font-[Antonio]">
            MEET THE TEAM
          </h2>

          {error && <p className="text-center text-red-500 mb-6">{error}</p>}

          <div className="relative max-w-7xl mx-auto">
            {loading ? (
              <p className="text-white text-center">Loading team members...</p>
            ) : teamMembers.length === 0 ? (
              <p className="text-white text-center">
                No team members available
              </p>
            ) : (
              <div className="flex justify-center items-stretch gap-8 px-4">
                {getVisibleMembers().map((member) => (
                  <div
                    key={member.id}
                    className="w-full md:w-1/3 min-w-[300px] max-w-[400px]"
                  >
                    <div className="bg-gray-900 text-center p-10 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-800 h-full">
                      <img
                        src={member.image}
                        alt={`${member.firstName} ${member.secondName}`}
                        className="mx-auto rounded-2xl mb-8 w-64 h-64 object-cover shadow-xl"
                      />
                      <h3 className="font-bold text-yellow-500 text-3xl mb-3">
                        {member.role}
                      </h3>
                      <p className="text-gray-300 text-xl font-light">
                        {member.firstName} {member.secondName}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={prevMember}
              className={`${navigationButtonStyles} -left-20`}
              aria-label="Previous member"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextMember}
              className={`${navigationButtonStyles} -right-20`}
              aria-label="Next member"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
