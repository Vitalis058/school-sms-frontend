import { ContactForm } from "@/components/Forms/contact/ContactForm";

export default function ContactUs() {
  return (
    <div className="mx-auto mt-4 w-full max-w-6xl overflow-hidden rounded-xl shadow-sm">
      <div className="flex flex-col">
        <div className="flex flex-col gap-10 p-3 md:flex-row">
          <div className="flex-1 space-y-2">
            <p className="text-primary text-sm font-medium tracking-wider uppercase">
              WE&apos;RE HERE TO HELP YOU
            </p>
            <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
              Enhance Your School Management
            </h1>
            <p className="mt-4">
              Looking for innovative solutions to streamline your school
              operations? Reach out to us and discover how we can help transform
              your educational institution.
            </p>
          </div>

          <div className="flex-1 space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">E-mail</p>
                <p className="text-sm font-medium">
                  contact@schoolsolutions.com
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-primary rounded-full p-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#fff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-500">Phone number</p>
                <p className="text-sm font-medium">+123 456 7890</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3">
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
