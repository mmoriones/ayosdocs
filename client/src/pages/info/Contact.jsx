import React from 'react';

const Contact = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-6 lg:px-10 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-gray-100 space-y-6">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Contact <span className="text-teal-600">Us</span>
          </h1>
          <p className="text-lg text-gray-600">
            Have questions, feedback, or suggestions? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">Email Us</h2>
                <p className="text-teal-600 font-medium">contact@ayosdocs.com</p>
                <p className="text-gray-500 text-sm">We typically respond within 24-48 hours.</p>
              </div>

              <div className="space-y-2">
                <h2 className="text-xl font-semibold text-gray-800">Social Media</h2>
                <p className="text-gray-600">Follow us for updates and tips:</p>
                <div className="flex gap-4">
                  <span className="text-teal-600 cursor-pointer hover:underline">Facebook</span>
                  <span className="text-teal-600 cursor-pointer hover:underline">Twitter</span>
                </div>
              </div>
            </div>

            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none transition-all"
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-teal-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-teal-700 transition-colors shadow-sm"
              >
                Send Message
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Contact;
