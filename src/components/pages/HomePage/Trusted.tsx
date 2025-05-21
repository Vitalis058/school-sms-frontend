import Image from "next/image";
import logo1 from "./../../../../public/logos/logo 1.png";
import logo2 from "./../../../../public/logos/logo 2.png";
import logo3 from "./../../../../public/logos/logo 3.png";
import logo4 from "./../../../../public/logos/logo 4.png";
import logo5 from "./../../../../public/logos/logo 5.png";
import logo6 from "./../../../../public/logos/logo 6.png";

function Trusted() {
  const logos = [logo1, logo2, logo3, logo4, logo5, logo6];
  return (
    <div className="mt-10 text-center md:mt-20">
      <p className="text-primary mb-8">Trusted by 500+ production companies</p>
      <div className="relative w-full overflow-hidden">
        <div className="animate-marquee flex justify-between whitespace-nowrap">
          {logos.map((image, i) => (
            <div key={i} className="mx-8 h-8 flex-shrink-0">
              <Image
                src={image}
                alt={`Client logo ${i + 1}`}
                width={120}
                height={32}
                className="contrast-more: h-full w-auto opacity-40 grayscale dark:opacity-80 dark:invert"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Trusted;
