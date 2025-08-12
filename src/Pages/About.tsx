

const About = () => {
  return (
    // <div className="pt-30">
    <div className="min-h-screen bg-white text-gray-800">

      {/* Hero Section */}
      <section className="bg-purple-700 text-white pt-[120px] pb-16 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">
          Transforming Workplace Management
        </h1>
        <p className="max-w-2xl mx-auto text-lg">
          We make office interactions, leave management, payments, and HR
          processes seamless saving time, cutting costs, and boosting
          productivity,with the aim of making the work environment more comfortable and enjoyable
        </p>
      </section>

      {/* Our Story */}
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">Our Story</h2>
        <p className="text-lg leading-relaxed">
          Founded with the motive that HR processes should not be stressful or
          scattered, we set out to build a solution that merges efficiency with
          simplicity. Our platform addresses the real challenges offices face 
          from managing leave requests to streamlining payroll  all in one
          place with a user-friendly interface.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="py-12 px-6 max-w-5xl mx-auto grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Our Mission
          </h2>
          <p className="text-lg leading-relaxed">
            To simplify and modernize HR operations for organizations of all
            sizes reducing the use of paper works, empowering teams to focus on what truly matters,
           people and  productivity.
        
          </p>
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-purple-700 mb-4">
            Our Vision
          </h2>
          <p className="text-lg leading-relaxed">
            To become the go-to HR solution globally, redefining workplace
            management with innovation, scalability, and unmatched user
            experience.
          </p>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-12 px-6 bg-purple-50 shadow-sm max-w-5xl mx-auto rounded-lg">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">
          Our Core Values
        </h2>
        <ul className="list-disc pl-6 space-y-2 text-lg">
          <li>Innovation — Continuously improving to meet evolving workplace needs</li>
          <li>Transparency — Clear and open processes</li>
          <li>Efficiency — Saving time and resources for our clients</li>
          <li>Reliability — Consistent, secure, and dependable service</li>
          <li> Inclusivity - Building a platform that caters to diverse workplace needs at your finger tips</li>
        </ul>  
      </section>

      
      <section className="py-12 px-6 max-w-5xl mx-auto">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">
          What We Offer
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-purple-700">Leave Management</h3>
            <p className="mt-2">
              Apply, approve, and track employee leave with ease.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-purple-700">Payroll & Payments</h3>
            <p className="mt-2">
              Streamlined salary processing and secure payment tracking.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-purple-700">Internal Communication</h3>
            <p className="mt-2">
              Foster better collaboration with integrated communication tools.
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-purple-700">Performance Tracking</h3>
            <p className="mt-2">
              Monitor employee growth and productivity in real time.
            </p>
          </div>
        </div>
      </section>
    </div>
  

    // </div>
  );
};

export default About;
