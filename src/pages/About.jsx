import { useState, useEffect } from "react";
import { createApiClient, handleApiError } from "../utils/apiUtils";

export default function About() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <main className="bg-black text-white">
      {/* About Section */}
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

      {/* Mission & Vision Section */}
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

      {/* Meet the Team Section */}
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-8xl font-bold text-yellow-500 mb-10 font-[Antonio] text-center">
            MEET THE TEAM
          </h2>

          {error && <p className="text-center text-red-500 mb-6">{error}</p>}

          {loading ? (
            <p className="text-white text-center">Loading team members...</p>
          ) : teamMembers.length === 0 ? (
            <p className="text-white text-center">
              No team members available
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="w-full bg-gray-900 text-center p-8 rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 border border-gray-800"
                >
                  <img
                    src={member.image}
                    alt={`${member.firstName} ${member.secondName}`}
                    className="mx-auto rounded-2xl mb-6 w-40 h-40 md:w-64 md:h-64 object-cover shadow-xl"
                  />
                  <h3 className="font-bold text-yellow-500 text-xl md:text-3xl mb-3">
                    {member.role}
                  </h3>
                  <p className="text-gray-300 text-lg font-light">
                    {member.firstName} {member.secondName}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
