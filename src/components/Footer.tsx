import { Blocks } from "lucide-react";

function Footer() {
  return (
    <footer className="relative border-t border-gray-800/50 mt-auto">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gray-900 to-transparent" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400">
            <Blocks className="size-5" />
            <span>Developed with 🫶 by Raghav Singla</span>
          </div>
          <div className="flex items-center gap-6">
            <a href="https://github.com/RaghavOG" target="_blank" className="text-gray-400 hover:text-gray-300 transition-colors">
              Github
            </a>
            <a href="https://www.linkedin.com/in/singlaraghav" target="_blank" className="text-gray-400 hover:text-gray-300 transition-colors">
              LinkedIn
            </a>
            <a href="mailto:04raghavsingla28@gmail.com" target="_blank" className="text-gray-400 hover:text-gray-300 transition-colors">
              Mail
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;