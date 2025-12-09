// import AppleStoreImg from '../../../public/marketing/Apple Store.webp';
// import GooglePlayImg from '../../../public/marketing/Google Play.webp';
import { Link } from 'react-router-dom';

export const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer>
      <div className="max-w-[1600px] mx-auto w-full px-4 py-6">
        <div className="grid grid-cols-1 gap-8 lg:gap-4 md:grid-cols-5">
          <div className="col-span-1 md:col-span-2 text-left space-y-8">
            <p>Workout Tracker Logo</p>
            {/* <div className="flex flex-row gap-8 mt-6"> */}
            {/* Facebook */}
            {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg> */}
            {/* Instagram */}
            {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg> */}
            {/* Twitter */}
            {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
              </svg> */}
            {/* Reddit */}
            {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 .97.533 1.811 1.317 2.271-.052.282-.086.567-.086.857 0 3.911 4.808 7.093 10.719 7.093s10.72-3.182 10.72-7.093c0-.274-.029-.544-.075-.81.832-.447 1.405-1.312 1.405-2.318zm-17.224 1.816c0-.868.71-1.575 1.582-1.575.872 0 1.581.707 1.581 1.575s-.709 1.574-1.581 1.574-1.582-.706-1.582-1.574zm9.061 4.669c-.797.793-2.048 1.179-3.824 1.179l-.013-.003-.013.003c-1.777 0-3.028-.386-3.824-1.179-.145-.144-.145-.379 0-.523.145-.145.381-.145.526 0 .65.647 1.729.961 3.298.961l.013.003.013-.003c1.569 0 2.648-.315 3.298-.962.145-.145.381-.144.526 0 .145.145.145.379 0 .524zm-.189-3.095c-.872 0-1.581-.706-1.581-1.574 0-.868.709-1.575 1.581-1.575s1.581.707 1.581 1.575-.709 1.574-1.581 1.574z" />
              </svg> */}
            {/* Tiktok */}
            {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="h-5 w-5">
                <path
                  fill="currentColor"
                  d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"
                />
              </svg> */}
          </div>
          {/* Mobile Apps */}
          {/* <div className="flex flex-row gap-4">
              <Link
              // to="https://apps.apple.com/app/id6446704541" target="_blank" rel="noreferrer"
              >
                <img src={AppleStoreImg} alt="Download on the Apple Store" className="h-10" />
              </Link>
              <Link
                // to="https://play.google.com/store/apps/details?id=com.haowee.workouttracker"
                target="_blank"
                rel="noreferrer"
              >
                <img src={GooglePlayImg} alt="Get it on Google Play" className="h-10" />
              </Link>
            </div> */}
          {/* </div> */}
          <div className="col-span-1">
            <p className="font-semibold mb-6">Resources</p>
            <div className="text-muted-foreground space-y-3">
              <Link to="/exercises" className="w-fit block mt-2 hover:underline">
                Exercises
              </Link>
              <Link to="/routines" className="w-fit block mt-2 hover:underline">
                Routines
              </Link>
              <Link to="/getting-started" className="w-fit block mt-2 hover:underline">
                Getting Started
              </Link>
            </div>
          </div>
          <div className="col-span-1">
            <p className="font-semibold mb-6">Legal</p>
            <div className="text-muted-foreground space-y-3">
              <Link to="/legal?tab=privacy-policy" className="w-fit block mt-2 hover:underline">
                Privacy Policy
              </Link>
              <Link to="/legal?tab=terms-of-service" className="w-fit block mt-2 hover:underline">
                Terms of Service
              </Link>
              <Link to="/legal?tab=data-deletion" className="w-fit block mt-2 hover:underline">
                Data Deletion
              </Link>
            </div>
          </div>
          <div className="col-span-1">
            <p className="font-semibold mb-6">Support</p>
            <div className="text-muted-foreground space-y-3">
              <Link to="/about" className="w-fit block mt-2 hover:underline">
                About Us
              </Link>
              <Link to="/help" className="w-fit block mt-2 hover:underline">
                Help Center
              </Link>
              <Link to="/contact" className="w-fit block mt-2 hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
      <hr className="my-6" />
      <p className="text-center mb-6 text-xs text-muted-foreground">
        &copy; {year} Workout Tracker. All rights reserved.
      </p>
    </footer>
  );
};
