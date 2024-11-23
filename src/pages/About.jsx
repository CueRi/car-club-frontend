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
    "absolute top-1/2 transform -translate-y-1/2 bg-yellow-500 hover:bg-yellow-400 text-black w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer shadow-lg hover:scale-110";

  return (
    <main className="bg-black text-white">
      <section className="py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-8xl font-bold text-yellow-500 mb-10 font-[Antonio] text-center">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 px-4">
                {getVisibleMembers().map((member) => (
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

            <button
              onClick={prevMember}
              className={`${navigationButtonStyles} -left-4 md:-left-20`}
              aria-label="Previous member"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextMember}
              className={`${navigationButtonStyles} -right-4 md:-right-20`}
              aria-label="Next member"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
