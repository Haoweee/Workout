import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const ContactPage = () => {
  return (
    <div className="max-w-[800px] mx-auto space-y-12 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Contact our team</h1>
      <form className="space-y-6">
        <div className="w-full flex flex-col md:flex-row items-center gap-6">
          <div className="w-full md:flex-1">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name
            </label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="mt-1 block w-full"
              placeholder="First Name"
            />
          </div>
          <div className="w-full md:flex-1">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name
            </label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="mt-1 block w-full"
              placeholder="Last Name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            className="mt-1 block w-full"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700">
            Message
          </label>
          <Input
            multiline
            id="message"
            name="message"
            rows={4}
            required
            className="mt-1 block w-full"
            placeholder="Leave us a message..."
          />
        </div>
        <div className="w-full">
          <Button type="submit" className="w-full px-6 py-2">
            Send Message
          </Button>
        </div>
      </form>
    </div>
  );
};
