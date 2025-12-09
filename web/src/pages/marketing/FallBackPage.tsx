const FallBackPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-8xl mb-8">404</h1>
      <p className="text-4xl font-bold mb-4">Sorry, this page isn't available</p>
      <p className="text-lg text-gray-700 mb-8">
        We couldn't find the page you were looking for.{' '}
        <span className="text-blue-400 hover:text-blue-500 hover:underline active:text-blue-600 ">
          <a href="/">Go back to Workout App</a>
        </span>
      </p>
    </div>
  );
};

export default FallBackPage;
