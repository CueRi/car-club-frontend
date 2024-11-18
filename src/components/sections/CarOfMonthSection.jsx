import { carOfTheMonth } from "@/data/mockData";
import { Link } from "react-router-dom";

export default function CarOfMonthSection() {
  return (
    <section className="relative bg-black text-white py-16 h-auto md:h-screen">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl md:text-8xl font-bold mb-10 text-yellow-500">
          MEMBER&apos;S CAR OF THE MONTH
        </h2>
        <div className="flex justify-center">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full md:w-80">
            <img
              src={carOfTheMonth.image}
              alt="Car of the Month"
              className="rounded mb-4"
            />
            <h3 className="text-lg md:text-xl font-semibold mb-2">
              {carOfTheMonth.owner}&apos;s {carOfTheMonth.car}
            </h3>
            <p className="mb-4">{carOfTheMonth.description}</p>
            <Link
              to="/news"
              className="inline-block bg-yellow-500 text-black py-2 px-6 rounded-lg font-semibold"
            >
              READ MORE NEWS
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
