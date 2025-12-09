import GymImg from '@/assets/marketing/gym.webp';

const AboutPage = () => {
  return (
    <div className="max-w-[1000px] mx-auto py-12">
      <h1 className="text-lg font-semibold">About Us</h1>
      <p className="text-4xl mt-2 text-gray-700">
        Setting Up Standard On
        <br />
        Gym Culture
      </p>
      <img src={GymImg} alt="Gym" className="w-full h-auto my-4 rounded-xl" loading="lazy" />
      <p className="text-gray-600 mb-6">
        We are committed to providing you with the best workout experience possible. Our platform is
        designed to help you achieve your fitness goals through personalized workout plans, expert
        guidance, and a supportive community.
      </p>
      <div className="space-y-4 text-gray-700">
        <p>
          Our mission is to empower individuals to lead healthier lives by making fitness accessible
          and enjoyable. We believe that everyone deserves the opportunity to reach their full
          potential, and we are here to support you every step of the way.
        </p>
        <p>
          Whether you are a beginner just starting your fitness journey or an experienced athlete
          looking to take your training to the next level, we have the tools and resources to help
          you succeed. Join us today and become a part of our growing community of fitness
          enthusiasts!
        </p>
      </div>
    </div>
  );
};

export default AboutPage;
