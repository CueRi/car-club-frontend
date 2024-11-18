import { Card } from "@/components/ui/card";

export default function Contact() {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const subject = formData.get("subject");
    const body = formData.get("body");
    const mailtoLink = `mailto:sunwaycarclub@gmail.com?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  return (
    <main className="relative min-h-screen bg-black text-white py-20">
      <div className="absolute inset-0 bg-[url('/images/background/contact.jpg')] opacity-40 bg-cover bg-center bg-no-repeat" />

      <div className="container mx-auto relative z-10 px-4">
        <h1 className="text-4xl md:text-8xl font-bold text-yellow-500 mb-10 font-[Antonio]">
          CONTACT US
        </h1>

        <Card className="bg-transparent">
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6"
          >
            <div>
              <label
                htmlFor="fullName"
                className="block text-sm font-bold mb-2"
              >
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                className="w-full p-4 text-black bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-bold mb-2">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="w-full p-4 text-black bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="body" className="block text-sm font-bold mb-2">
                Message
              </label>
              <textarea
                id="body"
                name="body"
                rows={5}
                className="w-full p-4 text-black bg-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                required
              />
            </div>

            <div className="md:col-span-2 text-center">
              <button
                type="submit"
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 px-8 rounded-lg 
                         focus:ring-4 focus:ring-yellow-400 transition-colors"
              >
                SUBMIT
              </button>
            </div>
          </form>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-white">
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
        </div>
      </div>
    </main>
  );
}
