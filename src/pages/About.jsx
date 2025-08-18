const About = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h2 className="text-4xl font-extrabold text-gray-800 mb-8 border-b pb-2">
        About Us
      </h2>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">Our History</h3>
        <p className="text-gray-600 leading-relaxed">
          Founded in 2025, I&M courier began with a clear mission — to provide fast, reliable, and affordable courier services.
          Over the years, we've grown into a trusted logistics partner serving businesses and individuals across the region.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">Our Vision & Mission</h3>
        <p className="text-gray-600 leading-relaxed">
          <strong>Vision:</strong> To become the leading courier and logistics company across Tanzania and Africa as whole.<br />
          <strong>Mission:</strong> To deliver efficient, secure, and cost-effective transportation solutions tailored to our clients' needs.
        </p>
      </section>

      <section>
        <h3 className="text-2xl font-semibold text-gray-700 mb-2">Our Team</h3>
        <p className="text-gray-600 leading-relaxed">
          Our team is made up of experienced logistics professionals dedicated to ensuring every package is delivered on time and with care.
          With a passion for innovation and customer service, we continue to redefine excellence in the logistics industry.
        </p>
      </section>
    </div>
  );
};

export default About;
