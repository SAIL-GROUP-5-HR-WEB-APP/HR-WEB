import Hero from "../Components/Block/home/Hero";
import Companies from "../Components/Block/home/Companies";
import Body from "../Components/Block/home/Body";
import HowItWorks from "../Components/Block/home/HowItWorks";
import HowOne from "../Components/Block/home/HowOne";
import HowTwo from "../Components/Block/home/HowTwo";
import Testimonial from "../Components/Block/home/Testimonial";

const Home = () => {
  return (
    <div>
      <Hero />
      <Companies />
      <Body />
      <HowItWorks />
      <HowOne />
      <HowTwo />
      <Testimonial />
    </div>
  );
};

export default Home;
